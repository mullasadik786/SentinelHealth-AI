/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, AuditLogEntry } from '../types';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  FileText,
  AlertCircle,
  Sliders,
  History,
  CheckCircle2,
} from 'lucide-react';

interface PrivacyAuditViewProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  auditLogs: AuditLogEntry[];
  smallCellThreshold: number;
  onThresholdChange: (threshold: number) => void;
}

export const PrivacyAuditView: React.FC<PrivacyAuditViewProps> = ({
  currentRole,
  onRoleChange,
  auditLogs,
  smallCellThreshold,
  onThresholdChange,
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'privacy_controls' | 'policies'>('privacy_controls');

  // Role permissions matrix
  const permissions = [
    {
      feature: 'View Aggregated Sector Alerts',
      analyst: true,
      safetyLead: true,
      clinician: true,
      auditor: true,
    },
    {
      feature: 'Deploy Workplace Interventions',
      analyst: false,
      safetyLead: true,
      clinician: false,
      auditor: false,
    },
    {
      feature: 'Configure Detection Thresholds',
      analyst: true,
      safetyLead: false,
      clinician: true,
      auditor: false,
    },
    {
      feature: 'Execute Historical Back-Tests',
      analyst: true,
      safetyLead: false,
      clinician: true,
      auditor: true,
    },
    {
      feature: 'Audit Cryptographic Access Logs',
      analyst: false,
      safetyLead: false,
      clinician: false,
      auditor: true,
    },
    {
      feature: 'Access Individual Medical Records',
      analyst: false,
      safetyLead: false,
      clinician: false,
      auditor: false,
      prohibitedNote: 'Banned platform-wide by privacy architecture',
    },
  ];

  // Illustrative small-cell table demo
  const sampleRawCounts = [
    { category: 'Dehydration / Exertion', rawCount: 14, suppressed: 14 },
    { category: 'Heat Syncope (Fainting)', rawCount: 3, suppressed: '< 5 (Suppressed)' },
    { category: 'Severe Heat Exhaustion', rawCount: 2, suppressed: '< 5 (Suppressed)' },
    { category: 'Mild Heat Cramps', rawCount: 8, suppressed: 8 },
    { category: 'Occupational Hyperthermia', rawCount: 1, suppressed: '< 5 (Suppressed)' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Privacy Governance, RBAC & Audit Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Privacy-by-design safeguards, automated small-cell suppression, anti-worker surveillance rules, and immutable audit trails.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('privacy_controls')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'privacy_controls' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Privacy Controls
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'audit' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Log Ledger ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('policies')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeTab === 'policies' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Anti-Surveillance Charter
          </button>
        </div>
      </div>

      {activeTab === 'privacy_controls' && (
        <div className="space-y-6">
          {/* Small-Cell Suppression Demonstration */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-teal-600" />
                  <span>Small-Cell Group Suppression Simulator</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protects patient confidentiality by automatically suppressing cell counts below threshold k, preventing re-identification attacks in small workplace groups.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Suppression Threshold (k):</span>
                <select
                  value={smallCellThreshold}
                  onChange={(e) => onThresholdChange(parseInt(e.target.value, 10))}
                  className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs font-mono font-semibold text-slate-800"
                  aria-label="Small cell suppression threshold"
                >
                  <option value={3}>k ≥ 3</option>
                  <option value={5}>k ≥ 5 (Standard HIPAA/GDPR)</option>
                  <option value={10}>k ≥ 10 (Strict)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Syndromic Presentation Sub-Category</th>
                    <th className="px-4 py-2.5 text-right font-mono">Raw Aggregated Count</th>
                    <th className="px-4 py-2.5 text-right font-mono">Displayed Public Output</th>
                    <th className="px-4 py-2.5">Privacy Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal text-slate-600">
                  {sampleRawCounts.map((row, idx) => {
                    const isSuppressed = row.rawCount < smallCellThreshold;
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-medium text-slate-900">{row.category}</td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-slate-500">
                          {row.rawCount}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold tabular-nums">
                          {isSuppressed ? (
                            <span className="text-amber-700 font-semibold">&lt; {smallCellThreshold} [Suppressed]</span>
                          ) : (
                            <span className="text-slate-800">{row.rawCount}</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5">
                          {isSuppressed ? (
                            <span className="text-[11px] text-amber-700">Suppressed to prevent single-person identification</span>
                          ) : (
                            <span className="text-[11px] text-emerald-700">Safe for aggregated reporting</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Role-Based Access Control (RBAC) Matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>Role-Based Access Control Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Platform Capability</th>
                    <th className="px-4 py-2.5 text-center">Public Health Epi</th>
                    <th className="px-4 py-2.5 text-center">Safety Lead</th>
                    <th className="px-4 py-2.5 text-center">Clinical Reviewer</th>
                    <th className="px-4 py-2.5 text-center">Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal text-slate-600">
                  {permissions.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        {p.feature}
                        {p.prohibitedNote && (
                          <span className="block text-[11px] text-rose-600 font-normal mt-0.5">
                            {p.prohibitedNote}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {p.analyst ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {p.safetyLead ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {p.clinician ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : '—'}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {p.auditor ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Immutable Cryptographic Audit Event Ledger
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              SHA-256 hashed records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Event ID</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor & Role</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Details</th>
                  <th className="px-4 py-3 font-mono">Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-600">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 font-mono text-[11px]">
                    <td className="px-4 py-2.5 font-bold text-slate-800">{log.id}</td>
                    <td className="px-4 py-2.5 text-slate-500">{log.timestamp.slice(0, 19).replace('T', ' ')}</td>
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-900">
                      {log.userName} ({log.userRole})
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-teal-800">{log.action}</td>
                    <td className="px-4 py-2.5 font-sans">{log.targetType}: {log.targetId}</td>
                    <td className="px-4 py-2.5 font-sans text-slate-700 max-w-xs truncate">{log.details}</td>
                    <td className="px-4 py-2.5 text-slate-400">{log.privacySafeHash.slice(0, 14)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base font-bold text-slate-900">
              Worker Protection & Anti-Surveillance Ethical Charter
            </h2>
            <p className="text-slate-500 mt-1">
              Guaranteed operational safeguards against punitive worker surveillance, discrimination, or individual profiling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                1. Zero Individual Worker Ranking
              </h4>
              <p>
                SentinelHealth AI strictly evaluates geographic sectors and aggregated shifts. The software does not contain individual employee accounts, biometric trackers, health risk scores per worker, or productivity penalization engines.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                2. Prohibition of Employment Retaliation
              </h4>
              <p>
                Sickness absence and clinic presentation signals are aggregated over minimum worker cohort sizes ($N \ge 5$). Telemetry may never be used for disciplinary actions, performance reviews, termination, or wage docking.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                3. Mandatory Decision Support Status
              </h4>
              <p>
                The platform is explicitly designated as operational decision support for environmental and occupational safety. It does not issue binding medical orders, replace emergency clinical triage, or automate site closures without human officer review.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                4. Data Retention & Erasure Policy
              </h4>
              <p>
                High-frequency raw sensor telemetry is summarized into rolling hourly aggregates and retained for 90 days. Aggregated syndromic healthcare reports are deleted or archived following seasonal epidemiology reporting cycles.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
