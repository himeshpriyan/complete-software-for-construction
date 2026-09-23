import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SITES } from '../../data/procurementSeed';
import {
  Warehouse, AlertTriangle, TrendingDown, ArrowRightLeft, Package, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

const STATUS_CFG = {
  ok: { label: 'OK', cls: 'text-emerald-700 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-950/50' },
  low: { label: 'Low', cls: 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-950/50' },
  critical: { label: 'Critical', cls: 'text-rose-700 bg-rose-100 dark:text-rose-400 dark:bg-rose-950/50' },
  excess: { label: 'Excess', cls: 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-950/50' },
};

export const StockDashboardPage: React.FC = () => {
  const { stockLedger, materials } = useAppStore();
  const [selectedSite, setSelectedSite] = useState<string>('all');

  const filtered = useMemo(() =>
    selectedSite === 'all' ? stockLedger : stockLedger.filter((s) => s.siteId === selectedSite),
    [stockLedger, selectedSite]
  );

  const critical = filtered.filter((s) => s.stockStatus === 'critical').length;
  const low = filtered.filter((s) => s.stockStatus === 'low').length;
  const totalValue = filtered.reduce((sum, s) => sum + Math.max(0, s.closingValue), 0);

  // Bar chart: stock value by site
  const siteValueData = useMemo(() => SITES.map((site) => ({
    site: site.name.split(' – ')[0],
    value: stockLedger
      .filter((s) => s.siteId === site.id)
      .reduce((sum, s) => sum + Math.max(0, s.closingValue), 0) / 100000,
  })).filter((d) => d.value > 0), [stockLedger]);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Multi-Site Inventory Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Stock ledger: Opening + Purchase + Transfer In − Issue − Wastage − Transfer Out = Closing</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Warehouse, label: 'Total Stock Value', value: `₹ ${(totalValue / 100000).toFixed(1)} L`, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { icon: AlertTriangle, label: 'Critical Items', value: critical.toString(), color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
          { icon: TrendingDown, label: 'Low / Reorder', value: low.toString(), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { icon: Package, label: 'Material Lines', value: filtered.length.toString(), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500">{label}</p>
              <p className={`text-base font-bold ${color}`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bar Chart: Stock Value by Site */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-600" /> Stock Value by Site (₹ Lakhs)
        </h2>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={siteValueData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.2} />
              <XAxis dataKey="site" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: any) => [`₹ ${Number(v || 0).toFixed(2)} L`, 'Stock Value']} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                {siteValueData.map((_, i) => (
                  <Cell key={i} fill={['#d97706', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b'][i % 6]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ledger Filter */}
      <div className="flex items-center gap-3">
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
        >
          <option value="all">All Sites</option>
          {SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <span className="text-sm text-slate-500">{filtered.length} stock lines</span>
      </div>

      {/* Ledger Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                {['Material', 'Site', 'Unit', 'Opening', 'Purchase', 'Transfer In', 'Site Issue', 'Wastage', 'Transfer Out', 'Adj.', 'Closing', 'Value (₹)', 'Status'].map((h) => (
                  <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((sl) => {
                const sc = STATUS_CFG[sl.stockStatus] || STATUS_CFG.ok;
                const rowCls = sl.stockStatus === 'critical' ? 'bg-rose-50/40 dark:bg-rose-950/10' : sl.stockStatus === 'low' ? 'bg-amber-50/40 dark:bg-amber-950/10' : '';
                return (
                  <tr key={sl.id} className={`${rowCls} hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors`}>
                    <td className="px-3 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">{sl.materialName}</td>
                    <td className="px-3 py-3 text-xs text-slate-500 whitespace-nowrap">{sl.siteName.split(' – ')[0]}</td>
                    <td className="px-3 py-3 text-xs text-slate-500">{sl.materialUnit}</td>
                    <td className="px-3 py-3 text-center text-slate-700 dark:text-slate-300">{sl.openingStock}</td>
                    <td className="px-3 py-3 text-center text-emerald-700 dark:text-emerald-400 font-medium">{sl.purchaseReceipt}</td>
                    <td className="px-3 py-3 text-center text-blue-700 dark:text-blue-400">{sl.transferIn}</td>
                    <td className="px-3 py-3 text-center text-amber-700 dark:text-amber-400">{sl.siteIssue}</td>
                    <td className="px-3 py-3 text-center text-slate-600 dark:text-slate-400">{sl.consumption}</td>
                    <td className="px-3 py-3 text-center text-purple-700 dark:text-purple-400">{sl.transferOut}</td>
                    <td className="px-3 py-3 text-center text-rose-700 dark:text-rose-400">{sl.adjustment}</td>
                    <td className={`px-3 py-3 text-center font-bold ${sl.closingStock < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>{sl.closingStock}</td>
                    <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-300 whitespace-nowrap font-medium">
                      {sl.closingValue < 0 ? '−' : ''}₹ {Math.abs(sl.closingValue).toLocaleString()}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.cls}`}>{sc.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
