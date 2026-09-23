import React, { useState, useMemo } from 'react';
import { equipmentSeed, maintenanceScheduleSeed } from '../../data/resourceSeed';
import {
  Wrench, Search, ChevronRight, AlertTriangle, CheckCircle2, Clock,
  Fuel, Gauge, Calendar, Shield, FileText, TrendingUp, Zap
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LineChart, Line, Legend
} from 'recharts';
import { Equipment, MaintenanceSchedule } from '../../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const STATUS_CFG = {
  active: { label: 'Active', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
  idle: { label: 'Idle', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  under_maintenance: { label: 'In Maintenance', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' },
  breakdown: { label: 'Breakdown', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' },
  returned: { label: 'Returned', cls: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
};

const MAINT_CFG = {
  overdue: { label: 'Overdue', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400', badge: 'text-rose-600' },
  due_this_week: { label: 'Due This Week', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400', badge: 'text-amber-600' },
  upcoming: { label: 'Upcoming', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400', badge: 'text-blue-600' },
  completed: { label: 'Completed', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400', badge: 'text-emerald-600' },
};

const OWN_CFG = {
  own: { label: 'Own', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
  rented: { label: 'Rented', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' },
  leased: { label: 'Leased', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' },
};

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function expiryBadge(dateStr: string): { cls: string; label: string } | null {
  const days = daysUntil(dateStr);
  if (days < 0) return { cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400', label: `Expired ${Math.abs(days)}d ago` };
  if (days <= 30) return { cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400', label: `Expires in ${days}d` };
  return null;
}

// ─── Equipment Detail Panel ───────────────────────────────────────────────────
const EquipmentDetailPanel: React.FC<{ eq: Equipment; onClose: () => void }> = ({ eq, onClose }) => {
  const [tab, setTab] = useState<'overview' | 'fuel' | 'maintenance' | 'documents'>('overview');
  const sc = STATUS_CFG[eq.status] || STATUS_CFG.active;
  const oc = OWN_CFG[eq.ownership];
  const usagePct = Math.min(100, Math.round((eq.currentMonthHours / eq.targetHoursPerMonth) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-end" onClick={onClose}>
      <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.cls}`}>{sc.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${oc.cls}`}>{oc.label}</span>
              <span className="text-xs text-slate-400 font-mono">{eq.code}</span>
            </div>
            <h2 className="text-base font-bold text-white">{eq.name}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{eq.make} {eq.model} · {eq.year} · {eq.assignedProjectName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {(['overview', 'fuel', 'maintenance', 'documents'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-3 text-xs font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${tab === t ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 space-y-5">
          {tab === 'overview' && (
            <>
              {/* Hours gauge */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2"><Gauge className="w-4 h-4 text-amber-600" /><span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Monthly Utilization</span></div>
                  <span className={`text-sm font-bold ${usagePct >= 90 ? 'text-emerald-600' : usagePct >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>{eq.currentMonthHours} / {eq.targetHoursPerMonth} hrs ({usagePct}%)</span>
                </div>
                <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${usagePct >= 90 ? 'bg-emerald-500' : usagePct >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1"><span>0 hrs</span><span className="text-slate-500">All-time: {eq.totalHoursRun.toLocaleString()} hrs</span><span>{eq.targetHoursPerMonth} hrs</span></div>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Operator', value: eq.operatorName },
                  { label: 'Registration No.', value: eq.registrationNumber || 'N/A' },
                  { label: 'Total Hours Run', value: `${eq.totalHoursRun.toLocaleString()} hrs` },
                  { label: 'Fuel Consumed', value: eq.totalFuelConsumed > 0 ? `${eq.totalFuelConsumed.toLocaleString()} L` : 'Electric/N/A' },
                  { label: 'Rental Vendor', value: eq.rentalVendor || 'Own Asset' },
                  { label: 'Daily Rental Rate', value: eq.rentalRatePerDay ? `₹ ${eq.rentalRatePerDay.toLocaleString()}` : 'Own' },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Equipment QR / Barcode Asset Tag & Scan Result Preview */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      Machine Telemetry QR / Barcode Asset Tag (Visual Only)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200">
                    OEMS Verified
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  {/* Mock QR Code Visual */}
                  <div className="p-2.5 bg-white rounded-lg border border-slate-300 shadow-xs shrink-0 flex flex-col items-center">
                    <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                      <rect x="5" y="5" width="90" height="90" fill="white" />
                      <rect x="10" y="10" width="24" height="24" fill="#0f172a" />
                      <rect x="14" y="14" width="16" height="16" fill="white" />
                      <rect x="18" y="18" width="8" height="8" fill="#0f172a" />
                      <rect x="66" y="10" width="24" height="24" fill="#0f172a" />
                      <rect x="70" y="14" width="16" height="16" fill="white" />
                      <rect x="74" y="18" width="8" height="8" fill="#0f172a" />
                      <rect x="10" y="66" width="24" height="24" fill="#0f172a" />
                      <rect x="14" y="70" width="16" height="16" fill="white" />
                      <rect x="18" y="74" width="8" height="8" fill="#0f172a" />
                      <rect x="42" y="16" width="6" height="6" fill="#0f172a" />
                      <rect x="50" y="24" width="8" height="8" fill="#0f172a" />
                      <rect x="22" y="44" width="8" height="8" fill="#0f172a" />
                      <rect x="36" y="48" width="6" height="6" fill="#0f172a" />
                      <rect x="52" y="44" width="6" height="6" fill="#0f172a" />
                      <rect x="68" y="46" width="8" height="8" fill="#0f172a" />
                      <rect x="80" y="42" width="6" height="6" fill="#0f172a" />
                      <rect x="44" y="68" width="8" height="8" fill="#0f172a" />
                      <rect x="60" y="72" width="6" height="6" fill="#0f172a" />
                      <rect x="76" y="76" width="8" height="8" fill="#0f172a" />
                    </svg>
                    <span className="font-mono text-[9px] text-slate-500 mt-1 font-bold">
                      {eq.code}
                    </span>
                  </div>

                  {/* Scan Result Preview Card */}
                  <div className="flex-1 space-y-1.5 text-xs">
                    <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <span>✓ Scanner Simulation: Heavy Plant Telemetry</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                      <div>
                        <span className="text-slate-400 block">Engine Serial:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {eq.registrationNumber ? `SN-${eq.registrationNumber}` : 'CAT-C15-9921'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Total Engine Hours:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {eq.totalHoursRun.toLocaleString()} hrs
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Next Hydraulic Svc:</span>
                        <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                          Due in 18 hrs
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Certified Operator:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {eq.operatorName}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic">
                      Scanning this QR with field tablet opens equipment pre-start checklist and diesel consumption log.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'fuel' && (
            <>
              {eq.fuelEntries.length === 0 ? (
                <div className="text-center py-10 text-slate-400"><Fuel className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No fuel data for this equipment</p></div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-center">
                      <p className="text-xs text-amber-600 dark:text-amber-400">Total Fuel</p>
                      <p className="text-lg font-bold text-amber-700 dark:text-amber-300">{eq.fuelEntries.reduce((s, e) => s + e.litres, 0).toFixed(0)} L</p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-center">
                      <p className="text-xs text-blue-600 dark:text-blue-400">Total Cost (This Month)</p>
                      <p className="text-lg font-bold text-blue-700 dark:text-blue-300">₹ {eq.fuelEntries.reduce((s, e) => s + e.totalCost, 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {eq.fuelEntries.map((fe) => (
                      <div key={fe.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                        <div>
                          <p className="text-xs text-slate-500">{fe.date} · {fe.fuelType} · {fe.filledBy}</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{fe.litres} L @ ₹{fe.ratePerLitre}/L</p>
                          {fe.hourMeterReading && <p className="text-xs text-slate-400">Hour meter: {fe.hourMeterReading.toLocaleString()} hrs</p>}
                          {fe.kmReading && <p className="text-xs text-slate-400">Odometer: {fe.kmReading.toLocaleString()} km</p>}
                        </div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">₹ {fe.totalCost.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'maintenance' && (
            <div className="space-y-3">
              {eq.maintenanceHistory.length === 0 ? (
                <div className="text-center py-10 text-slate-400"><Wrench className="w-10 h-10 mx-auto mb-2 opacity-30" /><p>No maintenance records</p></div>
              ) : eq.maintenanceHistory.map((mh) => (
                <div key={mh.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${mh.type === 'breakdown' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'}`}>{mh.type}</span>
                    <span className="text-xs text-slate-400">₹ {mh.cost.toLocaleString()}</span>
                  </div>
                  <p className="font-medium text-sm text-slate-900 dark:text-white">{mh.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{mh.performedDate} · {mh.vendor}</p>
                  {mh.remarks && <p className="text-xs text-slate-400 mt-1 italic">{mh.remarks}</p>}
                  {mh.nextDueDate && <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">Next due: {mh.nextDueDate}</p>}
                </div>
              ))}
            </div>
          )}

          {tab === 'documents' && (
            <div className="space-y-3">
              {eq.documents.map((doc, i) => {
                const badge = expiryBadge(doc.expiryDate);
                return (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${badge ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/20' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40'}`}>
                    <div className="flex items-center gap-3">
                      <FileText className={`w-5 h-5 ${badge ? 'text-amber-600' : 'text-slate-400'}`} />
                      <div>
                        <p className="font-medium text-sm text-slate-900 dark:text-white">{doc.type}</p>
                        <p className="text-xs text-slate-500 font-mono">{doc.documentNumber}</p>
                        <p className="text-xs text-slate-400">{doc.issueDate} → {doc.expiryDate}</p>
                      </div>
                    </div>
                    {badge ? (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.cls}`}>{badge.label}</span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">Valid</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
type PageTab = 'equipment' | 'maintenance';

export const EquipmentPage: React.FC = () => {
  const [pageTab, setPageTab] = useState<PageTab>('equipment');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [maintFilter, setMaintFilter] = useState('all');
  const [selected, setSelected] = useState<Equipment | null>(null);

  const filtered = useMemo(() => equipmentSeed.filter((e) => {
    const q = search.toLowerCase();
    return (e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q)) && (statusFilter === 'all' || e.status === statusFilter);
  }), [search, statusFilter]);

  const filteredMaint = useMemo(() => maintenanceScheduleSeed.filter((m) =>
    maintFilter === 'all' || m.status === maintFilter
  ).sort((a, b) => {
    const order = { overdue: 0, due_this_week: 1, upcoming: 2, completed: 3 };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  }), [maintFilter]);

  const overdueCount = maintenanceScheduleSeed.filter((m) => m.status === 'overdue').length;
  const dueThisWeek = maintenanceScheduleSeed.filter((m) => m.status === 'due_this_week').length;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Equipment & Machinery Management</h1>
        <p className="text-sm text-slate-500 mt-1">{equipmentSeed.length} machines · Usage tracking · Document expiry alerts · Maintenance schedule</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-fit">
        {(['equipment', 'maintenance'] as PageTab[]).map((t) => (
          <button key={t} onClick={() => setPageTab(t)} className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${pageTab === t ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'maintenance' ? 'Maintenance Schedule' : 'Equipment Fleet'}
            {t === 'maintenance' && (overdueCount + dueThisWeek) > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold">{overdueCount + dueThisWeek}</span>
            )}
          </button>
        ))}
      </div>

      {pageTab === 'equipment' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search equipment name, code..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="all">All Status</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((eq) => {
              const sc = STATUS_CFG[eq.status];
              const oc = OWN_CFG[eq.ownership];
              const usagePct = Math.min(100, Math.round((eq.currentMonthHours / eq.targetHoursPerMonth) * 100));
              const expiringDocs = eq.documents.filter((d) => expiryBadge(d.expiryDate));
              return (
                <div key={eq.id} onClick={() => setSelected(eq)} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.cls}`}>{sc.label}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${oc.cls}`}>{oc.label}</span>
                        {expiringDocs.length > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {expiringDocs.length} doc{expiringDocs.length > 1 ? 's' : ''} expiring</span>}
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 leading-snug">{eq.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{eq.code} · {eq.assignedProjectName}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 shrink-0 mt-1" />
                  </div>

                  {/* Usage gauge */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> Utilization</span>
                      <span className={usagePct >= 90 ? 'text-emerald-600 font-semibold' : usagePct >= 60 ? 'text-amber-600 font-semibold' : 'text-rose-600 font-semibold'}>{eq.currentMonthHours}/{eq.targetHoursPerMonth} hrs</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${usagePct >= 90 ? 'bg-emerald-500' : usagePct >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${usagePct}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {eq.totalHoursRun.toLocaleString()} hrs total</span>
                    {eq.totalFuelConsumed > 0 && <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> {eq.totalFuelConsumed.toLocaleString()} L</span>}
                    <span>{eq.operatorName.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {pageTab === 'maintenance' && (
        <>
          <div className="flex flex-wrap gap-2 mb-2">
            {[{ k: 'all', label: 'All' }, { k: 'overdue', label: `🔴 Overdue (${overdueCount})` }, { k: 'due_this_week', label: `🟡 Due This Week (${dueThisWeek})` }, { k: 'upcoming', label: 'Upcoming' }, { k: 'completed', label: 'Completed' }].map(({ k, label }) => (
              <button key={k} onClick={() => setMaintFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${maintFilter === k ? 'bg-amber-600 text-white border-amber-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-400'}`}>
                {label}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filteredMaint.map((ms) => {
              const mc = MAINT_CFG[ms.status];
              return (
                <div key={ms.id} className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 shadow-sm ${ms.status === 'overdue' ? 'border-rose-300 dark:border-rose-800' : ms.status === 'due_this_week' ? 'border-amber-300 dark:border-amber-800' : 'border-slate-200 dark:border-slate-800'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mc.cls}`}>{mc.label}</span>
                        <span className="text-xs font-mono text-slate-400">{ms.equipmentCode}</span>
                      </div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white">{ms.equipmentName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{ms.serviceType}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs shrink-0">
                      <div className="text-center">
                        <p className="text-slate-400">Last Service</p>
                        <p className="font-medium text-slate-700 dark:text-slate-300">{ms.lastServiceDate}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400">Due Date</p>
                        <p className={`font-bold ${mc.badge}`}>{ms.nextDueDate}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400">Est. Cost</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">₹ {ms.estimatedCost.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-slate-400">Vendor</p>
                        <p className="font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap max-w-[140px] truncate">{ms.vendor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {selected && <EquipmentDetailPanel eq={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
