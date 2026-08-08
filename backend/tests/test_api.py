from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_dashboard_summary():
    response = client.get("/api/dashboard/summary")
    assert response.status_code == 200
    assert "total_customers" in response.json()
