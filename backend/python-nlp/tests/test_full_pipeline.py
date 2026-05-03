"""Integration test for the full extraction pipeline."""
import pytest
from fastapi.testclient import TestClient
from app.services.nlp_service import load_model
from app.main import app


@pytest.fixture(autouse=True, scope="module")
def load_spacy():
    load_model()


@pytest.fixture
def client():
    return TestClient(app)


class TestDirectivesFromTextEndpoint:
    def test_extract_directives_from_text(self, client, sample_judgment_text):
        response = client.post(
            "/extract/directives-from-text",
            json={"text": sample_judgment_text, "judgment_date": "2024-03-15"},
        )
        assert response.status_code == 200
        data = response.json()

        # Verify response structure
        assert "metadata" in data
        assert "extraction_info" in data
        assert "directives" in data
        assert "full_text" in data

        # Verify metadata
        assert data["metadata"]["court_name"]["value"] is not None
        assert data["metadata"]["case_number"]["value"] is not None

        # Verify directives were extracted
        assert len(data["directives"]) >= 2

        # Verify directive structure
        d = data["directives"][0]
        assert "directive_text" in d
        assert "confidence" in d
        assert "review_status" in d
        assert 0 <= d["confidence"] <= 1

    def test_extract_with_empty_text(self, client):
        response = client.post(
            "/extract/directives-from-text",
            json={"text": "", "judgment_date": "2024-03-15"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["directives"] == []


class TestHealthEndpoint:
    def test_health(self, client):
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["tesseract"] is not None


class TestTextExtractionEndpoint:
    def test_entities_endpoint(self, client):
        response = client.post(
            "/extract/entities",
            json={"text": "Justice Sharma of High Court of Karnataka ordered on 15th March 2024."},
        )
        assert response.status_code == 200
        data = response.json()
        assert "entities" in data
        assert "total" in data
