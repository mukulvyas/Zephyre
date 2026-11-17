# Zephyre Architecture & System Design

```mermaid
flowchart TD
    subgraph Client["Frontend (React 18 + Vite + Tailwind CSS)"]
        UI["User Interface (Today / Ask / Impact / Family)"]
        Store["Browser LocalStorage (Zero Server DB, 100% On-Device)"]
        I18n["i18n Engine (English, Hindi, Tamil, Telugu, Marathi)"]
        UI <--> Store
        UI <--> I18n
    end

    subgraph Server["Backend (Python 3.11 + FastAPI)"]
        Router["API Gateway / Routers (Location, AQI, Advice, Impact)"]
        RateLimit["Rate Limiter (slowapi, per-IP)"]
        Security["Security Guard (Sanitization, Injection & Medical Defense)"]

        subgraph CoreEngine["Deterministic Rule Engine (Ground Truth)"]
            CPCB["aqi_cpcb.py (CPCB PM2.5/PM10 Breakpoint Calculation)"]
            Risk["risk_engine.py (Age x Asthma x Commute x Purifier Matrix)"]
            Planner["routine_planner.py (Hourly Safest Window & Checklist)"]
            Impact["impact_calculator.py (Fixed Emission Factors & Formulas)"]
            Region["region_context.py (State-wise Meteorology & Sources)"]
        end

        subgraph GenAI["GenAI Layer (Constrained Phrasing)"]
            LLMProvider["LLMProvider Interface"]
            Gemini["Google Gemini (Fast Structured JSON output)"]
            OfflineFallback["Offline Template Fallback Engine"]
            LLMProvider --> Gemini
            LLMProvider --> OfflineFallback
        end

        Cache["In-Memory TTL Cache (AQI: 15m, Geocoding: 24h, LLM: 10m)"]
    end

    subgraph DataSources["External Data APIs (Backend Only)"]
        OpenMeteoGeo["Open-Meteo Geocoding API (India restricted)"]
        WAQI["WAQI Station Feed (Optional live token)"]
        OpenMeteoAQ["Open-Meteo Air Quality API (Hourly forecast & model)"]
    end

    UI -->|Async HTTP REST| Router
    Router --> RateLimit
    RateLimit --> Security
    Security --> CoreEngine
    CoreEngine --> Cache
    CoreEngine --> LLMProvider
    Cache <--> DataSources
    LLMProvider -->|Validated Structured JSON| Router
```

## Data Flow & Invariant Principles
1. **Zero Browser Data Leaks**: All third-party endpoints and LLM keys are called exclusively by the backend service. Keys are never transmitted to clients.
2. **Local Privacy**: User profiles, names, ages, and checklist progress live solely in the client's `localStorage`. No database, no tracking pixels, and no analytics cookies.
3. **Rules First, GenAI Second**:
   - The deterministic core engine computes the ground-truth verdict (`safe`, `be_careful`, `avoid`), numeric impact, and safer windows.
   - The GenAI model is constrained to human phrasing and translation; it is architecturally prohibited from modifying verdicts or inventing emission factors.
4. **Graceful Degradation**: If network drops or the Gemini API key is absent, the backend instantly falls back to offline rule-based templates with an `is_offline_fallback=true` tag.
