import React, { useState } from 'react';
import { Project, RFIItem } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import {
  HelpCircle,
  Plus,
  Search,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  UserCheck,
  Send,
  MessageSquare,
} from 'lucide-react';

interface ProjectRFITabProps {
  project: Project;
  rfis: RFIItem[];
}

export const ProjectRFITab: React.FC<ProjectRFITabProps> = ({ project, rfis }) => {
  const { createRFI, updateRFIStatus } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeResponseRfi, setActiveResponseRfi] = useState<RFIItem | null>(null);
  const [responseText, setResponseText] = useState('');

  // Form State for new RFI
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [discipline, setDiscipline] = useState<RFIItem['discipline']>('structural');
  const [priority, setPriority] = useState<RFIItem['priority']>('high');
  const [assignedTo, setAssignedTo] = useState('VMS Structural Consultants');
  const [drawingRef, setDrawingRef] = useState('STR-TYP-COL-04');

  const filteredRFIs = rfis.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        (r.subject || '').toLowerCase().includes(q) ||
        r.rfiNumber.toLowerCase().includes(q) ||
        r.question.toLowerCase().includes(q) ||
        (r.drawingRef && r.drawingRef.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleRaiseRFI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !question.trim()) return;

    createRFI({
      projectId: project.id,
      projectName: project.name,
      subject,
      question,
      discipline,
      priority,
      assignedTo,
      drawingRef,
      dateRaised: new Date().toISOString().slice(0, 10),
      raisedBy: project.siteEngineer,
      status: 'open',
    });

    setSubject('');
    setQuestion('');
    setIsAddModalOpen(false);
  };

  const handleResolveRFI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeResponseRfi || !responseText.trim()) return;

    updateRFIStatus(activeResponseRfi.id, 'closed', responseText, 'Chief Consultant');
    setActiveResponseRfi(null);
    setResponseText('');
  };

  const overdueCount = rfis.filter((r) => r.daysOpen > 7 && r.status !== 'closed').length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            Request For Information (RFI) Technical Tracker
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Architectural and structural clarifications with automatic &gt;7-day delay flags
          </p>
        </div>

        <div className="flex items-center gap-3">
          {overdueCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              {overdueCount} Clarifications Overdue (&gt;7 Days)
            </div>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Raise New RFI
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search RFI subject, question, drawing #, or RFI ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
        >
          <option value="ALL">All Statuses</option>
          <option value="open">Open</option>
          <option value="under_review">Under Review</option>
          <option value="closed">Closed / Resolved</option>
        </select>
      </div>

      {/* RFI List / Cards */}
      <div className="space-y-3">
        {filteredRFIs.map((rfi) => {
          const isOverdue = rfi.daysOpen > 7 && rfi.status !== 'closed';

          return (
            <div
              key={rfi.id}
              className={`bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border transition ${
                isOverdue
                  ? 'border-rose-300 dark:border-rose-800/80 bg-rose-50/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                      {rfi.rfiNumber}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs uppercase font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {rfi.discipline}
                    </span>
                    {rfi.drawingRef && (
                      <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Dwg: {rfi.drawingRef}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rfi.subject}
                  </h4>
                </div>

                <div className="flex items-center gap-2 self-start">
                  {isOverdue && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {rfi.daysOpen}d Open (Overdue)
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                      rfi.status === 'closed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : rfi.status === 'under_review'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}
                  >
                    {rfi.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800">
                <span className="font-semibold block text-slate-900 dark:text-white mb-1">Query / Discrepancy:</span>
                {rfi.question}
              </div>

              {/* Official Response if available */}
              {rfi.response && (
                <div className="mt-2.5 p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 text-xs text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  <div className="flex items-center justify-between font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Resolution from {rfi.respondedBy || 'Consultant'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-normal">{rfi.responseDate}</span>
                  </div>
                  <div>{rfi.response}</div>
                </div>
              )}

              {/* Bottom Metadata & Response Action */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-4">
                  <span>Raised by: {rfi.raisedBy} ({rfi.dateRaised})</span>
                  <span>Assigned to: <strong className="text-slate-700 dark:text-slate-300">{rfi.assignedTo}</strong></span>
                </div>

                {rfi.status !== 'closed' && (
                  <button
                    onClick={() => {
                      setActiveResponseRfi(rfi);
                      setResponseText('');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-semibold transition self-end sm:self-auto"
                  >
                    <MessageSquare className="w-3 h-3" /> Provide Resolution
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredRFIs.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            No RFIs found matching your filters.
          </div>
        )}
      </div>

      {/* Raise RFI Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Raise Technical Request For Information (RFI)
            </h4>

            <form onSubmit={handleRaiseRFI} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rebar curtailment conflict between DWG-04 & DWG-07"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Discipline
                  </label>
                  <select
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="structural">Structural</option>
                    <option value="architectural">Architectural</option>
                    <option value="mep">MEP Services</option>
                    <option value="civil">Civil</option>
                    <option value="facade">Facade</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="high">High (&gt;48h response)</option>
                    <option value="urgent">Urgent (Stops casting)</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Drawing Ref / Sheet #
                  </label>
                  <input
                    type="text"
                    value={drawingRef}
                    onChange={(e) => setDrawingRef(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Assigned Consultant
                  </label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Query Details / Drawing Conflict Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the exact location, discrepancy between drawings, and recommended resolution..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-sm"
                >
                  Dispatch RFI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provide Resolution Modal */}
      {activeResponseRfi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Provide Engineering Clarification for {activeResponseRfi.rfiNumber}
            </h4>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-400">
              <strong className="block text-slate-900 dark:text-white mb-1">
                {activeResponseRfi.subject}
              </strong>
              {activeResponseRfi.question}
            </div>

            <form onSubmit={handleResolveRFI} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Consultant / Structural Engineer Directive *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Enter design resolution, revised rebar scheduling, or confirmation to proceed with revision..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveResponseRfi(null)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm"
                >
                  Confirm & Close RFI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
