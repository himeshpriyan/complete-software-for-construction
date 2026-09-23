import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Package, Search, TrendingUp, AlertTriangle, Brain, ChevronRight,
  Tag, BarChart2, Clock, ShoppingCart
} from 'lucide-react';
import { Material, MaterialCategory } from '../../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CATEGORY_COLORS: Record<MaterialCategory, string> = {
  Cement: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Steel: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  Sand: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
  Aggregate: 'bg-stone-100 text-stone-700 dark:bg-stone-900/50 dark:text-stone-400',
  Bricks: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  Blocks: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  Tiles: 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
  Paint: 'bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400',
  Electrical: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400',
  Plumbing: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400',
  Hardware: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400',
  Waterproofing: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  Shuttering: 'bg-brown-100 text-amber-900 dark:bg-amber-950/50 dark:text-amber-600',
  Safety: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
};

const getStockStatus = (mat: Material) => {
  if (mat.currentStock <= mat.minStockLevel) return { label: 'Critical', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' };
  if (mat.currentStock <= mat.reorderLevel) return { label: 'Low', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' };
  return { label: 'OK', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' };
};

const MaterialDetailPanel: React.FC<{ material: Material; onClose: () => void }> = ({ material, onClose }) => {
  const stockStatus = getStockStatus(material);
  const daysOfStock = material.avgDailyConsumption > 0 ? Math.floor(material.currentStock / material.avgDailyConsumption) : 999;
  const purchaseRequired = Math.max(0, material.reorderLevel * 2 - material.currentStock);

  const chartData = material.rateHistory.map((r) => ({
    date: r.date.slice(5, 10),
    rate: r.rate,
    supplier: r.supplier,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[material.category] || 'bg-slate-100 text-slate-700'}`}>
                {material.category}
              </span>
              <span className="text-xs font-mono text-slate-400">{material.sku}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{material.name}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{material.brand} · HSN: {material.hsnCode}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          {/* Current Rate */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center">
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Current Rate</p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-300">₹ {material.currentRate.toLocaleString('en-IN')}</p>
              <p className="text-xs text-amber-600/70 dark:text-amber-500">per {material.unit}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-center">
              <p className="text-xs text-slate-500">GST Rate</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{material.gstPct}%</p>
              <p className="text-xs text-slate-400">applicable</p>
            </div>
            <div className={`p-3 rounded-xl text-center ${stockStatus.cls}`}>
              <p className="text-xs font-medium opacity-80">Stock Status</p>
              <p className="text-lg font-bold">{stockStatus.label}</p>
              <p className="text-xs opacity-70">{material.currentStock} {material.unit}</p>
            </div>
          </div>

          {/* Specification */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Specification</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
              {material.specification}
            </p>
          </div>

          {/* Stock Levels */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Stock Level Parameters</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Min Stock Level', value: `${material.minStockLevel} ${material.unit}`, color: 'text-rose-600 dark:text-rose-400' },
                { label: 'Reorder Level', value: `${material.reorderLevel} ${material.unit}`, color: 'text-amber-600 dark:text-amber-400' },
                { label: 'Current Stock', value: `${material.currentStock} ${material.unit}`, color: 'text-emerald-600 dark:text-emerald-400' },
              ].map(({ label, value, color }) => (
                <div key={label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-center">
                  <p className="text-xs text-slate-500 mb-1">{label}</p>
                  <p className={`text-sm font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rate History Chart */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-600" /> Rate History (Last 6 Months)
            </h3>
            <div className="h-44 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/50 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 15, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(v: any) => [`₹ ${Number(v || 0).toLocaleString('en-IN')}`, 'Rate']}
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 11 }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#d97706" strokeWidth={2} dot={{ fill: '#d97706', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* QR / Barcode Tag & Scan Result Preview (Visual Only) */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Material QR / Barcode Asset Tag (Visual Only)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200">
                Auto-Generated
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              {/* Mock QR Code Visual */}
              <div className="p-2.5 bg-white rounded-lg border border-slate-300 shadow-xs shrink-0 flex flex-col items-center">
                <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                  {/* Outer Frame */}
                  <rect x="5" y="5" width="90" height="90" fill="white" />
                  {/* Corner Target 1 */}
                  <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" fill="#0f172a" />
                  {/* Corner Target 2 */}
                  <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" fill="#0f172a" />
                  {/* Corner Target 3 */}
                  <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" fill="#0f172a" />
                  {/* Barcode / Data matrix dots */}
                  <rect x="42" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="12" width="6" height="6" fill="#0f172a" />
                  <rect x="42" y="24" width="6" height="6" fill="#0f172a" />
                  <rect x="52" y="32" width="6" height="6" fill="#0f172a" />
                  <rect x="12" y="44" width="6" height="6" fill="#0f172a" />
                  <rect x="24" y="48" width="6" height="6" fill="#0f172a" />
                  <rect x="36" y="44" width="8" height="8" fill="#0f172a" />
                  <rect x="48" y="48" width="8" height="8" fill="#0f172a" />
                  <rect x="64" y="44" width="6" height="6" fill="#0f172a" />
                  <rect x="78" y="48" width="8" height="8" fill="#0f172a" />
                  <rect x="42" y="68" width="6" height="6" fill="#0f172a" />
                  <rect x="54" y="74" width="8" height="8" fill="#0f172a" />
                  <rect x="68" y="70" width="8" height="8" fill="#0f172a" />
                  <rect x="80" y="78" width="8" height="8" fill="#0f172a" />
                </svg>
                <span className="font-mono text-[9px] text-slate-500 mt-1 font-bold">
                  {material.sku}
                </span>
              </div>

              {/* Scan Result Preview Card */}
              <div className="flex-1 space-y-1.5 text-xs">
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span>✓ Scanner Simulation: Verified Asset</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                  <div>
                    <span className="text-slate-400 block">Batch #:</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      BTC-2026/09-881
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Yard Location:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Bay C-14, Yard East
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Mill Test Cert:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      MTC-IS-VERIFIED
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Last Inward GRN:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      GRN-2026-081
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 italic">
                  Scanning this QR code with mobile camera instantly loads the bin card & inwards history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MaterialsPage: React.FC = () => {
  const { materials } = useAppStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const allCategories = useMemo(() => {
    const cats = new Set(materials.map((m) => m.category));
    return Array.from(cats).sort();
  }, [materials]);

  const filtered = useMemo(() => materials.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q) || m.brand.toLowerCase().includes(q);
    const matchCat = categoryFilter === 'all' || m.category === categoryFilter;
    const stockStatus = getStockStatus(m).label;
    const matchStock = stockFilter === 'all' || stockStatus.toLowerCase() === stockFilter;
    return matchSearch && matchCat && matchStock;
  }), [materials, search, categoryFilter, stockFilter]);

  const criticalCount = materials.filter((m) => m.currentStock <= m.minStockLevel).length;
  const lowCount = materials.filter((m) => m.currentStock > m.minStockLevel && m.currentStock <= m.reorderLevel).length;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Material Master Catalogue</h1>
        <p className="text-sm text-slate-500 mt-1">{materials.length} materials · {criticalCount} critical · {lowCount} low stock</p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Package, label: 'Total SKUs', value: materials.length.toString(), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { icon: AlertTriangle, label: 'Critical Stock', value: criticalCount.toString(), color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
          { icon: Clock, label: 'Low / Reorder', value: lowCount.toString(), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { icon: ShoppingCart, label: 'Categories', value: allCategories.length.toString(), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, SKU, or brand..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none">
          <option value="all">All Categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none">
          <option value="all">All Stock Status</option>
          <option value="ok">OK</option>
          <option value="low">Low</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Materials Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                {['SKU', 'Material Name', 'Category', 'Unit', 'Brand', 'Rate (₹)', 'Current Stock', 'Reorder Lvl', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((mat) => {
                const ss = getStockStatus(mat);
                return (
                  <tr
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className="hover:bg-amber-50/50 dark:hover:bg-amber-950/10 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{mat.sku}</td>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">{mat.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[mat.category] || ''}`}>{mat.category}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">{mat.unit}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 text-xs">{mat.brand}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">₹ {mat.currentRate.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{mat.currentStock.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{mat.reorderLevel.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ss.cls}`}>{ss.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No materials match your filters</p>
          </div>
        )}
      </div>

      {selectedMaterial && (
        <MaterialDetailPanel material={selectedMaterial} onClose={() => setSelectedMaterial(null)} />
      )}
    </div>
  );
};
