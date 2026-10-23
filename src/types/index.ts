/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OperationalLevel = 'Monitor' | 'Elevated' | 'Urgent Review';

export type SignalCategory = 'environmental' | 'healthcare' | 'workplace';

export type UserRole = 
  | 'public_health_analyst'
  | 'occupational_safety_lead'
  | 'clinical_safety_officer'
  | 'compliance_auditor';

export interface MonitoringArea {
  id: string;
  name: string;
  code: string;
  sector: 'Logistics & Port' | 'Agriculture & Field' | 'Heavy Manufacturing' | 'Construction Corridor';
  coordinates: { lat: number; lng: number };
  baselineWorkerPopulation: number;
  activeSensorsCount: number;
  primaryRiskProfile: string;
  currentRiskScore: number;
  currentLevel: OperationalLevel;
  lastUpdated: string;
}

export interface SignalDefinition {
  id: string;
  name: string;
  category: SignalCategory;
  unit: string;
  baselineMean: number;
  baselineStd: number;
  updateFrequencyHours: number;
  description: string;
  warningThreshold: number;
  criticalThreshold: number;
}

export interface SignalObservation {
  areaId: string;
  signalId: string;
  timestamp: string; // ISO string YYYY-MM-DDTHH:mm:ss
  value: number;
  baselineMean: number;
  baselineStd: number;
  zScore: number;
  isSimulated: boolean;
  isMissing: boolean;
  isStale?: boolean;
  dataQualityScore: number; // 0 to 1
  reportingLagHours: number;
}

export interface ContributingSignal {
  signalId: string;
  signalName: string;
  category: SignalCategory;
  currentValue: number;
  baselineValue: number;
  unit: string;
  zScore: number;
  relativeChangePct: number;
  weight: number;
  dataQualityScore: number;
  freshnessHours: number;
  isCorroborated: boolean;
}

export interface CopilotAssessment {
  whatHappened: string;
  whyItMatters: string;
  supportingEvidence: string[];
  recommendedAction: string;
  ownership: string;
  timeframe: string;
  verification: string;
  limitations: string;
  generatedBy: 'gemini-3.8-flash' | 'deterministic-fallback';
  generatedAt: string;
}

export interface Alert {
  id: string;
  areaId: string;
  areaName: string;
  riskCategory: 'Heat-Related Illness' | 'Air Quality & Respiratory' | 'Occupational Physical Strain' | 'Sensor Fault / Calibration';
  operationalLevel: OperationalLevel;
  detectionTimestamp: string;
  observationTimestamp: string;
  riskScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  corroborationFactor: number;
  signalsCorroboratedCount: number;
  signalsTotalCount: number;
  status: 'New' | 'Under Review' | 'Action Approved' | 'In Progress' | 'Resolved' | 'Closed';
  assignedRole: string;
  assignedTo?: string;
  suggestedDeadlineHours: number;
  deadlineTimestamp: string;
  signals: ContributingSignal[];
  copilotAssessment: CopilotAssessment;
  interventionId?: string;
  dataCompletenessPct: number;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface InterventionNote {
  id: string;
  author: string;
  authorRole: string;
  timestamp: string;
  text: string;
}

export interface Intervention {
  id: string;
  alertId: string;
  areaId: string;
  areaName: string;
  title: string;
  priority: 'Urgent' | 'Elevated' | 'Standard';
  status: 'Pending Review' | 'Action Approved' | 'In Progress' | 'Completed' | 'Escalated';
  assignedRole: string;
  assigneeName: string;
  createdAt: string;
  deadline: string;
  checklist: ChecklistItem[];
  notes: InterventionNote[];
  completedAt?: string;
  outcomeAssessment?: {
    signalStabilized: boolean;
    postActionMeanDeltaPct: number;
    evaluationNotes: string;
    epidemiologicalDisclaimer: string;
  };
}

export type ScenarioId = 'heat_risk_wave' | 'air_quality_crisis' | 'sensor_fault_anomaly' | 'delayed_missing_feed';

export interface GroundTruthEvent {
  id: string;
  name: string;
  scenarioId: ScenarioId;
  areaId: string;
  startDate: string;
  endDate: string;
  description: string;
  detectedAt?: string;
  detectionLeadTimeHours?: number;
  wasDetected: boolean;
  classification: 'True Positive' | 'False Negative' | 'False Positive';
}

export interface BacktestMetrics {
  scenarioId: ScenarioId;
  scenarioName: string;
  datasetDays: number;
  totalGroundTruthEvents: number;
  detectedEvents: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  trueNegatives: number;
  sensitivityRecallPct: number;
  precisionPpvPct: number;
  f1Score: number;
  falseAlarmsPerAreaPerWeek: number;
  medianLeadTimeHours: number;
  averageDataLatencyHours: number;
  events: GroundTruthEvent[];
  evaluatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userRole: UserRole;
  userName: string;
  action: string;
  targetId: string;
  targetType: 'Alert' | 'Intervention' | 'ThresholdConfig' | 'Dataset' | 'Export';
  details: string;
  privacySafeHash: string;
}

export interface EngineConfig {
  rollingBaselineDays: number;
  thresholdMonitorZ: number;
  thresholdElevatedZ: number;
  thresholdUrgentZ: number;
  minCorroboratingSignals: number;
  weightEnvironmental: number;
  weightHealthcare: number;
  weightWorkplace: number;
  smallCellSuppressionThreshold: number;
  enableGeminiCopilot: boolean;
  alertDeduplicationWindowHours: number;
}
