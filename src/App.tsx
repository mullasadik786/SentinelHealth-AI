/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { OverviewView } from './components/OverviewView';
import { GeographicView } from './components/GeographicView';
import { SignalExplorerView } from './components/SignalExplorerView';
import { AlertInvestigationView } from './components/AlertInvestigationView';
import { ActionCenterView } from './components/ActionCenterView';
import { ValidationLabView } from './components/ValidationLabView';
import { DataQualityView } from './components/DataQualityView';
import { PrivacyAuditView } from './components/PrivacyAuditView';
import { TechDocsView } from './components/TechDocsView';
import { GuidedDemoModal } from './components/GuidedDemoModal';

import {
  Alert,
  MonitoringArea,
  SignalObservation,
  Intervention,
  UserRole,
  AuditLogEntry,
} from './types';
import { MONITORING_AREAS, generateSyntheticObservations } from './services/syntheticData';
import { evaluateSignalsForArea, DEFAULT_CONFIG } from './services/engine';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [currentRole, setCurrentRole] = useState<UserRole>('occupational_safety_lead');
  const [areas, setAreas] = useState<MonitoringArea[]>(MONITORING_AREAS);
  const [observations, setObservations] = useState<SignalObservation[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string>('AREA-01');
  const [isDemoOpen, setIsDemoOpen] = useState<boolean>(false);
  const [smallCellThreshold, setSmallCellThreshold] = useState<number>(5);

  const [interventions, setInterventions] = useState<Intervention[]>([
    {
      id: 'INT-01',
      alertId: 'ALT-METRO-20261022',
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
        {
          id: 'chk-1',
          label: 'Deploy 4 mobile shade canopy trailers along container berths 4-8',
          completed: true,
          completedAt: '2026-10-21T14:15:00Z',
          completedBy: 'M. Vance',
        },
        {
          id: 'chk-2',
          label: 'Restock chilled electrolyte hydration totes (target: 2L per outdoor worker shift)',
          completed: true,
          completedAt: '2026-10-21T14:30:00Z',
          completedBy: 'M. Vance',
        },
        {
          id: 'chk-3',
          label: 'Enforce 15-minute mandatory cooling rest rotation per 45 minutes of heavy rigging',
          completed: false,
        },
        {
          id: 'chk-4',
          label: 'Transmit syndromic advisory to Port Urgent Care on-call medical team',
          completed: true,
          completedAt: '2026-10-21T13:40:00Z',
          completedBy: 'Dr. Clara Chen',
        },
      ],
      notes: [
        {
          id: 'n-1',
          author: 'Marcus Vance',
          authorRole: 'Occupational Safety Lead',
          timestamp: '2026-10-21T14:32:00Z',
          text: 'Shade trailers 1-4 active. WBGT currently 89.2°F on asphalt. Dispatching additional cooling mist fans.',
        },
      ],
      outcomeAssessment: {
        signalStabilized: true,
        postActionMeanDeltaPct: -41.2,
        evaluationNotes:
          'Subsequent 48-hour observation showed heat exhaustion clinic presentations dropped from 14/day to 3.2/day following shift restructuring.',
        epidemiologicalDisclaimer:
          'Signal moderation observed concurrent with cooling interventions; observational data cannot definitively eliminate concurrent weather moderation confounders.',
      },
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'AUD-001',
      timestamp: '2026-10-23T06:00:00Z',
      userRole: 'public_health_analyst',
      userName: 'Dr. Clara Chen',
      action: 'SYSTEM_BOOT',
      targetId: 'INITIAL_LOAD',
      targetType: 'Dataset',
      details: 'Loaded 90-day multi-signal synthetic baseline dataset across 4 monitoring sectors.',
      privacySafeHash: 'sha256:7f83b1c902e4d...',
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
      privacySafeHash: 'sha256:9a42e8d415b3c...',
    },
  ]);

  // Initial load: fetch or compute observations & alerts
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/observations?days=90');
        if (res.ok) {
          const data = await res.json();
          setObservations(data.observations || []);
          computeAlerts(data.observations || []);
          return;
        }
      } catch (e) {
        // Fallback to local deterministic generator
      }
      const localObs = generateSyntheticObservations();
      setObservations(localObs);
      computeAlerts(localObs);
    }
    loadData();
  }, []);

  const computeAlerts = (obs: SignalObservation[]) => {
    const latestDate = '2026-10-22';
    const computed: Alert[] = [];
    for (const area of MONITORING_AREAS) {
      const alert = evaluateSignalsForArea(area, obs, latestDate, DEFAULT_CONFIG);
      if (alert) {
        computed.push(alert);
      }
    }
    setAlerts(computed);
    if (computed.length > 0 && !selectedAlert) {
      setSelectedAlert(computed[0]);
    }
  };

  const handleResetData = () => {
    const freshObs = generateSyntheticObservations();
    setObservations(freshObs);
    computeAlerts(freshObs);

    const resetAudit: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      userRole: currentRole,
      userName: 'Authorized Lead',
      action: 'RESET_BASELINE',
      targetId: 'SYNTHETIC_STORE',
      targetType: 'Dataset',
      details: 'Restored pristine 90-day baseline telemetry dataset.',
      privacySafeHash: 'sha256:reset_baseline',
    };
    setAuditLogs((prev) => [resetAudit, ...prev]);
  };

  const handleSelectAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setCurrentTab('alert_detail');
  };

  const handleAssignActionFromAlert = (alert: Alert) => {
    const newInt: Intervention = {
      id: `INT-${Date.now().toString().slice(-4)}`,
      alertId: alert.id,
      areaId: alert.areaId,
      areaName: alert.areaName,
      title: `${alert.riskCategory} Preventive Response`,
      priority: alert.operationalLevel === 'Urgent Review' ? 'Urgent' : 'Elevated',
      status: 'Action Approved',
      assignedRole: alert.assignedRole,
      assigneeName: alert.assignedTo || 'Marcus Vance',
      createdAt: new Date().toISOString(),
      deadline: alert.deadlineTimestamp,
      checklist: [
        {
          id: 'chk-1',
          label: `Enforce mandatory cooling rest breaks for all unshaded work crews`,
          completed: false,
        },
        {
          id: 'chk-2',
          label: `Verify chilled electrolyte distribution at active worksite stations`,
          completed: false,
        },
        {
          id: 'chk-3',
          label: `Transmit syndromic early-warning bulletin to local urgent care partners`,
          completed: false,
        },
        {
          id: 'chk-4',
          label: `Conduct field spot-check with portable WBGT heat stress monitor`,
          completed: false,
        },
      ],
      notes: [
        {
          id: `n-${Date.now().toString().slice(-4)}`,
          author: 'Marcus Vance',
          authorRole: alert.assignedRole,
          timestamp: new Date().toISOString(),
          text: `Action plan initiated following alert ${alert.id} (${alert.operationalLevel}).`,
        },
      ],
    };

    setInterventions((prev) => [newInt, ...prev]);
    setCurrentTab('actions');
  };

  const handleUpdateIntervention = (updated: Intervention) => {
    setInterventions((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Top Bar with Top Bar Contract */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
        }}
        onOpenDemo={() => setIsDemoOpen(true)}
        onResetData={handleResetData}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeAlertCount={alerts.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'overview' && (
          <OverviewView
            areas={areas}
            alerts={alerts}
            interventions={interventions}
            onSelectAlert={handleSelectAlert}
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenDemo={() => setIsDemoOpen(true)}
          />
        )}

        {currentTab === 'surveillance' && (
          <GeographicView
            areas={areas}
            alerts={alerts}
            onSelectArea={(area) => {
              setSelectedAreaId(area.id);
              setCurrentTab('signals');
            }}
            onSelectAlert={handleSelectAlert}
          />
        )}

        {currentTab === 'signals' && (
          <SignalExplorerView
            areas={areas}
            observations={observations}
            selectedAreaId={selectedAreaId}
            onSelectAreaId={setSelectedAreaId}
            smallCellSuppressionThreshold={smallCellThreshold}
          />
        )}

        {currentTab === 'alerts' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Early-Warning Alert Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Corroborated population and workforce health warnings requiring human operational assessment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => handleSelectAlert(alert)}
                  className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-400 hover:shadow-sm cursor-pointer transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-slate-500 font-mono">
                        {alert.id} · {alert.areaName}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">
                        {alert.riskCategory}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded font-mono font-semibold ${
                        alert.operationalLevel === 'Urgent Review'
                          ? 'bg-rose-100 text-rose-800'
                          : alert.operationalLevel === 'Elevated'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {alert.operationalLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {alert.copilotAssessment.whatHappened}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span>Risk Score: <strong className="text-slate-900">{alert.riskScore}/100</strong></span>
                    <span className="text-teal-700 font-sans font-semibold">Inspect evidence →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'alert_detail' && selectedAlert && (
          <AlertInvestigationView
            alert={selectedAlert}
            onBack={() => setCurrentTab('alerts')}
            onAssignAction={handleAssignActionFromAlert}
            currentRole={currentRole}
          />
        )}

        {currentTab === 'actions' && (
          <ActionCenterView
            interventions={interventions}
            onUpdateIntervention={handleUpdateIntervention}
            onCreateIntervention={() => {}}
            currentRole={currentRole}
          />
        )}

        {currentTab === 'validation' && <ValidationLabView />}

        {currentTab === 'quality' && <DataQualityView />}

        {currentTab === 'privacy' && (
          <PrivacyAuditView
            currentRole={currentRole}
            onRoleChange={setCurrentRole}
            auditLogs={auditLogs}
            smallCellThreshold={smallCellThreshold}
            onThresholdChange={setSmallCellThreshold}
          />
        )}

        {currentTab === 'docs' && <TechDocsView />}
      </main>

      {/* Guided Heat-Risk Demo Modal */}
      <GuidedDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onJumpToTab={(tab) => {
          setIsDemoOpen(false);
          setCurrentTab(tab);
        }}
      />
    </div>
  );
}
