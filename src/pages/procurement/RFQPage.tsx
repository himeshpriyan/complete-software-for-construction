import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  FileText, CheckCircle2, Trophy, Zap, ChevronRight, Search, AlertTriangle, ArrowRight
} from 'lucide-react';
import { RFQ, VendorQuote } from '../../types';

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  draft: { label: 'Draft', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' },
  sent: { label: 'Sent to Vendors', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' },
  quotes_received: { label: 'Quotes Received', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' },
  comparison_done: { label: 'Comparison Done', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' },
  vendor_selected: { label: 'Vendor Selected', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' },
  pending_approval: { label: 'Pending Approval', cls: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400' },
  approved: { label: 'Approved', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
  converted_po: { label: 'PO Created', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
};

const VendorComparisonModal: React.FC<{ rfq: RFQ; onClose: () => void }> = ({ rfq, onClose }) => {
  const navigate = useNavigate();
  const { selectVendorForRFQ, approveRFQ, currentUser } = useAppStore();

  if (rfq.vendorQuotes.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Quotes Received Yet</h3>
          <p className="text-sm text-slate-500 mb-4">Vendor quotes will appear here once vendors respond to this RFQ.</p>
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-medium text-sm">Close</button>
        </div>
      </div>
    );
  }

  const lowestRate = Math.min(...rfq.vendorQuotes.map((q) => q.rate));
  const fastestDelivery = Math.min(...rfq.vendorQuotes.map((q) => q.deliveryDays));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4 pt-8" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 rounded-t-2xl flex items-start justify-between">
          <div>
            <p className="text-xs text-amber-400 font-medium mb-1">VENDOR COMPARATIVE STATEMENT</p>
            <h2 className="text-lg font-bold text-white">{rfq.materialName}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{rfq.rfqNumber} · {rfq.quantity} {rfq.materialUnit} · {rfq.projectName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>

        <div className="p-6">
          {/* Comparison Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  {['Vendor', 'City', 'Rate (₹/unit)', 'GST %', 'Total Amount', 'Delivery Days', 'Valid Until', 'Remarks', 'Action'].map((h) => (
                    <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rfq.vendorQuotes.map((q) => {
                  const isLowestRate = q.rate === lowestRate;
                  const isFastest = q.deliveryDays === fastestDelivery;
                  const isSelected = rfq.selectedVendorId === q.vendorId;
                  return (
                    <tr key={q.vendorId} className={`transition-colors ${isSelected ? 'bg-amber-50 dark:bg-amber-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />}
                          <span className="font-medium text-slate-900 dark:text-white whitespace-nowrap">{q.vendorName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500">{q.vendorCity}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white">₹ {q.rate.toLocaleString()}</span>
                          {isLowestRate && <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-medium"><Trophy className="w-3 h-3" /> Lowest</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{q.gstPct}%</td>
                      <td className="px-3 py-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">₹ {q.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`font-medium ${isFastest ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>{q.deliveryDays} days</span>
                          {isFastest && <span className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 font-medium"><Zap className="w-3 h-3" /> Fastest</span>}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-xs text-slate-500">{q.validUntil}</td>
                      <td className="px-3 py-3 text-xs text-slate-500 max-w-[180px]">{q.remarks || '—'}</td>
                      <td className="px-3 py-3">
                        {rfq.status !== 'converted_po' && !isSelected && (rfq.status === 'quotes_received' || rfq.status === 'comparison_done' || rfq.status === 'vendor_selected') && (
                          <button
                            onClick={() => selectVendorForRFQ(rfq.id, q.vendorId)}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors whitespace-nowrap"
                          >
                            Select
                          </button>
                        )}
                        {isSelected && <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Selected ✓</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Approval action */}
          {rfq.status === 'pending_approval' && (
            <div className="flex items-start gap-4 p-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Management Approval Required</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Vendor selected. This RFQ requires sign-off before a PO can be raised.</p>
              </div>
              <button
                onClick={() => { approveRFQ(rfq.id, currentUser?.name || 'Management'); onClose(); }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors whitespace-nowrap"
              >
                Approve & Proceed
              </button>
            </div>
          )}
          {rfq.status === 'approved' && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-sm text-emerald-700 dark:text-emerald-300">RFQ approved by {rfq.approvedBy} on {rfq.approvalDate}. Ready for Purchase Order issuance.</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate('/procurement/purchase-orders');
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                <span>Raise PO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const RFQPage: React.FC = () => {
  const { rfqs } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null);

  const filtered = useMemo(() => rfqs.filter((r) => {
    const q = search.toLowerCase();
    const ms = r.materialName.toLowerCase().includes(q) || r.rfqNumber.toLowerCase().includes(q) || r.projectName.toLowerCase().includes(q);
    const st = statusFilter === 'all' || r.status === statusFilter;
    return ms && st;
  }), [rfqs, search, statusFilter]);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">RFQ Management & Vendor Comparison</h1>
        <p className="text-sm text-slate-500 mt-1">Compare vendor quotes side-by-side · Lowest price and fastest delivery auto-highlighted</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search RFQ number, material, project..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none">
          <option value="all">All Status</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* RFQ Cards */}
      <div className="space-y-3">
        {filtered.map((rfq) => {
          const sc = STATUS_CFG[rfq.status] || STATUS_CFG.draft;
          const lowestRate = rfq.vendorQuotes.length > 0 ? Math.min(...rfq.vendorQuotes.map((q) => q.rate)) : null;
          return (
            <div key={rfq.id} onClick={() => setSelectedRFQ(rfq)} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-500">{rfq.rfqNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.cls}`}>{sc.label}</span>
                    <span className="text-xs text-slate-400">{rfq.vendorQuotes.length} quotes</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">{rfq.materialName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{rfq.projectName} · {rfq.quantity} {rfq.materialUnit}</p>
                </div>
                <div className="text-right shrink-0">
                  {lowestRate && <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Best: ₹ {lowestRate.toLocaleString()}</p>}
                  <p className="text-xs text-slate-400 mt-0.5">Reqd: {rfq.requiredByDate}</p>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 ml-auto mt-1 transition-colors" />
                </div>
              </div>
              {rfq.vendorQuotes.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  {rfq.vendorQuotes.slice(0, 3).map((q) => (
                    <div key={q.vendorId} className={`text-xs px-2 py-1 rounded-lg ${q.isSelected ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 font-semibold' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {q.vendorName.split(' –')[0].substring(0, 20)} · ₹{q.rate.toLocaleString()}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400"><FileText className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No RFQs found</p></div>}
      </div>

      {selectedRFQ && <VendorComparisonModal rfq={selectedRFQ} onClose={() => setSelectedRFQ(null)} />}
    </div>
  );
};
