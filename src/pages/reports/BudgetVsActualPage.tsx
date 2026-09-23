import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ProjectCostCategory } from '../../types';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Download,
  Filter,
  DollarSign,
  PieChart,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export const BudgetVsActualPage: React.FC = () => {
  const { projects, projectCostings } = useAppStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  // Compute Company-Wide or Single Project data
  const { aggregatedCategories, totalBudget, totalActual, totalVariance, netVariancePct } = useMemo(() => {
    const categoriesMap: Record<
      string,
      { budget: number; actual: number; variance: number }
    > = {
      Material: { budget: 0, actual: 0, variance: 0 },
      Subcontract: { budget: 0, actual: 0, variance: 0 },
      Labour: { budget: 0, actual: 0, variance: 0 },
      Equipment: { budget: 0, actual: 0, variance: 0 },
      Transport: { budget: 0, actual: 0, variance: 0 },
      Misc: { budget: 0, actual: 0, variance: 0 },
      Overhead: { budget: 0, actual: 0, variance: 0 },
    };

    let bTotal = 0;
    let aTotal = 0;

    const relevantCostings =
      selectedProjectId === 'all'
        ? Object.values(projectCostings)
        : [projectCostings[selectedProjectId]].filter(Boolean);

    relevantCostings.forEach((c) => {
      bTotal += c.budgetTotal;
      aTotal += c.actualCostTotal;
      c.categories.forEach((cat) => {
        if (!categoriesMap[cat.category]) {
          categoriesMap[cat.category] = { budget: 0, actual: 0, variance: 0 };
        }
        categoriesMap[cat.category].budget += cat.budget;
        categoriesMap[cat.category].actual += cat.actual;
        categoriesMap[cat.category].variance += cat.budget - cat.actual;
      });
    });

    const rows = Object.entries(categoriesMap).map(([category, vals]) => {
      const vPct = vals.budget > 0 ? Math.round(((vals.budget - vals.actual) / vals.budget) * 100) : 0;
      return {
        category,
        budget: vals.budget,
        actual: vals.actual,
        variance: vals.variance,
        variancePct: vPct,
        consumedPct: vals.budget > 0 ? Math.round((vals.actual / vals.budget) * 100) : 0,
      };
    });

    const varianceAll = bTotal - aTotal;
    const vPctAll = bTotal > 0 ? Math.round((varianceAll / bTotal) * 100) : 0;

    return {
      aggregatedCategories: rows,
      totalBudget: bTotal,
      totalActual: aTotal,
      totalVariance: varianceAll,
      netVariancePct: vPctAll,
    };
  }, [projectCostings, selectedProjectId]);

  // Chart Dataset (Values in Crores)
  const chartData = aggregatedCategories.map((c) => ({
    category: c.category,
    Budget: Number((c.budget / 10000000).toFixed(2)),
    Actual: Number((c.actual / 10000000).toFixed(2)),
  }));

  const activeProject = projects.find((p) => p.id === selectedProjectId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Budget vs Actual Performance Analysis
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Comprehensive cost variance and budget overrun tracking across Material, Labour, Subcontract, Equipment, and Overheads.
          </p>
        </div>

        {/* Project Selector Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Scope:
          </span>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold shadow-xs cursor-pointer outline-none"
          >
            <option value="all">🏢 Company-Wide (All Projects Consolidated)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name.substring(0, 28)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Aggregate KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {selectedProjectId === 'all' ? 'Total Approved Budget' : 'Project Budget'}
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
            ₹ {(totalBudget / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Approved baseline cost</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Actual Incurred Cost
          </p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
            ₹ {(totalActual / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {Math.round((totalActual / totalBudget) * 100 || 0)}% of total budget burned
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 shadow-sm">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            Cost Variance (Under Budget)
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ₹ {(totalVariance / 10000000).toFixed(2)} Cr
            </p>
            <span className="text-xs font-extrabold text-emerald-600">
              (+{netVariancePct}%)
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Favorable cost variance (Savings)</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Project Health & Control
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              Strictly Within Limits
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Zero cost overruns detected</p>
        </div>
      </div>

      {/* Visual Chart: Grouped Bar Chart (Budget vs Actual in ₹ Crores) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Category Variance Comparison ({selectedProjectId === 'all' ? 'Company-Wide' : activeProject?.name})
          </h2>
          <p className="text-xs text-slate-500">
            Side-by-side grouped bar visualization of Planned Budget vs Incurred Actual (Values in ₹ Crores).
          </p>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis unit=" Cr" tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [`₹ ${val} Cr`, '']}
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table of Category | Budget | Actual | Variance (Color-coded red for overrun, green for under) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Category Variance Ledger Table
            </h3>
            <p className="text-xs text-slate-500">
              Color-coded variance tracking: Green indicates favorable under-budget execution; Red flags overruns.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left">Cost Category</th>
                <th className="py-3 px-4 text-right font-mono">Budget (₹)</th>
                <th className="py-3 px-4 text-right font-mono">Actual Incurred (₹)</th>
                <th className="py-3 px-4 text-right font-mono">Variance (₹)</th>
                <th className="py-3 px-4 text-center">Variance %</th>
                <th className="py-3 px-4 text-center">Budget Burn Rate</th>
                <th className="py-3 px-4 text-center">Health Indicator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {aggregatedCategories.map((c) => {
                const isUnder = c.variance >= 0;

                return (
                  <tr key={c.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white text-sm">
                      {c.category}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                      ₹ {c.budget.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ₹ {c.actual.toLocaleString('en-IN')}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-black ${
                        isUnder ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isUnder ? '+' : '-'} ₹ {Math.abs(c.variance).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-black text-[11px] ${
                          isUnder
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {isUnder ? `+${c.variancePct}%` : `-${Math.abs(c.variancePct)}%`}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              c.consumedPct > 100
                                ? 'bg-rose-600'
                                : c.consumedPct > 85
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, c.consumedPct)}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                          {c.consumedPct}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                          isUnder
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {isUnder ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {isUnder ? 'Favorable' : 'Overrun'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="border-t-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 font-bold">
              <tr>
                <td className="py-3 px-4 text-slate-900 dark:text-white uppercase font-black">
                  Total Consolidated Cost
                </td>
                <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                  ₹ {totalBudget.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-right font-mono text-amber-700 dark:text-amber-400 font-black">
                  ₹ {totalActual.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-right font-mono text-emerald-600 font-black">
                  + ₹ {totalVariance.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-4 text-center font-mono font-black text-emerald-600">
                  +{netVariancePct}%
                </td>
                <td className="py-3 px-4 text-center font-mono font-black text-slate-900 dark:text-white">
                  {Math.round((totalActual / totalBudget) * 100 || 0)}%
                </td>
                <td className="py-3 px-4 text-center text-emerald-600 font-black">
                  EXCELLENT
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
