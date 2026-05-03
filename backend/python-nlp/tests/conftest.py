import pytest


@pytest.fixture
def sample_judgment_text():
    """Sample court judgment text for testing."""
    return """
IN THE HIGH COURT OF KARNATAKA AT BENGALURU

DATED THIS THE 15TH DAY OF MARCH, 2024

PRESENT:
THE HON'BLE MR. JUSTICE A.B. SHARMA
AND
THE HON'BLE MR. JUSTICE C.D. PATEL

W.P. No. 12345/2023 (GM-RES)

BETWEEN:

State of Karnataka
represented by its Secretary,
Department of Environment ... Petitioner

AND

M/s Industrial Polluters Ltd.
through its Managing Director ... Respondent

ORDER

This petition was filed on 10.01.2023 seeking directions for environmental compliance.

After hearing both parties and considering the material on record, we find that
the respondent has been discharging untreated effluents into the river in violation
of the Water (Prevention and Control of Pollution) Act, 1974.

For the reasons aforesaid, we pass the following order:

1. The Department of Environment shall submit a detailed remediation plan
   within 60 days from the date of this order.

2. The respondent is directed to cease all discharge of untreated effluents
   forthwith.

3. The respondent shall deposit a sum of Rs. 5,00,000 (Rupees Five Lakhs Only)
   as environmental compensation with the Karnataka State Pollution Control Board
   within 30 days.

4. The Commissioner of the Department of Social Welfare shall ensure that the
   affected communities are provided clean drinking water, provided that the
   assessment report confirms contamination, within 90 days from the date
   of this order.

5. The Superintendent of Police, Bengaluru Rural district, is directed to
   ensure compliance of this order and file a compliance report before
   15th June, 2024.

The petition stands disposed of accordingly.

Sd/-
JUSTICE A.B. SHARMA

Sd/-
JUSTICE C.D. PATEL
"""


@pytest.fixture
def sample_order_section():
    """Just the order section text."""
    return """
For the reasons aforesaid, we pass the following order:

1. The Department of Environment shall submit a detailed remediation plan
   within 60 days from the date of this order.

2. The respondent is directed to cease all discharge of untreated effluents
   forthwith.

3. The respondent shall deposit a sum of Rs. 5,00,000 (Rupees Five Lakhs Only)
   as environmental compensation with the Karnataka State Pollution Control Board
   within 30 days.

4. The Commissioner of the Department of Social Welfare shall ensure that the
   affected communities are provided clean drinking water, provided that the
   assessment report confirms contamination, within 90 days from the date
   of this order.

5. The Superintendent of Police, Bengaluru Rural district, is directed to
   ensure compliance of this order and file a compliance report before
   15th June, 2024.

The petition stands disposed of accordingly.
"""
