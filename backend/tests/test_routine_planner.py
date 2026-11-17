"""Unit tests for Routine Planner and Safest Window."""

import pytest
from app.core.aqi_cpcb import AqiCategory
from app.core.routine_planner import (
    find_safest_outdoor_window,
    generate_daily_checklist,
    generate_one_line_instruction,
)
from app.models.aqi import HourlyForecastPoint
from app.models.profile import UserProfile


def test_safest_outdoor_window_selection():
    """Verify window selection correctly detects daytime hour with lowest AQI."""
    points = [
        HourlyForecastPoint(time="08:00", hour=8, aqi=410, category=AqiCategory.SEVERE, pm25=260.0),
        HourlyForecastPoint(time="11:00", hour=11, aqi=360, category=AqiCategory.VERY_POOR, pm25=200.0),
        HourlyForecastPoint(time="15:00", hour=15, aqi=240, category=AqiCategory.POOR, pm25=95.0),
        HourlyForecastPoint(time="20:00", hour=20, aqi=390, category=AqiCategory.VERY_POOR, pm25=220.0),
    ]

    safe_window, caution = find_safest_outdoor_window(points)
    assert "PM" in safe_window.start_time
    assert safe_window.average_aqi <= 300
    assert "before 11:00 AM" in caution


def test_one_line_instruction():
    """Verify one-line directive reflects CPCB urgency."""
    inst_good = generate_one_line_instruction(AqiCategory.GOOD)
    assert "crisp and clean" in inst_good

    inst_very_poor = generate_one_line_instruction(AqiCategory.VERY_POOR)
    assert "N95" in inst_very_poor


def test_daily_checklist_generation():
    """Verify 4 tailored actions are created for smoggy vs clean air."""
    profile = UserProfile()
    actions = generate_daily_checklist(AqiCategory.VERY_POOR, profile)
    assert len(actions) == 4
    action_ids = [a.id for a in actions]
    assert "act_mask" in action_ids
    assert "act_purifier" in action_ids
    assert "act_transit" in action_ids
    assert "act_cleaning" in action_ids
