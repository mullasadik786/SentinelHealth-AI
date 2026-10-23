/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Alert, UserRole } from '../types';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Share2,
  ChevronLeft,
  ArrowRight,
  ExternalLink,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface AlertInvestigationViewProps {
  alert: Alert;
  onBack: () => void;
  onAssignAction: (alert: Alert) => void;
  currentRole: UserRole;
}

export const AlertInvestigationView: React.FC<AlertInvestigationViewProps> = ({
  alert,
  onBack,
  onAssignAction,
  currentRole,
}) => {
  const [copilotMode, setCopilotMode] = useState<'gemini' | 'deterministic'>(
    alert.copilotAssessment.generatedBy === 'gemini-3.8-flash' ? 'gemini' : 'deterministic'
  );
  const [isCopilotRefreshing, setIsCopilotRefreshing] = useState<boolean>(false);
  const [assessment, setAssessment] = useState(alert.copilotAssessment);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const isUrgent = alert.operationalLevel === 'Urgent Review';
  const isElevated = alert.operationalLevel === 'Elevated';

  const handleRefreshCopilot = async (mode: 'gemini' | 'deterministic') => {
    setCopilotMode(mode);
    setIsCopilotRefreshing(true);
    try {
      const res = await fetch('/api/copilot/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alert,
          forceDeterministic: mode === 'deterministic',
        }),
      });
      const data = await res.json();
      if (data.assessment) {
        setAssessment(data.assessment);
      }
    } catch (err) {
      console.error('Error refreshing copilot:', err);
    } finally {
      setIsCopilotRefreshing(false);
    }
  };

  const handleExportPrivacySafeReport = () => {
    const reportData = {
      reportType: 'SentinelHealth AI Privacy-Preserving Population Early Warning',
      alertId: alert.id,
      sector: alert.areaName,
      sectorCode: alert.areaId,
      operationalLevel: alert.operationalLevel,
      riskScore: alert.riskScore,
      confidenceScore: alert.confidenceScore,
      detectionTimestamp: alert.detectionTimestamp,
      contributingSignals: alert.signals.map((s) => ({
        signalName: s.signalName,
        category: s.category,
        currentValue: s.currentValue,
        baselineValue: s.baselineValue,
        unit: s.unit,
        zScore: s.zScore,
        freshnessHours: s.freshnessHours,
      })),
      copilotBriefing: assessment,
      privacySafeguards: {
        piiIncluded: false,
        smallCellSuppression: 'Active (k ≥ 5)',
        dataAggregationLevel: 'Regional operational sector',
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-alert-${alert.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Privacy-safe report downloaded successfully.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Back to overview"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-mono">{alert.id}</span>
              <span aria-hidden="true">·</span>
              <span>{alert.areaName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{alert.observationTimestamp.slice(0, 10)}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
              <span>{alert.riskCategory}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                  isUrgent ? 'bg-rose-100 text-rose-800' : isElevated ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {alert.operationalLevel}
              </span>
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleExportPrivacySafeReport}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Privacy-Safe Brief</span>
          </button>
          <button
            onClick={() => onAssignAction(alert)}
            className="flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Deploy Preventive Action</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center justify-between">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="font-bold ml-2">✕</button>
        </div>
      )}

      {/* 6 Core Questions Investigation Panel */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide text-teal-800">
          Six Core Analytical Questions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
            <span className="font-semibold text-slate-500 block">1. What risk may be emerging?</span>
            <span className="text-slate-900 font-medium block">{alert.riskCategory}</span>
            <span className="text-slate-600">Operational score {alert.riskScore}/100 indicating significant aggregate deviation.</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
            <span className="font-semibold text-slate-500 block">2. Where and when is it emerging?</span>
            <span className="text-slate-900 font-medium block">{alert.areaName} ({alert.areaId})</span>
            <span className="text-slate-600">Detected {alert.detectionTimestamp.slice(11, 16)} UTC on {alert.observationTimestamp.slice(0, 10)}.</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
            <span className="font-semibold text-slate-500 block">3. Which independent signals support it?</span>
            <span className="text-slate-900 font-medium block">{alert.signalsCorroboratedCount} of 3 signal categories agree</span>
            <span className="text-slate-600">Environmental + Healthcare services + Workplace incident reports.</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
            <span className="font-semibold text-slate-500 block">4. How reliable is the evidence?</span>
            <span className="text-slate-900 font-medium block">Confidence Score: {alert.confidenceScore}/100</span>
            <span className="text-slate-600">Data completeness {alert.dataCompletenessPct}%. Evaluated against rolling 21-day median.</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
            <span className="font-semibold text-slate-500 block">5. What action, by whom, in what timeframe?</span>
            <span className="text-slate-900 font-medium block">{alert.assignedRole}</span>
            <span className="text-slate-600">Suggested turnaround: {alert.suggestedDeadlineHours} hours from detection.</span>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-lg space-y-1">
            <span className="font-semibold text-slate-500 block">6. Did action lead to improvement?</span>
            <span className="text-slate-900 font-medium block">Intervention Verification Loop</span>
            <span className="text-slate-600">Tracked via post-action 48-hour syndromic follow-up in Action Center.</span>
          </div>
        </div>
      </section>

      {/* Split: Signature Feature: Signal-to-Action Copilot vs Signal Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Signal-to-Action Copilot Briefing */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Signal-to-Action Decision Support Briefing
                </h3>
              </div>

              {/* Model Mode Selector */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto text-xs">
                <button
                  onClick={() => handleRefreshCopilot('gemini')}
                  disabled={isCopilotRefreshing}
                  className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                    copilotMode === 'gemini' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Gemini Flash 3.8
                </button>
                <button
                  onClick={() => handleRefreshCopilot('deterministic')}
                  disabled={isCopilotRefreshing}
                  className={`px-2.5 py-1 font-medium rounded-md transition-colors ${
                    copilotMode === 'deterministic' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Deterministic Engine
                </button>
              </div>
            </div>

            {isCopilotRefreshing ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                <div className="animate-spin w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full mx-auto"></div>
                <p>Generating evidence synthesis and action protocol...</p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Section A: What Happened */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-700">
                    A. What Happened
                  </h4>
                  <p className="mt-1 text-slate-700 leading-relaxed">{assessment.whatHappened}</p>
                </div>

                {/* Section B: Why It Matters */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-700">
                    B. Why It Matters
                  </h4>
                  <p className="mt-1 text-slate-700 leading-relaxed">{assessment.whyItMatters}</p>
                </div>

                {/* Section C: Supporting Evidence */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-teal-700">
                    C. Supporting Evidence
                  </h4>
                  <ul className="mt-1.5 space-y-1.5 text-slate-700 list-disc list-inside">
                    {assessment.supportingEvidence.map((ev, idx) => (
                      <li key={idx} className="leading-relaxed">{ev}</li>
                    ))}
                  </ul>
                </div>

                {/* Section D: Recommended Action */}
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg">
                  <h4 className="font-bold text-teal-900 uppercase tracking-wider text-[11px]">
                    D. Recommended Proportionate Action
                  </h4>
                  <p className="mt-1 text-teal-950 font-medium leading-relaxed">{assessment.recommendedAction}</p>
                </div>

                {/* Section E, F, G in 3-col strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">E. Assigned Ownership</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{assessment.ownership}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">F. Operational Timeframe</span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">{assessment.timeframe}</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-500 block uppercase text-[10px]">G. Verification Metric</span>
                    <span className="text-slate-700 mt-0.5 block">{assessment.verification}</span>
                  </div>
                </div>

                {/* Section H: Limitations & Uncertainty */}
                <div className="pt-2 border-t border-slate-100 text-slate-500">
                  <span className="font-bold text-slate-600 uppercase text-[10px] block">H. Limitations & Uncertainty:</span>
                  <p className="mt-0.5 leading-relaxed">{assessment.limitations}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Contributing Signals Breakdown */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Contributing Signal Decomposition
            </h3>

            <div className="space-y-3">
              {alert.signals.map((sig) => {
                const isHigh = sig.zScore >= 2.5;
                const isMed = sig.zScore >= 1.8;

                return (
                  <div
                    key={sig.signalId}
                    className="p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-slate-900 block">{sig.signalName}</span>
                        <span className="text-[11px] text-slate-500 capitalize">{sig.category}</span>
                      </div>
                      <div className="text-right font-mono tabular-nums">
                        <span
                          className={`font-bold ${
                            isHigh ? 'text-rose-600' : isMed ? 'text-amber-600' : 'text-slate-600'
                          }`}
                        >
                          Z: +{sig.zScore.toFixed(1)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px] font-mono tabular-nums">
                      <span>Observed: {sig.currentValue} {sig.unit}</span>
                      <span>Baseline: {sig.baselineValue} {sig.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quality & Uncertainty Summary */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Data Completeness:</span>
                <span className="font-mono font-semibold text-slate-800">{alert.dataCompletenessPct}%</span>
              </div>
              <div className="flex justify-between">
                <span>Multi-Signal Corroboration:</span>
                <span className="font-mono font-semibold text-slate-800">{alert.corroborationFactor}x factor</span>
              </div>
              <div className="flex justify-between">
                <span>False-Alarm Suppression:</span>
                <span className="text-emerald-700 font-semibold">Active (Single-Sensor Penalty Enabled)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
