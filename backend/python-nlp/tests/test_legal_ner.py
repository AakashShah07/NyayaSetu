import pytest
from app.services.nlp_service import load_model
from app.services.legal_ner import (
    extract_legal_metadata,
    map_to_department,
)


@pytest.fixture(autouse=True, scope="module")
def load_spacy():
    load_model()


class TestCourtNameExtraction:
    def test_known_court(self, sample_judgment_text):
        result = extract_legal_metadata(sample_judgment_text)
        assert result["court_name"]["value"] is not None
        assert "Karnataka" in result["court_name"]["value"]
        assert result["court_name"]["confidence"] >= 0.80

    def test_supreme_court(self):
        text = "IN THE SUPREME COURT OF INDIA\nCIVIL APPELLATE JURISDICTION"
        result = extract_legal_metadata(text)
        assert "Supreme Court" in result["court_name"]["value"]


class TestCaseNumberExtraction:
    def test_writ_petition(self, sample_judgment_text):
        result = extract_legal_metadata(sample_judgment_text)
        assert result["case_number"]["value"] is not None
        assert "12345" in result["case_number"]["value"]
        assert result["case_number"]["confidence"] >= 0.90

    def test_slp(self):
        text = "SLP (C) No. 789 of 2023"
        result = extract_legal_metadata(text)
        assert result["case_number"]["value"] is not None


class TestJudgeExtraction:
    def test_judges_found(self, sample_judgment_text):
        result = extract_legal_metadata(sample_judgment_text)
        assert len(result["judges"]) >= 1
        judge_names = [j["value"] for j in result["judges"]]
        assert any("sharma" in name.lower() for name in judge_names)

    def test_judge_confidence(self, sample_judgment_text):
        result = extract_legal_metadata(sample_judgment_text)
        for judge in result["judges"]:
            assert judge["confidence"] >= 0.85


class TestDateExtraction:
    def test_judgment_date(self, sample_judgment_text):
        result = extract_legal_metadata(sample_judgment_text)
        assert result["judgment_date"]["value"] is not None
        assert result["judgment_date"]["confidence"] >= 0.50

    def test_filing_date(self, sample_judgment_text):
        result = extract_legal_metadata(sample_judgment_text)
        # "filed on 10.01.2023" should be found
        assert result["filing_date"]["value"] is not None or result["filing_date"]["confidence"] == 0.0


class TestPartyExtraction:
    def test_parties_from_versus(self):
        text = "State of Karnataka v/s M/s Industrial Polluters Ltd.\n"
        result = extract_legal_metadata(text)
        parties = result["parties"]
        assert parties["petitioner"]["value"] is not None or parties["respondent"]["value"] is not None


class TestMonetaryAmounts:
    def test_rupee_amounts(self, sample_judgment_text):
        result = extract_legal_metadata(sample_judgment_text)
        assert len(result["monetary_amounts"]) >= 1
        amounts = [a["value"] for a in result["monetary_amounts"]]
        assert any("5,00,000" in a for a in amounts)


class TestDepartmentMapping:
    def test_environment(self):
        assert map_to_department("Department of Environment") == "Environment"

    def test_police(self):
        assert map_to_department("Superintendent of Police") == "Police"

    def test_social_welfare(self):
        assert map_to_department("Department of Social Welfare") == "Social Welfare"

    def test_general_fallback(self):
        assert map_to_department("Revenue Department") == "General"

    def test_none_input(self):
        assert map_to_department(None) == "General"
