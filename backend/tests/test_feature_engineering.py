import pytest
from app.services.feature_engineering import compute_rfm
import pandas as pd

def test_compute_rfm():
    df = pd.DataFrame({
        "last_login_days": [10, 20, 30, 40],
        "purchase_frequency": [1.0, 0.5, 0.2, 0.1],
        "monthly_charges": [100, 50, 20, 10],
        "tenure_months": [12, 6, 3, 1]
    })
    r, f, m, rfm = compute_rfm(df)
    assert len(rfm) == 4
    assert isinstance(rfm.iloc[0], str)
