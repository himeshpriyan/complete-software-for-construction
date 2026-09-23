import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ProjectHealth, ProjectStatus } from '../../types';
import {
  Building2,
  Calendar,
  Layers,
  CheckSquare,
  HardHat,
  Camera,
  FileSpreadsheet,
  HelpCircle,
  TrendingUp,
  FolderOpen,
  Users,
  KeyRound,
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit,
  MapPin,
  UserCheck,
} from 'lucide-react';

import { ProjectOverviewTab } from './components/ProjectOverviewTab';
import { ProjectPlanningTab } from './components/ProjectPlanningTab';
import { ProjectTasksTab } from './components/ProjectTasksTab';
import { ProjectDPRTab } from './components/ProjectDPRTab';
import { ProjectPhotosTab } from './components/ProjectPhotosTab';
import { ProjectMeasurementsTab } from './components/ProjectMeasurementsTab';
import { ProjectRFITab } from './components/ProjectRFITab';
import { ProjectVariationsTab } from './components/ProjectVariationsTab';
import { ProjectTeamTab } from './components/ProjectTeamTab';
import { ProjectHandoverTab } from './components/ProjectHandoverTab';
import { ProjectCostingTab } from './components/ProjectCostingTab';
import { ProjectDocumentsTab } from './components/ProjectDocumentsTab';
import { DollarSign } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    projects,
    wbsTasks,
    projectTasks,
    dprs,
    sitePhotos,
    mbEntries,
    rfis,
    variations,
    handovers,
    updateProject,
  } = useAppStore();

  const urlTab = searchParams.get('tab');
  const [activeTab, setActiveTabState] = useState<string>(urlTab || 'overview');

  useEffect(() => {
    if (urlTab) {
      setActiveTabState(urlTab);
    }
  }, [urlTab]);

  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    setSearchParams(tab === 'overview' ? {} : { tab });
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Find active project
  const project = projects.find((p) => p.id === id || p.code === id) || projects[0];

  // Form State for editing project health/status
  const [editHealth, setEditHealth] = useState<ProjectHealth>(project ? project.health : 'on_track');
  const [editStatus, setEditStatus] = useState<ProjectStatus>(project ? project.status : 'active');
  const [editProgress, setEditProgress] = useState<number>(project?.completionPercentage ?? 0);

  useEffect(() => {
    if (project) {
      setEditHealth(project.health);
      setEditStatus(project.status);
      setEditProgress(project.completionPercentage ?? 0);
    }
  }, [project]);

  if (!project) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Project Not Found</h2>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 px-4 py-2 rounded-lg bg-amber-600 text-white text-xs font-semibold"
        >
          Back to Projects Directory
        </button>
      </div>
    );
  }

  // Filter linked records for this project
  const projectWbs = wbsTasks.filter((t) => t.projectId === project.id);
  const projectActionTasks = projectTasks.filter((t) => t.projectId === project.id);
  const projectDprs = dprs.filter((d) => d.projectId === project.id);
  const projectPhotos = sitePhotos.filter((p) => p.projectId === project.id);
  const projectMb = mbEntries.filter((m) => m.projectId === project.id);
  const projectRfis = rfis.filter((r) => r.projectId === project.id);
  const projectVos = variations.filter((v) => v.projectId === project.id);
  const projectHandover = handovers[project.id];

  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject(project.id, {
      health: editHealth,
      status: editStatus,
      completionPercentage: editProgress,
    });
    setIsEditModalOpen(false);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'planning', label: 'Planning & Gantt', icon: Layers, badge: projectWbs.length },
    { id: 'tasks', label: 'Site Tasks', icon: CheckSquare, badge: projectActionTasks.length },
    { id: 'dpr', label: 'Daily DPR', icon: HardHat, badge: projectDprs.length },
    { id: 'photos', label: 'Site Photos', icon: Camera, badge: projectPhotos.length },
    { id: 'measurements', label: 'Measurements (MB)', icon: FileSpreadsheet, badge: projectMb.length },
    { id: 'costing', label: 'Costing & Margins', icon: DollarSign },
    { id: 'rfi', label: 'RFI Tracker', icon: HelpCircle, badge: projectRfis.length },
    { id: 'variations', label: 'Variations & CO', icon: TrendingUp, badge: projectVos.length },
    { id: 'documents', label: 'Drawings & Docs', icon: FolderOpen },
    { id: 'team', label: 'Site Team', icon: Users },
    { id: 'handover', label: 'Handover & Snags', icon: KeyRound },
  ];

  const getHealthBadge = (health: ProjectHealth) => {
    switch (health) {
      case 'on_track':
        return {
          label: '🟢 On Track',
          classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        };
      case 'at_risk':
        return {
          label: '🟡 At Risk',
          classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        };
      case 'delayed':
        return {
          label: '🔴 Delayed',
          classes: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800 animate-pulse',
        };
    }
  };

  const healthBadge = getHealthBadge(project.health);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-1 hover:text-amber-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Projects Directory
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          <span className="font-mono text-slate-400">{project.code}</span>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600" />
          <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
            {project.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs transition"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit Status & Health
          </button>
        </div>
      </div>

      {/* Project Master Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                {project.code}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${healthBadge.classes}`}>
                {healthBadge.label}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {project.status.replace('_', ' ')}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {project.name}
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Client: <strong className="text-slate-800 dark:text-slate-200 ml-0.5">{project.clientName}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {project.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                PM: <strong className="text-slate-800 dark:text-slate-200 ml-0.5">{project.projectManager}</strong>
              </span>
            </div>
          </div>

          {/* Quick Metrics in Header */}
          <div className="flex items-center gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 dark:border-slate-800">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-medium block">
                Contract Value
              </span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                ₹ {(project.contractValue / 10000000).toFixed(2)} Cr
              </span>
            </div>

            <div className="w-px h-10 bg-slate-200 dark:border-slate-800 hidden sm:block"></div>

            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-medium block">
                Execution Progress
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                  {project.completionPercentage}%
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  (Plan: {project.plannedPercentage}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Scrollable 11-Tab Navigation Strip */}
        <div className="mt-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${isActive
                      ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Render Active Tab Component */}
      <div className="transition-all duration-200">
        {activeTab === 'overview' && (
          <ProjectOverviewTab
            project={project}
            dprs={projectDprs}
            mbEntries={projectMb}
            variations={projectVos}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
        {activeTab === 'planning' && (
          <ProjectPlanningTab project={project} wbsTasks={projectWbs} />
        )}
        {activeTab === 'tasks' && (
          <ProjectTasksTab project={project} tasks={projectActionTasks} />
        )}
        {activeTab === 'dpr' && (
          <ProjectDPRTab project={project} dprs={projectDprs} />
        )}
        {activeTab === 'photos' && (
          <ProjectPhotosTab project={project} photos={projectPhotos} />
        )}
        {activeTab === 'measurements' && (
          <ProjectMeasurementsTab project={project} mbEntries={projectMb} />
        )}
        {activeTab === 'costing' && <ProjectCostingTab project={project} />}
        {activeTab === 'rfi' && (
          <ProjectRFITab project={project} rfis={projectRfis} />
        )}
        {activeTab === 'variations' && (
          <ProjectVariationsTab project={project} variations={projectVos} />
        )}
        {activeTab === 'documents' && <ProjectDocumentsTab project={project} />}
        {activeTab === 'team' && <ProjectTeamTab project={project} />}
        {activeTab === 'handover' && (
          <ProjectHandoverTab project={project} handover={projectHandover} />
        )}
      </div>

      {/* Edit Health / Status Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Update Project Status & Health
            </h4>

            <form onSubmit={handleUpdateProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Project Health
                </label>
                <select
                  value={editHealth}
                  onChange={(e) => setEditHealth(e.target.value as ProjectHealth)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="on_track">🟢 On Track (Milestones & budget on schedule)</option>
                  <option value="at_risk">🟡 At Risk (Material or RFI bottleneck)</option>
                  <option value="delayed">🔴 Delayed (Behind critical path)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Lifecycle Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as ProjectStatus)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="planning">Planning & Mobilization</option>
                  <option value="active">Active Execution</option>
                  <option value="on_hold">On Hold</option>
                  <option value="handover">Handover & Snagging</option>
                  <option value="completed">Completed & Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Actual Completion Percentage ({editProgress}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProgress}
                  onChange={(e) => setEditProgress(Number(e.target.value))}
                  className="w-full accent-amber-600"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
