/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MonitoringArea, SignalDefinition, SignalObservation } from '../types';
import { SIGNAL_DEFINITIONS } from '../services/syntheticData';
import { Layers, Calendar, Filter, AlertCircle, ArrowUpRight } from 'lucide-react';

interface SignalExplorerViewProps {
  areas: MonitoringArea[];
  observations: SignalObservation[];
  selectedAreaId: string;
  onSelectAreaId: (id: string) => void;
  smallCellSuppressionThreshold: number;
}

export const SignalExplorerView: React.FC<SignalExplorerViewProps> = ({
  areas,
  observations,
  selectedAreaId,
  onSelectAreaId,
  smallCellSuppressionThreshold,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeWindowDays, setTimeWindowDays] = useState<number>(30);
  const [hoveredPoint, setHoveredPoint] = useState<{
    signalName: string;
    date: string;
    value: number;
    unit: string;
    baseline: number;
    zScore: number;
  } | null>(null);

  const selectedArea = areas.find((a) => a.id === selectedAreaId) || areas[0];

  // Filter signals by category
  const filteredSignals = useMemo(() => {
    if (selectedCategory === 'all') return SIGNAL_DEFINITIONS;
    return SIGNAL_DEFINITIONS.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  // Filter observations by area and time window
  const areaObservations = useMemo(() => {
    const areaObs = observations.filter((o) => o.areaId === selectedAreaId);
    const uniqueDates = Array.from(new Set(areaObs.map((o) => o.timestamp.slice(0, 10)))).sort();
    const cutOffDates = uniqueDates.slice(-timeWindowDays);
    const minDate = cutOffDates[0] || '2026-07-25';
    return areaObs.filter((o) => o.timestamp.slice(0, 10) >= minDate);
  }, [observations, selectedAreaId, timeWindowDays]);

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Multi-Signal Time-Series Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Compare environmental metrics, syndromic healthcare visits, and workplace incident signals against rolling baselines.
            </p>
          </div>

          {/* Area Switcher */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sector:</span>
            <select
              value={selectedAreaId}
              onChange={(e) => onSelectAreaId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
              aria-label="Select surveillance area"
            >
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name} ({area.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category & Time Window Segmented Controls */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Signals ({SIGNAL_DEFINITIONS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('environmental')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'environmental' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Environmental (3)
            </button>
            <button
              onClick={() => setSelectedCategory('healthcare')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'healthcare' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Healthcare (3)
            </button>
            <button
              onClick={() => setSelectedCategory('workplace')}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'workplace' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Workplace (3)
            </button>
          </div>

          {/* Time Window Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {[7, 14, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setTimeWindowDays(days)}
                className={`px-2.5 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap font-mono tabular-nums ${
                  timeWindowDays === days ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {days}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Tooltip Card (if active) */}
      {hoveredPoint && (
        <div className="bg-slate-900 text-white rounded-lg p-3 text-xs flex flex-wrap items-center justify-between gap-4 shadow-sm animate-fade-in">
          <div>
            <span className="font-semibold text-teal-400">{hoveredPoint.signalName}</span>
            <span className="text-slate-400 ml-2">({hoveredPoint.date})</span>
          </div>
          <div className="flex items-center gap-4 font-mono tabular-nums">
            <span>Observed: <strong className="text-white">{hoveredPoint.value} {hoveredPoint.unit}</strong></span>
            <span>Baseline: <strong className="text-slate-300">{hoveredPoint.baseline} {hoveredPoint.unit}</strong></span>
            <span>
              Z-Score:{' '}
              <strong className={hoveredPoint.zScore >= 2.5 ? 'text-rose-400' : hoveredPoint.zScore >= 1.8 ? 'text-amber-400' : 'text-emerald-400'}>
                +{hoveredPoint.zScore}
              </strong>
            </span>
          </div>
        </div>
      )}

      {/* Multi-Signal Time Series Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredSignals.map((signal) => {
          const sigObs = areaObservations
            .filter((o) => o.signalId === signal.id)
            .sort((a, b) => a.timestamp.localeCompare(b.timestamp));

          if (sigObs.length === 0) return null;

          // Compute chart bounds
          const validValues = sigObs.filter((o) => !o.isMissing && o.value !== -1).map((o) => o.value);
          const minVal = Math.min(...validValues, signal.baselineMean - 2 * signal.baselineStd, 0);
          const maxVal = Math.max(...validValues, signal.criticalThreshold, signal.baselineMean + 3 * signal.baselineStd) * 1.08;
          const range = maxVal - minVal || 1;

          const svgWidth = 520;
          const svgHeight = 160;
          const padding = { top: 15, right: 20, bottom: 25, left: 45 };
          const plotWidth = svgWidth - padding.left - padding.right;
          const plotHeight = svgHeight - padding.top - padding.bottom;

          const getX = (idx: number) => padding.left + (idx / (sigObs.length - 1 || 1)) * plotWidth;
          const getY = (val: number) => padding.top + plotHeight - ((val - minVal) / range) * plotHeight;

          // Path for actual values
          const points = sigObs.map((o, idx) => ({
            x: getX(idx),
            y: o.isMissing ? null : getY(o.value),
            val: o.value,
            date: o.timestamp.slice(5, 10),
            z: o.zScore,
            isMissing: o.isMissing,
          }));

          const pathD = points
            .filter((p) => p.y !== null)
            .reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y!.toFixed(1)}`, '');

          const baselineY = getY(signal.baselineMean);
          const criticalY = getY(signal.criticalThreshold);
          const bandUpperY = getY(signal.baselineMean + 1.96 * signal.baselineStd);
          const bandLowerY = getY(Math.max(0, signal.baselineMean - 1.96 * signal.baselineStd));

          const latestObs = sigObs[sigObs.length - 1];
          const isLatestAnomalous = latestObs && latestObs.zScore >= 2.0;

          return (
            <div
              key={signal.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="capitalize">{signal.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">{signal.unit}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-0.5">{signal.name}</h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Latest Observed</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-slate-900">
                    {latestObs && !latestObs.isMissing ? (
                      <>
                        {latestObs.value} {signal.unit}
                        <span
                          className={`ml-1 text-xs font-semibold ${
                            latestObs.zScore >= 2.5
                              ? 'text-rose-600'
                              : latestObs.zScore >= 1.8
                              ? 'text-amber-600'
                              : 'text-slate-400'
                          }`}
                        >
                          (Z: +{latestObs.zScore.toFixed(1)})
                        </span>
                      </>
                    ) : (
                      <span className="text-amber-600 text-xs font-semibold">Feed Missing / Delayed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* SVG Sparkline/Chart */}
              <div className="w-full overflow-hidden select-none">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                  {/* Normal Baseline Envelope (Band ±2σ) */}
                  <rect
                    x={padding.left}
                    y={bandUpperY}
                    width={plotWidth}
                    height={Math.max(2, bandLowerY - bandUpperY)}
                    fill="#F1F5F9"
                    opacity="0.9"
                  />

                  {/* Baseline Median Line */}
                  <line
                    x1={padding.left}
                    y1={baselineY}
                    x2={svgWidth - padding.right}
                    y2={baselineY}
                    stroke="#94A3B8"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Critical Threshold Line */}
                  <line
                    x1={padding.left}
                    y1={criticalY}
                    x2={svgWidth - padding.right}
                    y2={criticalY}
                    stroke="#DC2626"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                    opacity="0.6"
                  />

                  {/* Left Y-axis ticks */}
                  <text x={padding.left - 6} y={getY(maxVal * 0.95)} fill="#94A3B8" fontSize="8" textAnchor="end" fontFamily="monospace">
                    {Math.round(maxVal)}
                  </text>
                  <text x={padding.left - 6} y={baselineY + 3} fill="#64748B" fontSize="8" textAnchor="end" fontFamily="monospace">
                    {Math.round(signal.baselineMean)}
                  </text>
                  <text x={padding.left - 6} y={padding.top + plotHeight} fill="#94A3B8" fontSize="8" textAnchor="end" fontFamily="monospace">
                    {Math.round(minVal)}
                  </text>

                  {/* Actual Data Path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={signal.category === 'environmental' ? '#0284C7' : signal.category === 'healthcare' ? '#0D9488' : '#D97706'}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Interactive Points */}
                  {points.map((p, idx) => {
                    if (p.y === null) return null;
                    const isHigh = p.z >= 2.0;

                    return (
                      <circle
                        key={idx}
                        cx={p.x}
                        cy={p.y}
                        r={isHigh ? 4 : 2}
                        fill={isHigh ? '#DC2626' : signal.category === 'environmental' ? '#0284C7' : '#0D9488'}
                        className="cursor-pointer transition-transform hover:scale-150"
                        onMouseEnter={() =>
                          setHoveredPoint({
                            signalName: signal.name,
                            date: p.date,
                            value: p.val,
                            unit: signal.unit,
                            baseline: signal.baselineMean,
                            zScore: p.z,
                          })
                        }
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Chart Legend & Signal Metadata */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-slate-400 inline-block"></span> Baseline ({signal.baselineMean} {signal.unit})
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-rose-500 inline-block"></span> Critical Alert ({signal.criticalThreshold} {signal.unit})
                  </span>
                </div>
                <span className="font-mono text-slate-400">Updates every {signal.updateFrequencyHours}h</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
