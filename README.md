# CustomerPulse

A comprehensive, production-grade Customer Churn & Segmentation Analytics Platform.

CustomerPulse is a full-stack application designed to help retention teams and business analysts understand customer behavior, identify churn risks, and simulate retention strategies. The platform combines a rich interactive dashboard with a machine learning engine to provide actionable insights.

## Architecture

This project is built using a modern, scalable tech stack:

*   **Frontend**: React, TypeScript, Vite, Tailwind CSS, Recharts
*   **Backend**: Python, FastAPI, SQLAlchemy, Scikit-Learn
*   **Database**: SQLite (for local development) / PostgreSQL (for production via Docker)
*   **AI/LLM Support**: Built-in deterministic intelligence engine with an optional LLM wrapper (supports Gemini, OpenAI, Anthropic)

## Key Features

*   **Hybrid Data Ingestion**: Supports uploading the benchmark IBM Telco Customer Churn dataset and seamlessly enriches it with a realistic, synthetic CRM layer (including RFM, CLV, engagement scores, and support metrics).
*   **Interactive Analytics Dashboard**: Beautifully styled UI (dark theme) with critical business KPIs, geographic and demographic distribution, and risk stratification.
*   **Customer Segmentation**: Unsupervised ML (K-Means) groups customers into distinct personas based on value, engagement, and satisfaction.
*   **Churn Prediction**: Supervised ML models (Logistic Regression, Random Forest, XGBoost) predict churn probabilities and categorize customers into risk tiers (Low, Medium, High, Critical).
*   **Explainable ML**: Identifies the top drivers of churn on a per-customer basis using feature importance and SHAP analysis.
*   **Revenue-at-Risk & CLV**: Calculates the exact financial impact of predicted churn and estimates Customer Lifetime Value.
*   **Retention Engine**: Provides actionable recommendations for at-risk customers and includes a "What-If" simulator for calculating ROI on retention interventions.
*   **AI Analytics Assistant (PulseAI)**: A chat interface to query your CRM data in natural language.

## Getting Started

### Prerequisites

*   Docker and Docker Compose (recommended for full stack)
*   OR Python 3.11+ and Node.js 20+ (for local manual run)

### Running with Docker (Recommended)

This spins up the FastAPI backend, the React frontend, and a PostgreSQL database.

```bash
git clone <your-repo-url>
cd customerpulse

# Start the stack
docker-compose up -d --build
```

The application will be available at:
*   Frontend Dashboard: `http://localhost:80`
*   Backend API Swagger UI: `http://localhost:8000/docs`

### Running Locally (Development Mode with SQLite)

If you prefer to run the app without Docker, the backend will automatically default to SQLite.

#### 1. Start the Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# The application defaults to sqlite:///./customerpulse.db
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.

## Configuration & Environment Variables

Create a `.env` file in the project root to configure the platform. An example is provided in `.env.example`.

```ini
# Core
DATABASE_URL=sqlite:///./customerpulse.db
# DATABASE_URL=postgresql://customerpulse:customerpulse_dev@db:5432/customerpulse

# AI Integration (Optional)
AI_PROVIDER=none  # options: none, gemini, openai, anthropic
GEMINI_API_KEY=your_key_here
```

## Demo Mode

By default, the application is set to `DEMO_MODE=true`. If the database is empty on startup, the system will automatically:
1. Generate ~10,000 CRM records.
2. Calculate features and RFM metrics.
3. Train the ML models.
4. Segment the customers.
5. Predict churn probabilities.

This means you will have a fully functioning, populated dashboard immediately after starting the app!
