import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { SiteEngineerDashboard } from './SiteEngineerDashboard';
import {
  Building2,
  Briefcase,
  Receipt,
  Users,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  HardHat,
  Truck,
  Wrench,
  Boxes,
  Activity,
  Layers,
  Sparkles,
  Bot,
  ChevronRight,
  Eye,
  Sliders,
  Grid,
  BarChart3 as BarChartIcon,
} from 'lucide-react';
import { ModuleHubView } from './ModuleHubView';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    projects,
    leads,
    customerReceivables,
    vendorPayables,
    vendors,
  } = useAppStore();
  const navigate = useNavigate();

  // Primary view tabs: 'modules' (Mansara CRM style App Launcher) vs 'analytics' (Executive Recharts BI)
  const [dashboardTab, setDashboardTab] = useState<'modules' | 'analytics'>('modules');

  // If role is site_engineer, or user toggles view, allow switching
  const [viewMode, setViewMode] = useState<'management' | 'site_engineer'>(
    currentUser?.role === 'site_engineer' ? 'site_engineer' : 'management'
  );

  // If user role is site engineer and user hasn't explicitly chosen management view, show site engineer
  if (currentUser?.role === 'site_engineer' && viewMode === 'site_engineer') {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={() => setViewMode('management')}
            className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Switch to Executive Overview</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <SiteEngineerDashboard />
      </div>
    );
  }

  // ==========================================================================
  // 1. TOP KPI AGGREGATIONS
  // ==========================================================================
  const activeProjectsCount = projects.filter((p) => p.status === 'active' || p.status === 'in_progress').length;
  const runningProjectsCount = projects.filter((p) => p.status === 'in_progress').length;
  const completedProjectsCount = projects.filter((p) => p.status === 'completed' || p.status === 'handover').length;

  const totalContractValue = projects.reduce((sum, p) => sum + (p.contractValue || 0), 0);
  const totalReceivables = customerReceivables.reduce((sum, r) => sum + r.balanceDue, 0);
  const totalPayables = vendorPayables.reduce((sum, p) => sum + p.balanceDue, 0);

  // ==========================================================================
  // 2. RECHARTS DATASETS
  // ==========================================================================

  // (a) Sales Pipeline Funnel / Stage Breakdown
  const salesPipelineData = [
    { stage: 'Prospecting', value: 14, amount: 28 },
    { stage: 'Site Visit', value: 9, amount: 45 },
    { stage: 'BOQ Estimation', value: 6, amount: 62 },
    { stage: 'Proposal / Quote', value: 4, amount: 38 },
    { stage: 'Contract Signed', value: 3, amount: 54 },
  ];

  // (b) Revenue Trend (Monthly Billing vs Target)
  const revenueTrendData = [
    { month: 'Apr', target: 240, billed: 220 },
    { month: 'May', target: 260, billed: 275 },
    { month: 'Jun', target: 280, billed: 265 },
    { month: 'Jul', target: 300, billed: 320 },
    { month: 'Aug', target: 320, billed: 310 },
    { month: 'Sep', target: 340, billed: 355 },
  ];

  // (c) Profitability by Project
  const profitabilityData = projects.map((p) => ({
    name: p.name.length > 14 ? p.name.substring(0, 12) + '...' : p.name,
    contract: Math.round((p.contractValue || 0) / 10000000), // in Cr
    actualCost: Math.round((p.actualCost || 0) / 10000000), // in Cr
    margin: p.contractValue ? Math.round(((p.contractValue - (p.actualCost || 0)) / p.contractValue) * 100) : 0,
  }));

  // (d) Cash Flow Inflows vs Outflows
  const cashFlowTrendData = [
    { month: 'May', inflow: 180, outflow: 140 },
    { month: 'Jun', inflow: 210, outflow: 195 },
    { month: 'Jul', inflow: 290, outflow: 240 },
    { month: 'Aug', inflow: 260, outflow: 270 },
    { month: 'Sep', inflow: 340, outflow: 290 },
  ];

  // (e) Material Consumption Rates
  const materialConsumptionData = [
    { week: 'Wk 1', cement: 1420, rmc: 480 },
    { week: 'Wk 2', cement: 1650, rmc: 520 },
    { week: 'Wk 3', cement: 1380, rmc: 610 },
    { week: 'Wk 4', cement: 1820, rmc: 590 },
  ];

  // (f) Procurement Spend by Category
  const purchaseCategoryData = [
    { name: 'Structural Steel', value: 38, fill: '#3b82f6' },
    { name: 'Ready-Mix Concrete', value: 26, fill: '#10b981' },
    { name: 'Formwork & Shuttering', value: 14, fill: '#f59e0b' },
    { name: 'MEP & Electrical', value: 12, fill: '#8b5cf6' },
    { name: 'Finishes & Tiling', value: 10, fill: '#ec4899' },
  ];

  // (g) Equipment Fleet Utilization
  const equipmentUtilizationData = [
    { name: 'Tower Crane 01', active: 92, idle: 8 },
    { name: 'Transit Mixer 04', active: 85, idle: 15 },
    { name: 'JCB Backhoe', active: 78, idle: 22 },
    { name: 'Concrete Boom Pump', active: 68, idle: 32 },
    { name: 'Bar Bending Unit', active: 90, idle: 10 },
  ];

  // (h) Aggregated Budget vs Actual
  const budgetVsActualAggregated = [
    { category: 'Substructure', budget: 14.5, actual: 13.8 },
    { category: 'Superstructure', budget: 38.2, actual: 41.5 },
    { category: 'MEP Services', budget: 18.0, actual: 16.4 },
    { category: 'Finishes', budget: 22.4, actual: 21.0 },
    { category: 'Site Overheads', budget: 6.5, actual: 7.2 },
  ];

  // ==========================================================================
  // 6(c) AI PROJECT RISK WIDGET COMPUTATION (Heuristic on Seeded Data)
  // ==========================================================================
  const delayedProjects = projects.filter((p) => p.health === 'delayed');
  const atRiskProjects = projects.filter((p) => p.health === 'at_risk');
  const totalCost = projects.reduce((sum, p) => sum + (p.actualCost || 0), 0);
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const costVariancePct = totalBudget > 0 ? Math.round(((totalCost - totalBudget) / totalBudget) * 100) : 0;

  const delayRiskLevel = delayedProjects.length > 0 ? 'Medium' : 'Low';
  const delayRationale =
    delayedProjects.length > 0
      ? `${delayedProjects[0]?.name} is running ${delayedProjects[0]?.delayDays || 14} days behind schedule due to monsoon casting pauses.`
      : 'All active project sites progressing within scheduled Gantt float margins.';

  const costRiskLevel = costVariancePct > 5 ? 'High' : costVariancePct > 0 ? 'Low' : 'Minimal';
  const costRationale =
    costVariancePct > 0
      ? `Cumulative portfolio costs tracking +${costVariancePct}% against initial baseline budget, driven by structural steel index price changes.`
      : 'Expenditure across all 6 active sites tracking 2.4% below planned budget allowances.';

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5 tracking-tight">
            <Building2 className="w-7 h-7 text-amber-600" />
            BuildOS Enterprise Operations
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Unified construction management hub, filtered module workspaces, and real-time execution controls
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Tab Controls: Module Hub vs Executive BI */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setDashboardTab('modules')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dashboardTab === 'modules'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-amber-600" />
              <span>Module Hub</span>
            </button>
            <button
              onClick={() => setDashboardTab('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dashboardTab === 'analytics'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChartIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Executive BI</span>
            </button>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'management' ? 'site_engineer' : 'management')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 hover:text-slate-900 transition shadow-xs"
            title="Switch to Mobile Site Engineer View"
          >
            <HardHat className="w-3.5 h-3.5 text-amber-600" />
            <span>Site Mode</span>
          </button>
        </div>
      </div>

      {/* RENDER CONTENT BASED ON SELECTED TAB */}
      {dashboardTab === 'modules' ? (
        <ModuleHubView />
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 1. TOP KPI ROW */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Active Projects
              </span>
              <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
                {activeProjectsCount}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Sites under execution</span>
            </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Running In-Progress
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-blue-600 dark:text-blue-400">
            {runningProjectsCount}
          </div>
          <span className="text-[11px] text-slate-400">Structural & MEP stage</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Completed / Handover
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {completedProjectsCount}
          </div>
          <span className="text-[11px] text-slate-400">DLP warranty active</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Total Contract Value
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ₹ {(totalContractValue / 10000000).toFixed(1)} Cr
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Order book portfolio</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Customer Receivables
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            ₹ {(totalReceivables / 100000).toFixed(1)} L
          </div>
          <span className="text-[11px] text-slate-400">RA bills pending client</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Vendor Payables
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
            ₹ {(totalPayables / 100000).toFixed(1)} L
          </div>
          <span className="text-[11px] text-slate-400">Material & sub bills</span>
        </div>
      </div>

      {/* 6(c) AI PROJECT RISK ANALYZER WIDGET (Ground Truth Heuristic) */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white border border-indigo-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/40 flex items-center gap-1">
                <Bot className="w-3 h-3" />
                AI Project Risk Engine (Illustrative Demo)
              </span>
              <span className="text-xs text-slate-400">Continuous Portfolio Telemetry</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Autonomous Site Delay & Cost Overrun Diagnostic
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl">
              Computed from real-time variance across 6 site DPRs, procurement schedules, and certified BOQ measurements.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-center min-w-[120px]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Delay Risk</span>
              <span
                className={`text-base font-black ${
                  delayRiskLevel === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {delayRiskLevel}
              </span>
            </div>

            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-center min-w-[120px]">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Cost Overrun</span>
              <span
                className={`text-base font-black ${
                  costRiskLevel === 'High' ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {costRiskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* 1-Line Grounded Rationales */}
        <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Schedule Rationale:</strong> {delayRationale}
            </div>
          </div>
          <div className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Cost Variance Rationale:</strong> {costRationale}
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROJECT HEALTH GRID / LIST (🟢 On Track, 🟡 At Risk, 🔴 Delayed) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Live Project Health & Progress Matrix
            </h3>
            <p className="text-xs text-slate-500">
              🟢 On Track • 🟡 At Risk • 🔴 Delayed status with direct drill-down into site detail
            </p>
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            All Projects Directory <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const isDelayed = proj.health === 'delayed';
            const isAtRisk = proj.health === 'at_risk';
            const isOnTrack = proj.health === 'on_track';
            const progress = proj.completionPercentage || proj.completionPct || 65;

            return (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}`)}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 shadow-xs hover:shadow-md transition cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                      {proj.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">{proj.location}</p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${
                      isOnTrack
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300'
                        : isAtRisk
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isOnTrack ? 'bg-emerald-500' : isAtRisk ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    />
                    {isOnTrack ? 'On Track' : isAtRisk ? 'At Risk' : 'Delayed'}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Physical Progress:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOnTrack
                          ? 'bg-emerald-500'
                          : isAtRisk
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Manager: {proj.projectManager}</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                    ₹ {((proj.contractValue || 0) / 10000000).toFixed(1)} Cr
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MULTI-COLUMN DATA-DENSE ANALYTICS CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Sales Pipeline Funnel Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Sales Pipeline Funnel (Value in ₹ Cr)
            </h4>
            <span className="text-xs text-slate-400">Pre-construction bids</span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesPipelineData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip />
                <Bar dataKey="amount" fill="#6366f1" radius={[0, 4, 4, 0]} name="Value (₹ Cr)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Revenue Trend (Monthly Billing vs Target) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Revenue Trend vs Target (₹ Lakhs)
            </h4>
            <span className="text-xs text-emerald-600 font-semibold">+5.4% Target Achieved</span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" name="Target (L)" />
                <Line type="monotone" dataKey="billed" stroke="#10b981" strokeWidth={3} name="Billed (L)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Project Profitability (Bar: Contract vs Actual Cost vs Margin) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Project Profitability (Contract vs Cost in ₹ Cr)
            </h4>
            <span className="text-xs text-slate-400">Avg Margin: 18.2%</span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitabilityData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="contract" fill="#3b82f6" name="Contract ₹ Cr" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actualCost" fill="#f59e0b" name="Cost ₹ Cr" radius={[4, 4, 0, 0]} />
                <Bar dataKey="margin" fill="#10b981" name="Profit Margin ₹ Cr" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Corporate Cash Flow (Inflow vs Outflow) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Consolidated Cash Flow (₹ Lakhs)
            </h4>
            <span className="text-xs text-emerald-600 font-semibold">Net Positive Reserve</span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowTrendData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="inflow" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="Cash Inflow" />
                <Area type="monotone" dataKey="outflow" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} name="Cash Outflow" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Material Consumption Trend */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Weekly Material Consumption Rate
            </h4>
            <span className="text-xs text-slate-400">Cement Bags vs RMC m³</span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={materialConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="cementBags" fill="#8b5cf6" name="Cement (Bags)" />
                <Bar dataKey="rmcM3" fill="#06b6d4" name="RMC Concrete (m³)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Purchase Spend Breakdown Category Pie */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Procurement Category Spend Share
            </h4>
            <span className="text-xs text-slate-400">YTD SCM Spend</span>
          </div>
          <div className="h-56 sm:h-64 flex flex-col sm:flex-row items-center justify-around">
            <div className="w-48 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={purchaseCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {purchaseCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 text-xs">
              {purchaseCategoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                  <span className="text-slate-600 dark:text-slate-400">{cat.name}:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 7: Equipment Fleet Utilization (% Active vs Idle) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Heavy Equipment Fleet Utilization (%)
            </h4>
            <span className="text-xs text-emerald-600 font-semibold">82.6% Fleet Active</span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={equipmentUtilizationData} layout="vertical" margin={{ left: 25 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="active" stackId="a" fill="#10b981" name="% Active" />
                <Bar dataKey="idle" stackId="a" fill="#e2e8f0" name="% Standby / Service" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 8: Company-Wide Aggregated Budget vs Actual */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Company-Wide Budget vs Actual (₹ Cr)
            </h4>
            <span className="text-xs text-slate-400">Structural to Finishes</span>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetVsActualAggregated}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="budget" fill="#64748b" name="Budget ₹ Cr" />
                <Bar dataKey="actual" fill="#f59e0b" name="Actual Cost ₹ Cr" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};
