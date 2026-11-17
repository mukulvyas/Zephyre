# Zephyre Decision Logic & Rules Specification

Zephyre employs a **hybrid rule engine + GenAI** architecture. All safety decisions, breakpoints, personal scores, and emission factors are computed deterministically.

---

## 1. Official Indian CPCB AQI Breakpoints

Calculated using the Indian Central Pollution Control Board (CPCB) formula:
$$I = \left[\frac{I_{\text{hi}} - I_{\text{lo}}}{B_{\text{hi}} - B_{\text{lo}}}\right] \times (C - B_{\text{lo}}) + I_{\text{lo}}$$

The overall AQI is:
$$\text{AQI} = \max\left(I_{\text{PM2.5}}, I_{\text{PM10}}\right)$$

| Category | AQI Range | PM2.5 ($\mu$g/m³) | PM10 ($\mu$g/m³) | Color Hex | Directive |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Good** | 0 – 50 | 0.0 – 30.0 | 0.0 – 50.0 | `#10B981` | Clean air. Enjoy full outdoor activities. |
| **Satisfactory** | 51 – 100 | 30.1 – 60.0 | 50.1 – 100.0 | `#84CC16` | Open windows before afternoon haze. |
| **Moderate** | 101 – 200 | 60.1 – 90.0 | 100.1 – 250.0 | `#F59E0B` | Sensitive individuals take easy breaks. |
| **Poor** | 201 – 300 | 90.1 – 120.0 | 250.1 – 350.0 | `#F97316` | Wear N95 during transit; move workouts indoors. |
| **Very Poor** | 301 – 400 | 120.1 – 250.0 | 350.1 – 430.0 | `#EF4444` | Keep windows sealed; bundle up with an N95 outside. |
| **Severe** | 401 – 500 | 250.1 – 380.0 | 430.1 – 510.0 | `#881337` | Health emergency! Seal indoors; run HEPA continuously. |

---

## 2. Personal Risk Scoring Matrix (`risk_engine.py`)

Personal Risk Score (0 to 100) is evaluated additively:

$$\text{Base AQI Score} + \sum \text{Vulnerabilities} + \sum \text{Mitigations}$$

| Parameter | Condition | Adjustment | Physiological Justification |
| :--- | :--- | :--- | :--- |
| **Base AQI** | Good / Satisfactory / Moderate / Poor / Very Poor / Severe | 10 / 25 / 45 / 65 / 85 / 100 | Ambient baseline concentration |
| **Child ($\le 10$y)** | Age $\le 10$ | **+15** | Developing lung alveoli; inhales 2-3x more air per kg bodyweight. |
| **Senior ($\ge 60$y)** | Age $\ge 60$ | **+15** | Reduced alveolar elasticity and elevated cardiovascular strain. |
| **Asthma / Respiratory**| Diagnosed condition | **+25** | Hyper-reactive bronchial airways prone to acute bronchospasm. |
| **Pregnancy** | Active pregnancy | **+20** | Trans-placental ultrafine particulate transfer risk. |
| **Vigorous Exertion** | Sports, outdoor coaching | **+20** | Switches to mouth breathing, bypassing nasal hair filtration. |
| **Open Commute** | Two-wheeler, open auto, roadside walking | **+15** | Direct roadside vehicular exhaust plume exposure. |
| **Metro Commute** | Underground filtered transit | **-10** | Physical barrier from highway tailpipe emissions. |
| **Home HEPA Filter** | Active in residential rooms | **-10** (indoors) | Traps 99.97% of particulates down to 0.3 microns. |
| **Biomass Cooking** | Chulha / wood / dung fuel | **+20** | Severe indoor smoke compounding outdoor particulate burden. |

### Verdict Mapping
- **Score $\le 40$**: `RiskVerdict.SAFE` (Badge: Fresh Air, Green)
- **Score $41 - 70$**: `RiskVerdict.BE_CAREFUL` (Badge: Caution / N95 Transit, Amber)
- **Score $> 70$**: `RiskVerdict.AVOID` (Badge: Indoor play only / Stay indoors, Red)

---

## 3. Household Sanctuary Clean Score Formula

Computed dynamically for the family sanctuary:

$$\text{Clean Score} = 50 + \text{PurifierBonus} (15) + \text{ExhaustBonus} (10) + \text{CleanFuelBonus} (5) + \left(20 \times \frac{\text{Completed}}{\text{Total}}\right) - \left(0.15 \times \text{AvgRisk}\right)$$

Clamped between 10 and 100.

---

## 4. Fixed Emission Factors & Impact Formulas (`impact_calculator.py`)

Every impact number follows the strict principle **Choice $\rightarrow$ Effect $\rightarrow$ Number**:

1. **Delhi Metro vs Private Cab Commute**:
   - Private car emission: $0.140$ kg CO₂/km
   - Metro rail emission: $0.018$ kg CO₂/km
   - Commute distance: $15.0$ km
   $$\Delta \text{CO}_2 = (0.140 - 0.018) \times 15.0 = 1.83 \text{ kg CO}_2 \text{ avoided}$$
   - *Source: CEA CO₂ Baseline Database for Indian Power & Urban Transport Sector.*

2. **N95 Respirator vs Single-Layer Cloth**:
   - N95 filter efficiency: $\ge 95\%$
   - Single-layer cloth efficiency: $\approx 30\%$
   $$\Delta \text{Particulate Barrier} = 95\% - 30\% = +65\% \text{ additional microparticulate capture}$$
   - *Source: Bureau of Indian Standards (BIS IS:9473) & NIOSH 42 CFR 84.*

3. **HEPA H13 Room Purifier**:
   - CADR $250 \text{ m}^3/\text{h}$ in typical $40 \text{ m}^3$ room $\rightarrow 80\%$ ambient particulate reduction within 45 minutes of closed-door operation.
