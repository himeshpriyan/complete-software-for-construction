import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project, ProjectCosting } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  ArrowRight,
  Receipt,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ComposedChart,
  Line,
  CartesianGrid,
} from 'recharts';

interface ProjectCostingTabProps {
  project: Project;
}

const CATEGORY_COLORS: Record<string, string> = {
  Material: '#f59e0b', // amber
  Subcontract: '#6366f1', // indigo
  Labour: '#10b981', // emerald
  Equipment: '#0ea5e9', // sky
  Transport: '#8b5cf6', // purple
  Misc: '#ec4899', // pink
  Overhead: '#64748b', // slate
};

export const ProjectCostingTab: React.FC<ProjectCostingTabProps> = ({ project }) => {
  const navigate = useNavigate();
  const { projectCostings } = useAppStore();

  // Find costing or fallback default based on project actualCost & budget
  const costing: ProjectCosting = projectCostings[project.id] || {
    projectId: project.id,
    projectName: project.name,
    contractValue: project.contractValue,
    budgetTotal: project.budget,
    actualCostTotal: project.actualCost,
    projectMarginAmount: project.contractValue - project.actualCost,
    projectMarginPct: Math.round(((project.contractValue - project.actualCost) / project.contractValue) * 100),
    budgetMarginAmount: project.contractValue - project.budget,
    budgetMarginPct: Math.round(((project.contractValue - project.budget) / project.contractValue) * 100),
    categories: [
      { id: '1', category: 'Material', budget: Math.round(project.budget * 0.45), actual: Math.round(project.actualCost * 0.45), variance: Math.round(project.budget * 0.45 - project.actualCost * 0.45), variancePct: 58 },
      { id: '2', category: 'Subcontract', budget: Math.round(project.budget * 0.25), actual: Math.round(project.actualCost * 0.25), variance: Math.round(project.budget * 0.25 - project.actualCost * 0.25), variancePct: 58 },
      { id: '3', category: 'Labour', budget: Math.round(project.budget * 0.15), actual: Math.round(project.actualCost * 0.15), variance: Math.round(project.budget * 0.15 - project.actualCost * 0.15), variancePct: 58 },
      { id: '4', category: 'Equipment', budget: Math.round(project.budget * 0.08), actual: Math.round(project.actualCost * 0.08), variance: Math.round(project.budget * 0.08 - project.actualCost * 0.08), variancePct: 58 },
      { id: '5', category: 'Transport', budget: Math.round(project.budget * 0.03), actual: Math.round(project.actualCost * 0.03), variance: Math.round(project.budget * 0.03 - project.actualCost * 0.03), variancePct: 58 },
      { id: '6', category: 'Misc', budget: Math.round(project.budget * 0.02), actual: Math.round(project.actualCost * 0.02), variance: Math.round(project.budget * 0.02 - project.actualCost * 0.02), variancePct: 58 },
      { id: '7', category: 'Overhead', budget: Math.round(project.budget * 0.02), actual: Math.round(project.actualCost * 0.02), variance: Math.round(project.budget * 0.02 - project.actualCost * 0.02), variancePct: 58 },
    ],
    monthlyCostTrend: [],
  };

  const [chartView, setChartView] = useState<'waterfall' | 'comparison'>('waterfall');

  // Waterfall dataset: starts at Contract Value, subtracts each actual cost head, lands on Project Margin!
  const waterfallData = [
    { name: 'Contract Value', value: Math.round(costing.contractValue / 10000000), fill: '#10b981', isTotal: true },
    ...costing.categories.map((c) => ({
      name: `- ${c.category}`,
      value: -Math.round(c.actual / 10000000),
      fill: CATEGORY_COLORS[c.category] || '#64748b',
      isCost: true,
    })),
    {
      name: 'Project Margin',
      value: Math.round(costing.projectMarginAmount / 10000000),
      fill: '#f59e0b',
      isTotal: true,
    },
  ];

  // Budget vs Actual grouped comparison data
  const comparisonData = costing.categories.map((c) => ({
    category: c.category,
    Budget: Math.round(c.budget / 100000), // in Lakhs
    Actual: Math.round(c.actual / 100000),
  }));

  return (
    <div className="space-y-6">
      {/* Top Margin & Contract Commercial Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contract Agreed Value</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹ {(costing.contractValue / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Fixed lumpsum turnkey contract</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Approved Cost Budget</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹ {(costing.budgetTotal / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
            Planned Margin: ₹ {(costing.budgetMarginAmount / 10000000).toFixed(2)} Cr ({costing.budgetMarginPct}%)
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Actual Incurred Cost to Date
          </p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            ₹ {(costing.actualCostTotal / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {Math.round((costing.actualCostTotal / costing.budgetTotal) * 100)}% of total budget consumed
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 shadow-sm">
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            Current Project Margin
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
              ₹ {(costing.projectMarginAmount / 10000000).toFixed(2)} Cr
            </p>
            <span className="text-sm font-extrabold text-amber-600">
              ({costing.projectMarginPct}%)
            </span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Contract Value minus Incurred Cost</p>
        </div>
      </div>

      {/* Commercial & Financial Cross-Links */}
      <div className="bg-slate-900 rounded-xl p-3.5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Commercial Financial Controls</p>
            <p className="text-[11px] text-slate-400">Deep-link to company-wide variance analytics and project running billing.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/reports/budget-vs-actual')}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <span>Budget vs Actual Report</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => navigate('/billing/ra-bills')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Receipt className="h-3.5 w-3.5 text-amber-400" />
            <span>RA Bills</span>
          </button>
        </div>
      </div>

      {/* Visual Chart: Margin Breakdown (Waterfall / Grouped Bar) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              {chartView === 'waterfall'
                ? 'Commercial Waterfall Analysis (Contract Value → Cost Heads → Margin)'
                : 'Category Budget vs Incurred Cost (₹ Lakhs)'}
            </h3>
            <p className="text-xs text-slate-500">
              Direct cost elements breakdown: Material + Labour + Subcontract + Equipment + Transport + Misc + Overhead = Actual Cost
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setChartView('waterfall')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                chartView === 'waterfall'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Waterfall Chart
            </button>
            <button
              onClick={() => setChartView('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                chartView === 'comparison'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Budget vs Actual
            </button>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartView === 'waterfall' ? (
              <BarChart data={waterfallData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis unit=" Cr" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₹ ${Math.abs(Number(val))} Cr`, 'Amount']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis unit=" L" tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val: any) => [`₹ ${val} Lakhs`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Actual" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Itemized Cost Breakdown Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Cost Component Ledger (All 7 Cost Centers)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left">Cost Component</th>
                <th className="py-3 px-4 text-right font-mono">Planned Budget (₹)</th>
                <th className="py-3 px-4 text-right font-mono">Actual Incurred (₹)</th>
                <th className="py-3 px-4 text-right font-mono">Variance (Savings)</th>
                <th className="py-3 px-4 text-center">% of Total Cost</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {costing.categories.map((c) => {
                const pctOfTotal = Math.round((c.actual / costing.actualCostTotal) * 100);
                const isUnderBudget = c.actual <= c.budget;

                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[c.category] || '#64748b' }}
                        />
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {c.category}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                      ₹ {c.budget.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ₹ {c.actual.toLocaleString('en-IN')}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-bold ${
                        isUnderBudget ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isUnderBudget ? '+' : '-'} ₹ {Math.abs(c.variance).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pctOfTotal}%`,
                              backgroundColor: CATEGORY_COLORS[c.category] || '#f59e0b',
                            }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                          {pctOfTotal}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          isUnderBudget
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {isUnderBudget ? 'Under Budget' : 'Overrun'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 font-bold">
              <tr>
                <td className="py-3 px-4 text-slate-900 dark:text-white uppercase font-black">
                  Total Actual Cost
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                  ₹ {costing.budgetTotal.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-right font-mono text-amber-700 dark:text-amber-400 text-sm font-black">
                  ₹ {costing.actualCostTotal.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 font-black">
                  ₹ {(costing.budgetTotal - costing.actualCostTotal).toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-center font-mono font-black text-slate-900 dark:text-white">
                  100%
                </td>
                <td className="py-3 px-4 text-center text-emerald-600 font-black">
                  ON TRACK
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
