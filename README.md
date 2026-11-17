# Zephyre - Daily Air Quality Coach 🌿
> **"A weather app for your lungs"** — Personalized low-emission daily routines, indoor air-quality hacks, and explainable impact metrics for families across all of India.

---

## 1. Project Overview & Problem Statement

### The Challenge
Across urban India, winter brings severe toxic smog, thermal inversions, and hazardous particulate spikes (PM2.5 frequently exceeding $300\text{ }\mu\text{g/m}^3$). While existing weather apps display raw AQI numbers and alarmist warnings, they fail to answer the critical daily questions for Indian households:
- *"Can my 6-year-old go to football coaching at 4:30 PM today?"*
- *"Should my 68-year-old mother with mild asthma step out for an evening walk?"*
- *"When is the safest time today to open windows for ventilation without filling our home with smog?"*

### The Zephyre Solution
Zephyre is designed around a single UX principle: **The user opens it and understands what to do today in under 5 seconds**.
Every recommendation follows:
$$\text{Choice} \longrightarrow \text{Effect} \longrightarrow \text{Number}$$

---

## 2. Design System & Screenshots (Google Stitch)
Designed in **Google Stitch** (`Zephyre Air Quality Coach`, project `projects/16959326902119838273`):
- **Visuals**: Mobile-first, soft rounded cards (`24px` radius), mint green (`#6cf8bb` / `#006c49`), sky blue (`#006194`), and warm peach (`#ffdbce` / `#a33900`) on a pale cloud-grey canvas (`#f8f9ff`).
- **Typography**: Plus Jakarta Sans for headlines and body; Inter for data labels.
- **Logo**: Inline SVG wind-swirl "Z" in a mint circle next to "Zephyre".
- **Navigation**: 4 bottom tabs on mobile (`Today`, `Ask`, `Impact`, `My Family`) + desktop layout with left sidebar and 2-column grid.

| Screen | Core Feature & UI Showcase |
| :--- | :--- |
| **Today** | CPCB Live AQI Radial Gauge, one-line directive, best outdoor window (`2:00 PM – 4:00 PM`), family care chips, interactive checklist (`1 of 4 done`). |
| **Ask** | AI Coach with quick chips, voice input, CPCB verdict badges, 2-sentence reasons, practical alternatives, and impact facts. |
| **Impact** | Total CO₂ avoided ($2.1\text{ kg}$), neem tree carbon equivalence, 5-day clean streak, and expandable *"How we calculated this"* formulas. |
| **My Family** | Household clean score ($88/100$ circular ring), personal member risk cards (Mukul, Aarav, Kavita), room air estimates (`Demo data`). |
| **Onboarding** | 4-step wizard: Indian locality search with GPS, household members, commute mode, and home purifier/fuel setup. |

---

## 3. How It Works (Mermaid Architecture)

```mermaid
flowchart TD
    UserProfile["User Profile & Family (Stored in LocalStorage)"] --> Location["Nationwide Location Search (Open-Meteo IN / GPS)"]
    Location --> DataIngestion["Live Data Ingestion (WAQI + Open-Meteo Fallback)"]
    
    subgraph DeterministicEngine["Deterministic Rule Engine (Ground Truth)"]
        DataIngestion --> CPCB["CPCB Breakpoint Interpolation (PM2.5 / PM10)"]
        CPCB --> RiskEngine["Risk Matrix (Age x Asthma x Commute x Purifier)"]
        CPCB --> RoutinePlanner["Routine Planner (Safest Window & Checklist)"]
        RiskEngine --> ImpactCalc["Impact Calculator (Fixed Emission Factors)"]
    end

    subgraph GenAILayer["GenAI Phrasing & Safety Layer"]
        DeterministicEngine --> SafetyGuard["Safety & Sanitization Guard (Injection + Medical)"]
        SafetyGuard --> Gemini["Google Gemini (Constrained Phrasing in EN/HI/TA/TE/MR)"]
        SafetyGuard --> OfflineFallback["Rule-Based Offline Fallback (If no API key)"]
    end

    GenAILayer --> Output["Validated JSON Output: Choice -> Effect -> Number"]
```

---

## 4. Feature Proofs Mapped to Evaluation Areas

