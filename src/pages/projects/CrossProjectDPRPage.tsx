import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  HardHat,
  Search,
  Calendar,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Filter,
} from 'lucide-react';

export const CrossProjectDPRPage: React.FC = () => {
  const navigate = useNavigate();
  const { dprs, projects } = useAppStore();

  const [selectedProject, setSelectedProject] = useState('ALL');
  const [selectedShift, setSelectedShift] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDPRs = dprs.filter((d) => {
    if (selectedProject !== 'ALL' && d.projectId !== selectedProject) return false;
    if (selectedShift !== 'ALL' && (d.shift || 'day') !== selectedShift) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.projectName.toLowerCase().includes(q) ||
        d.dprNumber.toLowerCase().includes(q) ||
        (d.preparedBy || d.submittedBy || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalManpowerAcrossSites = dprs.reduce((acc, d) => acc + (d.totalManpower || 0), 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-600" />
            Central Site Operations & DPR Stream
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time daily progress reports, headcount tracking, and work achievement rates
          </p>
        </div>
      </div>

      {/* KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Deployed Workforce Today
          </span>
          <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {totalManpowerAcrossSites} Workers
          </span>
          <div className="text-xs text-slate-400 mt-1">Logged across all active sites</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Daily Progress Reports
          </span>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            {dprs.length} Reports
          </span>
          <div className="text-xs text-emerald-600 font-medium mt-1">100% Shift compliance</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Safety Incidents Flagged
          </span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            0 Incidents
          </span>
          <div className="text-xs text-slate-400 mt-1">Zero lost-time injuries</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name or engineer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} - {p.name}
              </option>
            ))}
          </select>

          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Shifts</option>
            <option value="day">Day Shift</option>
            <option value="night">Night Shift</option>
            <option value="general">General Shift</option>
          </select>
        </div>
      </div>

      {/* DPR Feed Cards */}
      <div className="space-y-4">
        {filteredDPRs.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {report.dprNumber}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <button
                      onClick={() => navigate(`/projects/${report.projectId}`)}
                      className="font-bold text-slate-900 dark:text-white hover:text-amber-600 transition"
                    >
                      {report.projectName}
                    </button>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Date: <strong className="text-slate-700 dark:text-slate-300">{report.date}</strong> • Shift: <span className="uppercase">{report.shift}</span> • Weather: {report.weather}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Site Headcount</span>
                  <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                    {report.totalManpower} Workers
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/projects/${report.projectId}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 hover:text-amber-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition"
                >
                  <span>Project Tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Output Progress Highlight */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              {(report.workDone || report.workCompleted || []).map((w, idx) => {
                const desc = w.description || w.activity || 'Construction output';
                const pct = w.achievementPercentage !== undefined ? w.achievementPercentage : (w.achievementPct || 0);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">{desc}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Loc: {w.location} • Output: {w.achievedQty} / {w.plannedQty} {w.unit}
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        pct >= 100
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
              <span>Prepared by: {report.preparedBy || report.submittedBy}</span>
              <span>Approved by: {report.approvedBy || 'Project Manager'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
