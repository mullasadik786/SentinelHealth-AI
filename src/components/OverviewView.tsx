/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Alert, MonitoringArea, Intervention } from '../types';
import { AlertTriangle, ShieldCheck, ArrowRight, CheckCircle2, Clock, Users, Cpu, FileText, ChevronRight } from 'lucide-react';

interface OverviewViewProps {
  areas: MonitoringArea[];
  alerts: Alert[];
  interventions: Intervention[];
  onSelectAlert: (alert: Alert) => void;
  onNavigate: (tab: string) => void;
  onOpenDemo: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  areas,
  alerts,
  interventions,
  onSelectAlert,
  onNavigate,
  onOpenDemo,
}) => {
  const urgentCount = alerts.filter((a) => a.operationalLevel === 'Urgent Review').length;
  const elevatedCount = alerts.filter((a) => a.operationalLevel === 'Elevated').length;
  const monitorCount = alerts.filter((a) => a.operationalLevel === 'Monitor').length;
  const totalWorkforce = areas.reduce((acc, a) => acc + a.baselineWorkerPopulation, 0);
  const totalSensors = areas.reduce((acc, a) => acc + a.activeSensorsCount, 0);
  const openInterventions = interventions.filter((i) => i.status !== 'Completed');

  return (
    <div className="space-y-8">
      {/* Hero Banner: Clear Mission & Mechanism-to-Outcome */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2">
            <div className="text-xs font-semibold text-teal-700 tracking-wide uppercase">
              Population & Occupational Health Early Warning Platform
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              Detect Emerging Health Hazards Before Escalation
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Continuously synthesizes environmental exposures, aggregated syndromic healthcare visits, and occupational incident reports. Provides explainable, privacy-preserving alerts and evidence-backed preventive action protocols.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap text-center"
            >
              Run Heat-Risk Demo
            </button>
            <button
              onClick={() => onNavigate('validation')}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap text-center"
            >
              Validation Lab
            </button>
          </div>
        </div>

        {/* Mechanism-to-Outcome Ribbon */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">1</div>
            <div>
              <span className="font-semibold text-slate-900 block">Tri-Signal Ingestion</span>
              <span>Environmental + Healthcare + Workplace feeds</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">2</div>
            <div>
              <span className="font-semibold text-slate-900 block">Robust MAD Baselines</span>
              <span>Rolling median absolute deviation outlier detection</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">3</div>
            <div>
              <span className="font-semibold text-slate-900 block">Corroboration Filter</span>
              <span>Penalizes isolated sensor faults, validates cluster risks</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">4</div>
            <div>
              <span className="font-semibold text-slate-900 block">Proportionate Action</span>
              <span>Role-assigned checklists and post-action verification</span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Stat Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Active Alerts</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {alerts.length}
            </span>
            <span className="text-xs text-rose-600 font-semibold font-mono tabular-nums">
              {urgentCount} urgent
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>{elevatedCount} elevated</span>
            <span aria-hidden="true">·</span>
            <span>{monitorCount} monitoring</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Monitored Population</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {totalWorkforce.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">workers</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>Across 4 regional sectors</span>
            <span aria-hidden="true">·</span>
            <span>100% de-identified</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Telemetry Coverage</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {totalSensors}
            </span>
            <span className="text-xs text-slate-500">active feeds</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>98.4% data freshness</span>
            <span aria-hidden="true">·</span>
            <span>&lt; 2h median latency</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Open Interventions</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 font-mono tabular-nums">
              {openInterventions.length}
            </span>
            <span className="text-xs text-teal-700 font-semibold">in progress</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span>Assigned to safety leads</span>
            <span aria-hidden="true">·</span>
            <span>OSHA compliant</span>
          </div>
        </div>
      </section>

      {/* Main Split: Active Alerts vs Monitored Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Active Early-Warning Alerts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Active Health Early-Warning Alerts
            </h2>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              View all alerts <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => {
              const isUrgent = alert.operationalLevel === 'Urgent Review';
              const isElevated = alert.operationalLevel === 'Elevated';

              return (
                <div
                  key={alert.id}
                  onClick={() => onSelectAlert(alert)}
                  className={`bg-white border rounded-xl p-5 cursor-pointer transition-all hover:border-slate-400 hover:shadow-sm ${
                    isUrgent
                      ? 'border-rose-300 bg-rose-50/10'
                      : isElevated
                      ? 'border-amber-300 bg-amber-50/10'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-semibold ${
                            isUrgent ? 'text-rose-700' : isElevated ? 'text-amber-700' : 'text-slate-600'
                          }`}
                        >
                          {alert.operationalLevel}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono text-slate-500">{alert.id}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 font-medium">{alert.areaName}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {alert.riskCategory}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {alert.copilotAssessment.whatHappened}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs text-slate-500">Risk Score</div>
                      <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                        {alert.riskScore}
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Signal Corroboration Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>
                        Corroboration: <strong className="text-slate-800 font-mono">{alert.signalsCorroboratedCount}/{alert.signalsTotalCount} categories</strong>
                      </span>
                      <span>·</span>
                      <span>
                        Completeness: <strong className="text-slate-800 font-mono">{alert.dataCompletenessPct}%</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-teal-700 font-semibold group-hover:underline">
                      <span>Investigate evidence</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Monitored Areas & Interventions Quick Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Surveillance Sectors
              </h3>
              <button
                onClick={() => onNavigate('surveillance')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                Map View
              </button>
            </div>

            <div className="space-y-3">
              {areas.map((area) => {
                const isUrgent = area.currentLevel === 'Urgent Review';
                const isElevated = area.currentLevel === 'Elevated';
                return (
                  <div
                    key={area.id}
                    className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{area.name}</span>
                      <span
                        className={`font-mono font-semibold ${
                          isUrgent ? 'text-rose-600' : isElevated ? 'text-amber-600' : 'text-emerald-600'
                        }`}
                      >
                        {area.currentRiskScore}/100
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500 flex items-center gap-2">
                      <span>{area.sector}</span>
                      <span>·</span>
                      <span className="font-mono tabular-nums">{area.baselineWorkerPopulation.toLocaleString()} staff</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Intervention Focus Card */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold tracking-wide uppercase text-teal-400">
                Live Intervention
              </span>
              <span className="font-mono">{interventions[0]?.id}</span>
            </div>

            <h4 className="text-sm font-bold text-white">
              {interventions[0]?.title}
            </h4>
            <p className="text-xs text-slate-300">
              Assigned to: <strong className="text-white">{interventions[0]?.assigneeName}</strong> ({interventions[0]?.assignedRole})
            </p>

            <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Checklist progress</span>
                <span className="font-mono text-teal-400">
                  {interventions[0]?.checklist.filter((c) => c.completed).length}/
                  {interventions[0]?.checklist.length} completed
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('actions')}
              className="w-full mt-2 py-2 px-3 bg-teal-500 hover:bg-teal-400 text-slate-900 text-xs font-semibold rounded-lg transition-colors text-center"
            >
              Open Action Center
            </button>
          </div>
        </div>
      </div>

      {/* Regulatory & Responsible AI Statement */}
      <footer className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>Decision Support Safeguard:</strong> SentinelHealth AI generates operational risk warnings for organizational prevention. It does not diagnose medical conditions, replace emergency services, or conduct punitive individual employee tracking.
          </span>
        </div>
        <div className="text-slate-500 font-mono shrink-0">
          Small-Cell Suppression: Active (k ≥ 5)
        </div>
      </footer>
    </div>
  );
};