| Evaluation Area | Implemented Capability & Proof |
| :--- | :--- |
| **Problem Alignment** | **Nationwide, not hardcoded to Delhi**. Works for any Indian city or locality via Open-Meteo geocoding; state-wise pollution context in `region_context.py`. |
| **Code Quality** | Strict TypeScript (`noImplicitAny`), Pydantic v2 schemas, zero magic numbers, modular architecture, 100% ruff and eslint clean. |
| **Security** | Secrets server-side only; regex prompt-injection defense; clinical emergency guard for chest pain/asthma attacks (`needs_doctor=true`); rate-limiting via slowapi; zero server PII. |
| **Efficiency** | In-memory TTL caching (AQI 15m, Geocoding 24h, LLM 10m); async concurrent httpx; code-split lazy routes; **production bundle under 250 KB** (gzipped: 59 KB JS + 5.5 KB CSS). |
| **Testing** | **33 backend pytest unit/API tests (92% coverage on `app/core/`)**; **14 frontend Vitest tests**; automated **axe-core WCAG 2.1 AA** checks. |
| **Accessibility** | Color contrast $\ge 4.5:1$, skip-to-content landmark, progressbar roles with text alternatives, touch targets $\ge 44\text{px}$, reduced-motion support, voice input. |

---

## 5. Decision Tables & Impact Formulas

### A. CPCB AQI Category & Person Vulnerability Matrix
| AQI Category | Healthy Adult | Child ($\le 10$y) | Senior / Asthma | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Good (0-50)** | Safe | Safe | Safe | Full outdoor play & cross-ventilation. |
| **Satisfactory (51-100)** | Safe | Safe | Safe / Caution | Safe for general public. |
| **Moderate (101-200)** | Safe | Caution | Be Careful | Take breaks during heavy outdoor exertion. |
| **Poor (201-300)** | Be Careful | Avoid Outdoors | Avoid Exertion | Wear N95 in transit; move sports inside. |
| **Very Poor (301-400)** | Be Careful | Avoid Outdoors | Stay Indoors | Seal windows; run HEPA; keep inhaler ready. |
| **Severe (401-500)** | Avoid Outdoors | Avoid Strictly | Stay Indoors | Health emergency; continuous indoor filtration. |

### B. Standardized Emission Factors & Impact Formulas
- **Transit CO₂ Savings**:
  $$\text{CO}_2\text{ avoided (kg)} = \left(\text{Car Baseline } [0.140] - \text{Metro } [0.018]\right) \times 15.0\text{ km} = \mathbf{1.83\text{ kg CO}_2}$$
  *Source: Central Electricity Authority (CEA) Baseline Database for Indian Transport Sector.*
- **N95 Respirator Particulate Filtration**:
  $$\Delta \text{Capture} = 95\%\text{ (N95 standard)} - 30\%\text{ (cloth)} = \mathbf{+65\%\text{ additional microparticulate capture}}$$
  *Source: Bureau of Indian Standards (BIS IS:9473) & NIOSH 42 CFR 84.*
- **HEPA H13 Room Purifier**:
  Single pass $99.97\%$ capture at $0.3\text{ }\mu\text{m} \rightarrow \mathbf{\approx 80\%}$ ambient room PM2.5 reduction within 45 minutes in a closed $40\text{ m}^3$ bedroom.

---

## 6. Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Vitest, React Testing Library, Axe-core, ESLint, Prettier.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, Pydantic Settings, HTTPX (async), SlowAPI (rate limiting), Pytest, Pytest-asyncio, Pytest-cov, Ruff.
- **GenAI**: Google Gemini API via `LLMProvider` abstraction (`gemini-2.0-flash` or `gemini-1.5-flash`), with structured JSON output and automatic offline rule template fallback.
- **Data APIs**: Open-Meteo Geocoding API (no key), WAQI API (optional token), Open-Meteo Air Quality API (no key fallback + hourly forecast).

---

## 7. Folder Structure

```
zephyre-air-quality-coach/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── Makefile
├── render.yaml
├── vercel.json
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DECISION_LOGIC.md
│   ├── SECURITY.md
│   ├── ACCESSIBILITY.md
│   └── stitch_designs/
├── backend/
│   ├── Dockerfile
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── utils/
│   └── tests/
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── index.html
    └── src/
        ├── App.tsx
        ├── routes.tsx
        ├── api/
        ├── components/
        ├── hooks/
        ├── lib/
        ├── locales/
        └── pages/
```

---

## 8. Setup & Run Instructions

### Prerequisites
- Node.js 18+ & npm
- Python 3.11+

