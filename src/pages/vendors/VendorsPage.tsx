import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Building2, Star, TrendingUp, Phone, Mail, MapPin, Shield,
  ChevronRight, Search, Filter, AlertTriangle, CheckCircle2,
  CreditCard, Award, Package, BarChart3, Radar
} from 'lucide-react';
import { Vendor } from '../../types';
import {
  RadarChart, Radar as RechartsRadar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const STATUS_CONFIG = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
  on_hold: { label: 'On Hold', className: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' },
  blacklisted: { label: 'Blacklisted', className: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' },
};

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-500 fill-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
      />
    ))}
    <span className="ml-1 text-xs font-semibold text-slate-700 dark:text-slate-300">{rating.toFixed(1)}</span>
  </div>
);

const VendorDetailPanel: React.FC<{ vendor: Vendor; onClose: () => void }> = ({ vendor, onClose }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'performance'>('profile');
  const fmt = (n: number) => `₹ ${(n / 100000).toFixed(2)} L`;

  const radarData = [
    { subject: 'Delivery', value: vendor.performance.onTimeDeliveryPct / 10 },
    { subject: 'Quality', value: vendor.performance.qualityRating * 2 },
    { subject: 'Pricing', value: vendor.performance.priceCompetitivenessScore },
    { subject: 'Response', value: vendor.performance.responsivenessScore },
    { subject: 'Compliance', value: vendor.performance.complianceScore },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div
        className="w-full max-w-2xl h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[vendor.status].className}`}>
                {STATUS_CONFIG[vendor.status].label}
              </span>
              <span className="text-xs text-slate-400">{vendor.code}</span>
            </div>
            <h2 className="text-lg font-bold text-white">{vendor.companyName}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{vendor.categories.join(' · ')}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {(['profile', 'performance'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-3 text-sm font-medium transition-colors capitalize border-b-2 ${activeTab === t ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 space-y-6">
          {activeTab === 'profile' ? (
            <>
              {/* Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: Phone, label: 'Phone', value: vendor.phone },
                  { icon: Mail, label: 'Email', value: vendor.email },
                  { icon: MapPin, label: 'Location', value: `${vendor.city}, ${vendor.state}` },
                  { icon: CreditCard, label: 'Credit Period', value: `${vendor.creditPeriodDays} days` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <Icon className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Legal & Tax Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <p className="text-xs text-slate-500 mb-0.5">GST Number</p>
                    <p className="text-sm font-mono font-medium text-slate-800 dark:text-slate-200">{vendor.gst}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <p className="text-xs text-slate-500 mb-0.5">PAN Number</p>
                    <p className="text-sm font-mono font-medium text-slate-800 dark:text-slate-200">{vendor.pan}</p>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Bank Account</h3>
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{vendor.bankDetails.bankName}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 px-2 py-0.5 rounded-full">{vendor.bankDetails.accountType}</span>
                  </div>
                  <p className="text-sm font-mono text-slate-600 dark:text-slate-400">{vendor.bankDetails.accountNumber}</p>
                  <p className="text-xs text-slate-500 mt-1">IFSC: {vendor.bankDetails.ifscCode}</p>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Product Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {vendor.categories.map((c) => (
                    <span key={c} className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* KPI Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { label: 'On-Time Delivery', value: `${vendor.performance.onTimeDeliveryPct}%`, color: 'text-emerald-600 dark:text-emerald-400', good: vendor.performance.onTimeDeliveryPct >= 90 },
                  { label: 'Quality Rating', value: `${vendor.performance.qualityRating}/5`, color: 'text-amber-600 dark:text-amber-400', good: vendor.performance.qualityRating >= 4 },
                  { label: 'Rejection Rate', value: `${vendor.performance.rejectionRatePct}%`, color: vendor.performance.rejectionRatePct > 3 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400', good: vendor.performance.rejectionRatePct <= 3 },
                  { label: 'Total Purchases', value: fmt(vendor.performance.totalPurchaseValue), color: 'text-blue-600 dark:text-blue-400', good: true },
                  { label: 'Pending Payment', value: fmt(vendor.performance.pendingPaymentAmount), color: 'text-amber-600 dark:text-amber-400', good: true },
                  { label: 'Credit Period', value: `${vendor.creditPeriodDays} days`, color: 'text-slate-700 dark:text-slate-300', good: true },
                ].map(({ label, value, color }) => (
                  <div key={label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className={`text-base font-bold ${color}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Radar Chart */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <Radar className="w-4 h-4 text-amber-600" /> Performance Scorecard (out of 10)
                </h3>
                <div className="h-56 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/50">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                      <PolarGrid stroke="#334155" strokeOpacity={0.3} />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                      <RechartsRadar name="Score" dataKey="value" stroke="#d97706" fill="#d97706" fillOpacity={0.25} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Monthly Bar Chart */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" /> Monthly Purchase Value (₹ Lakhs)
                </h3>
                <div className="h-44 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/50 p-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vendor.performance.monthlyPurchaseHistory.map(m => ({ ...m, value: m.value / 100000 }))} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v: any) => [`₹ ${Number(v || 0).toFixed(2)} L`, 'Purchase Value']} contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const VendorsPage: React.FC = () => {
  const { vendors } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    vendors.forEach((v) => v.categories.forEach((c) => cats.add(c)));
    return Array.from(cats).sort();
  }, [vendors]);

  const filtered = useMemo(() => vendors.filter((v) => {
    const q = search.toLowerCase();
    const matchSearch = v.companyName.toLowerCase().includes(q) || v.contactPerson.toLowerCase().includes(q) || v.city.toLowerCase().includes(q) || v.gst.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchCat = categoryFilter === 'all' || v.categories.includes(categoryFilter as never);
    return matchSearch && matchStatus && matchCat;
  }), [vendors, search, statusFilter, categoryFilter]);

  const totalValue = vendors.reduce((s, v) => s + v.performance.totalPurchaseValue, 0);
  const activeCount = vendors.filter((v) => v.status === 'active').length;
  const avgRating = vendors.reduce((s, v) => s + v.performance.qualityRating, 0) / vendors.length;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Vendor & Supplier Master</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {activeCount} active vendors · {vendors.length} total registered
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Building2, label: 'Total Vendors', value: vendors.length.toString(), color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { icon: CheckCircle2, label: 'Active', value: activeCount.toString(), color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { icon: TrendingUp, label: 'Total Purchase Value', value: `₹ ${(totalValue / 10000000).toFixed(2)} Cr`, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { icon: Star, label: 'Avg Quality Rating', value: `${avgRating.toFixed(1)}/5`, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
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
            placeholder="Search vendors by name, city, GST..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
          <option value="blacklisted">Blacklisted</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
        >
          <option value="all">All Categories</option>
          {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Vendor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((vendor) => (
          <div
            key={vendor.id}
            onClick={() => setSelectedVendor(vendor)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CONFIG[vendor.status].className}`}>
                    {STATUS_CONFIG[vendor.status].label}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {vendor.companyName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{vendor.contactPerson} · {vendor.city}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 shrink-0 mt-1 transition-colors" />
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {vendor.categories.slice(0, 3).map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">{c}</span>
              ))}
              {vendor.categories.length > 3 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">+{vendor.categories.length - 3}</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <StarRating rating={vendor.performance.qualityRating} />
              <div className="text-right">
                <p className="text-xs text-slate-400">On-time delivery</p>
                <p className={`text-sm font-bold ${vendor.performance.onTimeDeliveryPct >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {vendor.performance.onTimeDeliveryPct}%
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs text-slate-500">
              <span>GST: <span className="font-mono text-slate-600 dark:text-slate-400">{vendor.gst.slice(0, 12)}…</span></span>
              <span>Credit: <span className="font-medium text-slate-700 dark:text-slate-300">{vendor.creditPeriodDays}d</span></span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No vendors match your search</p>
        </div>
      )}

      {/* Detail Panel */}
      {selectedVendor && (
        <VendorDetailPanel vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />
      )}
    </div>
  );
};
