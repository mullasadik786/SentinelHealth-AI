/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MonitoringArea, SignalDefinition, SignalObservation, GroundTruthEvent } from '../types';

export const MONITORING_AREAS: MonitoringArea[] = [
  {
    id: 'AREA-01',
    name: 'Metro Logistics & Port Hub',
    code: 'METRO-PORT-01',
    sector: 'Logistics & Port',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    baselineWorkerPopulation: 3400,
    activeSensorsCount: 18,
    primaryRiskProfile: 'Outdoor container loading, tarmac heat re-radiation, forklift operations',
    currentRiskScore: 88,
    currentLevel: 'Urgent Review',
    lastUpdated: '2026-10-23T06:30:00Z',
  },
  {
    id: 'AREA-02',
    name: 'Central Agricultural Basin',
    code: 'AGRI-VALLEY-02',
    sector: 'Agriculture & Field',
    coordinates: { lat: 36.7783, lng: -119.4179 },
    baselineWorkerPopulation: 2850,
    activeSensorsCount: 14,
    primaryRiskProfile: 'Direct solar radiation, manual harvesting, pesticide spraying windows',
    currentRiskScore: 28,
    currentLevel: 'Monitor',
    lastUpdated: '2026-10-23T06:45:00Z',
  },
  {
    id: 'AREA-03',
    name: 'Iron Belt Heavy Manufacturing',
    code: 'MFG-BELT-03',
    sector: 'Heavy Manufacturing',
    coordinates: { lat: 37.3382, lng: -121.8863 },
    baselineWorkerPopulation: 4100,
    activeSensorsCount: 22,
    primaryRiskProfile: 'Foundry radiant heat, particulate emissions, confined machinery halls',
    currentRiskScore: 42,
    currentLevel: 'Monitor',
    lastUpdated: '2026-10-23T07:15:00Z',
  },
  {
    id: 'AREA-04',
    name: 'Coastal Infrastructure & Highway Works',
    code: 'CIVIL-CORRIDOR-04',
    sector: 'Construction Corridor',
    coordinates: { lat: 37.8044, lng: -122.2712 },
    baselineWorkerPopulation: 2200,
    activeSensorsCount: 12,
    primaryRiskProfile: 'Asphalt paving, trenching, unshaded linear worksites',
    currentRiskScore: 56,
    currentLevel: 'Elevated',
    lastUpdated: '2026-10-23T05:00:00Z',
  },
];

