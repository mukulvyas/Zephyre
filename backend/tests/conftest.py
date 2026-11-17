"""Pytest configuration and shared test fixtures."""

import pytest

from app.models.profile import UserProfile


@pytest.fixture
def sample_user_profile():
    return UserProfile()
