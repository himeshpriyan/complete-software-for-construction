import React, { useState, useMemo } from 'react';
import { equipmentSeed } from '../../data/resourceSeed';
import { Fuel, TrendingUp, DollarSign, Activity, BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, Legend, ComposedChart, Area
} from 'recharts';
import { FuelEntry } from '../../types';

// Flatten all fuel entries with equipment name attached
const allFuelEntries: (FuelEntry & { equipmentName: string; equipmentCode: string })[] = equipmentSeed
  .flatMap((eq) => eq.fuelEntries.map((fe) => ({ ...fe, equipmentName: eq.name, equipmentCode: eq.code })))
  .sort((a, b) => b.date.localeCompare(a.date));

const FUEL_COLORS = ['#f59e0b', '#06b6d4', '#8b5cf6', '#10b981', '#ef4444', '#f97316'];

export const FuelManagementPage: React.FC = () => {
  const [selectedEquipment, setSelectedEquipment] = useState('all');

  const equipmentWithFuel = useMemo(() => equipmentSeed.filter((eq) => eq.fuelEntries.length > 0), []);

  const filtered = useMemo(() => selectedEquipment === 'all' ? allFuelEntries : allFuelEntries.filter((fe) => fe.equipmentId === selectedEquipment), [selectedEquipment]);

  // Per-equipment aggregates for comparison chart
  const perEquipmentStats = useMemo(() => equipmentWithFuel.map((eq) => ({
    name: eq.code.split('-').slice(1).join('-'),
    fullName: eq.name,
    totalLitres: eq.fuelEntries.reduce((s, fe) => s + fe.litres, 0),
    totalCost: eq.fuelEntries.reduce((s, fe) => s + fe.totalCost, 0),
    hoursRun: eq.currentMonthHours,
    litresPerHour: eq.currentMonthHours > 0
      ? (eq.fuelEntries.reduce((s, fe) => s + fe.litres, 0) / eq.currentMonthHours).toFixed(2)
      : '—',
  })), [equipmentWithFuel]);

  // Monthly fuel cost trend (aggregate)
  const monthlyTrend = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((month) => ({
    month,
    cost: equipmentSeed.reduce((s, eq) => {
      const m = eq.monthlyUsage.find((mu) => mu.month === month);
      return s + (m?.cost || 0);
    }, 0),
    litres: equipmentSeed.reduce((s, eq) => {
      const m = eq.monthlyUsage.find((mu) => mu.month === month);
      return s + (m?.fuel || 0);
    }, 0),
  }));

  const totalCost = allFuelEntries.reduce((s, fe) => s + fe.totalCost, 0);
  const totalLitres = allFuelEntries.reduce((s, fe) => s + fe.litres, 0);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fuel Management</h1>
        <p className="text-sm text-slate-500 mt-1">Fuel log across all equipment · Efficiency analysis · Monthly cost trend</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Fuel, label: 'Total Fuel (This Month)', value: `${totalLitres.toFixed(0)} L`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { icon: DollarSign, label: 'Total Fuel Cost', value: `₹ ${totalCost.toLocaleString('en-IN')}`, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
          { icon: Activity, label: 'Active Equipment', value: equipmentWithFuel.length.toString(), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { icon: TrendingUp, label: 'Avg Cost/Machine', value: `₹ ${Math.round(totalCost / Math.max(equipmentWithFuel.length, 1)).toLocaleString('en-IN')}`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <div><p className="text-xs text-slate-500">{label}</p><p className={`text-base font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>

      {/* Monthly Trend */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-amber-600" /> Monthly Fuel Cost & Volume Trend (All Fleet)</h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={monthlyTrend}>
              <CartesianGrid vertical={false} stroke="#1e293b" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="cost" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="litres" orientation="right" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} formatter={(v: any, n: any) => [n === 'cost' ? `₹ ${Number(v || 0).toLocaleString('en-IN')}` : `${v} L`, n === 'cost' ? 'Fuel Cost' : 'Litres']} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area yAxisId="cost" type="monotone" dataKey="cost" fill="#fef3c7" stroke="#f59e0b" strokeWidth={2} name="cost" />
              <Bar yAxisId="litres" dataKey="litres" fill="#06b6d4" opacity={0.7} radius={[4, 4, 0, 0]} name="litres" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-Equipment Comparison */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Fuel Consumption by Equipment</h2>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perEquipmentStats} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid horizontal={false} stroke="#1e293b" opacity={0.15} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }} formatter={(v: any) => [`${v} L`, 'Litres']} />
              <Bar dataKey="totalLitres" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Total Litres" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fuel Efficiency Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Fuel Efficiency Analysis</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                {['Equipment', 'Total Litres', 'Total Cost', 'Hours Run', 'L/Hour', 'Cost/Hour'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {perEquipmentStats.map((s) => (
                <tr key={s.name} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/10 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap text-xs">{s.fullName.substring(0, 32)}{s.fullName.length > 32 ? '…' : ''}</td>
                  <td className="px-4 py-3 font-semibold text-amber-700 dark:text-amber-300">{s.totalLitres.toFixed(0)} L</td>
                  <td className="px-4 py-3 font-semibold text-rose-600 dark:text-rose-400">₹ {s.totalCost.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{s.hoursRun} hrs</td>
                  <td className="px-4 py-3 text-blue-600 dark:text-blue-400 font-mono">{s.litresPerHour}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400 font-mono">{s.hoursRun > 0 ? `₹ ${Math.round(s.totalCost / s.hoursRun)}` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fuel Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">Fuel Log Entries</h2>
          <select value={selectedEquipment} onChange={(e) => setSelectedEquipment(e.target.value)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none">
            <option value="all">All Equipment</option>
            {equipmentWithFuel.map((eq) => <option key={eq.id} value={eq.id}>{eq.name.substring(0, 35)}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                {['Date', 'Equipment', 'Fuel Type', 'Litres', 'Rate/L', 'Total Cost', 'Hour/KM Reading', 'Filled By'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((fe) => (
                <tr key={fe.id} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/10 transition-colors">
                  <td className="px-4 py-3 text-xs text-slate-500">{fe.date}</td>
                  <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{fe.equipmentName.substring(0, 25)}{fe.equipmentName.length > 25 ? '…' : ''}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">{fe.fuelType}</span></td>
                  <td className="px-4 py-3 font-semibold text-amber-700 dark:text-amber-300">{fe.litres} L</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">₹ {fe.ratePerLitre}</td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">₹ {fe.totalCost.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {fe.hourMeterReading ? `${fe.hourMeterReading} hrs` : fe.kmReading ? `${fe.kmReading.toLocaleString()} km` : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{fe.filledBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-10 text-slate-400"><Fuel className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No fuel entries found</p></div>}
        </div>
      </div>
    </div>
  );
};
