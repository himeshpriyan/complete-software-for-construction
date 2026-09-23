import React, { useState, useMemo } from 'react';
import { Project, ProjectHandover, SnagItem, SnagStatus } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileCheck,
  ShieldCheck,
  Building,
  KeyRound,
  Calendar,
  Layers,
  Camera,
  Plus,
  X,
  ChevronRight,
  Filter,
} from 'lucide-react';

interface ProjectHandoverTabProps {
  project: Project;
  handover?: ProjectHandover;
}

const SNAG_STATUSES: { key: SnagStatus; label: string }[] = [
  { key: 'open', label: '1. Open' },
  { key: 'assigned', label: '2. Assigned' },
  { key: 'in_progress', label: '3. In Progress' },
  { key: 'completed', label: '4. Completed' },
  { key: 'verified', label: '5. Verified' },
];

export const ProjectHandoverTab: React.FC<ProjectHandoverTabProps> = ({
  project,
  handover: propHandover,
}) => {
  const { updateHandover, snagItems, createSnagItem, updateSnagStatus } = useAppStore();

  const [snagFilter, setSnagFilter] = useState<string>('ALL');
  const [showAddSnagModal, setShowAddSnagModal] = useState(false);

  // New snag form state
  const [newSnag, setNewSnag] = useState<{
    issue: string;
    location: string;
    assignedTo: string;
    priority: 'critical' | 'major' | 'minor';
    dueDate: string;
  }>({
    issue: '',
    location: '',
    assignedTo: 'Er. Rajesh Iyer (Site QA)',
    priority: 'major',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  });

  // Snags for this project (or fallback to all if matching none so demo is rich)
  const projectSnags = useMemo(() => {
    const list = snagItems.filter((s) => s.projectId === project.id);
    return list.length > 0 ? list : snagItems;
  }, [snagItems, project.id]);

  const filteredSnags = useMemo(() => {
    if (snagFilter === 'ALL') return projectSnags;
    return projectSnags.filter((s) => s.status === snagFilter);
  }, [projectSnags, snagFilter]);

  const totalSnags = projectSnags.length;
  const resolvedSnags = projectSnags.filter(
    (s) => s.status === 'completed' || s.status === 'verified'
  ).length;
  const snagResolutionPct = totalSnags > 0 ? Math.round((resolvedSnags / totalSnags) * 100) : 100;

  const handover: ProjectHandover = propHandover || {
    projectId: project.id,
    currentStage: snagResolutionPct >= 100 ? 'as_built_submission' : 'snag_clearing',
    snagsTotal: totalSnags,
    snagsResolved: resolvedSnags,
    asBuiltDrawingsApproved: true,
    oAndMManualSubmitted: true,
    dlpPeriodMonths: 12,
    statutoryNocReceived: false,
    virtualCompletionCertificateIssued: false,
    retentionMoneyReleased: false,
    clientSignoffDate: 'Expected 2026-12-15',
  };

  const currentStage = handover.currentStage || 'snag_clearing';

  const stages = [
    {
      key: 'snag_clearing',
      title: '1. Snag Rectification',
      desc: 'Punch-list defects cleared',
      isComplete: snagResolutionPct >= 95,
      active: currentStage === 'snag_clearing',
    },
    {
      key: 'as_built_submission',
      title: '2. As-Built Drawings',
      desc: 'Redline drawings ratified',
      isComplete: !!handover.asBuiltDrawingsApproved,
      active: currentStage === 'as_built_submission',
    },
    {
      key: 'statutory_nocs',
      title: '3. Statutory NOCs & OC',
      desc: 'Fire, Lift, Municipal clearance',
      isComplete: !!handover.statutoryNocReceived,
      active: currentStage === 'statutory_nocs',
    },
    {
      key: 'virtual_completion',
      title: '4. Virtual Completion (VCC)',
      desc: 'Handover letter & 50% retention',
      isComplete: !!handover.virtualCompletionCertificateIssued,
      active: handover.currentStage === 'virtual_completion',
    },
    {
      key: 'final_handover',
      title: '5. DLP & Final Sign-Off',
      desc: '12-month defect period & release',
      isComplete: !!handover.retentionMoneyReleased,
      active: handover.currentStage === 'final_handover',
    },
  ];

  const toggleMilestone = (key: keyof ProjectHandover) => {
    const currentVal = !!handover[key];
    updateHandover(project.id, { [key]: !currentVal });
  };

  const handleCreateSnag = (e: React.FormEvent) => {
    e.preventDefault();
    createSnagItem({
      projectId: project.id,
      projectName: project.name,
      issue: newSnag.issue,
      location: newSnag.location,
      assignedTo: newSnag.assignedTo,
      priority: newSnag.priority,
      dueDate: newSnag.dueDate,
      status: 'open',
      photoEvidence:
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
    });
    setNewSnag({
      issue: '',
      location: '',
      assignedTo: 'Er. Rajesh Iyer (Site QA)',
      priority: 'major',
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
    setShowAddSnagModal(false);
  };

  const advanceSnagStatus = (snag: SnagItem) => {
    const currentIndex = SNAG_STATUSES.findIndex((s) => s.key === snag.status);
    if (currentIndex < SNAG_STATUSES.length - 1) {
      const nextStatus = SNAG_STATUSES[currentIndex + 1].key;
      updateSnagStatus(
        snag.id,
        nextStatus,
        nextStatus === 'verified' ? 'Punch item inspected and ratified on site' : undefined,
        nextStatus === 'verified' ? 'Client Quality Auditor' : undefined
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-600" />
            Project Handover, Snagging & Virtual Completion
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Defect liability period (DLP), as-built certification, punch-list clearing, and retention release
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-800">
            DLP Period: {handover.dlpPeriodMonths || 12} Months
          </span>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
            Stage: {currentStage.replace(/_/g, ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
          Handover Milestones Progression
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {stages.map((st) => (
            <div
              key={st.key}
              className={`p-3.5 rounded-xl border transition ${
                st.isComplete
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                  : st.active
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {st.title}
                </span>
                {st.isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">{st.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Grid: Real Snag Tracker & Milestone Sign-Off Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Dynamic Punch-List Snag Tracker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Punch-List Snag Progress
              </h4>
              <p className="text-xs text-slate-500">Live defect resolution from Punch List register</p>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 font-mono">
              {resolvedSnags} / {totalSnags} Cleared ({snagResolutionPct}%)
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${snagResolutionPct}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Open & Assigned</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {projectSnags.filter((s) => s.status === 'open' || s.status === 'assigned').length} Items
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">In Progress</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {projectSnags.filter((s) => s.status === 'in_progress').length} Items
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Completed by Subcontractor</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {projectSnags.filter((s) => s.status === 'completed').length} Items
              </span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block mb-0.5">Audited & Verified</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {projectSnags.filter((s) => s.status === 'verified').length} Items (100% Closed)
              </span>
            </div>
          </div>
        </div>

        {/* Right: Contractual Handover Checklist */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Formal Handover & Commercial Release Checklist
          </h4>
          <p className="text-xs text-slate-500">
            Click checkbox to update milestone status and trigger automated audit log
          </p>

          <div className="space-y-2.5 text-xs">
            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
              <input
                type="checkbox"
                checked={handover.asBuiltDrawingsApproved}
                onChange={() => toggleMilestone('asBuiltDrawingsApproved')}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  As-Built Drawings Approved by Consultant
                </span>
                <span className="text-slate-500 text-[11px]">
                  All structural, architectural, and MEP revisions signed off as true site conditions.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
              <input
                type="checkbox"
                checked={handover.oAndMManualSubmitted}
                onChange={() => toggleMilestone('oAndMManualSubmitted')}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  O&M Manuals, Warranties & Equipment Guarantees Submitted
                </span>
                <span className="text-slate-500 text-[11px]">
                  Elevator, DG sets, HVAC chillers, and fire pump manufacturer warranty booklets handed over.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
              <input
                type="checkbox"
                checked={handover.statutoryNocReceived}
                onChange={() => toggleMilestone('statutoryNocReceived')}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Statutory Occupancy Certificate (OC) & Final Fire NOC
                </span>
                <span className="text-slate-500 text-[11px]">
                  Municipal building authority inspection cleared and occupation permitted.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
              <input
                type="checkbox"
                checked={handover.virtualCompletionCertificateIssued}
                onChange={() => toggleMilestone('virtualCompletionCertificateIssued')}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Virtual Completion Certificate (VCC) Issued
                </span>
                <span className="text-slate-500 text-[11px]">
                  Unlocks release of first 50% retention money and initiates the 12-month DLP window.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
              <input
                type="checkbox"
                checked={handover.retentionMoneyReleased}
                onChange={() => toggleMilestone('retentionMoneyReleased')}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">
                  Final Retention Money Released (DLP Conclusion)
                </span>
                <span className="text-slate-500 text-[11px]">
                  Final account signed off; remaining 5% retention amount disbursed.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* SNAGGING / PUNCH LIST TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Detailed Project Snag / Punch List Register
            </h4>
            <p className="text-xs text-slate-500">
              Granular punch-list tracking: location, assigned contractor, photo evidence, and progressive sign-offs
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {['ALL', 'open', 'assigned', 'in_progress', 'completed', 'verified'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSnagFilter(st)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition uppercase ${
                    snagFilter === st
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddSnagModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Log Snag Item
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Snag # & Issue</th>
                <th className="px-4 py-3.5">Specific Location</th>
                <th className="px-4 py-3.5">Assigned To</th>
                <th className="px-4 py-3.5">Priority</th>
                <th className="px-4 py-3.5">Due Date</th>
                <th className="px-4 py-3.5">Photo Evidence</th>
                <th className="px-4 py-3.5">Status Flow</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredSnags.map((snag) => (
                <tr key={snag.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3.5 max-w-[220px]">
                    <div className="font-bold text-slate-900 dark:text-white text-xs">
                      {snag.issue}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                      {snag.snagNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                    {snag.location}
                  </td>
                  <td className="px-4 py-3.5">{snag.assignedTo}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        snag.priority === 'critical'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                          : snag.priority === 'major'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                      }`}
                    >
                      {snag.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-800 dark:text-slate-300">
                    {snag.dueDate}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                      <Camera className="w-3.5 h-3.5" />
                      Mock Photo
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        snag.status === 'verified'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300'
                          : snag.status === 'completed'
                          ? 'bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-300'
                          : snag.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300'
                          : snag.status === 'assigned'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300'
                      }`}
                    >
                      {snag.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {snag.status !== 'verified' ? (
                      <button
                        onClick={() => advanceSnagStatus(snag)}
                        className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 dark:text-slate-300 font-semibold rounded text-[11px] transition flex items-center gap-1 ml-auto"
                      >
                        Advance
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Closed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Snag Modal */}
      {showAddSnagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Log New Snag / Punch Item
              </h3>
              <button onClick={() => setShowAddSnagModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSnag} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Snag Description / Defect
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Paint peeling on ceiling near AC diffuser"
                  value={newSnag.issue}
                  onChange={(e) => setNewSnag({ ...newSnag, issue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Location Reference
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Room 203 / Flat 1402 Living"
                    value={newSnag.location}
                    onChange={(e) => setNewSnag({ ...newSnag, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newSnag.priority}
                    onChange={(e) =>
                      setNewSnag({
                        ...newSnag,
                        priority: e.target.value as 'critical' | 'major' | 'minor',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    <option value="minor">Minor (Cosmetic touchup)</option>
                    <option value="major">Major (Repairs before handover)</option>
                    <option value="critical">Critical (Prevents handover)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Subcontractor / Engineer
                  </label>
                  <input
                    type="text"
                    required
                    value={newSnag.assignedTo}
                    onChange={(e) => setNewSnag({ ...newSnag, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rectification Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newSnag.dueDate}
                    onChange={(e) => setNewSnag({ ...newSnag, dueDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddSnagModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                >
                  Create Snag Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
