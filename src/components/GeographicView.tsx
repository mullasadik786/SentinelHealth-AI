/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MonitoringArea, Alert } from '../types';
import { MapPin, Layers, Table, Info, AlertTriangle, ShieldAlert } from 'lucide-react';

interface GeographicViewProps {
  areas: MonitoringArea[];
  alerts: Alert[];
  onSelectArea: (area: MonitoringArea) => void;
  onSelectAlert: (alert: Alert) => void;
}

export const GeographicView: React.FC<GeographicViewProps> = ({
  areas,
  alerts,
  onSelectArea,
  onSelectAlert,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(areas[0]?.id || 'AREA-01');
  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');

  const selectedArea = areas.find((a) => a.id === selectedAreaId) || areas[0];
  const areaAlert = alerts.find((a) => a.areaId === selectedArea?.id);

  // SVG coordinate transformation for the 4 regional operational sectors
  const sectorGeometries: Record<string, { cx: number; cy: number; r: number; path: string }> = {
    'AREA-01': {
      cx: 190,
      cy: 230,
      r: 45,
      path: 'M 140,210 Q 180,180 240,200 L 250,270 Q 190,290 135,260 Z',
    },
    'AREA-02': {
      cx: 470,
      cy: 340,
      r: 52,
      path: 'M 410,290 Q 480,270 540,310 L 530,390 Q 460,420 395,370 Z',
    },
    'AREA-03': {
      cx: 260,
      cy: 350,
      r: 48,
      path: 'M 210,310 Q 280,300 320,330 L 310,400 Q 250,420 200,380 Z',
    },
    'AREA-04': {
      cx: 220,
      cy: 160,
      r: 40,
      path: 'M 170,130 Q 240,120 280,150 L 270,210 Q 210,220 160,190 Z',
    },
  };

  const getRiskColor = (score: number) => {
    if (score >= 75) return { fill: 'rgba(239, 68, 68, 0.25)', stroke: '#DC2626', text: 'text-rose-700' };
    if (score >= 50) return { fill: 'rgba(245, 158, 11, 0.25)', stroke: '#D97706', text: 'text-amber-700' };
    return { fill: 'rgba(16, 185, 129, 0.20)', stroke: '#059669', text: 'text-emerald-700' };
  };

  return (
    <div className="space-y-6">
      {/* Header with Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Geographic Population & Workplace Surveillance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Authorized regional surveillance sectors. Evaluated against rolling 21-day baselines.
          </p>
        </div>

        {/* View Mode Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Accessible Matrix</span>
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Vector Surveillance Map Canvas */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-6 text-white relative shadow-sm overflow-hidden min-h-[460px] flex flex-col justify-between">
            <div className="flex items-center justify-between z-10">
              <div className="text-xs text-slate-400">
                <span className="font-semibold text-slate-200">Regional Coordinate System:</span> WGS84 Projection
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/60 border border-rose-500 inline-block"></span> Urgent (≥75)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/60 border border-amber-500 inline-block"></span> Elevated (50-74)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/60 border border-emerald-500 inline-block"></span> Nominal (&lt;50)
                </span>
              </div>
            </div>

            {/* SVG Choropleth / Regional Topology */}
            <div className="w-full my-auto flex items-center justify-center py-4">
              <svg viewBox="0 0 650 480" className="w-full max-w-2xl h-auto select-none">
                {/* Coastal Geographic Contours */}
                <path
                  d="M 60,60 Q 120,180 140,240 T 160,390 L 190,440"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text x="70" y="240" fill="#64748B" fontSize="10" fontFamily="sans-serif">Pacific Coastline</text>

                {/* Major Transit Corridor */}
                <path
                  d="M 180,90 L 220,170 L 260,340 L 440,360"
                  fill="none"
                  stroke="#1E293B"
                  strokeWidth="6"
                />
                <path
                  d="M 180,90 L 220,170 L 260,340 L 440,360"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="6 3"
                />
                <text x="310" y="325" fill="#64748B" fontSize="9" fontFamily="sans-serif">Industrial Rail & Freight Corridor</text>

                {/* Surveillance Sector Zones */}
                {areas.map((area) => {
                  const geom = sectorGeometries[area.id] || { cx: 200, cy: 200, path: '', r: 30 };
                  const isSelected = selectedAreaId === area.id;
                  const colors = getRiskColor(area.currentRiskScore);

                  return (
                    <g
                      key={area.id}
                      onClick={() => setSelectedAreaId(area.id)}
                      className="cursor-pointer transition-transform hover:opacity-95"
                    >
                      {/* Polygon Zone */}
                      <path
                        d={geom.path}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth={isSelected ? '3' : '1.5'}
                        className="transition-all"
                      />

                      {/* Central Node Pin */}
                      <circle
                        cx={geom.cx}
                        cy={geom.cy}
                        r={isSelected ? '14' : '10'}
                        fill={colors.stroke}
                        className="transition-all"
                      />
                      <circle
                        cx={geom.cx}
                        cy={geom.cy}
                        r={isSelected ? '22' : '16'}
                        fill="none"
                        stroke={colors.stroke}
                        strokeWidth="1"
                        opacity={isSelected ? '0.8' : '0.3'}
                      />

                      {/* Score Label inside Pin */}
                      <text
                        x={geom.cx}
                        y={geom.cy + 3.5}
                        fill="#FFFFFF"
                        fontSize="9"
                        fontWeight="bold"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {area.currentRiskScore}
                      </text>

                      {/* Zone Name Label */}
                      <text
                        x={geom.cx}
                        y={geom.cy + 34}
                        fill={isSelected ? '#F8FAFC' : '#94A3B8'}
                        fontSize="11"
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        fontFamily="sans-serif"
                        textAnchor="middle"
                      >
                        {area.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 z-10 pt-2 border-t border-slate-800">
              <span>Click any sector pin to inspect real-time multi-signal telemetry.</span>
              <span className="font-mono">Lat: {selectedArea.coordinates.lat.toFixed(4)}, Lng: {selectedArea.coordinates.lng.toFixed(4)}</span>
            </div>
          </div>

          {/* Right 1 Col: Selected Sector Inspector */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 font-mono">{selectedArea.code}</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedArea.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedArea.sector}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500">Risk Score</div>
                <div className="text-2xl font-bold font-mono text-slate-900">
                  {selectedArea.currentRiskScore}
                  <span className="text-xs font-normal text-slate-400">/100</span>
                </div>
              </div>
            </div>

            {/* Area Operational Profile */}
            <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-lg border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Workforce Baseline:</span>
                <span className="font-mono font-semibold text-slate-800 tabular-nums">
                  {selectedArea.baselineWorkerPopulation.toLocaleString()} workers
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Sensor Feeds:</span>
                <span className="font-mono font-semibold text-slate-800 tabular-nums">
                  {selectedArea.activeSensorsCount} telemetry nodes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Primary Risk Factor:</span>
                <span className="font-semibold text-slate-800">{selectedArea.primaryRiskProfile}</span>
              </div>
            </div>

            {/* Active Alert in Selected Area */}
            {areaAlert ? (
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Active Warning
                  </span>
                  <span className="text-rose-700 font-semibold text-xs font-mono">
                    {areaAlert.operationalLevel}
                  </span>
                </div>

                <div className="text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">{areaAlert.riskCategory}</p>
                  <p className="text-slate-600 leading-relaxed line-clamp-3">
                    {areaAlert.copilotAssessment.whatHappened}
                  </p>
                </div>

                <button
                  onClick={() => onSelectAlert(areaAlert)}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors text-center"
                >
                  Investigate Evidence & Actions
                </button>
              </div>
            ) : (
              <div className="py-4 text-center text-xs text-slate-500 border-t border-slate-100">
                No active critical alerts in this sector. Telemetry within normal statistical bounds.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Accessible Non-Map Fallback Table */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Sector Surveillance Matrix (Accessible Fallback)
            </h3>
            <span className="text-xs text-slate-500">
              All coordinates and baseline populations verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Sector Name</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3 text-right">Population</th>
                  <th className="px-4 py-3 text-right">Sensors</th>
                  <th className="px-4 py-3 text-right">Risk Score</th>
                  <th className="px-4 py-3">Operational Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-normal text-slate-600">
                {areas.map((area) => {
                  const alert = alerts.find((a) => a.areaId === area.id);
                  const isUrgent = area.currentLevel === 'Urgent Review';
                  const isElevated = area.currentLevel === 'Elevated';

                  return (
                    <tr key={area.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-slate-800">{area.code}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{area.name}</td>
                      <td className="px-4 py-3">{area.sector}</td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">
                        {area.baselineWorkerPopulation.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums">{area.activeSensorsCount}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold tabular-nums">
                        <span className={isUrgent ? 'text-rose-600' : isElevated ? 'text-amber-600' : 'text-emerald-600'}>
                          {area.currentRiskScore}/100
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${isUrgent ? 'text-rose-700' : isElevated ? 'text-amber-700' : 'text-slate-600'}`}>
                          {area.currentLevel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {alert ? (
                          <button
                            onClick={() => onSelectAlert(alert)}
                            className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
                          >
                            Inspect Alert
                          </button>
                        ) : (
                          <span className="text-slate-400">Nominal</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
