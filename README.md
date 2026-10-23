# SentinelHealth AI
**Explainable, Privacy-Preserving Population & Workforce Health Early-Warning Platform**
*Detect Earlier. Explain Clearly. Prevent Smarter.*

---

## 1. Overview & Mission
SentinelHealth AI transforms fragmented environmental, healthcare-service, and workplace operational signals into early, interpretable, privacy-preserving warnings. Built for public-health departments, occupational safety leads, and healthcare operations, the platform identifies emerging hazards earlier, explains why warnings occur through robust statistical corroboration, and provides actionable, proportionate preventive measures.

### Initial Signature Scenario
Heat-related illness risk among outdoor logistics, agricultural, and industrial workers—combining ambient heat measurements, aggregated de-identified clinic presentations, and workplace incident reports.

---

## 2. Core Architecture & Signal Pipeline

```
+---------------------------------------------------------------------------------+
|                                 DATA INGESTION                                  |
|  * Environmental (Heat Index, WBGT, PM2.5)                                      |
|  * Aggregated Healthcare (Syndromic Heat Illness, Respiratory, ED Triages)      |
|  * Workplace Operations (Sickness Absence, Heat Incidents, Exposure Hours)      |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                       STATISTICAL ANOMALY & ROBUST MAD                          |
|  * 21-Day Rolling Median: Baseline = median(x_{t-21}, ..., x_{t-1})             |
|  * Median Absolute Deviation: MAD = median(|x_i - Median|)                       |
|  * Modified Z-score: Z_i = 0.6745 * (x_t - Median) / MAD                        |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                         MULTI-SIGNAL CORROBORATION                              |
|  * K >= 3 categories agree: Multiplier C = 1.35x (Elevated / Urgent Alert)      |
|  * K = 1 single-sensor spike: Multiplier C = 0.38x (False Alarm Suppression)    |
|  * Strict non-zero missing data policy & data freshness adjustments             |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                        SIGNAL-TO-ACTION DECISION COPILOT                        |
|  * 8-Part Structured Briefing (What happened, Why it matters, Evidence, Action, |
|    Ownership, Timeframe, Verification, Limitations)                             |
|  * Dual engine: Gemini Flash 3.8 + Deterministic Rule Fallback                  |
+---------------------------------------+-----------------------------------------+
                                        |
                                        v
+---------------------------------------------------------------------------------+
|                        INTERVENTION & VERIFICATION LOOP                         |
|  * Role assignment (Marcus Vance - Safety Lead, Dr. Clara Chen - Epi)           |
|  * Mandatory cooling break checklists & hydration station restocks              |
|  * Post-intervention 48h signal trajectory tracking                             |
+---------------------------------------------------------------------------------+
```

---

## 3. Key Pages & Features

1. **Overview Dashboard**: Command-center KPIs, active alerts by operational level, regional workforce coverage, and 7-day multi-signal sparklines.
2. **Geographic Surveillance**: Interactive SVG vector choropleth map of 4 regional sectors with accessible tabular fallback.
3. **Signal Explorer**: Multi-series time-series charts with rolling baseline envelopes ($\mu \pm 2\sigma$), critical thresholds, and category toggles.
4. **Alert Investigation**: Detailed 6-question breakdown, radar contribution weights, data completeness indicators, and the full Signal-to-Action Copilot briefing.
5. **Action Center**: Operational task board with workflow statuses (`New`, `Under Review`, `Action Approved`, `In Progress`, `Completed`), checklists, and post-action outcome verification.
6. **Validation Laboratory**: Chronological 90-day back-testing engine across 4 ground truth scenarios, calculating Sensitivity, Precision, F1 Score, False Alarms/week, and Lead Times without temporal leakage.
7. **Data Quality Center**: Feed latency matrix, missing data simulator, and live CSV/JSON schema upload validator.
8. **Privacy & Audit Center**: Role-Based Access Control (RBAC) switcher, small-cell suppression simulator ($k \ge 5$), anti-worker surveillance charter, and immutable audit logs.
9. **Technical Documentation**: Mathematical formulations, data dictionary of all 11 signals, assumptions, and limitations.
10. **One-Click Guided Demo Modal**: 8-step interactive walkthrough demonstrating end-to-end heat wave detection, Copilot briefing, action execution, and sensor-fault false alarm resilience.

---

## 4. Setup & Running Instructions

### Prerequisites
- Node.js >= 20.0
- npm >= 10.0

### Installation
```bash
npm install
```

### Running in Development
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### Running Production Build
```bash
npm run build
npm start
```

### Linting & Verification
```bash
npm run lint
```

---

## 5. Environment Variables
- `GEMINI_API_KEY`: Optional Gemini AI API key for enhanced natural-language Copilot synthesis. If omitted, SentinelHealth AI automatically operates in full deterministic rule-based fallback mode.
- `PORT`: Server port (defaults to 3000).

---

## 6. Assumptions & Responsible AI Disclaimers
1. **Decision Support Only**: SentinelHealth AI is an operational resource prioritization tool for organizations. It does not provide clinical diagnoses, replace emergency medical services, or conduct individual employee surveillance.
2. **Synthetic Data Demarcation**: All initial demonstration telemetry is generated via calibrated statistical formulas. No actual protected health information (PHI) or identifiable employee records are processed.
3. **Non-Zero Missingness**: When a feed drops, missing readings are never silently imputed as zero; instead, data completeness penalties are visibly applied.
4. **Anti-Surveillance Guarantee**: The platform strictly prohibits ranking individual workers by health risk, making employment decisions, or disciplining staff based on health signals.
