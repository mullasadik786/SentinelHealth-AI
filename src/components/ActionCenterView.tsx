/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Intervention, ChecklistItem, UserRole } from '../types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Send,
  ShieldCheck,
  CheckSquare,
  Square,
  MessageSquare,
  TrendingDown,
  Info,
} from 'lucide-react';

interface ActionCenterViewProps {
  interventions: Intervention[];
  onUpdateIntervention: (intervention: Intervention) => void;
  onCreateIntervention: (intervention: Partial<Intervention>) => void;
  currentRole: UserRole;
}

export const ActionCenterView: React.FC<ActionCenterViewProps> = ({
  interventions,
  onUpdateIntervention,
  onCreateIntervention,
  currentRole,
}) => {
  const [selectedIntId, setSelectedIntId] = useState<string>(interventions[0]?.id || 'INT-01');
  const [newNoteText, setNewNoteText] = useState<string>('');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('all');

  const selectedInt = interventions.find((i) => i.id === selectedIntId) || interventions[0];

  const handleToggleChecklist = (checkId: string) => {
    if (!selectedInt) return;
    const updatedChecklist = selectedInt.checklist.map((item) => {
      if (item.id === checkId) {
        return {
          ...item,
          completed: !item.completed,
          completedAt: !item.completed ? new Date().toISOString() : undefined,
          completedBy: !item.completed ? 'Authorized Lead' : undefined,
        };
      }
      return item;
    });

    const allDone = updatedChecklist.every((c) => c.completed);
    const updatedInt: Intervention = {
      ...selectedInt,
      checklist: updatedChecklist,
      status: allDone ? 'Completed' : 'In Progress',
      completedAt: allDone ? new Date().toISOString() : undefined,
    };

    onUpdateIntervention(updatedInt);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedInt) return;

    const newNote = {
      id: `n-${Date.now().toString().slice(-4)}`,
      author: 'Marcus Vance',
      authorRole: 'Occupational Safety Lead',
      timestamp: new Date().toISOString(),
      text: newNoteText.trim(),
    };

    const updatedInt: Intervention = {
      ...selectedInt,
      notes: [...selectedInt.notes, newNote],
    };

    onUpdateIntervention(updatedInt);
    setNewNoteText('');
  };

  const handleStatusChange = (newStatus: Intervention['status']) => {
    if (!selectedInt) return;
    const updatedInt: Intervention = {
      ...selectedInt,
      status: newStatus,
      completedAt: newStatus === 'Completed' ? new Date().toISOString() : undefined,
    };
    onUpdateIntervention(updatedInt);
  };

  const filteredInterventions = interventions.filter((i) => {
    if (activeStatusFilter === 'all') return true;
    if (activeStatusFilter === 'in_progress') return i.status === 'In Progress' || i.status === 'Action Approved';
    if (activeStatusFilter === 'completed') return i.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Intervention Management & Verification Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Track operational execution of preventive actions, completion checklists, and post-action signal trajectory.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveStatusFilter('all')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Interventions ({interventions.length})
          </button>
          <button
            onClick={() => setActiveStatusFilter('in_progress')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeStatusFilter === 'in_progress' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Tasks
          </button>
          <button
            onClick={() => setActiveStatusFilter('completed')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              activeStatusFilter === 'completed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Main Split: Task List vs Task Detail & Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interventions List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900">Preventive Tasks</h2>
          <div className="space-y-2.5">
            {filteredInterventions.map((item) => {
              const isSelected = selectedIntId === item.id;
              const isComplete = item.status === 'Completed';
              const completedCount = item.checklist.filter((c) => c.completed).length;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedIntId(item.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">{item.id}</span>
                    <span
                      className={`font-semibold ${
                        isComplete ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-1">{item.title}</h3>
                  <div className="mt-1 text-xs text-slate-600 flex items-center gap-1.5">
                    <span>{item.areaName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.assigneeName}</span>
                  </div>

                  {/* Checklist mini indicator */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Checklist: {completedCount}/{item.checklist.length}</span>
                    <span>Priority: {item.priority}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Intervention Detail & Checklist */}
        {selectedInt ? (
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono">{selectedInt.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>Linked to {selectedInt.alertId}</span>
                    <span aria-hidden="true">·</span>
                    <span>{selectedInt.areaName}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedInt.title}</h2>
                  <div className="mt-1 text-xs text-slate-600 flex items-center gap-3">
                    <span>Assigned to: <strong className="text-slate-800">{selectedInt.assigneeName}</strong></span>
                    <span>·</span>
                    <span>Role: <strong className="text-slate-800">{selectedInt.assignedRole}</strong></span>
                  </div>
                </div>

                {/* Status Switcher Dropdown */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-slate-500">Status:</span>
                  <select
                    value={selectedInt.status}
                    onChange={(e) => handleStatusChange(e.target.value as Intervention['status'])}
                    className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
                    aria-label="Update intervention status"
                  >
                    <option value="Pending Review">Pending Review</option>
                    <option value="Action Approved">Action Approved</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Escalated">Escalated</option>
                  </select>
                </div>
              </div>

              {/* Action Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    Preventive Task Checklist
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {selectedInt.checklist.filter((c) => c.completed).length} of {selectedInt.checklist.length} verified
                  </span>
                </div>

                <div className="space-y-2">
                  {selectedInt.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleChecklist(item.id)}
                      className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${
                        item.completed
                          ? 'bg-emerald-50/30 border-emerald-200 text-slate-700'
                          : 'bg-slate-50/50 border-slate-200 text-slate-900 hover:bg-slate-100/50'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-teal-600 focus:outline-none"
                        aria-label={`Toggle ${item.label}`}
                      >
                        {item.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <div className="text-xs space-y-0.5">
                        <span className={item.completed ? 'line-through text-slate-500' : 'font-medium'}>
                          {item.label}
                        </span>
                        {item.completedAt && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            Verified {item.completedAt.slice(11, 16)} UTC by {item.completedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Post-Action Outcome Assessment & Verification Loop */}
              {selectedInt.outcomeAssessment && (
                <div className="p-4 bg-teal-50/40 border border-teal-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-teal-900 flex items-center gap-1.5 uppercase text-[11px]">
                      <TrendingDown className="w-4 h-4 text-teal-700" />
                      Post-Intervention Trajectory (48-Hour Follow-Up)
                    </span>
                    <span className="font-mono font-bold text-teal-700 tabular-nums">
                      {selectedInt.outcomeAssessment.postActionMeanDeltaPct}% signal delta
                    </span>
                  </div>
                  <p className="text-teal-950 leading-relaxed font-medium">
                    {selectedInt.outcomeAssessment.evaluationNotes}
                  </p>
                  <p className="text-slate-500 text-[11px] pt-1 border-t border-teal-100">
                    <strong className="text-slate-600">Epidemiological Disclaimer:</strong> {selectedInt.outcomeAssessment.epidemiologicalDisclaimer}
                  </p>
                </div>
              )}

              {/* Action Log / Notes */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Field Communications & Incident Notes
                </h3>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedInt.notes.map((note) => (
                    <div key={note.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-semibold text-slate-800">{note.author} ({note.authorRole})</span>
                        <span className="font-mono">{note.timestamp.slice(11, 16)} UTC</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{note.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Log a field inspection note or hydration delivery update..."
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Log Note</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500">
            Select an intervention from the left list to review checklist and action outcomes.
          </div>
        )}
      </div>
    </div>
  );
};
