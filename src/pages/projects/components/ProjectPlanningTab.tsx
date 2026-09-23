import React, { useState } from 'react';
import { Project, WBSTask } from '../../../types';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Layers,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  Filter,
} from 'lucide-react';

interface ProjectPlanningTabProps {
  project: Project;
  wbsTasks: WBSTask[];
}

export const ProjectPlanningTab: React.FC<ProjectPlanningTabProps> = ({ project, wbsTasks }) => {
  const [viewMode, setViewMode] = useState<'gantt' | 'wbs' | 'cards'>('gantt');
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    Phase1: true,
    Phase2: true,
    Phase3: true,
    Phase4: true,
  });

  const togglePhase = (phase: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  // Group tasks by phase
  const groupedTasks: Record<string, WBSTask[]> = {};
  wbsTasks.forEach((t) => {
    const code = t.wbsCode || t.id;
    const phaseKey = code.includes('.') ? code.split('.')[0] : '1';
    const groupName = `Phase ${phaseKey}: ${code.startsWith('1') ? 'Substructure' : code.startsWith('2') ? 'Superstructure' : code.startsWith('3') ? 'MEP Services' : 'Finishing & Handover'}`;
    if (!groupedTasks[groupName]) {
      groupedTasks[groupName] = [];
    }
    groupedTasks[groupName].push(t);
  });

  // Calculate project timeline boundaries for Gantt
  const allDates = wbsTasks.flatMap((t) => [
    new Date(t.plannedStartDate || t.plannedStart || project.startDate).getTime(),
    new Date(t.plannedEndDate || t.plannedEnd || project.expectedEndDate).getTime(),
    (t.actualStartDate || t.actualStart) ? new Date(t.actualStartDate || t.actualStart || '').getTime() : 0,
    (t.actualEndDate || t.actualEnd) ? new Date(t.actualEndDate || t.actualEnd || '').getTime() : 0,
  ]).filter((d) => d > 0);

  const minTime = allDates.length > 0 ? Math.min(...allDates) : new Date(project.startDate).getTime();
  const maxTime = allDates.length > 0 ? Math.max(...allDates) : new Date(project.expectedEndDate).getTime();
  const totalDurationDays = Math.max(1, Math.round((maxTime - minTime) / (1000 * 60 * 60 * 24)));

  const getPositionPercent = (dateStr?: string) => {
    if (!dateStr) return 0;
    const time = new Date(dateStr).getTime();
    const offsetDays = Math.round((time - minTime) / (1000 * 60 * 60 * 24));
    return Math.max(0, Math.min(100, (offsetDays / totalDurationDays) * 100));
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            Project Schedule & Work Breakdown Structure (WBS)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Planned vs Actual baseline tracking with delay overhang detection
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setViewMode('gantt')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              viewMode === 'gantt'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📊 Gantt Timeline
          </button>
          <button
            onClick={() => setViewMode('wbs')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              viewMode === 'wbs'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📋 WBS Table
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📱 Phase Cards
          </button>
        </div>
      </div>

      {/* Gantt Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
        <span className="font-semibold text-slate-700 dark:text-slate-300">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2.5 rounded bg-blue-500 inline-block"></span>
          <span className="text-slate-600 dark:text-slate-400">Planned Schedule</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2.5 rounded bg-amber-500 inline-block"></span>
          <span className="text-slate-600 dark:text-slate-400">Actual Execution</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2.5 rounded bg-rose-500 inline-block"></span>
          <span className="text-slate-600 dark:text-slate-400">Delay Overhang (Overdue)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-2.5 rounded bg-emerald-500 inline-block"></span>
          <span className="text-slate-600 dark:text-slate-400">Completed 100%</span>
        </div>
      </div>

      {/* 1. GANTT VIEW */}
      {viewMode === 'gantt' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm overflow-x-auto">
          <div className="min-w-[850px] space-y-6">
            {/* Timeline Header bar */}
            <div className="grid grid-cols-12 gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="col-span-4">WBS TASK & SPECIFICATION</div>
              <div className="col-span-8 flex justify-between px-2">
                <span>Start: {new Date(minTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                <span>Midway Milestone</span>
                <span>Target: {new Date(maxTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            {/* Task Rows grouped by Phase */}
            {Object.entries(groupedTasks).map(([phaseTitle, tasks]) => (
              <div key={phaseTitle} className="space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded flex items-center justify-between">
                  <span>{phaseTitle}</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    {tasks.filter((t) => t.status === 'completed').length} / {tasks.length} Completed
                  </span>
                </div>

                <div className="space-y-2">
                  {tasks.map((task) => {
                    const taskStart = task.plannedStartDate || task.plannedStart || project.startDate;
                    const taskEnd = task.plannedEndDate || task.plannedEnd || project.expectedEndDate;
                    const taskProgress = task.progress !== undefined ? task.progress : (task.progressPct || 0);

                    const plannedStartPct = getPositionPercent(taskStart);
                    const plannedEndPct = getPositionPercent(taskEnd);
                    const plannedWidth = Math.max(3, plannedEndPct - plannedStartPct);

                    // Actual bar calculation
                    let actualStartPct = plannedStartPct;
                    let actualEndPct = plannedEndPct;
                    let hasDelayOverhang = false;
                    let delayOverhangWidth = 0;

                    const actStart = task.actualStartDate || task.actualStart;
                    const actEnd = task.actualEndDate || task.actualEnd;

                    if (actStart) {
                      actualStartPct = getPositionPercent(actStart);
                    }

                    if (actEnd) {
                      actualEndPct = getPositionPercent(actEnd);
                      if (actualEndPct > plannedEndPct) {
                        hasDelayOverhang = true;
                        delayOverhangWidth = actualEndPct - plannedEndPct;
                      }
                    } else if (task.status === 'in_progress' && plannedEndPct < 60) {
                      // Simulating ongoing task running past deadline
                      actualEndPct = Math.min(100, plannedEndPct + 12);
                      hasDelayOverhang = true;
                      delayOverhangWidth = actualEndPct - plannedEndPct;
                    }

                    const actualWidth = Math.max(3, (task.status === 'completed' ? actualEndPct : plannedStartPct + (plannedWidth * taskProgress) / 100) - actualStartPct);

                    return (
                      <div
                        key={task.id}
                        className="grid grid-cols-12 gap-1 items-center py-2 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition"
                      >
                        {/* Task Meta Left */}
                        <div className="col-span-4 pr-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              <span className="text-amber-600 dark:text-amber-400 font-mono mr-1.5">{task.wbsCode}</span>
                              {task.name}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 ${
                                task.status === 'completed'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                  : task.status === 'in_progress'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {task.progress}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span>{task.plannedStartDate} → {task.plannedEndDate}</span>
                            {task.dependencies.length > 0 && (
                              <span className="text-slate-500">Dep: {task.dependencies.join(', ')}</span>
                            )}
                          </div>
                        </div>

                        {/* Gantt Bar Track Right */}
                        <div className="col-span-8 relative h-7 bg-slate-100 dark:bg-slate-800/60 rounded flex items-center px-1">
                          {/* Planned Bar (Blue) */}
                          <div
                            className="absolute top-1 h-2 rounded bg-blue-400/80 dark:bg-blue-500/70"
                            style={{
                              left: `${plannedStartPct}%`,
                              width: `${plannedWidth}%`,
                            }}
                            title={`Planned: ${task.plannedStartDate} to ${task.plannedEndDate}`}
                          ></div>

                          {/* Actual Progress Bar (Amber / Green) */}
                          <div
                            className={`absolute bottom-1 h-2.5 rounded ${
                              task.status === 'completed'
                                ? 'bg-emerald-500'
                                : 'bg-gradient-to-r from-amber-500 to-amber-600'
                            }`}
                            style={{
                              left: `${actualStartPct}%`,
                              width: `${actualWidth}%`,
                            }}
                            title={`Actual Progress: ${task.progress}%`}
                          ></div>

                          {/* Delay Overhang Bar (Red) */}
                          {hasDelayOverhang && (
                            <div
                              className="absolute bottom-1 h-2.5 rounded-r bg-rose-500 animate-pulse"
                              style={{
                                left: `${plannedEndPct}%`,
                                width: `${delayOverhangWidth}%`,
                              }}
                              title="Delay Overhang past planned completion"
                            ></div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. WBS TABLE VIEW */}
      {viewMode === 'wbs' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">WBS Code</th>
                  <th className="py-3 px-4">Task Description</th>
                  <th className="py-3 px-4">Planned Dates</th>
                  <th className="py-3 px-4">Actual Dates</th>
                  <th className="py-3 px-4">Dependencies</th>
                  <th className="py-3 px-4 text-center">Progress</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {wbsTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400">
                      {t.wbsCode}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                      {t.name}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {t.plannedStartDate} → {t.plannedEndDate}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {t.actualStartDate || '—'} → {t.actualEndDate || 'Ongoing'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {t.dependencies.length > 0 ? t.dependencies.join(', ') : 'None'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${t.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${t.progress}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{t.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                          t.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : t.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MOBILE PHASE CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {Object.entries(groupedTasks).map(([phaseTitle, tasks]) => (
            <div
              key={phaseTitle}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{phaseTitle}</h4>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 font-semibold">
                  {tasks.length} line items
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
                {tasks.map((task) => (
                  <div key={task.id} className="py-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mr-1.5">
                          {task.wbsCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {task.name}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded shrink-0 ${
                          task.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : task.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Timeline: {task.plannedStartDate} → {task.plannedEndDate}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{task.progress}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
