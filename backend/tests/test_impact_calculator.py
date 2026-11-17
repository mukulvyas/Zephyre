"""Unit tests for Impact and Emission Factors Calculator."""

from app.core.impact_calculator import (
    calculate_damp_mop_benefit,
    calculate_n95_filtration_benefit,
    calculate_purifier_exposure_reduction,
    calculate_transit_co2_savings,
    generate_impact_report,
)


def test_transit_co2_savings():
    """Verify metro vs petrol car emission calculation."""
    # (0.140 - 0.018) * 15 = 1.83 kg CO2
    calc = calculate_transit_co2_savings("metro_electric", "car_petrol", 15.0)
    assert calc.value == 1.83
    assert calc.unit == "kg CO2"
    assert "0.14" in calc.formula
    assert "CEA" in calc.source_note


def test_n95_filtration_benefit():
    """Verify N95 vs cloth mask particulate calculation."""
    calc = calculate_n95_filtration_benefit(ambient_pm25=280.0)
    assert calc.value == 65.0
    assert "95%" in calc.formula
    assert "BIS" in calc.source_note


def test_purifier_exposure_reduction():
    """Verify HEPA room efficiency metric."""
    calc = calculate_purifier_exposure_reduction()
    assert calc.value == 80.0
    assert "CADR" in calc.formula


def test_damp_mop_benefit():
    """Verify floor dust re-suspension metric."""
    calc = calculate_damp_mop_benefit()
    assert calc.value == 70.0


def test_generate_impact_report():
    """Verify full explainable report structure and Choice -> Effect -> Number."""
    report = generate_impact_report(["act_transit", "act_mask", "act_purifier", "act_cleaning"])
    assert report.total_co2_avoided_kg > 0
    assert report.total_pm25_exposure_reduced_pct >= 50.0
    assert len(report.action_breakdowns) == 4
    for b in report.action_breakdowns:
        assert b.choice_made
        assert b.effect_description
        assert b.number_highlight
        assert b.calculation.formula
        assert b.calculation.source_note
