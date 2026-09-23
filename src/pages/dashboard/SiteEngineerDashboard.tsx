import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  ClipboardList,
  FileCheck2,
  Users2,
  PackagePlus,
  Camera,
  Ruler,
  HelpCircle,
  AlertOctagon,
  ShieldCheck,
  Wifi,
  WifiOff,
  Sun,
  HardHat,
  MapPin,
  ChevronRight,
  Clock,
  CheckCircle2,
  ArrowRight,
  Info,
} from 'lucide-react';

export const SiteEngineerDashboard: React.FC = () => {
  const { currentUser, projects, projectTasks: allTasks, dprs, snagItems } = useAppStore();
  const navigate = useNavigate();

  const [offlineMode, setOfflineMode] = useState(false);
  const [showOfflineTooltip, setShowOfflineTooltip] = useState(false);

  // Active site project
  const currentProject = projects[0] || {
    id: 'PRJ-001',
    name: 'Lodha Skylines Tower C Highrise',
    code: 'LS-TWC-2026',
    location: 'Lower Parel, Mumbai',
  };

  const projectTasks = allTasks.filter((t) => t.projectId === currentProject.id);
  const urgentTasksCount = projectTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high').length;
  const openSnags = snagItems.filter((s) => s.projectId === currentProject.id && s.status !== 'verified').length;

  // The 9 large tappable tiles required by the prompt
  const TILES = [
    {
      id: 'tasks',
      title: "Today's Tasks",
      count: `${urgentTasksCount} Priority`,
      desc: 'Execution workfronts & schedules',
      icon: <ClipboardList className="w-7 h-7 text-blue-600" />,
      bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-300',
      link: '/projects/tasks',
    },
    {
      id: 'dpr',
      title: 'Daily Progress (DPR)',
      count: 'Submit Due',
      desc: 'Log today manpower, concrete & delays',
      icon: <FileCheck2 className="w-7 h-7 text-emerald-600" />,
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      link: '/projects/dpr',
    },
    {
      id: 'attendance',
      title: 'Site Attendance',
      count: '84 Checked In',
      desc: 'Daily labour & staff biometric muster',
      icon: <Users2 className="w-7 h-7 text-indigo-600" />,
      bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      link: '/labour',
    },
    {
      id: 'material-request',
      title: 'Material Request (MR)',
      count: '+ Indent',
      desc: 'Raise cement, steel & chemical orders',
      icon: <PackagePlus className="w-7 h-7 text-amber-600" />,
      bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      textColor: 'text-amber-700 dark:text-amber-300',
      link: '/procurement/purchase-requests',
    },
    {
      id: 'site-photos',
      title: 'Site Progress Photos',
      count: 'Geo-tagged',
      desc: 'Upload pour card & shuttering photos',
      icon: <Camera className="w-7 h-7 text-purple-600" />,
      bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
      textColor: 'text-purple-700 dark:text-purple-300',
      link: `/projects/${currentProject.id}`,
    },
    {
      id: 'measurements',
      title: 'Measurement Book (MB)',
      count: 'Bill #09',
      desc: 'Enter joint measurements & grid levels',
      icon: <Ruler className="w-7 h-7 text-teal-600" />,
      bg: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
      textColor: 'text-teal-700 dark:text-teal-300',
      link: `/projects/${currentProject.id}`,
    },
    {
      id: 'rfi',
      title: 'Technical RFI',
      count: '3 Open',
      desc: 'Ask structural & MEP design queries',
      icon: <HelpCircle className="w-7 h-7 text-sky-600" />,
      bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
      textColor: 'text-sky-700 dark:text-sky-300',
      link: `/projects/${currentProject.id}`,
    },
    {
      id: 'issues',
      title: 'Snag & Issues Log',
      count: `${openSnags} Active`,
      desc: 'Punch list defects & client observations',
      icon: <AlertOctagon className="w-7 h-7 text-rose-600" />,
      bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      textColor: 'text-rose-700 dark:text-rose-300',
      link: `/projects/${currentProject.id}`,
    },
    {
      id: 'safety',
      title: 'HSE & Tool Box Talk',
      count: '248d Zero LTI',
      desc: 'PPE checks, near-miss & site audits',
      icon: <ShieldCheck className="w-7 h-7 text-orange-600" />,
      bg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
      textColor: 'text-orange-700 dark:text-orange-300',
      link: '/safety',
    },
  ];

  return (
    <div className="space-y-5 pb-8 max-w-5xl mx-auto">
      {/* Top Banner: Site Location, Weather, and Offline Mode Switch */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Site Terminal Mode
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentProject.code}
              </span>
            </div>
            <h1 className="text-xl font-bold mt-1 text-white tracking-tight">
              {currentProject.name}
            </h1>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              {currentProject.location} • Incharge: {currentUser?.name || 'Er. Amit Patel'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Weather Widget */}
            <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-2 text-xs">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <div className="font-bold text-white leading-none">31°C Clear</div>
                <div className="text-[10px] text-slate-400">Pouring Conditions: Optimal</div>
              </div>
            </div>

            {/* Offline Mode Toggle with Tooltip */}
            <div className="relative">
              <button
                onClick={() => setOfflineMode(!offlineMode)}
                onMouseEnter={() => setShowOfflineTooltip(true)}
                onMouseLeave={() => setShowOfflineTooltip(false)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  offlineMode
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800 shadow-inner'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                }`}
              >
                {offlineMode ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    <span>Offline Cache ON</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live 5G Connected</span>
                  </>
                )}
              </button>

              {/* Tooltip */}
              {showOfflineTooltip && (
                <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-xl bg-slate-800 text-slate-200 text-xs border border-slate-700 shadow-2xl z-50 animate-in fade-in">
                  <div className="flex items-start gap-1.5">
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">Offline Sync Active:</strong>
                      Queues DPR entries, measurements, and pour photos in local browser storage when connectivity drops at basement/remote sites. Auto-syncs when signal recovers.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 9 Large Mobile-First Touch Targets Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Site Operations Quick Launch (Large Tap Targets)
          </h2>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            One-Tap Deep Links
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TILES.map((tile) => (
            <button
              key={tile.id}
              onClick={() => navigate(tile.link)}
              className={`p-5 rounded-2xl border ${tile.bg} shadow-sm hover:shadow-md transition text-left flex items-start justify-between group active:scale-[0.98] min-h-[110px]`}
            >
              <div className="space-y-1.5 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900 dark:text-white">
                    {tile.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                  {tile.desc}
                </p>
                <div className="pt-1 flex items-center gap-1.5">
                  <span className={`text-xs font-bold font-mono ${tile.textColor}`}>
                    {tile.count}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                {tile.icon}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Shift Summary Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Shift Checklist & Critical Fronts Today
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600">
            Shift A (08:00 - 18:00)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Critical Pour Front:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Tower C 38th Floor Beam B12-B16
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Transit Mixer RMC Scheduled:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              14:00 PM • 35 m³ M40 Self-Compacting
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-slate-400 block mb-0.5">Inspection Verification:</span>
            <span className="font-bold text-amber-600 dark:text-amber-400">
              Consultant Pre-Pour Card Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
