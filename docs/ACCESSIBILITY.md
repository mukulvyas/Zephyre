# Zephyre Accessibility & Inclusivity Specification (WCAG 2.1 AA)

Zephyre is designed from the ground up to be accessible to all Indian families, including seniors with visual impairments, screen-reader users, and non-native English speakers.

---

## 1. WCAG 2.1 AA Compliance Checklist

| Requirement | Implementation Detail | Verification |
| :--- | :--- | :--- |
| **Color Contrast ($\ge 4.5:1$)** | All text against backgrounds exceeds WCAG AA requirements ($4.5:1$ for body text, $3:1$ for large headings). | Verified in browser devtools & axe-core. |
| **Non-Color Reliance** | Every AQI category and risk verdict pairs color with a clear text label and distinct icon (e.g. Shield, Warning, Check). | Inspected in all card components. |
| **Semantic Landmarks** | Proper semantic tags: `<header>`, `<main id="main-content">`, `<nav>`, `<aside>`, and `<section>`. | Documented in `App.tsx` and screens. |
| **Skip-to-Content Link** | Hidden anchor at top of page, visible on keyboard focus, jumping directly to `#main-content`. | Tested via `Tab` key navigation. |
| **Visible Focus Rings** | Prominent `:focus-visible` styling (`outline: 2px solid #10B981; outline-offset: 2px`). | Tested across all interactive inputs. |
| **Touch Targets ($\ge 44\text{px}$)** | All buttons, tabs, and checklist tap targets meet or exceed $44 \times 44\text{px}$ minimum size. | Tested in mobile responsive viewport. |
| **Dynamic Live Regions** | `aria-live="polite"` applied to chat streams and AQI live changes. | Verified in `Ask.tsx`. |
| **Screen Reader Gauges** | `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and descriptive `aria-label` text. | Verified in `AqiGauge.tsx` and `Family.tsx`. |
| **Prefers Reduced Motion** | Respects `@media (prefers-reduced-motion: reduce)`, disabling non-essential transitions. | Verified via `useReducedMotion.ts`. |
| **Multilingual Support** | Instant switching between English, Hindi, Tamil, Telugu, and Marathi. | Tested in `i18n.ts` and `locales/`. |

---

## 2. Automated Testing with Axe
Automated axe-core accessibility checks are integrated into the Vitest suite (`frontend/src/__tests__/A11y.test.tsx`):
- `Logo`: 0 violations.
- `AqiGauge`: 0 violations.
- `SafeWindowTimeline`: 0 violations.
