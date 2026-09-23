import React from 'react';
import { Project, DailyProgressReport, MeasurementBookEntry, VariationOrder } from '../../../types';
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building,
  UserCheck,
  MapPin,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  HardHat,
} from 'lucide-react';

interface ProjectOverviewTabProps {
  project: Project;
  dprs: DailyProgressReport[];
  mbEntries: MeasurementBookEntry[];
  variations: VariationOrder[];
  onNavigateTab: (tab: string) => void;
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({
  project,
  dprs,
  mbEntries,
  variations,
  onNavigateTab,
}) => {
  const formatCrores = (val: number) => `₹ ${(val / 10000000).toFixed(2)} Cr`;
  const formatLakhs = (val: number) => `₹ ${(val / 100000).toFixed(2)} L`;

  const variance = project.budget - project.actualCost;
  const isUnderBudget = variance >= 0;

  // Recent combined site activities
  const recentActivities = [
    ...dprs.slice(0, 3).map((d) => ({
      id: d.id,
      type: 'dpr',
      title: `DPR Logged: ${d.dprNumber}`,
      subtitle: `${d.totalManpower || 0} workers • Shift: ${d.shift || 'day'} • Work: ${d.workDone?.[0]?.description || 'General site works'}`,
      date: d.date,
      time: 'Evening Shift',
      icon: HardHat,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400',
    })),
    ...mbEntries.slice(0, 2).map((m) => ({
      id: m.id,
      type: 'mb',
      title: `MB Measurement: ${m.mbNumber}`,
      subtitle: `${m.description || m.workDescription || 'Measurement'} (${m.quantity} ${m.unit}) — Value: ${formatLakhs(m.totalAmount || m.amount || 0)}`,
      date: m.recordedDate || m.date || '',
      time: 'Verified by ' + m.recordedBy,
      icon: FileSpreadsheet,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400',
    })),
    ...variations.slice(0, 2).map((v) => ({
      id: v.id,
      type: 'vo',
      title: `Variation ${v.variationNumber}: ${v.title}`,
      subtitle: `Status: ${v.status.toUpperCase()} • Impact: ${v.type === 'addition' ? '+' : '−'}${formatLakhs(v.amount || 0)}`,
      date: v.dateProposed || v.date || '',
      time: 'Client Review',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400',
    })),
  ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Contract Value
          </div>
          <div className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
            {formatCrores(project.contractValue)}
          </div>
          <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span>BOQ Agreed</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Target Budget
          </div>
          <div className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
            {formatCrores(project.budget)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Cost Baseline</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Actual Incurred
          </div>
          <div className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
            {formatCrores(project.actualCost)}
          </div>
          <div className={`text-xs mt-1 font-medium ${isUnderBudget ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isUnderBudget ? `₹ ${(variance / 100000).toFixed(0)} L under budget` : `₹ ${(Math.abs(variance) / 100000).toFixed(0)} L overspend`}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Actual Progress
          </div>
          <div className="text-lg lg:text-xl font-bold text-amber-600 dark:text-amber-400">
            {project.completionPercentage}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Physical execution</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Planned Progress
          </div>
          <div className="text-lg lg:text-xl font-bold text-blue-600 dark:text-blue-400">
            {project.plannedPercentage}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Baseline schedule</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Schedule Variance
          </div>
          <div className={`text-lg lg:text-xl font-bold ${project.delayDays > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {project.delayDays > 0 ? `+${project.delayDays} Days` : 'On Schedule'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {project.delayDays > 0 ? 'Behind plan' : 'Milestones met'}
          </div>
        </div>
      </div>

      {/* 6(c) AI Project Risk Diagnostic Card (Illustrative Demo) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 border border-indigo-500/30 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
              AI Risk Diagnostic (Illustrative Demo)
            </span>
            <span className="text-xs text-slate-300 font-semibold">
              Live Heuristic Evaluation
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">Delay Risk:</span>
              <span
                className={`font-bold font-mono px-2 py-0.5 rounded ${
                  project.delayDays > 10
                    ? 'bg-rose-900/60 text-rose-300'
                    : project.delayDays > 0
                    ? 'bg-amber-900/60 text-amber-300'
                    : 'bg-emerald-900/60 text-emerald-300'
                }`}
              >
                {project.delayDays > 10 ? 'High' : project.delayDays > 0 ? 'Medium' : 'Low'}
              </span>
            </span>

            <span className="flex items-center gap-1.5">
              <span className="text-slate-400">Cost Overrun:</span>
              <span
                className={`font-bold font-mono px-2 py-0.5 rounded ${
                  project.actualCost > project.budget
                    ? 'bg-amber-900/60 text-amber-300'
                    : 'bg-emerald-900/60 text-emerald-300'
                }`}
              >
                {project.actualCost > project.budget ? 'Medium' : 'Low'}
              </span>
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
          <div>
            <span className="text-slate-400 font-medium">Schedule Diagnostic: </span>
            {project.delayDays > 0
              ? `Site execution is experiencing a ${project.delayDays}-day float deficit against baseline S-curve, requiring accelerated second-shift casting.`
              : 'Physical progress is synchronised with master milestones; zero critical path slippage detected.'}
          </div>
          <div>
            <span className="text-slate-400 font-medium">Commercial Diagnostic: </span>
            {project.actualCost > project.budget
              ? `Actual certified billing is ₹ ${(Math.abs(project.budget - project.actualCost) / 100000).toFixed(1)} L above planned budget due to market material escalation.`
              : `Current spend is within safe 4.8% float of target budget allowance (${formatCrores(project.budget)} allocated).`}
          </div>
        </div>
      </div>

      {/* Progress Comparison Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Physical Progress vs Baseline Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live S-Curve tracking based on verified Measurement Book records and DPR outputs
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Actual: {project.completionPercentage}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block"></span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                Planned: {project.plannedPercentage}%
              </span>
            </div>
            {project.delayDays > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 font-medium">
                Lag: {(project.plannedPercentage ?? 0) - (project.completionPercentage ?? 0)}% ({project.delayDays}d)
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {/* Dual Bar Comparison */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Actual Completion</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400">{project.completionPercentage ?? 0}%</span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(project.completionPercentage ?? 0, 100)}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Planned Baseline</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{project.plannedPercentage ?? 0}%</span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(project.plannedPercentage ?? 0, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Milestone summary row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Commencement Date</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {project.startDate}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Baseline Target Date</span>
            <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {project.expectedEndDate}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Current Phase</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">
              {project.currentPhase}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Execution Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              {project.status}
            </span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Specs + Recent Site Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Project Profile & Key Entities */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Site Attributes & Contacts
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <Building className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block">Client Organization</span>
                <span className="font-semibold text-slate-900 dark:text-white">{project.clientName}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <MapPin className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block">Site Location</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{project.location}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <UserCheck className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block">Project Manager</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{project.projectManager}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="text-slate-400 block">Site Engineer & Safety</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{project.siteEngineer}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="text-xs text-slate-400 font-medium">Quick Workspace Navigation</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => onNavigateTab('planning')}
                className="p-2 text-left rounded border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
              >
                📊 Gantt & WBS
              </button>
              <button
                onClick={() => onNavigateTab('dpr')}
                className="p-2 text-left rounded border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
              >
                👷 Daily DPR ({dprs.length})
              </button>
              <button
                onClick={() => onNavigateTab('measurements')}
                className="p-2 text-left rounded border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
              >
                📐 MB Records ({mbEntries.length})
              </button>
              <button
                onClick={() => onNavigateTab('variations')}
                className="p-2 text-left rounded border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition"
              >
                ⚖️ Variations ({variations.length})
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Site Activity Feed */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                Recent Site Operations Feed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest DPR entries, measurement records, and engineering change notices
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
              Live Stream
            </span>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3.5 p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                >
                  <div className={`p-2 rounded-lg ${act.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {act.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" />
                        {act.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {act.subtitle}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1">{act.time}</div>
                  </div>
                </div>
              );
            })}

            {recentActivities.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                No recent activity recorded yet for this project.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
