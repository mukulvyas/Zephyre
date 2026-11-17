# Zephyre Security Architecture & Policy

Zephyre is designed under strict zero-trust principles for user safety, privacy, and system resilience.

---

## 1. Secrets & API Key Hygiene
- **Zero Frontend Leakage**: Neither `GEMINI_API_KEY` nor `WAQI_TOKEN` are ever passed, bundled, or accessible to the browser client or client bundles.
- **Environment Isolation**: Configured exclusively via server-side environment variables loaded by `pydantic-settings`.
- **Fail-Safe Startup**: If `GEMINI_API_KEY` is omitted, the backend runs in a fully functional, deterministic offline coach mode without crashing.
- **Git Hygiene**: Strict `.gitignore` prevents `.env`, build artifacts, and virtual environments from ever entering revision control.

---

## 2. Input Sanitization & Prompt-Injection Defense
User questions sent to `/api/advice/ask` are treated as untrusted data:
1. **Length Capping**: Strictly truncated to $300$ characters.
2. **Control Character Stripping**: Strips non-printable byte sequences and normalizes whitespace.
3. **Injection Pattern Guard**: Matches known prompt override signatures:
   - `ignore all previous instructions`
   - `system prompt`
   - `you are now in developer mode`
   - `act as DAN`
   If detected, the request is terminated with `400 Bad Request`.
4. **Delimiter Boundary Isolation**: User text is wrapped in explicit delimiters (`USER_QUESTION_INPUT_START` ... `USER_QUESTION_INPUT_END`) with strict system instructions directing the model to disregard instructions contained within the boundary.
5. **Schema Validation**: Model output must strictly match the Pydantic `AskResponse` JSON schema; any malformed response falls back to pre-compiled rule templates.

---

## 3. Medical Safety & Clinical Guardrails
Zephyre is an air quality coach, not a diagnostic medical device:
- **Emergency Symptom Interception**: Queries referencing acute respiratory distress (chest pain, cannot breathe, asthma attack, blue lips, cyanosis) immediately trip `needs_doctor=true`.
- **Emergency Directive**: The user is presented with immediate instructions to use their prescribed quick-relief bronchodilator (e.g. Salbutamol) and seek urgent emergency care.
- **Mandatory Disclaimer**: Every response carries a disclaimer clarifying that Zephyre does not substitute for clinical medical diagnosis.

---

## 4. Network Hardening & Rate Limiting
- **IP Rate Limiting**: Enforced via `slowapi` (`60 requests/minute` per IP address) returning `429 Too Many Requests`.
- **Request Size Limiting**: Middleware rejects request payloads exceeding $1 \text{ MB}$ (`413 Payload Too Large`).
- **Restrictive CORS**: Restricted strictly to configured frontend domains (defaulting to localhost in development and production Vercel URL in deployment).
- **Security Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`

---

## 5. Privacy & Zero-Knowledge Storage
- **On-Device Storage**: User names, ages, family relationships, and commute routes are stored solely in browser `localStorage`.
- **No Database**: Zephyre operates without a persistent backend database. No personal data is stored on backend disks.
- **No Logged PII**: Loggers explicitly exclude user names and health conditions.
- **Delete My Data**: A one-click button in the UI immediately flushes all local data.
