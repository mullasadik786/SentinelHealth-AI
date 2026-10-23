/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { MONITORING_AREAS, SIGNAL_DEFINITIONS, GROUND_TRUTH_EVENTS, generateSyntheticObservations } from './src/services/syntheticData';
import { DEFAULT_CONFIG, evaluateSignalsForArea, generateDeterministicAssessment } from './src/services/engine';
import { runBacktest } from './src/services/validationService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// In-memory application state
let cachedObservations = generateSyntheticObservations();
let activeInterventions: any[] = [
  {
    id: 'INT-01',
    alertId: 'ALT-METRO-20261021',
    areaId: 'AREA-01',
    areaName: 'Metro Logistics & Port Hub',
    title: 'Tier-1 Heat Mitigation & Hydration Mandate',
    priority: 'Urgent',
    status: 'In Progress',
    assignedRole: 'Occupational Safety Lead & Facility Ops',
    assigneeName: 'Marcus Vance',
    createdAt: '2026-10-21T13:00:00Z',
    deadline: '2026-10-21T17:00:00Z',
    checklist: [
      { id: 'chk-1', label: 'Verify 4 mobile shade canopy trailers deployed along container berth 4-8', completed: true, completedAt: '2026-10-21T14:15:00Z', completedBy: 'M. Vance' },
      { id: 'chk-2', label: 'Restock chilled electrolyte hydration totes (target: 2L per outdoor worker shift)', completed: true, completedAt: '2026-10-21T14:30:00Z', completedBy: 'M. Vance' },
      { id: 'chk-3', label: 'Enforce 15-minute mandatory cooling rest rotation per 45 minutes of heavy rigging', completed: false },
      { id: 'chk-4', label: 'Transmit syndromic advisory to Port Urgent Care on-call medical team', completed: true, completedAt: '2026-10-21T13:40:00Z', completedBy: 'Dr. Clara Chen' }
    ],
    notes: [
      { id: 'n-1', author: 'Marcus Vance', authorRole: 'Occupational Safety Lead', timestamp: '2026-10-21T14:32:00Z', text: 'Shade trailers 1-4 active. WBGT currently 87.2°F on asphalt. Dispatching additional cooling mist fans.' }
    ],
    outcomeAssessment: {
      signalStabilized: true,
      postActionMeanDeltaPct: -41.2,
      evaluationNotes: 'Subsequent 48-hour observation showed heat exhaustion clinic presentations dropped from 14/day to 3.2/day following shift restructuring.',
      epidemiologicalDisclaimer: 'Signal moderation observed concurrent with cooling interventions; observational data cannot definitively eliminate concurrent weather moderation confounders.'
    }
  }
];

let auditLogs: any[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-10-23T06:00:00Z',
    userRole: 'public_health_analyst',
    userName: 'Dr. Clara Chen',
    action: 'SYSTEM_BOOT',
    targetId: 'INITIAL_LOAD',
    targetType: 'Dataset',
    details: 'Loaded 90-day multi-signal synthetic baseline dataset across 4 monitoring sectors.',
    privacySafeHash: 'sha256:7f83b1c...'
  },
  {
    id: 'AUD-002',
    timestamp: '2026-10-23T06:30:00Z',
    userRole: 'occupational_safety_lead',
    userName: 'Marcus Vance',
    action: 'CHECKLIST_ITEM_COMPLETE',
    targetId: 'INT-01',
    targetType: 'Intervention',
    details: 'Completed hydration tote restock checklist item for Metro Port Terminal.',
    privacySafeHash: 'sha256:9a42e8d...'
  }
];

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI:', err);
  }
}

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    product: 'SentinelHealth AI',
    version: '1.0.0-prod',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    totalObservations: cachedObservations.length,
    activeAreas: MONITORING_AREAS.length,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/areas', (req, res) => {
  res.json({ areas: MONITORING_AREAS });
});

app.get('/api/signals', (req, res) => {
  res.json({ signals: SIGNAL_DEFINITIONS });
});

app.get('/api/observations', (req, res) => {
  const { areaId, signalId, days } = req.query;
  let filtered = [...cachedObservations];

  if (areaId) {
    filtered = filtered.filter((o) => o.areaId === areaId);
  }
  if (signalId) {
    filtered = filtered.filter((o) => o.signalId === signalId);
  }
  if (days) {
    const limitDays = parseInt(days as string, 10);
    const uniqueDates = Array.from(new Set(filtered.map((o) => o.timestamp.slice(0, 10)))).sort().slice(-limitDays);
    const minDate = uniqueDates[0];
    if (minDate) {
      filtered = filtered.filter((o) => o.timestamp.slice(0, 10) >= minDate);
    }
  }

  res.json({ observations: filtered });
});

app.get('/api/alerts', (req, res) => {
  const latestDate = '2026-10-22';
  const alerts: any[] = [];

  for (const area of MONITORING_AREAS) {
    const alert = evaluateSignalsForArea(area, cachedObservations, latestDate, DEFAULT_CONFIG);
    if (alert) {
      alerts.push(alert);
    }
  }

  res.json({ alerts });
});

app.post('/api/detection/run', (req, res) => {
  const { dateStr, config } = req.body;
  const targetDate = dateStr || '2026-10-22';
  const engineConfig = { ...DEFAULT_CONFIG, ...(config || {}) };
  const alerts: any[] = [];

  for (const area of MONITORING_AREAS) {
    const alert = evaluateSignalsForArea(area, cachedObservations, targetDate, engineConfig);
    if (alert) {
      alerts.push(alert);
    }
  }

  res.json({
    evaluatedDate: targetDate,
    alertsFound: alerts.length,
    alerts
  });
});

