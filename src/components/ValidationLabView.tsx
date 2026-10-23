/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BacktestMetrics, ScenarioId, EngineConfig } from '../types';
import { runBacktest } from '../services/validationService';
import { DEFAULT_CONFIG } from '../services/engine';
import {
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Layers,
  Sliders,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

interface ValidationLabViewProps {
  initialMetrics?: BacktestMetrics;
}

export const ValidationLabView: React.FC<ValidationLabViewProps> = ({ initialMetrics }) => {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('heat_risk_wave');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<BacktestMetrics>(
    initialMetrics || runBacktest('heat_risk_wave', DEFAULT_CONFIG)
  );

  // Tunable configuration sliders
  const [config, setConfig] = useState<EngineConfig>({ ...DEFAULT_CONFIG });

  const handleRunEvaluation = () => {
    setIsRunning(true);
    setTimeout(() => {
      const results = runBacktest(selectedScenario, config);
      setMetrics(results);
      setIsRunning(false);
    }, 400);
  };

  const scenarios: { id: ScenarioId; name: string; tag: string; description: string }[] = [
    {
      id: 'heat_risk_wave',
      name: 'Scenario 1: Heat-Related Illness Crisis',
      tag: 'Corroborated Multi-Signal',
      description: 'Environmental heat index surges to 104°F; aggregated clinic visits spike 3.8x; workplace incidents surge with 24-hour physiological delay.',
    },
    {
      id: 'air_quality_crisis',
      name: 'Scenario 2: Particulate Air Quality Inversion',
      tag: 'Environmental & Clinical',
      description: 'Atmospheric inversion traps PM2.5 at 78 µg/m³ in heavy manufacturing sector; syndromic acute respiratory presentations rise 2.7x.',
    },
    {
      id: 'sensor_fault_anomaly',
      name: 'Scenario 3: Sensor Fault / False Alarm Resilience',
      tag: 'Uncorroborated Anomaly',
      description: 'Station #ENV-09 thermistor malfunctions reading 119°F for 12 hours. Zero corroboration from clinics or field teams. Evaluates suppression of false alarms.',
    },
    {
      id: 'delayed_missing_feed',
      name: 'Scenario 4: Missing or Delayed Healthcare Telemetry',
      tag: 'Data Degradation',
      description: 'Hospital EHR maintenance severs syndromic feeds for 4 days. System flags data completeness drop (66%), penalizes confidence, and warns operations.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Chronological Validation & Back-Testing Laboratory
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Reproducible 90-day evaluation pipeline measuring sensitivity, precision, lead time, and false alarm suppression without temporal data leakage.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors self-start sm:self-auto shrink-0"
        >
          {isRunning ? (
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Play className="w-3.5 h-3.5" />
          )}
          <span>Execute Back-Test</span>
        </button>
      </div>

      {/* Scenario Selector Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map((sc) => {
          const isSelected = selectedScenario === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => setSelectedScenario(sc.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/30 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-teal-700">{sc.tag}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">{sc.name}</h3>
              <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                {sc.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Metric Scorecard (Measured Prototype Performance) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">Sensitivity (Recall)</span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1 block">
            {metrics.sensitivityRecallPct}%
          </span>
          <span className="text-[10px] text-slate-400">TP / (TP + FN)</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">Precision (PPV)</span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1 block">
            {metrics.precisionPpvPct}%
          </span>
          <span className="text-[10px] text-slate-400">TP / (TP + FP)</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">F1 Composite</span>
          <span className="text-2xl font-bold font-mono text-teal-700 tabular-nums mt-1 block">
            {metrics.f1Score}
          </span>
          <span className="text-[10px] text-slate-400">Harmonic Mean</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">False Alarm Rate</span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1 block">
            {metrics.falseAlarmsPerAreaPerWeek}
          </span>
          <span className="text-[10px] text-slate-400">per area / week</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">Median Lead Time</span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1 block">
            {metrics.medianLeadTimeHours}h
          </span>
          <span className="text-[10px] text-slate-400">Pre-peak window</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
          <span className="text-[11px] text-slate-500 block">Avg Telemetry Lag</span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums mt-1 block">
            {metrics.averageDataLatencyHours}h
          </span>
          <span className="text-[10px] text-slate-400">Reporting latency</span>
        </div>
      </div>

      {/* Main Split: Confusion Matrix vs Event Verification Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Confusion Matrix & Threshold Controls */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Epidemiological Confusion Matrix
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs text-center font-mono">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[10px] text-emerald-700 uppercase block font-sans font-semibold">True Positives</span>
                <span className="text-xl font-bold text-emerald-900 mt-1 block tabular-nums">{metrics.truePositives}</span>
                <span className="text-[10px] text-emerald-600 font-sans">Corroborated detected</span>
              </div>
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="text-[10px] text-rose-700 uppercase block font-sans font-semibold">False Positives</span>
                <span className="text-xl font-bold text-rose-900 mt-1 block tabular-nums">{metrics.falsePositives}</span>
                <span className="text-[10px] text-rose-600 font-sans">Unjustified alerts</span>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-[10px] text-amber-700 uppercase block font-sans font-semibold">False Negatives</span>
                <span className="text-xl font-bold text-amber-900 mt-1 block tabular-nums">{metrics.falseNegatives}</span>
                <span className="text-[10px] text-amber-600 font-sans">Missed true events</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-600 uppercase block font-sans font-semibold">True Negatives</span>
                <span className="text-xl font-bold text-slate-800 mt-1 block tabular-nums">{metrics.trueNegatives}</span>
                <span className="text-[10px] text-slate-500 font-sans">Nominal periods</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              Evaluated across 90 chronological days ($N = 360$ area-day observations). Ground truth event windows are strictly isolated from detection feature generation to prevent data leakage.
            </div>
          </div>

          {/* Interactive Threshold Tuner */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Sensitivity Threshold Tuning</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Monitor Threshold (Robust Z):</span>
                  <span className="font-mono font-bold text-slate-900">{config.thresholdMonitorZ.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.2"
                  max="2.5"
                  step="0.1"
                  value={config.thresholdMonitorZ}
                  onChange={(e) => setConfig({ ...config, thresholdMonitorZ: parseFloat(e.target.value) })}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Elevated Threshold (Robust Z):</span>
                  <span className="font-mono font-bold text-slate-900">{config.thresholdElevatedZ.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="3.5"
                  step="0.1"
                  value={config.thresholdElevatedZ}
                  onChange={(e) => setConfig({ ...config, thresholdElevatedZ: parseFloat(e.target.value) })}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-600 mb-1">
                  <span>Urgent Review Threshold:</span>
                  <span className="font-mono font-bold text-slate-900">{config.thresholdUrgentZ.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="2.8"
                  max="4.5"
                  step="0.1"
                  value={config.thresholdUrgentZ}
                  onChange={(e) => setConfig({ ...config, thresholdUrgentZ: parseFloat(e.target.value) })}
                  className="w-full accent-teal-600"
                />
              </div>

              <button
                onClick={handleRunEvaluation}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors text-center text-xs mt-2"
              >
                Re-evaluate Model With New Parameters
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Event-Level Detection Timeline & Rationale */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Ground-Truth Event Evaluation Timeline
            </h3>

            <div className="space-y-3">
              {metrics.events.map((ev) => {
                const isDetected = ev.wasDetected;
                return (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors space-y-2 text-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                          <span>{ev.id}</span>
                          <span aria-hidden="true">·</span>
                          <span>Sector: {ev.areaId}</span>
                          <span aria-hidden="true">·</span>
                          <span>Window: {ev.startDate} to {ev.endDate}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5">{ev.name}</h4>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded text-[11px] ${
                            isDetected
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.scenarioId === 'sensor_fault_anomaly'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isDetected ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              Detected (TP)
                            </>
                          ) : ev.scenarioId === 'sensor_fault_anomaly' ? (
                            <>
                              <ShieldCheck className="w-3 h-3" />
                              False Alarm Suppressed
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Missed Event
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed">{ev.description}</p>

                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-slate-500 text-[11px] font-mono">
                      <span>
                        First Early Warning: {ev.detectedAt ? `${ev.detectedAt.slice(0, 10)} (${ev.detectionLeadTimeHours}h lead time)` : 'N/A'}
                      </span>
                      <span>Outcome: System Verified</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scientific Validation Disclaimer */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-start gap-2">
              <FileCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong>Evaluation Standard:</strong> Results generated via synthetic chronological simulation. Metric denominators are explicit ($N = 90$ calendar days across 4 zones). Real-world epidemiological effectiveness requires site-specific baseline calibration and prospective clinical observational validation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
