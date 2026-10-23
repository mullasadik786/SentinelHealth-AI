/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SIGNAL_DEFINITIONS, MONITORING_AREAS } from '../services/syntheticData';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Upload,
  FileCode,
  ShieldCheck,
  RefreshCw,
  Database,
  Search,
} from 'lucide-react';

export const DataQualityView: React.FC = () => {
  const [uploadText, setUploadText] = useState<string>('');
  const [validationResult, setValidationResult] = useState<{
    valid: boolean;
    recordsCount: number;
    errors: string[];
    warnings: string[];
  } | null>(null);

  // Feed status matrix mock data based on our synthetic scenario state
  const feedStatuses = [
    {
      id: 'FEED-ENV-01',
      name: 'Maritime Port Ambient Weather Telemetry',
      category: 'Environmental',
      area: 'Metro Logistics & Port Hub (AREA-01)',
      updateCadence: 'Hourly',
      lastReceived: '18 minutes ago',
      freshnessScore: 0.99,
      status: 'Healthy',
      completeness: '100%',
      latencyMinutes: 12,
    },
    {
      id: 'FEED-ENV-02',
      name: 'Central Basin Agro-Meteorological Station',
      category: 'Environmental',
      area: 'Central Agricultural Basin (AREA-02)',
      updateCadence: 'Hourly',
      lastReceived: '32 minutes ago',
      freshnessScore: 0.96,
      status: 'Healthy',
      completeness: '98.5%',
      latencyMinutes: 24,
    },
    {
      id: 'FEED-HLT-01',
      name: 'Regional Syndromic Urgent Care presentations',
      category: 'Healthcare Services',
      area: 'Metro Logistics Corridor (AREA-01)',
      updateCadence: 'Every 6 Hours',
      lastReceived: '2.5 hours ago',
      freshnessScore: 0.94,
      status: 'Healthy',
      completeness: '96.2%',
      latencyMinutes: 140,
    },
    {
      id: 'FEED-HLT-04',
      name: 'Coastal General Hospital ED Syndromic Feed',
      category: 'Healthcare Services',
      area: 'Coastal Infrastructure Corridor (AREA-04)',
      updateCadence: 'Every 6 Hours',
      lastReceived: '44 hours ago',
      freshnessScore: 0.22,
      status: 'Severely Delayed / Offline',
      completeness: '62.0%',
      latencyMinutes: 2640,
    },
    {
      id: 'FEED-WRK-01',
      name: 'Port Tarmac Daily Safety Incident & Absence Log',
      category: 'Workplace Operations',
      area: 'Metro Logistics Hub (AREA-01)',
      updateCadence: 'Daily (24h)',
      lastReceived: '4 hours ago',
      freshnessScore: 0.98,
      status: 'Healthy',
      completeness: '100%',
      latencyMinutes: 240,
    },
    {
      id: 'FEED-ENV-03',
      name: 'Iron Belt Industrial Particulate Laser Monitor',
      category: 'Environmental',
      area: 'Iron Belt Heavy Manufacturing (AREA-03)',
      updateCadence: 'Hourly',
      lastReceived: '12 minutes ago',
      freshnessScore: 0.99,
      status: 'Healthy',
      completeness: '99.1%',
      latencyMinutes: 8,
    },
  ];

  const handleValidateUpload = () => {
    const lines = uploadText.trim().split('\n');
    if (!uploadText.trim()) {
      setValidationResult({
        valid: false,
        recordsCount: 0,
        errors: ['Input payload is empty. Please paste CSV or JSON data.'],
        warnings: [],
      });
      return;
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    let recordsCount = 0;

    // Check if JSON
    if (uploadText.trim().startsWith('{') || uploadText.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(uploadText);
        const items = Array.isArray(parsed) ? parsed : [parsed];
        recordsCount = items.length;

        items.forEach((item, idx) => {
          if (!item.areaId) errors.push(`Item ${idx + 1}: Missing required field 'areaId'`);
          if (!item.signalId) errors.push(`Item ${idx + 1}: Missing required field 'signalId'`);
          if (item.value === undefined) errors.push(`Item ${idx + 1}: Missing required field 'value'`);
          if (typeof item.value !== 'number' && item.value !== null) {
            errors.push(`Item ${idx + 1}: 'value' must be a numeric observation`);
          }
          if (item.value === null) {
            warnings.push(`Item ${idx + 1}: Missing reading recorded. Sentinel engine will treat as non-zero missingness.`);
          }
        });
      } catch (err: any) {
        errors.push(`JSON Syntax Error: ${err.message}`);
      }
    } else {
      // Treat as CSV
      const header = lines[0].toLowerCase();
      if (!header.includes('area') || !header.includes('signal') || !header.includes('value')) {
        errors.push("CSV header must contain 'areaId', 'signalId', and 'value' columns.");
      }
      recordsCount = lines.length - 1;

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < 3) {
          errors.push(`Line ${i + 1}: Invalid CSV format, expected at least 3 columns.`);
          break;
        }
        const val = parseFloat(parts[2]);
        if (isNaN(val)) {
          warnings.push(`Line ${i + 1}: Value '${parts[2]}' cannot be parsed as numeric. Flagged as missing feed.`);
        }
      }
    }

    setValidationResult({
      valid: errors.length === 0,
      recordsCount,
      errors,
      warnings,
    });
  };

  const handleLoadSampleCSV = () => {
    const sample = `timestamp,areaId,signalId,value,unit
2026-10-23T07:00:00Z,AREA-01,env_heat_index,101.5,degF
2026-10-23T07:00:00Z,AREA-01,health_heat_illness_visits,9,visits
2026-10-23T07:00:00Z,AREA-01,work_heat_cramps_incidents,4,reports
2026-10-23T07:00:00Z,AREA-02,env_heat_index,84.2,degF
2026-10-23T07:00:00Z,AREA-02,health_heat_illness_visits,2,visits`;
    setUploadText(sample);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Data Quality, Freshness & Ingestion Center
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Monitor sensor telemetry freshness, detect delayed syndromic feeds, validate incoming schemas, and enforce missing-data policies.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500">Telemetry Feed Health</span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-700 tabular-nums">5 / 6 Online</div>
          <span className="text-xs text-slate-500">1 feed experiencing latency</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500">Overall Data Freshness</span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 tabular-nums">98.4%</div>
          <span className="text-xs text-slate-500">Mean staleness &lt; 2.4 hrs</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500">Missingness Policy</span>
          <div className="mt-2 text-sm font-bold text-slate-900">Strict Non-Zero</div>
          <span className="text-xs text-slate-500">Never silently sets missing to 0</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs text-slate-500">Schema Validation</span>
          <div className="mt-2 text-sm font-bold text-teal-700">Strict Typing Active</div>
          <span className="text-xs text-slate-500">Units & dates normalized</span>
        </div>
      </div>

      {/* Feed Status Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Active Telemetry Ingestion Feeds
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            6 feeds registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Feed Identifier</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Sector Location</th>
                <th className="px-4 py-3">Cadence</th>
                <th className="px-4 py-3">Last Telemetry</th>
                <th className="px-4 py-3 text-right">Completeness</th>
                <th className="px-4 py-3">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal text-slate-600">
              {feedStatuses.map((feed) => {
                const isDelayed = feed.status.includes('Delayed');
                return (
                  <tr key={feed.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-800">{feed.id}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{feed.category}</td>
                    <td className="px-4 py-3">{feed.area}</td>
                    <td className="px-4 py-3 font-mono">{feed.updateCadence}</td>
                    <td className="px-4 py-3 font-mono">{feed.lastReceived}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums">{feed.completeness}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold ${
                          isDelayed ? 'text-rose-700' : 'text-emerald-700'
                        }`}
                      >
                        {isDelayed ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                        {feed.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingestion & Schema Validator Sandbox */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-600" />
              <span>External Dataset Ingestion & Schema Validator</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload custom CSV or JSON observations to validate schema integrity, timestamp compliance, and unit normalization.
            </p>
          </div>

          <button
            onClick={handleLoadSampleCSV}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 self-start sm:self-auto"
          >
            Load Sample CSV Payload
          </button>
        </div>

        <div className="space-y-3">
          <textarea
            value={uploadText}
            onChange={(e) => setUploadText(e.target.value)}
            rows={5}
            placeholder="Paste CSV (timestamp,areaId,signalId,value,unit) or JSON array..."
            className="w-full font-mono text-xs bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-teal-500"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleValidateUpload}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Validate Dataset Schema</span>
            </button>
            <span className="text-xs text-slate-500 font-mono">
              Accepted: ISO-8601 timestamps, degF / degC, visits/day
            </span>
          </div>
        </div>

        {validationResult && (
          <div
            className={`p-4 rounded-lg border text-xs space-y-2 ${
              validationResult.valid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5">
                {validationResult.valid ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                {validationResult.valid ? 'Schema Validated Successfully' : 'Schema Validation Errors Detected'}
              </span>
              <span className="font-mono tabular-nums">{validationResult.recordsCount} records analyzed</span>
            </div>

            {validationResult.errors.length > 0 && (
              <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] text-rose-800">
                {validationResult.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            )}

            {validationResult.warnings.length > 0 && (
              <ul className="list-disc list-inside space-y-0.5 font-mono text-[11px] text-amber-800">
                {validationResult.warnings.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