app.get('/api/interventions', (req, res) => {
  res.json({ interventions: activeInterventions });
});

app.post('/api/interventions', (req, res) => {
  const newInt = {
    id: `INT-${Date.now().toString().slice(-4)}`,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  activeInterventions.unshift(newInt);
  
  auditLogs.unshift({
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    userRole: req.body.assignedRole || 'occupational_safety_lead',
    userName: req.body.assigneeName || 'Authorized Operator',
    action: 'CREATE_INTERVENTION',
    targetId: newInt.id,
    targetType: 'Intervention',
    details: `Created preventive intervention: ${newInt.title} for ${newInt.areaName}`,
    privacySafeHash: 'sha256:generated'
  });

  res.json({ intervention: newInt });
});

app.patch('/api/interventions/:id', (req, res) => {
  const { id } = req.params;
  const index = activeInterventions.findIndex((i) => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Intervention not found' });
  }

  activeInterventions[index] = { ...activeInterventions[index], ...req.body };
  res.json({ intervention: activeInterventions[index] });
});

app.post('/api/backtest/run', (req, res) => {
  const { scenarioId, config } = req.body;
  const engineConfig = { ...DEFAULT_CONFIG, ...(config || {}) };
  const results = runBacktest(scenarioId || 'heat_risk_wave', engineConfig);

  auditLogs.unshift({
    id: `AUD-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toISOString(),
    userRole: 'clinical_safety_officer',
    userName: 'Validation Automation',
    action: 'RUN_BACKTEST',
    targetId: scenarioId || 'heat_risk_wave',
    targetType: 'Dataset',
    details: `Executed chronological 90-day back-test for scenario ${scenarioId}. F1: ${results.f1Score}`,
    privacySafeHash: 'sha256:backtest'
  });

  res.json({ results });
});

app.get('/api/audit-logs', (req, res) => {
  res.json({ logs: auditLogs });
});

// Signal-to-Action Copilot AI Endpoint
app.post('/api/copilot/explain', async (req, res) => {
  const { alert, forceDeterministic } = req.body;
  if (!alert) {
    return res.status(400).json({ error: 'Alert object is required' });
  }

  // If client requests deterministic fallback or Gemini key is absent
  if (forceDeterministic || !geminiClient || !process.env.GEMINI_API_KEY) {
    const area = MONITORING_AREAS.find((a) => a.id === alert.areaId) || MONITORING_AREAS[0];
    const fallback = generateDeterministicAssessment(
      alert.id,
      area,
      alert.riskCategory,
      alert.operationalLevel,
      alert.riskScore,
      alert.confidenceScore,
      alert.signalsCorroboratedCount,
      alert.signals,
      alert.dataCompletenessPct / 100,
      alert.observationTimestamp.slice(0, 10)
    );
    return res.json({ assessment: fallback });
  }

  try {
    const systemPrompt = `You are the clinical safety and occupational health decision-support copilot for SentinelHealth AI.
You translate validated statistical early-warning alerts into structured, proportionate, privacy-preserving preventive actions.
CRITICAL SAFETY & GOVERNANCE RULES:
1. Ground your response ONLY in the provided alert data and metrics. Do NOT invent unmeasured numbers, outbreaks, or clinical diagnoses.
2. Clearly distinguish between operational prioritization and individual clinical illness.
3. Emphasize proportionate workplace prevention (shade, hydration, shift pacing, air filtration, PPE).
4. Never suggest punitive worker surveillance or individual employee targeting.
5. Provide concise, clear answers under the exact JSON schema requested.`;

    const userPrompt = `Analyze this alert and provide an 8-part actionable briefing:
Alert Details:
- Area: ${alert.areaName} (${alert.areaId})
- Risk Category: ${alert.riskCategory}
- Operational Level: ${alert.operationalLevel}
- Risk Score: ${alert.riskScore}/100
- Confidence Score: ${alert.confidenceScore}/100
- Corroborated Categories: ${alert.signalsCorroboratedCount}/3
- Data Completeness: ${alert.dataCompletenessPct}%
- Contributing Signals:
${alert.signals.map((s: any) => `  * ${s.signalName}: ${s.currentValue} ${s.unit} (Baseline: ${s.baselineValue}, Z-score: +${s.zScore})`).join('\n')}

Format as JSON with keys:
"whatHappened", "whyItMatters", "supportingEvidence" (array of strings), "recommendedAction", "ownership", "timeframe", "verification", "limitations"`;

    const geminiResponse = await geminiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(geminiResponse.text || '{}');
    const assessment = {
      ...parsed,
      generatedBy: 'gemini-3.8-flash',
      generatedAt: new Date().toISOString(),
    };

    res.json({ assessment });
  } catch (error: any) {
    console.error('Gemini API Error, falling back to deterministic engine:', error);
    const area = MONITORING_AREAS.find((a) => a.id === alert.areaId) || MONITORING_AREAS[0];
    const fallback = generateDeterministicAssessment(
      alert.id,
      area,
      alert.riskCategory,
      alert.operationalLevel,
      alert.riskScore,
      alert.confidenceScore,
      alert.signalsCorroboratedCount,
      alert.signals,
      alert.dataCompletenessPct / 100,
      alert.observationTimestamp.slice(0, 10)
    );
    res.json({ assessment: fallback });
  }
});

// Reset synthetic dataset
app.post('/api/dataset/reset', (req, res) => {
  cachedObservations = generateSyntheticObservations();
  res.json({ message: 'Dataset reset to pristine 90-day baseline', total: cachedObservations.length });
});

// Dev server or static files
async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SentinelHealth AI server running at http://localhost:${port}`);
  });
}

startServer();