export const SIGNAL_DEFINITIONS: SignalDefinition[] = [
  // Environmental Signals
  {
    id: 'env_heat_index',
    name: 'Environmental Heat Index',
    category: 'environmental',
    unit: '°F',
    baselineMean: 82.4,
    baselineStd: 4.8,
    updateFrequencyHours: 1,
    description: 'Apparent temperature combining ambient dry bulb temperature and relative humidity.',
    warningThreshold: 91.0,
    criticalThreshold: 103.0,
  },
  {
    id: 'env_wbgt',
    name: 'Wet Bulb Globe Temperature (WBGT)',
    category: 'environmental',
    unit: '°F',
    baselineMean: 74.5,
    baselineStd: 3.6,
    updateFrequencyHours: 1,
    description: 'Comprehensive occupational heat stress metric accounting for radiant sun load and wind.',
    warningThreshold: 82.0,
    criticalThreshold: 88.0,
  },
  {
    id: 'env_pm25',
    name: 'Fine Particulate Matter (PM2.5)',
    category: 'environmental',
    unit: 'µg/m³',
    baselineMean: 17.5,
    baselineStd: 5.8,
    updateFrequencyHours: 1,
    description: 'Microscopic inhalable combustion and dust particles measured by ambient air monitors.',
    warningThreshold: 35.0,
    criticalThreshold: 55.0,
  },

  // Healthcare Services Signals (Aggregated, De-identified)
  {
    id: 'health_heat_illness_visits',
    name: 'Aggregated Syndromic Heat Illness Visits',
    category: 'healthcare',
    unit: 'visits/day',
    baselineMean: 2.3,
    baselineStd: 1.2,
    updateFrequencyHours: 6,
    description: 'De-identified clinic and urgent-care presentations with ICD/SNOMED codes for heat exhaustion, syncope, or dehydration.',
    warningThreshold: 6.0,
    criticalThreshold: 11.0,
  },
  {
    id: 'health_respiratory_visits',
    name: 'Aggregated Acute Respiratory Consults',
    category: 'healthcare',
    unit: 'visits/day',
    baselineMean: 8.6,
    baselineStd: 2.5,
    updateFrequencyHours: 12,
    description: 'Aggregated area primary care presentations for bronchospasm, asthma exacerbation, and acute cough.',
    warningThreshold: 15.0,
    criticalThreshold: 22.0,
  },
  {
    id: 'health_ed_severe_triages',
    name: 'Emergency Dept Severe Occupational Triages',
    category: 'healthcare',
    unit: 'triages/day',
    baselineMean: 1.1,
    baselineStd: 0.8,
    updateFrequencyHours: 6,
    description: 'Aggregated hospital emergency department triage Category 1-2 for occupational acute collapse or heat stroke.',
    warningThreshold: 3.0,
    criticalThreshold: 6.0,
  },

  // Workplace & Operational Signals (Aggregated)
  {
    id: 'work_sickness_absence_rate',
    name: 'Aggregated Sickness Absence Rate',
    category: 'workplace',
    unit: '%',
    baselineMean: 3.2,
    baselineStd: 0.7,
    updateFrequencyHours: 24,
    description: 'Proportion of scheduled outdoor worker shifts missed due to reported medical/physical illness.',
    warningThreshold: 5.0,
    criticalThreshold: 7.5,
  },
  {
    id: 'work_heat_cramps_incidents',
    name: 'Workplace Heat Strain & Near-Miss Reports',
    category: 'workplace',
    unit: 'reports/day',
    baselineMean: 0.9,
    baselineStd: 0.7,
    updateFrequencyHours: 8,
    description: 'Anonymous site safety officer and peer reports of heat cramps, dizziness, or enforced early cool-down stops.',
    warningThreshold: 3.0,
    criticalThreshold: 5.5,
  },
  {
    id: 'work_unmitigated_outdoor_hours',
    name: 'Aggregate High-Exertion Exposure Hours',
    category: 'workplace',
    unit: 'worker-hrs',
    baselineMean: 1420,
    baselineStd: 160,
    updateFrequencyHours: 24,
    description: 'Total cumulative hours logged in unshaded, non-air-conditioned work zones across the monitoring area.',
    warningThreshold: 1800,
    criticalThreshold: 2200,
  },
];

// Seeded pseudorandom generator for complete repeatability
class PseudoRng {
  private s: number;
  constructor(seed = 19840315) {
    this.s = seed;
  }
  next(): number {
    this.s = (this.s * 1664525 + 1013904223) % 4294967296;
    return this.s / 4294967296;
  }
  gaussian(mean = 0, std = 1): number {
    const u = Math.max(1e-7, this.next());
    const v = this.next();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * std;
  }
}

