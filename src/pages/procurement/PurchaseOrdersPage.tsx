import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ShoppingBag, Search, ChevronDown, ChevronUp, ChevronRight, Building2, MapPin, Calendar, Package, ArrowRight, ExternalLink } from 'lucide-react';
import { PurchaseOrder } from '../../types';

const STATUS_CFG: Record<string, { label: string; cls: string; step: number }> = {
  draft: { label: 'Draft', cls: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', step: 1 },
  sent: { label: 'Sent to Vendor', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400', step: 2 },
  acknowledged: { label: 'Acknowledged', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400', step: 3 },
  partially_received: { label: 'Partially Received', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400', step: 4 },
  fully_received: { label: 'Fully Received', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400', step: 5 },
  closed: { label: 'Closed', cls: 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400', step: 6 },
  cancelled: { label: 'Cancelled', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400', step: 0 },
};

const STATUS_STEPS = ['Draft', 'Sent', 'Acknowledged', 'Partially Received', 'Fully Received', 'Closed'];

const PODocumentView: React.FC<{ po: PurchaseOrder; onClose: () => void }> = ({ po, onClose }) => {
  const navigate = useNavigate();
  const { updatePOStatus } = useAppStore();
  const sc = STATUS_CFG[po.status] || STATUS_CFG.draft;
  const currentStep = sc.step;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4 pt-6" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* PO Document Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Purchase Order</p>
                  <p className="text-xl font-bold text-white">{po.poNumber}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {po.poDate}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {po.projectName}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.cls}`}>{sc.label}</span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mt-5 flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => (
              <React.Fragment key={step}>
                <div className={`flex flex-col items-center ${i < STATUS_STEPS.length - 1 ? '' : ''}`}>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${i + 1 <= currentStep ? 'bg-amber-600 border-amber-600 text-white' : 'border-slate-600 text-slate-500'}`}>
                    {i + 1 <= currentStep ? '✓' : i + 1}
                  </div>
                  <p className={`text-xs mt-1 whitespace-nowrap hidden md:block ${i + 1 <= currentStep ? 'text-amber-400' : 'text-slate-600'}`}>{step}</p>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${i + 1 < currentStep ? 'bg-amber-600' : 'bg-slate-700'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Parties */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">From (Buyer)</p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white">Apex Buildcon Pvt Ltd</p>
                <p className="text-xs text-slate-500 mt-1">27AABCA7817Q1ZN</p>
                <p className="text-xs text-slate-500">Mumbai HQ, Maharashtra</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">To (Vendor)</p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="font-bold text-slate-900 dark:text-white">{po.vendorName}</p>
                <p className="text-xs text-slate-500 mt-1">{po.vendorGST}</p>
                <p className="text-xs text-slate-500">{po.vendorAddress}</p>
              </div>
            </div>
          </div>

          {/* Delivery & Payment */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: 'Delivery Terms', value: po.deliveryTerms },
              { label: 'Payment Terms', value: po.paymentTerms },
              { label: 'Expected Delivery', value: po.expectedDeliveryDate },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value}</p>
              </div>
            ))}
          </div>

          {/* Line Items Table */}
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Line Items</p>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60">
                  <tr>
                    {['#', 'Material', 'HSN', 'Unit', 'Qty', 'Rate (₹)', 'Amount (₹)', 'GST %', 'GST Amt', 'Total (₹)'].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {po.lineItems.map((item, i) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2.5 text-slate-500 text-xs">{i + 1}</td>
                      <td className="px-3 py-2.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">{item.materialName}</td>
                      <td className="px-3 py-2.5 font-mono text-xs text-slate-500">{item.hsnCode}</td>
                      <td className="px-3 py-2.5 text-xs text-slate-500">{item.unit}</td>
                      <td className="px-3 py-2.5 font-medium">{item.quantity}</td>
                      <td className="px-3 py-2.5 font-medium">₹ {item.rate.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2.5">₹ {item.amount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2.5 text-slate-500">{item.gstPct}%</td>
                      <td className="px-3 py-2.5">₹ {item.gstAmount.toLocaleString('en-IN')}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-900 dark:text-white">₹ {item.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Subtotal</span><span>₹ {po.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>GST (all rates)</span><span>₹ {po.totalGST.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-2">
                <span>Grand Total</span><span>₹ {po.grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {po.remarks && (
            <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-0.5">Special Remarks</p>
              <p className="text-sm text-amber-800 dark:text-amber-300">{po.remarks}</p>
            </div>
          )}

          {/* Status action */}
          {po.status === 'sent' && (
            <button onClick={() => { updatePOStatus(po.id, 'acknowledged'); onClose(); }} className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors">
              Mark as Acknowledged by Vendor
            </button>
          )}

          {/* Downstream Actions: GRN & Inventory */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Downstream Flow:</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  onClose();
                  navigate('/procurement/grn');
                }}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Receive Goods / Create GRN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  onClose();
                  navigate('/inventory/materials');
                }}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <span>Stock Master</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PurchaseOrdersPage: React.FC = () => {
  const { purchaseOrders } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const filtered = useMemo(() => purchaseOrders.filter((po) => {
    const q = search.toLowerCase();
    const ms = po.poNumber.toLowerCase().includes(q) || po.vendorName.toLowerCase().includes(q) || po.projectName.toLowerCase().includes(q);
    const st = statusFilter === 'all' || po.status === statusFilter;
    return ms && st;
  }), [purchaseOrders, search, statusFilter]);

  const totalValue = purchaseOrders.reduce((s, po) => s + po.grandTotal, 0);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Purchase Orders</h1>
          <p className="text-sm text-slate-500 mt-1">{purchaseOrders.length} POs · Total value ₹ {(totalValue / 10000000).toFixed(2)} Cr</p>
        </div>
      </div>

      {/* Status chips */}
      <div className="flex flex-wrap gap-2">
        {[{ k: 'all', label: `All (${purchaseOrders.length})` }, ...Object.entries(STATUS_CFG).map(([k, v]) => ({ k, label: `${v.label} (${purchaseOrders.filter((p) => p.status === k).length})` }))].map(({ k, label }) => (
          <button key={k} onClick={() => setStatusFilter(k)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${statusFilter === k ? 'bg-amber-600 text-white border-amber-600' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-400'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search PO number, vendor, project..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
      </div>

      {/* PO Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60">
              <tr>
                {['PO Number', 'Date', 'Vendor', 'Project', 'Items', 'Grand Total', 'Expected Delivery', 'Status', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filtered.map((po) => {
                const sc = STATUS_CFG[po.status] || STATUS_CFG.draft;
                return (
                  <tr key={po.id} onClick={() => setSelectedPO(po)} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/10 cursor-pointer transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">{po.poNumber}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{po.poDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-sm font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{po.vendorName.split('–')[0].trim()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{po.projectName.substring(0, 25)}{po.projectName.length > 25 ? '…' : ''}</td>
                    <td className="px-4 py-3 text-center text-slate-700 dark:text-slate-300">{po.lineItems.length}</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white whitespace-nowrap">₹ {po.grandTotal.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">{po.expectedDeliveryDate}</td>
                    <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.cls}`}>{sc.label}</span></td>
                    <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-slate-400"><ShoppingBag className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No POs found</p></div>}
        </div>
      </div>

      {selectedPO && <PODocumentView po={selectedPO} onClose={() => setSelectedPO(null)} />}
    </div>
  );
};
