"""Unit tests for Regional Air Quality Context Lookup."""

from app.core.region_context import DEFAULT_CONTEXT, get_region_context


def test_known_regions():
    """Verify state/city lookups for northern, southern, and coastal regions."""
    delhi = get_region_context("Delhi")
    assert "Delhi-NCR" in delhi.region_name
    assert delhi.stubble_burning_risk is True
    assert "thermal inversion" in delhi.seasonal_dynamic.lower()

    bengaluru = get_region_context("Bengaluru, Karnataka")
    assert "Karnataka" in bengaluru.region_name
    assert delhi.stubble_burning_risk is True
    assert bengaluru.dust_dominant is True

    mumbai = get_region_context("Mumbai")
    assert mumbai.coastal is True

    kolkata = get_region_context("Kolkata")
    assert "West Bengal" in kolkata.region_name

    chennai = get_region_context("Chennai")
    assert chennai.coastal is True


def test_unknown_region_fallback():
    """Unknown regions fallback to default Indian urban context."""
    fallback = get_region_context("UnknownCityXYZ")
    assert fallback == DEFAULT_CONTEXT
    assert "Urban India" in fallback.region_name