export const GROUND_TRUTH_EVENTS: GroundTruthEvent[] = [
  {
    id: 'GT-01',
    name: 'Severe Mid-Summer Maritime Tarmac Heat Wave',
    scenarioId: 'heat_risk_wave',
    areaId: 'AREA-01',
    startDate: '2026-10-15',
    endDate: '2026-10-22',
    description: 'Sustained 7-day marine inversion trapping extreme heat (heat index 104°F) causing a 3.8x surge in heat exhaustion and 3.1x rise in workplace incidents.',
    detectedAt: '2026-10-16T10:00:00Z',
    detectionLeadTimeHours: 18,
    wasDetected: true,
    classification: 'True Positive',
  },
  {
    id: 'GT-02',
    name: 'Industrial Basin Particulate Emission Inversion',
    scenarioId: 'air_quality_crisis',
    areaId: 'AREA-03',
    startDate: '2026-09-08',
    endDate: '2026-09-14',
    description: 'Temperature inversion combined with foundry emissions elevated PM2.5 to 78 µg/m³, resulting in respiratory clinic surge.',
    detectedAt: '2026-09-09T08:00:00Z',
    detectionLeadTimeHours: 24,
    wasDetected: true,
    classification: 'True Positive',
  },
  {
    id: 'GT-03',
    name: 'Basin Sensor Node ENV-09 Thermistor Ground Short (False Alarm Test)',
    scenarioId: 'sensor_fault_anomaly',
    areaId: 'AREA-02',
    startDate: '2026-09-24',
    endDate: '2026-09-25',
    description: 'Isolated agricultural weather station thermistor malfunctioned reading 119°F for 12 hours. Zero corroboration from clinics or field teams.',
    wasDetected: false, // Correctly rejected from Urgent alert
    classification: 'True Positive', // System accurately identified as Sensor Audit rather than population health emergency
  },
  {
    id: 'GT-04',
    name: 'Regional EHR Gateway Outage & Telemetry Lag',
    scenarioId: 'delayed_missing_feed',
    areaId: 'AREA-04',
    startDate: '2026-10-19',
    endDate: '2026-10-23',
    description: 'Hospital network upgrade severed syndicated syndromic feeds for 4 days, inducing high data uncertainty while environmental heat rose.',
    detectedAt: '2026-10-20T14:00:00Z',
    detectionLeadTimeHours: 12,
    wasDetected: true,
    classification: 'True Positive',
  },
];

/**
 * Generates 90 days of reproducible daily synthetic observations.
 */
