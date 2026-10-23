/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldCheck, PlayCircle, RefreshCw } from 'lucide-react';
import { UserRole } from '../types';

interface TopBarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenDemo: () => void;
  onResetData: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeAlertCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenDemo,
  onResetData,
  currentRole,
  onRoleChange,
  activeAlertCount,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'surveillance', label: 'Surveillance' },
    { id: 'signals', label: 'Signals' },
    { id: 'alerts', label: 'Alerts', badge: activeAlertCount },
    { id: 'actions', label: 'Action Center' },
    { id: 'validation', label: 'Validation Lab' },
    { id: 'quality', label: 'Data Quality' },
    { id: 'privacy', label: 'Privacy & Audit' },
    { id: 'docs', label: 'Documentation' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text wordmark */}
          <button
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none group whitespace-nowrap shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500/30 transition-colors">
              <Activity className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white group-hover:text-teal-300 transition-colors">
              SentinelHealth AI
            </span>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-teal-400 font-semibold border-b-2 border-teal-400 -mb-[2px]'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-xs text-amber-400 font-mono tabular-nums">
                      ({item.badge})
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action & role switcher */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick role selector */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                aria-label="Active user role"
              >
                <option value="occupational_safety_lead">Occupational Safety Lead</option>
                <option value="public_health_analyst">Public Health Epidemiologist</option>
                <option value="clinical_safety_officer">Clinical Safety Reviewer</option>
                <option value="compliance_auditor">Compliance Auditor</option>
              </select>
            </div>

            <button
              onClick={onResetData}
              title="Reset synthetic baseline data"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
              aria-label="Reset dataset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDemo}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Run Heat-Risk Demo</span>
            </button>
          </div>
        </div>

        {/* Responsive secondary scroll row for smaller desktop/tablets */}
        <div className="xl:hidden flex items-center gap-5 overflow-x-auto py-2 border-t border-slate-800 text-xs no-scrollbar">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`whitespace-nowrap py-1 ${
                  isActive ? 'text-teal-400 font-semibold border-b border-teal-400' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                {item.badge !== undefined && item.badge > 0 && ` (${item.badge})`}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
