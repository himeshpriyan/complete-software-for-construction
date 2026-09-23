import React, { useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Brain, TrendingUp, AlertTriangle, ShoppingCart, Clock, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from 'recharts';

const URGENCY = {
  critical: { label: 'Critical — Buy Now', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400', barColor: '#ef4444' },
  soon: { label: 'Buy Soon (<14 days)', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400', barColor: '#f59e0b' },
  adequate: { label: 'Stock Adequate', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400', barColor: '#10b981' },
};

export const MaterialForecastingPage: React.FC = () => {
  const { materials } = useAppStore();

  const insights = useMemo(() => materials
    .filter((m) => m.avgDailyConsumption > 0)
    .map((m) => {
      const daysLeft = Math.floor(m.currentStock / m.avgDailyConsumption);
      const urgency = daysLeft <= 5 ? 'critical' : daysLeft <= 14 ? 'soon' : 'adequate';
      const recommended = Math.max(0, m.reorderLevel * 2.5 - m.currentStock);
      const estCost = recommended * m.currentRate;
      const reorderDate = new Date();
      reorderDate.setDate(reorderDate.getDate() + Math.max(0, daysLeft - 7));
      return { ...m, daysLeft, urgency, recommended, estCost, reorderDate: reorderDate.toISOString().split('T')[0] };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft),
    [materials]
  );

  const critical = insights.filter((i) => i.urgency === 'critical');
  const soon = insights.filter((i) => i.urgency === 'soon');
  const totalPurchaseBudget = insights.filter((i) => i.urgency !== 'adequate').reduce((s, i) => s + i.estCost, 0);

  const chartData = insights.slice(0, 15).map((i) => ({
    name: i.name.length > 16 ? i.name.substring(0, 14) + '…' : i.name,
    days: i.daysLeft,
    urgency: i.urgency,
  }));

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Material Forecasting & Procurement Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1">AI-driven reorder predictions based on site consumption rates · Estimated purchase budget for next 30 days</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: AlertTriangle, label: 'Critical (≤5 days)', value: critical.length.toString(), color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
          { icon: Clock, label: 'Buy Soon (≤14 days)', value: soon.length.toString(), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { icon: ShoppingCart, label: 'Est. Purchase Budget', value: `₹ ${(totalPurchaseBudget / 100000).toFixed(1)} L`, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { icon: TrendingUp, label: 'Materials Tracked', value: insights.length.toString(), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <div><p className="text-xs text-slate-500">{label}</p><p className={`text-base font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>

      {/* Days of Stock Bar Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-600" /> Days of Stock Remaining (Top 15 Active Materials)
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 80, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="#1e293b" opacity={0.2} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v: any) => [`${v} days`, 'Stock Remaining']} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
              <ReferenceLine x={7} stroke="#ef4444" strokeDasharray="4 2" label={{ value: '7d', fontSize: 10, fill: '#ef4444', position: 'top' }} />
              <ReferenceLine x={14} stroke="#f59e0b" strokeDasharray="4 2" label={{ value: '14d', fontSize: 10, fill: '#f59e0b', position: 'top' }} />
              <Bar dataKey="days" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={URGENCY[entry.urgency as keyof typeof URGENCY]?.barColor || '#10b981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-rose-500 inline-block" /> Critical (≤7 days)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" /> Buy Soon (≤14 days)</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Adequate</span>
        </div>
      </div>

      {/* Procurement Forecast Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <Brain className="w-4 h-4 text-amber-600" />
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Smart Procurement Recommendation</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                {['Material', 'Unit', 'Avg Daily Use', 'Current Stock', 'Days Left', 'Reorder By', 'Rec. Qty', 'Est. Cost (₹)', 'Urgency'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {insights.map((m) => {
                const urg = URGENCY[m.urgency as keyof typeof URGENCY] || URGENCY.adequate;
                return (
                  <tr key={m.id} className={`transition-colors ${m.urgency === 'critical' ? 'bg-rose-50/40 dark:bg-rose-950/10' : m.urgency === 'soon' ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''}`}>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">{m.name}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{m.unit}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{m.avgDailyConsumption}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{m.currentStock.toLocaleString('en-IN')}</td>
                    <td className={`px-4 py-3 font-bold ${m.daysLeft <= 5 ? 'text-rose-600 dark:text-rose-400' : m.daysLeft <= 14 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {m.daysLeft}d
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{m.reorderDate}</td>
                    <td className="px-4 py-3 font-semibold text-blue-700 dark:text-blue-400">{m.recommended > 0 ? m.recommended.toFixed(0) : '—'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {m.estCost > 0 ? `₹ ${m.estCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urg.cls}`}>{urg.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Budget footer */}
        <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between">
          <p className="text-sm text-slate-500">Showing {insights.length} materials with consumption data</p>
          <div className="text-right">
            <p className="text-xs text-slate-400">Estimated 30-day procurement budget (urgent + soon)</p>
            <p className="text-lg font-bold text-slate-900 dark:text-white">₹ {totalPurchaseBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
