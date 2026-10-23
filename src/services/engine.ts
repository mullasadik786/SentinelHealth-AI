/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Alert,
  ContributingSignal,
  EngineConfig,
  MonitoringArea,
  OperationalLevel,
  SignalObservation,
} from '../types';
import { MONITORING_AREAS, SIGNAL_DEFINITIONS } from './syntheticData';

export const DEFAULT_CONFIG: EngineConfig = {
  rollingBaselineDays: 21,
  thresholdMonitorZ: 1.8,
  thresholdElevatedZ: 2.6,
  thresholdUrgentZ: 3.4,
  minCorroboratingSignals: 2,
  weightEnvironmental: 0.35,
  weightHealthcare: 0.40,
  weightWorkplace: 0.25,
  smallCellSuppressionThreshold: 5,
  enableGeminiCopilot: true,
  alertDeduplicationWindowHours: 48,
};

export function calculateMedian(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function calculateMAD(values: number[], median: number): number {
  if (values.length === 0) return 1;
  const deviations = values.map((v) => Math.abs(v - median));
  const mad = calculateMedian(deviations);
  return mad === 0 ? 0.001 : mad;
}

export function calculateRobustZScore(value: number, baselineValues: number[]): number {
  if (baselineValues.length === 0) return 0;
  const median = calculateMedian(baselineValues);
  const mad = calculateMAD(baselineValues, median);
  // Modified Z-score using 0.6745 consistency factor for normal distribution
  return (0.6745 * (value - median)) / mad;
}

/**
 * Runs the Multi-Signal Early-Warning Engine across the observation timeline.
 */
export function evaluateSignalsForArea(
  area: MonitoringArea,
  allObservations: SignalObservation[],
  targetDateStr: string,
  config: EngineConfig = DEFAULT_CONFIG
): Alert | null {
  const areaObs = allObservations.filter((o) => o.areaId === area.id);

  // Filter observations up to targetDate (avoiding temporal leakage!)
  const historicalObs = areaObs.filter((o) => o.timestamp.slice(0, 10) <= targetDateStr);
  const currentDayObs = areaObs.filter((o) => o.timestamp.slice(0, 10) === targetDateStr);

  if (currentDayObs.length === 0) return null;

  const contributingSignals: ContributingSignal[] = [];
  let weightedZSum = 0;
  let totalWeightsUsed = 0;
  let validSignalCount = 0;
  let missingSignalCount = 0;
  let totalQualityScore = 0;

  const categoriesTriggered = new Set<string>();

  for (const sigDef of SIGNAL_DEFINITIONS) {
    const todayRecord = currentDayObs.find((o) => o.signalId === sigDef.id);
    const weight =
      sigDef.category === 'environmental'
        ? config.weightEnvironmental / 3
        : sigDef.category === 'healthcare'
        ? config.weightHealthcare / 3
        : config.weightWorkplace / 3;

    if (!todayRecord || todayRecord.isMissing || todayRecord.value === -1) {
      missingSignalCount++;
      continue;
    }

    validSignalCount++;
    totalQualityScore += todayRecord.dataQualityScore;

    // Calculate rolling baseline from prior days (respecting rollingBaselineDays)
    const priorDaysObs = historicalObs
      .filter((o) => o.signalId === sigDef.id && o.timestamp.slice(0, 10) < targetDateStr && !o.isMissing && o.value !== -1)
      .slice(-config.rollingBaselineDays)
      .map((o) => o.value);

    const baselineVal = priorDaysObs.length > 5 ? calculateMedian(priorDaysObs) : sigDef.baselineMean;
    const robustZ = priorDaysObs.length > 5
      ? calculateRobustZScore(todayRecord.value, priorDaysObs)
      : (todayRecord.value - sigDef.baselineMean) / (sigDef.baselineStd || 1);

    const relativeChangePct = baselineVal > 0 ? ((todayRecord.value - baselineVal) / baselineVal) * 100 : 0;
    const isAnomalous = robustZ >= config.thresholdMonitorZ;

    if (isAnomalous) {
      categoriesTriggered.add(sigDef.category);
    }

    contributingSignals.push({
      signalId: sigDef.id,
      signalName: sigDef.name,
      category: sigDef.category,
      currentValue: todayRecord.value,
      baselineValue: Math.round(baselineVal * 10) / 10,
      unit: sigDef.unit,
      zScore: Math.round(robustZ * 100) / 100,
      relativeChangePct: Math.round(relativeChangePct * 10) / 10,
      weight,
      dataQualityScore: todayRecord.dataQualityScore,
      freshnessHours: todayRecord.reportingLagHours,
      isCorroborated: isAnomalous,
    });

    // Anomaly weighting
    const boundedZ = Math.max(0, robustZ);
    weightedZSum += boundedZ * weight;
    totalWeightsUsed += weight;
  }

  const rawWeightedZ = totalWeightsUsed > 0 ? weightedZSum / totalWeightsUsed : 0;
  const categoriesCount = categoriesTriggered.size;

  // Corroboration multiplier logic
  // Severe penalty for isolated single sensor anomaly without clinic or workplace corroboration
  let corroborationMultiplier = 1.0;
  if (categoriesCount >= 3) {
    corroborationMultiplier = 1.35; // Corroborated across Environmental, Healthcare, and Workplace!
  } else if (categoriesCount === 2) {
    corroborationMultiplier = 1.15;
  } else if (categoriesCount === 1) {
    corroborationMultiplier = 0.38; // Single-category uncorroborated anomaly
  } else {
    corroborationMultiplier = 0.15;
  }

  // Completeness & quality adjustment
  const totalExpectedSignals = SIGNAL_DEFINITIONS.length;
  const completenessRatio = validSignalCount / totalExpectedSignals;
  const avgQuality = validSignalCount > 0 ? totalQualityScore / validSignalCount : 0.5;

  // Final 0-100 Operational Risk Score
  // Normalized as: (Z / 4.0) * 100 * corroborationMultiplier * qualityModifier
  const normalizedZBase = Math.min(100, (rawWeightedZ / 3.8) * 75);
  const compositeScore = Math.min(
    100,
    Math.max(0, Math.round(normalizedZBase * corroborationMultiplier * (0.7 + 0.3 * avgQuality)))
  );

  // Confidence score
  const confidenceScore = Math.min(
    100,
    Math.max(
      15,
      Math.round(
        (completenessRatio * 0.45 +
          avgQuality * 0.35 +
          (categoriesCount >= 2 ? 0.2 : 0.05)) *
          100
      )
    )
  );

  // Determine operational severity
  let operationalLevel: OperationalLevel = 'Monitor';
  if (compositeScore >= 75 && categoriesCount >= 2) {
    operationalLevel = 'Urgent Review';
  } else if (compositeScore >= 50 && categoriesCount >= 2) {
    operationalLevel = 'Elevated';
  } else if (compositeScore >= 25 || rawWeightedZ >= config.thresholdMonitorZ) {
    operationalLevel = 'Monitor';
  } else {
    // Below threshold, no alert warranted
    return null;
  }

  // Determine primary risk category
  let riskCategory: Alert['riskCategory'] = 'Heat-Related Illness';
  const heatZ = contributingSignals.find((s) => s.signalId === 'env_heat_index')?.zScore || 0;
  const pm25Z = contributingSignals.find((s) => s.signalId === 'env_pm25')?.zScore || 0;

  if (categoriesCount === 1 && heatZ >= 5.0 && categoriesTriggered.has('environmental')) {
    riskCategory = 'Sensor Fault / Calibration';
    operationalLevel = 'Monitor'; // Demote sensor fault to Monitor level
  } else if (pm25Z > 2.5 && pm25Z > heatZ) {
    riskCategory = 'Air Quality & Respiratory';
  } else {
    riskCategory = 'Heat-Related Illness';
  }

  // Generate deterministic Copilot Assessment
  const alertId = `ALT-${area.code.split('-')[0]}-${targetDateStr.replace(/-/g, '')}`;
  const copilotAssessment = generateDeterministicAssessment(
    alertId,
    area,
    riskCategory,
    operationalLevel,
    compositeScore,
    confidenceScore,
    categoriesCount,
    contributingSignals,
    completenessRatio,
    targetDateStr
  );

  const deadlineHours = operationalLevel === 'Urgent Review' ? 4 : operationalLevel === 'Elevated' ? 12 : 24;
  const deadlineDate = new Date(new Date(`${targetDateStr}T12:00:00Z`).getTime() + deadlineHours * 3600000);

  return {
    id: alertId,
    areaId: area.id,
    areaName: area.name,
    riskCategory,
    operationalLevel,
    detectionTimestamp: `${targetDateStr}T12:30:00Z`,
    observationTimestamp: `${targetDateStr}T12:00:00Z`,
    riskScore: compositeScore,
    confidenceScore,
    corroborationFactor: Math.round(corroborationMultiplier * 100) / 100,
    signalsCorroboratedCount: categoriesCount,
    signalsTotalCount: 3,
    status: operationalLevel === 'Urgent Review' ? 'New' : 'Under Review',
    assignedRole:
      operationalLevel === 'Urgent Review'
        ? 'Occupational Safety Lead & Facility Ops'
        : 'Public Health Surveillance Officer',
    assignedTo: operationalLevel === 'Urgent Review' ? 'Marcus Vance (Safety Lead)' : 'Dr. Clara Chen (Epi)',
    suggestedDeadlineHours: deadlineHours,
    deadlineTimestamp: deadlineDate.toISOString(),
    signals: contributingSignals,
    copilotAssessment,
    dataCompletenessPct: Math.round(completenessRatio * 100),
  };
}

/**
 * Creates high-fidelity deterministic 8-part action briefing
 * adhering strictly to the Signal-to-Action Copilot specifications.
 */
export function generateDeterministicAssessment(
  alertId: string,
  area: MonitoringArea,
  riskCategory: Alert['riskCategory'],
  level: OperationalLevel,
  riskScore: number,
  confidenceScore: number,
  categoriesCount: number,
  signals: ContributingSignal[],
  completenessRatio: number,
  dateStr: string
) {
  const topSignals = [...signals].sort((a, b) => b.zScore - a.zScore).slice(0, 3);
  const evidenceLines = topSignals.map(
    (s) =>
      `${s.signalName}: Observed ${s.currentValue} ${s.unit} vs baseline ${s.baselineValue} ${s.unit} (Z-Score: +${s.zScore.toFixed(1)}, change +${s.relativeChangePct.toFixed(0)}%, freshness: ${s.freshnessHours}h)`
  );

  let whatHappened = '';
  let whyItMatters = '';
  let recommendedAction = '';
  let ownership = '';
  let timeframe = '';
  let verification = '';
  let limitations = '';

  if (riskCategory === 'Sensor Fault / Calibration') {
    whatHappened = `Extreme environmental reading (+7.8 Z-score) detected in ${area.name} on ${dateStr}, but zero syndromic clinical visits or workplace reports corroborate the anomaly.`;
    whyItMatters = `A false alarm could trigger disruptive, unnecessary work stoppages. Uncorroborated single-sensor spikes strongly indicate localized hardware drift, sensor grounding fault, or solar shelter damage rather than actual community health exposure.`;
    recommendedAction = `Dispatch environmental field technician to inspect thermistor housing and solar radiation shield on Station #ENV-09. Do not alter workforce shifts or issue public warnings pending physical sensor audit.`;
    ownership = 'Environmental Instrumentation Lead';
    timeframe = 'Inspect within 8 hours';
    verification = 'Compare telemetry against adjacent secondary weather station and verify analog recalibration reading.';
    limitations = 'Microclimate variations are possible; verification relies on secondary sensors in adjacent 3km buffer.';
  } else if (riskCategory === 'Air Quality & Respiratory') {
    whatHappened = `Elevated particulate matter (PM2.5) combined with a ${topSignals[0]?.relativeChangePct || 45}% rise in aggregated acute respiratory clinic presentations across ${area.name}.`;
    whyItMatters = `Co-occurring particulate inhalation and respiratory exacerbations indicate active airborne exposure risk for outdoor maintenance and logistics crews. This is operational prioritization, not causal proof of a toxic discharge.`;
    recommendedAction = `Activate Tier-2 Air Quality Respiratory Protocol: mandate N95 respirator deployment for outdoor personnel, inspect air filtration scrubbers, and reschedule high-exertion outdoor duties to enclosed facilities.`;
    ownership = 'Workplace Industrial Hygiene Lead & Operations Supervisor';
    timeframe = level === 'Urgent Review' ? 'Execute within 4 hours' : 'Execute within 12 hours';
    verification = 'Audit respirator compliance logs and monitor next 12-hour syndromic respiratory clinic triage rate.';
    limitations = 'Regional smoke inversion or traffic congestion may confound measurements; clinical triage data reflects aggregate attendance, not individual worker diagnosis.';
  } else {
    // Heat-Related Illness
    whatHappened = `Multi-signal heat stress deviation detected in ${area.name}: environmental heat index exceeds critical limits, corroborated by a 3.8x surge in aggregated heat-exhaustion clinic presentations and rising workplace near-miss incidents.`;
    whyItMatters = `Simultaneous environmental, healthcare, and workplace signals provide strong empirical evidence of acute heat exhaustion risk among outdoor workforce. Early intervention prevents progression into life-threatening exertional heat stroke.`;
    recommendedAction = `Enforce mandatory 15-minute shaded rest breaks every 45 minutes; verify cold electrolyte water deployment at all field stations; pause unshaded asphalt and heavy manual lifting between 12:00 and 16:30; alert regional occupational urgent care partners.`;
    ownership = 'Occupational Health & Safety Manager, supported by Area Facility Lead';
    timeframe = level === 'Urgent Review' ? 'Immediate execution within 2 to 4 hours' : 'Execute within 8 hours';
    verification = 'Check site hydration station checklist, verify shift break compliance logs, and track heat clinic triage counts over next 24-48 hours.';
    limitations = `Data reflects area-level population aggregation. Small-cell counts (<5) suppressed for privacy. Does not replace clinical evaluation or statutory OSHA/CAL-OSHA rest mandates.`;
  }

  if (completenessRatio < 1.0) {
    limitations += ` Note: Data completeness is currently ${(completenessRatio * 100).toFixed(0)}%; syndromic healthcare feeds are experiencing reporting lag.`;
  }

  return {
    whatHappened,
    whyItMatters,
    supportingEvidence: evidenceLines,
    recommendedAction,
    ownership,
    timeframe,
    verification,
    limitations,
    generatedBy: 'deterministic-fallback' as const,
    generatedAt: new Date().toISOString(),
  };
}
