import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { RateItem } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Database,
  TrendingUp,
  Search,
  Filter,
  History,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';

export const RateAnalysisPage: React.FC = () => {
  const { rateMaster } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedRateItem, setSelectedRateItem] = useState<RateItem | null>(rateMaster[0] || null);

  // Distinct categories
  const categories = useMemo(() => {
    return Array.from(new Set(rateMaster.map((r) => r.category)));
  }, [rateMaster]);

  // Filtered rate items
  const filteredRates = useMemo(() => {
    return rateMaster.filter((r) => {
      if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesCode = r.code.toLowerCase().includes(q);
        const matchesSupplier = r.supplier.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesSupplier) return false;
      }
      return true;
    });
  }, [rateMaster, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Rate Master & Material Price Intelligence"
        subtitle="Standardized schedule of rates (DSR), historical material cost telemetry, and labour muster rates"
        badge={`${rateMaster.length} Commodities Tracked`}
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Tracked Items"
          value={rateMaster.length.toString()}
          subtext="Standard materials & equipment"
          icon="Database"
          trend="up"
        />
        <StatCard
          title="Price Volatility (6 Mo)"
          value="± 3.4%"
          subtext="Steel stabilized, cement moderate"
          icon="TrendingUp"
          trend="neutral"
        />
        <StatCard
          title="Primary Vendor Contracts"
          value="18 Partners"
          subtext="Tata Steel, UltraTech, ACC"
          icon="Building"
          trend="up"
        />
        <StatCard
          title="Last Index Sync"
          value="Today, 09:00 AM"
          subtext="WPI Construction Index"
          icon="History"
          trend="up"
        />
      </div>

      {/* Main Grid: Rate Master Table (7 cols) + Selected Item Rate Trend (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rate Master Table */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search code, item, supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <span className="text-xs text-slate-500">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              >
                <option value="ALL">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-2.5">Item & Code</th>
                  <th className="p-2.5">Category</th>
                  <th className="p-2.5 text-right">Current Rate</th>
                  <th className="p-2.5 text-center">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRates.map((item) => {
                  const isSelected = selectedRateItem?.id === item.id;
                  const latestChange = item.rateHistory[item.rateHistory.length - 1]?.changePct || 0;
                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRateItem(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-amber-50/70 dark:bg-amber-950/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="p-2.5">
                        <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                          {item.code}
                        </span>
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.name}</p>
                        <p className="text-[11px] text-slate-400 truncate max-w-xs">{item.supplier}</p>
                      </td>
                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                          ₹ {item.currentRate.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block">per {item.unit}</span>
                      </td>
                      <td className="p-2.5 text-center">
                        <span
                          className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
                            latestChange > 0
                              ? 'text-rose-600'
                              : latestChange < 0
                              ? 'text-emerald-600'
                              : 'text-slate-500'
                          }`}
                        >
                          {latestChange > 0 ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : latestChange < 0 ? (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          ) : null}
                          <span>{latestChange >= 0 ? `+${latestChange}%` : `${latestChange}%`}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Historical Rate Trend Viewer */}
        <div className="lg:col-span-5 space-y-4">
          {selectedRateItem ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    {selectedRateItem.code}
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
                    Updated: {selectedRateItem.lastUpdated}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedRateItem.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedRateItem.specification}</p>
              </div>

              {/* Current Price Hero */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Active Base Rate</span>
                  <p className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
                    ₹ {selectedRateItem.currentRate.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-slate-500">/ {selectedRateItem.unit}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Primary Vendor</span>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {selectedRateItem.supplier}
                  </p>
                </div>
              </div>

              {/* 6-Month Rate History Line Chart */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  6-Month Price Progression (₹ / {selectedRateItem.unit})
                </h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedRateItem.rateHistory} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} domain={['dataMin - 50', 'dataMax + 50']} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const pt = payload[0].payload;
                            return (
                              <div className="bg-slate-900 text-white text-xs p-2 rounded shadow">
                                <p className="font-bold text-amber-400">{label}</p>
                                <p>Rate: ₹ {pt.rate.toLocaleString('en-IN')}</p>
                                <p className="text-[10px] text-slate-300">Source: {pt.source}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="rate"
                        stroke="#d97706"
                        strokeWidth={2.5}
                        dot={{ r: 4, fill: '#d97706' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Price Change Ledger */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h5 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                  Telemetry Ledger
                </h5>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedRateItem.rateHistory.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">{h.date}</span>
                      <span className="text-[11px] text-slate-400">{h.source}</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        ₹ {h.rate.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
              Select an item on the left to view historical rate telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
