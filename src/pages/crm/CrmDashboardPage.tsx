import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from 'recharts';
import {
  Users,
  TrendingUp,
  Target,
  DollarSign,
  Compass,
  FileCheck2,
  PhoneCall,
  ArrowUpRight,
  Plus,
  Building2,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

const SOURCE_COLORS = [
  '#d97706', // amber-600
  '#2563eb', // blue-600
  '#059669', // emerald-600
  '#7c3aed', // violet-600
  '#db2777', // pink-600
  '#0891b2', // cyan-600
  '#ea580c', // orange-600
  '#4f46e5', // indigo-600
  '#64748b', // slate-500
  '#10b981', // emerald-500
];

export const CrmDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { leads, siteVisits, followUps } = useAppStore();

  // Metrics computation
  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.stage === 'won');
  const wonValue = wonLeads.reduce((acc, l) => acc + l.budget, 0);
  const totalPipelineValue = leads.filter((l) => l.stage !== 'lost').reduce((acc, l) => acc + l.budget, 0);
  const conversionRate = totalLeads > 0 ? ((wonLeads.length / totalLeads) * 100).toFixed(1) : '0';
  const siteVisitsCompleted = siteVisits.filter((v) => v.status === 'completed' || v.status === 'approved').length;
  const quotationsSent = leads.filter((l) =>
    ['quotation', 'negotiation', 'approved', 'contract', 'won'].includes(l.stage)
  ).length;

  // Pipeline Funnel data
  const funnelData = useMemo(() => {
    const stages = [
      { key: 'new_lead', label: 'New Lead' },
      { key: 'contacted', label: 'Contacted' },
      { key: 'requirement_collected', label: 'Req. Done' },
      { key: 'site_visit', label: 'Site Visit' },
      { key: 'estimation', label: 'Estimation' },
      { key: 'quotation', label: 'Quotation' },
      { key: 'negotiation', label: 'Negotiation' },
      { key: 'approved', label: 'Approved' },
      { key: 'contract', label: 'Contract' },
      { key: 'won', label: 'Won' },
    ];
    return stages.map((s) => ({
      stage: s.label,
      leads: leads.filter((l) => l.stage === s.key).length,
      valueCr: Number(
        (leads.filter((l) => l.stage === s.key).reduce((sum, l) => sum + l.budget, 0) / 10000000).toFixed(2)
      ),
    }));
  }, [leads]);

  // Lead Sources donut data
  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      counts[l.source] = (counts[l.source] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
    }));
  }, [leads]);

  // Project type distribution
  const projectTypeData = useMemo(() => {
    const types: Record<string, { count: number; totalBudget: number }> = {};
    leads.forEach((l) => {
      if (!types[l.projectType]) types[l.projectType] = { count: 0, totalBudget: 0 };
      types[l.projectType].count += 1;
      types[l.projectType].totalBudget += l.budget;
    });
    return Object.entries(types).map(([type, d]) => ({
      type,
      count: d.count,
      valueCr: (d.totalBudget / 10000000).toFixed(1),
    }));
  }, [leads]);

  // 6-Month sales trend data
  const monthlyTrends = [
    { month: 'Apr', leads: 12, wonValueCr: 14.5, quotations: 5 },
    { month: 'May', leads: 15, wonValueCr: 21.0, quotations: 7 },
    { month: 'Jun', leads: 18, wonValueCr: 28.5, quotations: 8 },
    { month: 'Jul', leads: 22, wonValueCr: 25.0, quotations: 10 },
    { month: 'Aug', leads: 20, wonValueCr: 36.0, quotations: 11 },
    { month: 'Sep', leads: 25, wonValueCr: 41.2, quotations: 14 },
  ];

  // Sales Rep performance
  const repPerformance = useMemo(() => {
    const reps = ['Siddharth Rao', 'Natasha Bose', 'Pooja Kulkarni'];
    return reps.map((rep) => {
      const repLeads = leads.filter((l) => l.assignedSalesperson === rep);
      const won = repLeads.filter((l) => l.stage === 'won');
      const pipelineVal = repLeads.reduce((acc, l) => acc + l.budget, 0);
      const wonVal = won.reduce((acc, l) => acc + l.budget, 0);
      return {
        name: rep,
        total: repLeads.length,
        wonCount: won.length,
        pipelineCr: (pipelineVal / 10000000).toFixed(2),
        wonCr: (wonVal / 10000000).toFixed(2),
      };
    });
  }, [leads]);

  // Recent timeline activities across all leads
  const recentActivities = useMemo(() => {
    const list: Array<{ leadName: string; leadId: string; activity: any }> = [];
    leads.forEach((l) => {
      l.activities.forEach((act) => {
        list.push({ leadName: l.customerName, leadId: l.id, activity: act });
      });
    });
    return list.slice(0, 6);
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="CRM Analytics & Sales Cockpit"
        subtitle="Real-time revenue pipeline, lead stage velocity, channel distribution, and team conversion metrics"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/crm/pipeline')}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
            >
              Open Pipeline Kanban
            </button>
            <button
              onClick={() => navigate('/crm/pipeline')}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Lead</span>
            </button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          title="Active Leads"
          value={totalLeads.toString()}
          subtext="Total opportunities in pipeline"
          icon="Users"
          trend="up"
        />
        <StatCard
          title="Pipeline Value"
          value={`₹ ${(totalPipelineValue / 10000000).toFixed(1)} Cr`}
          subtext="Active pipeline valuation"
          icon="Target"
          trend="up"
        />
        <StatCard
          title="Contracts Won"
          value={`₹ ${(wonValue / 10000000).toFixed(1)} Cr`}
          subtext={`${wonLeads.length} deals closed successfully`}
          icon="DollarSign"
          trend="up"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          subtext="Lead to won conversion"
          icon="TrendingUp"
          trend="up"
        />
        <StatCard
          title="Site Inspections"
          value={siteVisitsCompleted.toString()}
          subtext={`${siteVisits.length} scheduled total`}
          icon="Compass"
          trend="neutral"
        />
        <StatCard
          title="Quotations Sent"
          value={quotationsSent.toString()}
          subtext="Proposals out for review"
          icon="FileCheck2"
          trend="up"
        />
      </div>

      {/* Charts Row 1: Funnel & 6-Month Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pipeline Stage Funnel (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Pipeline Stage Velocity & Lead Count
              </h3>
              <p className="text-xs text-slate-500">Distribution of deals across standard sales lifecycle</p>
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md">
              Total 10 Stages
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="stage" angle={-25} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-700">
                          <p className="font-bold text-amber-400">{label}</p>
                          <p className="mt-1">Active Leads: <strong>{data.leads}</strong></p>
                          <p>Total Value: <strong>₹ {data.valueCr} Cr</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="leads" fill="#d97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Acquisition Sources (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Lead Sources</h3>
              <p className="text-xs text-slate-500">Acquisition channel breakdown</p>
            </div>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SOURCE_COLORS[index % SOURCE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0];
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2 rounded shadow">
                          <p className="font-semibold">{d.name}: {d.value} leads</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Source Badges Legend */}
          <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px] max-h-28 overflow-y-auto">
            {sourceData.map((s, idx) => (
              <div key={s.name} className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: SOURCE_COLORS[idx % SOURCE_COLORS.length] }}
                />
                <span className="truncate text-slate-600 dark:text-slate-400">{s.name}</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: 6-Month Sales Trend & Project Types */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 6-Month Sales & Revenue Growth (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                6-Month Revenue & Inflow Trend (FY 2026-27)
              </h3>
              <p className="text-xs text-slate-500">Closed deal revenue (₹ Cr) vs Monthly lead inflow</p>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="wonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white text-xs p-2.5 rounded-lg shadow-xl border border-slate-700 space-y-1">
                          <p className="font-bold text-amber-400">{label}</p>
                          <p>Won Contract Value: <strong>₹ {payload[0]?.value} Cr</strong></p>
                          <p>New Inflow Leads: <strong>{payload[1]?.value}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area
                  type="monotone"
                  dataKey="wonValueCr"
                  name="Won Value (₹ Cr)"
                  stroke="#d97706"
                  fillOpacity={1}
                  fill="url(#wonGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="leads"
                  name="New Leads Inflow"
                  stroke="#2563eb"
                  fillOpacity={1}
                  fill="url(#leadsGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Type Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Project Type Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">Pipeline by construction sector</p>

            <div className="space-y-3">
              {projectTypeData.map((pt) => (
                <div key={pt.type} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      <span>{pt.type}</span>
                    </span>
                    <span className="text-amber-600 dark:text-amber-400">₹ {pt.valueCr} Cr</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>{pt.count} Active Projects</span>
                    <span>{((pt.count / totalLeads) * 100).toFixed(0)}% of volume</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(pt.count / totalLeads) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Focus: Residential & Commercial</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">88% of Pipeline</span>
          </div>
        </div>
      </div>

      {/* Row 3: Sales Rep Leaderboard & Recent CRM Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Rep Leaderboard (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Sales Rep Pipeline & Win Performance
              </h3>
              <p className="text-xs text-slate-500">Deals managed by account executives</p>
            </div>
          </div>

          <div className="space-y-3">
            {repPerformance.map((rep, idx) => (
              <div
                key={rep.name}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{rep.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {rep.total} active leads • {rep.wonCount} won contracts
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">₹ {rep.wonCr} Cr Won</p>
                  <p className="text-[11px] text-slate-500">₹ {rep.pipelineCr} Cr In Pipeline</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Touchpoints & Activity Feed (6 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Live Sales Touchpoints Feed
              </h3>
              <p className="text-xs text-slate-500">Real-time client activities & interactions</p>
            </div>
            <button
              onClick={() => navigate('/crm/follow-ups')}
              className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 mt-0.5">
                  {item.activity.type === 'call' && <PhoneCall className="w-3.5 h-3.5" />}
                  {item.activity.type === 'site_visit' && <Compass className="w-3.5 h-3.5" />}
                  {item.activity.type === 'status_change' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {item.activity.type === 'note' && <FileCheck2 className="w-3.5 h-3.5" />}
                  {item.activity.type === 'whatsapp' && <Users className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.leadName}
                    </p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {item.activity.relativeTime || item.activity.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">
                    {item.activity.title}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">{item.activity.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
