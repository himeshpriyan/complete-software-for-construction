import React, { useState, useMemo } from 'react';
import { subcontractorsSeed } from '../../data/resourceSeed';
import { Building, Search, ChevronRight, Star, Shield, Users, TrendingUp, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Subcontractor, RunningBill } from '../../types';

const TRADE_COLORS: Record<string, string> = {
  Mason: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Electrical: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
  Plumbing: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400',
  Fabrication: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  Painting: 'bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400',
  Flooring: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  HVAC: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  Roofing: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  Waterproofing: 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
  Shuttering: 'bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-400',
  Landscaping: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  'Labour Supply': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400',
};

const BILL_STATUS_CFG = {
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400', icon: Clock },
  approved: { label: 'Approved', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400', icon: CheckCircle2 },
  paid: { label: 'Paid', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400', icon: CheckCircle2 },
  rejected: { label: 'Rejected', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400', icon: XCircle },
};

const StarRating: React.FC<{ rating: number; label: string }> = ({ rating, label }) => (
  <div className="text-center">
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <div className="flex justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
      ))}
    </div>
    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">{rating.toFixed(1)}</p>
  </div>
);

const SubcontractorDetail: React.FC<{ sub: Subcontractor; onClose: () => void }> = ({ sub, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'bills'>('profile');
  const totalRetention = sub.runningBills.reduce((s, b) => s + b.retentionAmount, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-end" onClick={onClose}>
      <div className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TRADE_COLORS[sub.trade] || ''}`}>{sub.trade}</span>
              <span className="text-xs text-slate-400">{sub.code}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{sub.companyName}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{sub.projectName} · {sub.workOrderNumber}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          {(['profile', 'bills'] as const).map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === t ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {t === 'bills' ? 'Running Bills' : 'Work Order Profile'}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 space-y-5">
          {activeTab === 'profile' ? (
            <>
              {/* Financial KPIs */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 text-center">
                  <p className="text-xs text-blue-600 dark:text-blue-400">Contract Value</p>
                  <p className="text-base font-bold text-blue-700 dark:text-blue-300">₹ {(sub.contractValue / 100000).toFixed(1)}L</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center">
                  <p className="text-xs text-amber-600 dark:text-amber-400">Billed</p>
                  <p className="text-base font-bold text-amber-700 dark:text-amber-300">₹ {(sub.billedAmount / 100000).toFixed(1)}L</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                  <p className="text-xs text-slate-500">Pending</p>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">₹ {(sub.pendingAmount / 100000).toFixed(1)}L</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>Work Progress (Billed vs Contract)</span>
                  <span>{((sub.billedAmount / sub.contractValue) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (sub.billedAmount / sub.contractValue) * 100)}%` }} />
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Contact', value: sub.contactPerson },
                  { label: 'Phone', value: sub.phone },
                  { label: 'Rate Basis', value: sub.rateBasis.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) },
                  { label: 'Mobilization Advance', value: `${sub.mobilizationAdvancePct}%` },
                  { label: 'Retention', value: `${sub.retentionPct}%` },
                  { label: 'Retention Hold', value: `₹ ${totalRetention.toLocaleString('en-IN')}` },
                  { label: 'MB Reference', value: sub.mbReference || '—' },
                  { label: 'GST', value: sub.gst },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              {/* Performance */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Performance Ratings</h3>
                <div className="flex justify-around p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <StarRating rating={sub.qualityRating} label="Quality" />
                  <StarRating rating={sub.safetyRating} label="Safety" />
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Attendance Score</p>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{sub.attendanceScore}%</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Running Bills */}
              <div className="space-y-4">
                {sub.runningBills.map((bill) => {
                  const bsc = BILL_STATUS_CFG[bill.status];
                  const BIcon = bsc.icon;
                  return (
                    <div key={bill.billNo} className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{bill.billNo}</p>
                          <p className="text-xs text-slate-500">{bill.period} · {bill.billDate}</p>
                        </div>
                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${bsc.cls}`}>
                          <BIcon className="w-3 h-3" /> {bsc.label}
                        </span>
                      </div>
                      <div className="p-4 space-y-2 text-sm">
                        {[
                          { label: 'Gross Amount', value: bill.grossAmount, cls: 'text-slate-900 dark:text-white font-bold' },
                          { label: `Retention (${bill.retentionPct}%)`, value: -bill.retentionAmount, cls: 'text-rose-600 dark:text-rose-400' },
                          { label: 'Mobilization Advance Disbursed', value: bill.mobilizationAdvance, cls: 'text-blue-600 dark:text-blue-400' },
                          { label: 'Advance Recovery', value: -bill.advanceRecovery, cls: 'text-rose-600 dark:text-rose-400' },
                          { label: 'Other Deductions', value: -bill.otherDeductions, cls: bill.otherDeductions > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400' },
                        ].map(({ label, value, cls }) => (
                          <div key={label} className="flex items-center justify-between">
                            <span className="text-slate-500">{label}</span>
                            <span className={`font-medium ${cls}`}>{value < 0 ? '−' : ''}₹ {Math.abs(value).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">Net Payable</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 text-base">₹ {bill.netPayable.toLocaleString('en-IN')}</span>
                        </div>
                        {bill.paidDate && <p className="text-xs text-slate-400">Paid on {bill.paidDate}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const SubcontractorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [selected, setSelected] = useState<Subcontractor | null>(null);

  const trades = useMemo(() => Array.from(new Set(subcontractorsSeed.map((s) => s.trade))).sort(), []);
  const filtered = useMemo(() => subcontractorsSeed.filter((s) => {
    const q = search.toLowerCase();
    return (s.companyName.toLowerCase().includes(q) || s.projectName.toLowerCase().includes(q)) && (tradeFilter === 'all' || s.trade === tradeFilter);
  }), [search, tradeFilter]);

  const totalContractValue = subcontractorsSeed.reduce((s, r) => s + r.contractValue, 0);
  const totalPending = subcontractorsSeed.reduce((s, r) => s + r.pendingAmount, 0);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Subcontractor Management</h1>
        <p className="text-sm text-slate-500 mt-1">{subcontractorsSeed.filter((s) => s.status === 'active').length} active subcontractors · {subcontractorsSeed.length} total</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Building, label: 'Total Subcontractors', value: subcontractorsSeed.length.toString(), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { icon: TrendingUp, label: 'Total Contract Value', value: `₹ ${(totalContractValue / 10000000).toFixed(2)} Cr`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { icon: Clock, label: 'Pending Payment', value: `₹ ${(totalPending / 100000).toFixed(1)} L`, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
          { icon: Star, label: 'Avg Quality Rating', value: `${(subcontractorsSeed.reduce((s, r) => s + r.qualityRating, 0) / subcontractorsSeed.length).toFixed(1)}/5`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <div><p className="text-xs text-slate-500">{label}</p><p className={`text-base font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by company, project..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
        </div>
        <select value={tradeFilter} onChange={(e) => setTradeFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none">
          <option value="all">All Trades</option>
          {trades.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((sub) => (
          <div key={sub.id} onClick={() => setSelected(sub)} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TRADE_COLORS[sub.trade] || ''}`}>{sub.trade}</span>
                  <span className="text-xs text-slate-400">{sub.code}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">{sub.companyName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{sub.projectName}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 shrink-0 mt-1" />
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Billed vs Contract</span>
                <span>{((sub.billedAmount / sub.contractValue) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (sub.billedAmount / sub.contractValue) * 100)}%` }} />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <p className="text-slate-400">Contract</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">₹ {(sub.contractValue / 100000).toFixed(1)}L</p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-3 h-3 ${s <= Math.round(sub.qualityRating) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`} />)}
              </div>
              <div className="text-right">
                <p className="text-slate-400">Pending</p>
                <p className="font-bold text-rose-600 dark:text-rose-400">₹ {(sub.pendingAmount / 100000).toFixed(1)}L</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && <SubcontractorDetail sub={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};