export function generateSyntheticObservations(): SignalObservation[] {
  const rng = new PseudoRng(42);
  const observations: SignalObservation[] = [];
  const TOTAL_DAYS = 90;
  const BASE_DATE = new Date('2026-07-25T00:00:00Z');

  for (let day = 0; day < TOTAL_DAYS; day++) {
    const curDate = new Date(BASE_DATE.getTime() + day * 86400000);
    const dateStr = curDate.toISOString().split('T')[0];
    const dayOfWeek = curDate.getUTCDay(); // 0 is Sunday, 6 is Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    for (const area of MONITORING_AREAS) {
      for (const signal of SIGNAL_DEFINITIONS) {
        let value = rng.gaussian(signal.baselineMean, signal.baselineStd * 0.45);
        let isSimulated = true;
        let isMissing = false;
        let dataQuality = 0.96 + rng.next() * 0.04;
        let reportingLagHours = signal.updateFrequencyHours;

        // Apply weekend effect for workplace & clinic operations
        if (isWeekend) {
          if (signal.category === 'workplace') {
            value *= 0.35; // reduced weekend shifts
          } else if (signal.category === 'healthcare' && signal.id !== 'health_ed_severe_triages') {
            value *= 0.65; // primary care clinics reduced weekend hours
          }
        }

        // ==========================================
        // INJECT SCENARIO 1: Heat wave in AREA-01 (Days 75 to 83)
        // ==========================================
        if (area.id === 'AREA-01' && day >= 75 && day <= 83) {
          const heatPeakMultiplier = 1.0 - Math.abs(day - 79) * 0.12;
          if (signal.id === 'env_heat_index') {
            value = 97.0 + 8.5 * heatPeakMultiplier + rng.gaussian(0, 1.2);
          } else if (signal.id === 'env_wbgt') {
            value = 85.0 + 4.5 * heatPeakMultiplier + rng.gaussian(0, 0.8);
          } else if (signal.id === 'health_heat_illness_visits') {
            // Physiological lag: peaks 1-2 days after environmental peak
            const healthLagMult = Math.max(0.1, 1.0 - Math.abs(day - 80) * 0.15);
            value = signal.baselineMean + 11.5 * healthLagMult + rng.gaussian(0, 1.0);
          } else if (signal.id === 'health_ed_severe_triages') {
            const triageMult = Math.max(0, 1.0 - Math.abs(day - 80) * 0.2);
            value = signal.baselineMean + 4.2 * triageMult + rng.gaussian(0, 0.5);
          } else if (signal.id === 'work_heat_cramps_incidents') {
            const workLagMult = Math.max(0.1, 1.0 - Math.abs(day - 79.5) * 0.15);
            value = signal.baselineMean + 4.8 * workLagMult + rng.gaussian(0, 0.6);
          } else if (signal.id === 'work_sickness_absence_rate') {
            value = signal.baselineMean + 4.1 * Math.max(0, 1.0 - Math.abs(day - 81) * 0.18);
          }
        }

        // ==========================================
        // INJECT SCENARIO 2: PM2.5 Crisis in AREA-03 (Days 42 to 49)
        // ==========================================
        if (area.id === 'AREA-03' && day >= 42 && day <= 49) {
          const airPeak = 1.0 - Math.abs(day - 45) * 0.18;
          if (signal.id === 'env_pm25') {
            value = 45.0 + 38.0 * airPeak + rng.gaussian(0, 2.5);
          } else if (signal.id === 'health_respiratory_visits') {
            const respLag = Math.max(0.1, 1.0 - Math.abs(day - 46) * 0.18);
            value = signal.baselineMean + 14.5 * respLag + rng.gaussian(0, 1.5);
          }
        }

        // ==========================================
        // INJECT SCENARIO 3: Isolated Sensor Fault in AREA-02 (Day 61)
        // Single extreme temperature spike without clinic or workplace corroboration
        // ==========================================
        if (area.id === 'AREA-02' && day === 61) {
          if (signal.id === 'env_heat_index') {
            value = 119.4; // Extreme spike
            dataQuality = 0.68; // Flagged internal variance
          }
          // Note: clinic and workplace signals intentionally left normal baseline!
        }

        // ==========================================
        // INJECT SCENARIO 4: Missing/Delayed Healthcare Feed in AREA-04 (Days 85 to 89)
        // ==========================================
        if (area.id === 'AREA-04' && day >= 85) {
          if (signal.category === 'healthcare') {
            isMissing = true;
            dataQuality = 0.15;
            reportingLagHours = (day - 85) * 24 + 18;
            value = -1; // Missing indicator (not zero!)
          } else if (signal.id === 'env_heat_index') {
            value = 92.8 + rng.gaussian(0, 1.0); // moderate heat
          }
        }

        // Bound values realistically
        if (!isMissing) {
          if (signal.unit === '%' || signal.id === 'work_sickness_absence_rate') {
            value = Math.max(0.2, Math.min(25, value));
          } else if (signal.unit.includes('visits') || signal.unit.includes('triages') || signal.unit.includes('reports')) {
            value = Math.max(0, Math.round(value * 10) / 10);
          } else {
            value = Math.max(0, Math.round(value * 10) / 10);
          }
        }

        const zScore = isMissing
          ? 0
          : (value - signal.baselineMean) / (signal.baselineStd || 1);

        observations.push({
          areaId: area.id,
          signalId: signal.id,
          timestamp: `${dateStr}T12:00:00Z`,
          value,
          baselineMean: signal.baselineMean,
          baselineStd: signal.baselineStd,
          zScore: Math.round(zScore * 100) / 100,
          isSimulated,
          isMissing,
          isStale: reportingLagHours > 24,
          dataQualityScore: Math.round(dataQuality * 100) / 100,
          reportingLagHours,
        });
      }
    }
  }

  return observations;
}
