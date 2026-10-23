/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Activity,
  Cpu,
  UserCheck,
  CheckSquare,
  Square,
  TrendingDown,
} from 'lucide-react';

interface GuidedDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToTab: (tab: string) => void;
}

export const GuidedDemoModal: React.FC<GuidedDemoModalProps> = ({
  isOpen,
  onClose,
  onJumpToTab,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [taskCompleted, setTaskCompleted] = useState<boolean>(false);
  const [contrastingView, setContrastingView] = useState<boolean>(false);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: '1. Ingestion & Baseline Calibration',
      description: 'System loads 90 days of synthetic observations for 4 sectors and calculates rolling 21-day MAD historical baselines.',
    },
    {
      step: 2,
      title: '2. Emerging Environmental Heat Wave',
      description: 'In Sector AREA-01 (Metro Logistics Port), ambient heat index climbs from baseline 82.4°F to an extreme 104.2°F (Z = +4.8).',
    },
    {
      step: 3,
      title: '3. Physiological Lag: Healthcare & Workplace Surge',
      description: 'After an 18-hour delay, aggregated clinic visits surge 3.8x (14/day) and workplace heat near-miss incidents jump to 5.8/day.',
    },
    {
      step: 4,
      title: '4. Multi-Signal Corroboration Engine',
      description: 'The detection engine combines all 3 independent signal categories. Corroboration multiplier applies 1.35x boost, elevating risk score to 88/100 (Urgent Review).',
    },
    {
      step: 5,
      title: '5. Signal-to-Action Copilot Briefing',
      description: 'Translates validated evidence into an 8-part actionable briefing with recommended preventive cooling protocols and clear ownership.',
    },
    {
      step: 6,
      title: '6. Role Assignment & Preventive Action',
      description: 'Assigned to Occupational Safety Lead Marcus Vance with an operational response deadline of 4 hours.',
    },
    {
      step: 7,
      title: '7. Checklist Execution & Post-Action Follow-Up',
      description: 'Safety lead deploys shaded rest canopies and chilled electrolyte totes. Subsequent 48-hour follow-up demonstrates 41.2% signal moderation.',
    },
    {
      step: 8,
      title: '8. Contrast: Sensor Fault Resilience Test',
      description: 'Contrasting single-sensor thermistor fault (119°F in AREA-02) is successfully demoted to Monitor level, preventing an expensive false alarm!',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">
                One-Click Heat-Risk Scenario Demonstration
              </h2>
              <p className="text-[11px] text-slate-400">
                End-to-End Walkthrough: Signal Ingestion → Corroboration → Action → Verification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            aria-label="Close walkthrough"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 font-mono">
          <span>Step {currentStep} of {steps.length}</span>
          <div className="flex gap-1.5">
            {steps.map((s) => (
              <span
                key={s.step}
                className={`w-5 h-1.5 rounded-full transition-colors ${
                  s.step <= currentStep ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block">
              {steps[currentStep - 1].title}
            </span>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {/* Interactive Step Content */}
          {currentStep === 1 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 font-mono text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Dataset:</span>
                <span className="font-bold text-slate-900">3,960 synthetic observations across 4 sectors</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Baseline Window:</span>
                <span className="font-bold text-slate-900">Rolling 21-day median & MAD calculation</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Data Completeness:</span>
                <span className="font-bold text-emerald-700">100% (No missing feeds in baseline)</span>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2 text-rose-950 font-mono text-xs">
              <div className="flex justify-between">
                <span>Environmental Heat Index:</span>
                <span className="font-bold text-rose-800">104.2°F (Baseline 82.4°F)</span>
              </div>
              <div className="flex justify-between">
                <span>Robust Z-Score:</span>
                <span className="font-bold text-rose-800">+4.8 Standard Deviations</span>
              </div>
              <div className="flex justify-between">
                <span>WBGT Reading:</span>
                <span className="font-bold text-rose-800">89.5°F (OSHA Flag: Red Condition)</span>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2 text-amber-950 font-mono text-xs">
              <div className="flex justify-between">
                <span>Syndromic Heat Illness Visits:</span>
                <span className="font-bold text-amber-800">14 visits/day (Baseline 2.3/day, +3.8x)</span>
              </div>
              <div className="flex justify-between">
                <span>Workplace Heat Incident Reports:</span>
                <span className="font-bold text-amber-800">5.8 reports/day (Baseline 0.9/day, +3.1x)</span>
              </div>
              <div className="flex justify-between">
                <span>Physiological Lag Detected:</span>
                <span className="font-bold text-slate-700">18.5 hours between heat spike & clinic surge</span>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 font-mono text-xs">
              <div className="flex justify-between text-teal-400">
                <span>Multi-Signal Corroboration:</span>
                <span className="font-bold">3 of 3 Categories Corroborated</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Corroboration Multiplier (C):</span>
                <span>1.35x Empirical Boost</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Normalized Operational Risk:</span>
                <span className="text-xl font-bold text-rose-400">88 / 100</span>
              </div>
              <div className="text-[11px] text-slate-400 font-sans pt-2 border-t border-slate-800">
                Operational Severity Level: <strong className="text-rose-400 font-mono">Urgent Review</strong>. Automatic escalation triggered.
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl space-y-2 text-teal-950 text-xs">
              <h4 className="font-bold uppercase tracking-wider text-[11px] text-teal-800">
                Copilot Proportionate Action Recommendation
              </h4>
              <p className="leading-relaxed">
                Mandate 15-minute shaded cooling rest per 45 minutes of heavy cargo rigging. Restock chilled electrolyte totes at Port Berths 4-8. Alert Port Urgent Care partners.
              </p>
              <div className="text-[11px] text-teal-800 font-mono pt-1">
                Ownership: Occupational Health & Safety Lead (Marcus Vance) · Deadline: 4 Hours
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center gap-2 font-semibold text-slate-900">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>Assigned to Marcus Vance (Occupational Safety Lead)</span>
              </div>
              <p className="text-slate-600">
                Notification dispatched via secure operational routing. Response ticket INT-01 created with automated audit hash verification.
              </p>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-3">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 text-xs">
                <span className="font-semibold text-slate-900 block">Interactive Task Verification:</span>
                <div
                  onClick={() => setTaskCompleted(!taskCompleted)}
                  className="flex items-center gap-2 p-2 rounded bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100"
                >
                  {taskCompleted ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span className={taskCompleted ? 'line-through text-slate-500 font-medium' : 'font-medium text-slate-900'}>
                    Deploy 4 mobile shade canopy trailers & chilled electrolyte totes along Berths 4-8
                  </span>
                </div>
              </div>

              <div className="p-4 bg-teal-50/50 border border-teal-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-teal-900">
                  <span className="flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-teal-700" />
                    Subsequent 48-Hour Observation
                  </span>
                  <span className="font-mono text-teal-700">-41.2% delta</span>
                </div>
                <p className="text-teal-950 leading-relaxed">
                  Aggregated heat exhaustion clinic presentations returned from 14/day down to 3.2/day following shift restructuring and hydration mandates.
                </p>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Contrasting Sensor Fault Resilience Test
                </span>
                <span className="text-emerald-700 font-semibold font-mono">Resilience Pass</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                When agricultural sensor ENV-09 spiked to 119°F with zero corroboration from clinics or field teams, SentinelHealth AI applied the 0.38x uncorroborated penalty and classified it as a localized "Sensor Fault / Calibration Audit", completely avoiding an expensive, disruptive false alert!
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(1)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
              >
                Previous
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onJumpToTab('validation');
                }}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
              >
                <span>View Full Validation Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
