"""Unit tests for Personal Risk Scoring Engine."""

import pytest
from app.core.aqi_cpcb import AqiCategory
from app.core.risk_engine import compute_household_clean_score, compute_member_risk
from app.models.advice import RiskVerdict
from app.models.profile import (
    ActivityIntensity,
    CommuteMode,
    CookingFuel,
    FamilyMember,
    HouseholdSetup,
)


def test_child_risk_in_very_poor_air():
    """Child under 10 with vigorous sports activity in Very Poor air should be AVOID."""
    child = FamilyMember(
        id="c1",
        name="Aarav",
        age=6,
        relationship="Son",
        has_asthma_or_respiratory=False,
        commute_mode=CommuteMode.BUS,
        default_activity=ActivityIntensity.VIGOROUS,
    )
    household = HouseholdSetup(has_air_purifier=True)

    guidance = compute_member_risk(child, AqiCategory.VERY_POOR, household)
    assert guidance.verdict == RiskVerdict.AVOID
    assert "Indoor play only" in guidance.verdict_label
    assert any("developing lungs" in r for r in guidance.reasons)


def test_child_in_moderate_air():
    """Child in Moderate air should be BE_CAREFUL with light play label."""
    child = FamilyMember(
        id="c2",
        name="Aarav",
        age=6,
        relationship="Son",
        has_asthma_or_respiratory=False,
        commute_mode=CommuteMode.METRO,
        default_activity=ActivityIntensity.MODERATE,
    )
    household = HouseholdSetup(has_air_purifier=True)

    guidance = compute_member_risk(child, AqiCategory.MODERATE, household)
    assert guidance.verdict in (RiskVerdict.BE_CAREFUL, RiskVerdict.SAFE)


def test_elderly_asthma_in_severe_air():
    """Elderly with asthma in Severe air should have high risk score and AVOID verdict."""
    senior = FamilyMember(
        id="s1",
        name="Kavita",
        age=68,
        relationship="Grandmother",
        has_asthma_or_respiratory=True,
        commute_mode=CommuteMode.WORK_FROM_HOME,
        default_activity=ActivityIntensity.LIGHT,
    )
    household = HouseholdSetup(has_air_purifier=True)

    guidance = compute_member_risk(senior, AqiCategory.SEVERE, household)
    assert guidance.verdict == RiskVerdict.AVOID
    assert "inhaler ready" in guidance.verdict_label.lower()
    assert guidance.risk_score >= 85


def test_pregnant_member_and_two_wheeler_commute():
    """Pregnant member with open two wheeler commute and biomass fuel."""
    member = FamilyMember(
        id="p1",
        name="Pooja",
        age=28,
        relationship="Wife",
        has_asthma_or_respiratory=False,
        is_pregnant=True,
        commute_mode=CommuteMode.TWO_WHEELER,
        default_activity=ActivityIntensity.LIGHT,
    )
    household = HouseholdSetup(
        has_air_purifier=False,
        cooking_fuel=CookingFuel.BIOMASS_CHULHA,
    )
    guidance = compute_member_risk(member, AqiCategory.POOR, household)
    assert guidance.risk_score > 70
    assert guidance.verdict == RiskVerdict.AVOID
    assert any("circulation" in r for r in guidance.reasons)


def test_healthy_adult_in_good_air():
    """Healthy adult in Good air should be SAFE."""
    adult = FamilyMember(
        id="a1",
        name="Mukul",
        age=34,
        relationship="Self",
        has_asthma_or_respiratory=False,
        commute_mode=CommuteMode.METRO,
        default_activity=ActivityIntensity.MODERATE,
    )
    household = HouseholdSetup(has_air_purifier=False)

    guidance = compute_member_risk(adult, AqiCategory.GOOD, household)
    assert guidance.verdict == RiskVerdict.SAFE
    assert guidance.risk_score <= 40
    assert "Fresh Air" in guidance.verdict_label


def test_household_clean_score_calculation():
    """Household clean score accounts for purifiers, compliance, and vulnerabilities."""
    household = HouseholdSetup(
        has_air_purifier=True,
        has_exhaust_chimney=True,
        cooking_fuel=CookingFuel.LPG,
    )
    guidances = [
        compute_member_risk(
            FamilyMember(
                id="m1",
                name="Test",
                age=30,
                relationship="Self",
                has_asthma_or_respiratory=False,
            ),
            AqiCategory.MODERATE,
            household,
        )
    ]
    score = compute_household_clean_score(
        guidances=guidances,
        household=household,
        checklist_completed_count=3,
        checklist_total_count=4,
    )
    assert 60 <= score <= 95
