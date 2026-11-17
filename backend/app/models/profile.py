"""Profile and Family Member Pydantic Models."""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class CommuteMode(str, Enum):
    METRO = "metro"
    BUS = "bus"
    CAR_AC = "car_ac"
    CAR_OPEN = "car_open"
    TWO_WHEELER = "two_wheeler"
    WALK_CYCLE = "walk_cycle"
    WORK_FROM_HOME = "wfh"


class CookingFuel(str, Enum):
    LPG = "lpg"
    ELECTRIC = "electric_induction"
    PIPED_NATURAL_GAS = "png"
    BIOMASS_CHULHA = "biomass_wood"


class ActivityIntensity(str, Enum):
    LIGHT = "light"          # desk work, reading
    MODERATE = "moderate"    # walking, household chores
    VIGOROUS = "vigorous"    # sports, running, outdoor coaching


class FamilyMember(BaseModel):
    id: str = Field(..., description="Unique member identifier")
    name: str = Field(..., min_length=1, max_length=50, description="Member name")
    age: int = Field(..., ge=0, le=120, description="Age in years")
    relationship: str = Field(..., max_length=30, description="Self, Son, Daughter, Grandmother, etc.")
    has_asthma_or_respiratory: bool = Field(False, description="Has asthma, wheezing, COPD, or dust allergy")
    is_pregnant: bool = Field(False, description="Is currently pregnant")
    commute_mode: CommuteMode = Field(CommuteMode.METRO, description="Primary commute mode")
    default_activity: ActivityIntensity = Field(ActivityIntensity.MODERATE, description="Typical outdoor activity level")


class HouseholdSetup(BaseModel):
    has_air_purifier: bool = Field(True, description="Has at least one HEPA air purifier")
    purifier_count: int = Field(1, ge=0, le=10, description="Number of HEPA purifiers")
    cooking_fuel: CookingFuel = Field(CookingFuel.LPG, description="Cooking fuel type")
    has_exhaust_chimney: bool = Field(True, description="Kitchen exhaust fan or chimney present")
    window_sealing_quality: str = Field("average", description="poor, average, airtight")


class LocationProfile(BaseModel):
    name: str = Field(..., description="City or Locality name, e.g., Greater Kailash II, New Delhi")
    state: str = Field(..., description="Indian State or UT, e.g., Delhi")
    latitude: float = Field(..., ge=6.0, le=38.0, description="Valid latitude for India")
    longitude: float = Field(..., ge=68.0, le=98.0, description="Valid longitude for India")


class UserProfile(BaseModel):
    user_name: str = Field("Mukul", max_length=50)
    language: str = Field("en", description="en, hi, ta, te, mr")
    location: LocationProfile = Field(
        default_factory=lambda: LocationProfile(
            name="Greater Kailash II, New Delhi",
            state="Delhi",
            latitude=28.5355,
            longitude=77.2410,
        )
    )
    members: List[FamilyMember] = Field(
        default_factory=lambda: [
            FamilyMember(
                id="m1",
                name="Mukul",
                age=34,
                relationship="Self",
                has_asthma_or_respiratory=False,
                commute_mode=CommuteMode.METRO,
                default_activity=ActivityIntensity.MODERATE,
            ),
            FamilyMember(
                id="m2",
                name="Aarav",
                age=6,
                relationship="Son",
                has_asthma_or_respiratory=False,
                commute_mode=CommuteMode.BUS,
                default_activity=ActivityIntensity.VIGOROUS,
            ),
            FamilyMember(
                id="m3",
                name="Kavita",
                age=68,
                relationship="Grandmother",
                has_asthma_or_respiratory=True,
                commute_mode=CommuteMode.WORK_FROM_HOME,
                default_activity=ActivityIntensity.LIGHT,
            ),
        ]
    )
    household: HouseholdSetup = Field(default_factory=HouseholdSetup)
