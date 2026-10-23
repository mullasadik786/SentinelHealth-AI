/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SIGNAL_DEFINITIONS } from '../services/syntheticData';
import { BookOpen, Code, Database, Cpu, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const TechDocsView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          SentinelHealth AI Technical Architecture & Methodology
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Detailed mathematical formulation, data dictionary, signal-to-action reasoning engine, and operational assumptions.
        </p>
      </div>

      {/* 1. Architecture Overview */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-teal-600" />
          <span>1. System Architecture & Detection Pipeline</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          SentinelHealth AI unifies heterogeneous environmental time series, syndromic healthcare attendance, and occupational incident reports through a 5-stage probabilistic decision-support pipeline.
        </p>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg font-mono text-xs text-slate-800 space-y-3">
          <div className="font-bold text-slate-900 font-sans">Pipeline Execution Flow:</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-[11px]">
            <div className="p-2.5 bg-white border border-slate-200 rounded shadow-xs">
              <span className="font-bold block text-teal-700">Stage 1</span>
              <span>Data Ingestion & Unit Normalization</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded shadow-xs">
              <span className="font-bold block text-teal-700">Stage 2</span>
              <span>Rolling 21-Day MAD Baseline</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded shadow-xs">
              <span className="font-bold block text-teal-700">Stage 3</span>
              <span>Robust Z-Score Transformation</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded shadow-xs">
              <span className="font-bold block text-teal-700">Stage 4</span>
              <span>Multi-Signal Corroboration</span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded shadow-xs">
              <span className="font-bold block text-teal-700">Stage 5</span>
              <span>Copilot Briefing & Intervention</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mathematical Formulation */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Code className="w-5 h-5 text-teal-600" />
          <span>2. Mathematical Formulations</span>
        </h2>

        <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">A. Robust Median Absolute Deviation (MAD) Baseline</h3>
            <p>
              To prevent extreme single-day outliers from distorting historical expectations, baselines are computed over rolling $W = 21$ day retrospective windows using median and MAD:
            </p>
            <div className="p-3 bg-white border border-slate-200 rounded font-mono text-xs text-slate-900 space-y-1">
              <div>Median = median(x_{'{t-W}'}, ..., x_{'{t-1}'})</div>
              <div>MAD = median(|x_i - Median|)</div>
              <div>Modified Z_i = [0.6745 × (x_t - Median)] / MAD</div>
            </div>
            <p className="text-[11px] text-slate-500">
              The consistency constant 0.6745 equates MAD to the standard deviation for asymptotically normal distributions.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">B. Multi-Signal Corroboration Multiplier</h3>
            <p>
              Single-sensor spikes frequently arise from hardware drift or localized electrical faults. The corroboration multiplier C actively discounts isolated anomalies while amplifying multi-source agreement:
            </p>
            <div className="p-3 bg-white border border-slate-200 rounded font-mono text-xs text-slate-900 space-y-1">
              <div>C = 1.35  (if K ≥ 3 independent signal categories corroborated)</div>
              <div>C = 1.15  (if K = 2 categories corroborated)</div>
              <div>C = 0.38  (if K = 1 isolated single-sensor anomaly; false-alarm suppression)</div>
              <div>C = 0.15  (if K = 0 within nominal bounds)</div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">C. Composite Operational Risk Score (0–100)</h3>
            <p>
              The composite score is calculated as the weighted sum of standardized signal deviations, adjusted for corroboration, completeness, and data freshness:
            </p>
            <div className="p-3 bg-white border border-slate-200 rounded font-mono text-xs text-slate-900 space-y-1">
              <div>Z_weighted = Σ [w_j × max(0, Z_j)], where Σ w_j = 1.0</div>
              <div>Risk Score = min(100, [Z_weighted / 3.8] × 75 × C × (0.70 + 0.30 × DataFreshness))</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Data Dictionary */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            <span>3. Signal Data Dictionary</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {SIGNAL_DEFINITIONS.length} defined telemetry streams
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Identifier</th>
                <th className="px-4 py-3">Signal Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3 text-right">Baseline Mean</th>
                <th className="px-4 py-3 text-right">Critical Limit</th>
                <th className="px-4 py-3">Cadence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-600">
              {SIGNAL_DEFINITIONS.map((sig) => (
                <tr key={sig.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-semibold text-slate-800">{sig.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{sig.name}</td>
                  <td className="px-4 py-3 capitalize">{sig.category}</td>
                  <td className="px-4 py-3 font-mono">{sig.unit}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{sig.baselineMean}</td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-rose-600 tabular-nums">
                    {sig.criticalThreshold}
                  </td>
                  <td className="px-4 py-3 font-mono">{sig.updateFrequencyHours}h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Assumptions & Responsible AI Limitations */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span>4. Core Assumptions, Limitations & Disclaimers</span>
        </h2>

        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">Synthetic Data Demarcation:</span>
            All demonstration signals are generated through validated pseudorandom mathematical formulas with calibrated mean and standard deviation. No actual patient health records or proprietary corporate telemetry are used.
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">Operational Prioritization, Not Clinical Diagnosis:</span>
            The 0–100 risk score is an operational resource prioritization metric. It does not measure the probability of an individual worker contracting heat stroke or respiratory illness.
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">Non-Zero Missing Data Policy:</span>
            When a healthcare or environmental feed drops, SentinelHealth AI never converts the reading to zero. Instead, it marks the feed as missing, applies an explicit completeness penalty to confidence scores, and warns decision-makers of telemetry uncertainty.
          </div>
        </div>
      </section>
    </div>
  );
};
