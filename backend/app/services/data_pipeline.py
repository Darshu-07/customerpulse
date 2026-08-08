import os
from typing import Optional
import pandas as pd
from datetime import datetime
import logging

from app.config import settings
from app.database.connection import SessionLocal, init_db
from app.services.data_generator import load_or_generate_data
from app.services.feature_engineering import compute_all_features
from app.ml.segmentation import run_segmentation
from app.ml.churn_model import train_churn_models, predict_churn
from app.ml.explainability import get_feature_importance, explain_customer
from app.services.retention_engine import generate_recommendations
from app.models.database import Customer, CustomerAnalytics, ModelRun

logger = logging.getLogger(__name__)

def _clear_db():
    """Delete all existing records before a fresh pipeline run."""
    db = SessionLocal()
    try:
        db.query(CustomerAnalytics).delete()
        db.query(Customer).delete()
        db.query(ModelRun).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        logger.warning("Error clearing DB: %s", e)
    finally:
        db.close()

def run_full_pipeline(upload_path: Optional[str] = None):
    """Execute the entire data pipeline.

    If ``upload_path`` is provided, that CSV is used as the source dataset;
    otherwise the existing data generator fallback (real file if present,
    synthetic otherwise) is used.
    """
    logger.info("Running full pipeline (upload_path=%s)", upload_path)
    init_db()
    # Load data
    if upload_path and os.path.exists(upload_path):
        raw_df = pd.read_csv(upload_path)
        from app.services.data_generator import enrich_data
        df = enrich_data(raw_df)
        logger.info("Loaded and enriched uploaded CSV with %d rows", len(df))
    else:
        df = load_or_generate_data()
        logger.info("Loaded generated data with %d rows", len(df))

    # Deduplicate by customer_id
    if 'customer_id' in df.columns:
        df = df.drop_duplicates(subset=['customer_id'])

    # Feature engineering
    df_enriched = compute_all_features(df)

    # Train churn models and select best
    results, best_model = train_churn_models(df_enriched)
    mr = ModelRun(
        model_type=best_model,
        accuracy=results[best_model]["accuracy"],
        precision_score=results[best_model]["precision"],
        recall=results[best_model]["recall"],
        f1=results[best_model]["f1"],
        roc_auc=results[best_model]["roc_auc"],
        pr_auc=results[best_model]["pr_auc"],
        confusion_matrix=results[best_model]["confusion_matrix"],
        feature_importance=get_feature_importance(),
        is_best=True,
        trained_at=datetime.utcnow()
    )

    # Clear old DB records
    _clear_db()
    db = SessionLocal()
    db.add(mr)
    db.commit()
    db.refresh(mr)

    # Predict churn and segment customers
    pred_df = predict_churn(df_enriched)
    df_enriched = df_enriched.merge(pred_df, on='customer_id', how='left')
    seg_res = run_segmentation(df_enriched)
    df_enriched['segment_id'] = seg_res['labels']

    # Persist customers and analytics
    for _, row in df_enriched.iterrows():
        cust = Customer(
            customer_id=row['customer_id'],
            age=row.get('age'),
            gender=row.get('gender'),
            city=row.get('city'),
            country=row.get('country'),
            acquisition_channel=row.get('acquisition_channel'),
            signup_date=row.get('signup_date'),
            tenure_months=row.get('tenure_months'),
            contract_type=row.get('contract_type'),
            monthly_charges=row.get('monthly_charges'),
            total_charges=row.get('total_charges'),
            phone_service=row.get('phone_service'),
            multiple_lines=row.get('multiple_lines'),
            internet_service=row.get('internet_service'),
            online_security=row.get('online_security'),
            online_backup=row.get('online_backup'),
            device_protection=row.get('device_protection'),
            tech_support=row.get('tech_support'),
            streaming_tv=row.get('streaming_tv'),
            streaming_movies=row.get('streaming_movies'),
            paperless_billing=row.get('paperless_billing'),
            payment_method=row.get('payment_method'),
            senior_citizen=row.get('senior_citizen'),
            partner=row.get('partner'),
            dependents=row.get('dependents'),
            login_frequency=row.get('login_frequency'),
            average_session_minutes=row.get('average_session_minutes'),
            last_login_days=row.get('last_login_days'),
            product_usage_score=row.get('product_usage_score'),
            features_used=row.get('features_used'),
            support_tickets=row.get('support_tickets'),
            complaints=row.get('complaints'),
            email_open_rate=row.get('email_open_rate'),
            purchases=row.get('purchases'),
            purchase_frequency=row.get('purchase_frequency'),
            average_order_value=row.get('average_order_value'),
            discount_usage=row.get('discount_usage'),
            refund_count=row.get('refund_count'),
            satisfaction_score=row.get('satisfaction_score'),
            nps_score=row.get('nps_score'),
            churn=row.get('churn'),
            churn_date=row.get('churn_date'),
            churn_reason=row.get('churn_reason')
        )
        db.add(cust)
        db.flush()
        # Analytics record
        risk = row.get('risk_level', 'Low')
        prob = row.get('churn_probability', 0.1)
        analytics = CustomerAnalytics(
            customer_id=cust.id,
            engagement_score=row.get('engagement_score'),
            customer_value_score=row.get('customer_value_score'),
            support_friction_score=row.get('support_friction_score'),
            recency=row.get('recency'),
            frequency=row.get('frequency'),
            monetary=row.get('monetary'),
            rfm_segment=row.get('rfm_segment'),
            churn_probability=prob,
            risk_level=risk,
            predicted_clv=row.get('monthly_charges') * 12 * (1 / max(prob, 0.01)),
            revenue_at_risk=row.get('monthly_charges') * prob,
            segment_id=row.get('segment_id'),
            segment_name=seg_res['segment_profiles'].get(row.get('segment_id'), {}).get('name', ''),
            top_churn_drivers=explain_customer(row.to_dict())
        )
        db.add(analytics)
    db.commit()
    # Retention recommendations
    generate_recommendations(db)
    logger.info("Full data pipeline completed.")
    db.close()
