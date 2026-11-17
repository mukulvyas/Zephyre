"""Unit tests for Indian CPCB AQI Calculation and Breakpoint Boundaries."""

import pytest
from app.core.aqi_cpcb import (
    AqiCategory,
    calculate_cpcb_aqi,
    calculate_sub_index_pm10,
    calculate_sub_index_pm25,
    get_aqi_category,
    get_category_metadata,
)


def test_pm25_boundary_values():
    """Verify PM2.5 CPCB breakpoint boundaries."""
    # Good (0-30 -> 0-50)
    assert calculate_sub_index_pm25(0.0) == 0
    assert calculate_sub_index_pm25(15.0) == 25
    assert calculate_sub_index_pm25(30.0) == 50

    # Satisfactory (30.1-60 -> 51-100)
    assert calculate_sub_index_pm25(30.1) == 51
    assert calculate_sub_index_pm25(45.0) == 75
    assert calculate_sub_index_pm25(60.0) == 100

    # Moderate (60.1-90 -> 101-200)
    assert calculate_sub_index_pm25(60.1) == 101
    assert calculate_sub_index_pm25(75.0) == 150
    assert calculate_sub_index_pm25(90.0) == 200

    # Poor (90.1-120 -> 201-300)
    assert calculate_sub_index_pm25(90.1) == 201
    assert calculate_sub_index_pm25(105.0) == 250
    assert calculate_sub_index_pm25(120.0) == 300

    # Very Poor (120.1-250 -> 301-400)
    assert calculate_sub_index_pm25(120.1) == 301
    assert calculate_sub_index_pm25(185.0) == 350
    assert calculate_sub_index_pm25(250.0) == 400

    # Severe (250.1-380 -> 401-500)
    assert calculate_sub_index_pm25(250.1) == 401
    assert calculate_sub_index_pm25(315.0) == 450
    assert calculate_sub_index_pm25(380.0) == 500


def test_pm10_boundary_values():
    """Verify PM10 CPCB breakpoint boundaries."""
    # Good (0-50 -> 0-50)
    assert calculate_sub_index_pm10(0.0) == 0
    assert calculate_sub_index_pm10(50.0) == 50

    # Satisfactory (50.1-100 -> 51-100)
    assert calculate_sub_index_pm10(50.1) == 51
    assert calculate_sub_index_pm10(100.0) == 100

    # Moderate (100.1-250 -> 101-200)
    assert calculate_sub_index_pm10(100.1) == 101
    assert calculate_sub_index_pm10(250.0) == 200

    # Poor (250.1-350 -> 201-300)
    assert calculate_sub_index_pm10(250.1) == 201
    assert calculate_sub_index_pm10(350.0) == 300

    # Very Poor (350.1-430 -> 301-400)
    assert calculate_sub_index_pm10(350.1) == 301
    assert calculate_sub_index_pm10(430.0) == 400

    # Severe (430.1-510 -> 401-500)
    assert calculate_sub_index_pm10(430.1) == 401
    assert calculate_sub_index_pm10(510.0) == 500


def test_cpcb_aqi_max_sub_index():
    """Overall AQI takes max of PM2.5 and PM10 sub-indices."""
    # PM2.5 dominates (pm25=120 -> sub=300, pm10=50 -> sub=50)
    aqi, pol = calculate_cpcb_aqi(pm25=120.0, pm10=50.0)
    assert aqi == 300
    assert pol == "PM2.5"

    # PM10 dominates (pm25=20 -> sub=33, pm10=300 -> sub=250)
    aqi2, pol2 = calculate_cpcb_aqi(pm25=20.0, pm10=300.0)
    assert aqi2 == 250
    assert pol2 == "PM10"


def test_aqi_category_mappings():
    """Test standard CPCB category classification boundaries."""
    assert get_aqi_category(0) == AqiCategory.GOOD
    assert get_aqi_category(50) == AqiCategory.GOOD
    assert get_aqi_category(51) == AqiCategory.SATISFACTORY
    assert get_aqi_category(100) == AqiCategory.SATISFACTORY
    assert get_aqi_category(101) == AqiCategory.MODERATE
    assert get_aqi_category(200) == AqiCategory.MODERATE
    assert get_aqi_category(201) == AqiCategory.POOR
    assert get_aqi_category(300) == AqiCategory.POOR
    assert get_aqi_category(301) == AqiCategory.VERY_POOR
    assert get_aqi_category(400) == AqiCategory.VERY_POOR
    assert get_aqi_category(401) == AqiCategory.SEVERE
    assert get_aqi_category(500) == AqiCategory.SEVERE


def test_category_metadata():
    """Verify colors and metadata for categories."""
    meta = get_category_metadata(AqiCategory.VERY_POOR)
    assert meta.min_aqi == 301
    assert meta.max_aqi == 400
    assert meta.color_hex == "#EF4444"
    assert "Keep windows closed" in meta.health_statement