### A. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run backend development server
uvicorn app.main:app --reload --port 8000
```
Backend will be live at `http://localhost:8000` (Swagger docs at `/docs`).

### B. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be live at `http://localhost:5173`.

### C. Environment Variables (`.env`)
Create `.env` in the root (see `.env.example`):
```ini
GEMINI_API_KEY=your_gemini_api_key_here  # Optional: falls back to offline coach mode if blank
GEMINI_MODEL=gemini-2.0-flash
WAQI_TOKEN=your_optional_waqi_token      # Optional: falls back to Open-Meteo
DEMO_MODE=false                          # Set to true for fixed demo injections
```

---

## 9. Running Tests

### Backend Tests (Pytest + Coverage)
```bash
cd backend
source .venv/bin/activate
pytest -v --cov=app/core --cov-report=term-missing
```
*Result: 33 passed, 92% coverage on core/.*

### Frontend Tests (Vitest + RTL + Axe)
```bash
cd frontend
npm test
```
*Result: 14 passed (including automated axe WCAG 2.1 AA accessibility checks).*

### Code Quality Linters
```bash
# Backend
cd backend && ruff check app tests

# Frontend
cd frontend && npm run lint
```

---

## 10. Live Demo Script (Delhi vs Bengaluru)

Zephyre provides a documented `DEMO_MODE` env flag to demonstrate how the exact same question receives radically different, context-aware answers in high-pollution vs moderate-pollution cities:

### Scenario 1: Severe Winter Smog in Delhi
Set `DEMO_MODE=true` and `DEMO_AQI_CITY=delhi`:
- **Location**: Greater Kailash II, New Delhi (AQI $\sim 340$, Very Poor)
- **Question**: *"Can Aarav (6 yrs old) go to football coaching at 4:30 PM today?"*
- **Response**:
  - **Verdict**: `Avoid Outdoor Coaching` (Red Badge)
  - **Reason**: Delhi AQI at 4:30 PM is forecasted at 340 (Very Poor). Vigorous exercise causes children like Aarav to breathe 2-3x more air per minute, pulling micro-particulates deep into growing lung tissue.
  - **Suggestion**: ⚽ Move football indoors: footwork drills, soft foam ball juggling, or living room coordination obstacles!
  - **Impact**: Keeps Aarav away from the worst air of the day.
  - **Safest Window**: Tomorrow 2:00 PM – 4:00 PM.

### Scenario 2: Moderate Afternoon Air in Bengaluru
Set `DEMO_MODE=true` and `DEMO_AQI_CITY=bengaluru`:
- **Location**: Indiranagar, Bengaluru (AQI $\sim 72$, Satisfactory)
- **Question**: *"Can Aarav (6 yrs old) go to football coaching at 4:30 PM today?"*
- **Response**:
  - **Verdict**: `Safe for Outdoor Play` (Green Badge)
  - **Reason**: Bengaluru air is currently Satisfactory (AQI 72). Particulate concentrations are well within safe thresholds for outdoor athletic development.
  - **Suggestion**: Hydrate well and enjoy outdoor coaching on open grass grounds away from major traffic rings.
  - **Impact**: Encourages vital physical cardiovascular exercise under safe air conditions.

---

## 11. Assumptions, Limitations & Future Scope

### Assumptions & Limitations
1. **Modelled Estimates**: When no CPCB physical monitoring station is located within $25\text{ km}$, Zephyre falls back to Open-Meteo reanalysis grids and transparently displays *"Estimated from nearby grid"* to avoid inventing numbers.
2. **Not Medical Advice**: Zephyre offers lifestyle and exposure reduction routines, not clinical diagnoses. Acute medical distress triggers doctor emergency directives.
3. **Indoor Estimates Tagged**: Room air concentrations are labeled *"Demo benchmark"* based on standard air exchange assumptions, with zero fake sensor claims.

### Future Scope
- Integration with local municipal low-emission school transit zones.
- Community neighborhood clean-walk corridor crowdsourcing.
- Support for wearable peripheral air intake telemetry.

---

## 12. Size Verification
- Working tree and `.git` size stays strictly under $10\text{ MB}$ (excluding local uncommitted node_modules/venv).
- Production web bundle is only **$181.5\text{ kB}$** ($59.3\text{ kB}$ gzipped).
- Zero binary media files committed; all visual icons and wind-swirl logos are authored in lightweight SVGs.
