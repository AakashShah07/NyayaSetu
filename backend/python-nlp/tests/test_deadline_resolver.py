from app.services.deadline_resolver import resolve_deadline


class TestRelativeDeadlines:
    def test_within_days(self):
        result = resolve_deadline("within 30 days", "2024-03-15")
        assert result["deadline"] == "2024-04-14"
        assert result["confidence"] > 0.8

    def test_within_months(self):
        result = resolve_deadline("within 3 months", "2024-03-15")
        assert result["deadline"] == "2024-06-15"
        assert result["confidence"] > 0.8

    def test_within_period_of_days(self):
        result = resolve_deadline("within a period of 60 days", "2024-03-15")
        assert result["deadline"] == "2024-05-14"

    def test_not_later_than(self):
        result = resolve_deadline("not later than 14 days", "2024-03-15")
        assert result["deadline"] == "2024-03-29"

    def test_within_years(self):
        result = resolve_deadline("within 1 year", "2024-03-15")
        assert result["deadline"] == "2025-03-15"


class TestImmediateDeadlines:
    def test_forthwith(self):
        result = resolve_deadline("forthwith", "2024-03-15")
        assert result["deadline"] == "2024-03-22"
        assert result["confidence"] > 0.7

    def test_immediately(self):
        result = resolve_deadline("immediately", "2024-03-15")
        assert result["deadline"] == "2024-03-22"

    def test_without_delay(self):
        result = resolve_deadline("without any delay", "2024-03-15")
        assert result["deadline"] == "2024-03-22"

    def test_at_the_earliest(self):
        result = resolve_deadline("at the earliest", "2024-03-15")
        assert result["deadline"] == "2024-04-14"
        assert result["confidence"] > 0.5


class TestAbsoluteDeadlines:
    def test_before_date(self):
        result = resolve_deadline("before 15th June, 2024", "2024-03-15")
        assert result["deadline"] == "2024-06-15"
        assert result["confidence"] > 0.9

    def test_by_date_dd_mm_yyyy(self):
        result = resolve_deadline("by 30.06.2024", "2024-03-15")
        assert result["deadline"] == "2024-06-30"

    def test_on_or_before(self):
        result = resolve_deadline("on or before 15/06/2024", "2024-03-15")
        assert result["deadline"] == "2024-06-15"


class TestEdgeCases:
    def test_no_judgment_date(self):
        result = resolve_deadline("within 30 days", None)
        assert result["deadline"] is not None
        assert result["confidence"] < 0.5  # Halved because no anchor

    def test_empty_text(self):
        result = resolve_deadline("", "2024-03-15")
        assert result["deadline"] is None
        assert result["confidence"] == 0.0

    def test_unparseable(self):
        result = resolve_deadline("on the next date of hearing", "2024-03-15")
        assert result["confidence"] == 0.0 or result["deadline"] is None
