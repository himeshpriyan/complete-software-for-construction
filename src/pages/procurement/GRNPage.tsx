import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SITES } from '../../data/procurementSeed';
import { ClipboardCheck, AlertTriangle, CheckCircle2, MinusCircle, Search, ChevronRight, Plus, Bot, Sparkles, FileText } from 'lucide-react';
import { GRNEntry, PurchaseOrder } from '../../types';

const STATUS_CFG = {
  pass: { label: 'Pass', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
  fail: { label: 'Fail', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' },
  partial: { label: 'Partial', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' },
};

const RECEIPT_CFG = {
  exact: { label: 'Exact', icon: CheckCircle2, cls: 'text-emerald-600 dark:text-emerald-400' },
  short: { label: 'Short', icon: MinusCircle, cls: 'text-amber-600 dark:text-amber-400' },
  excess: { label: 'Excess', icon: AlertTriangle, cls: 'text-blue-600 dark:text-blue-400' },
};

const GRNDetailPanel: React.FC<{ grn: GRNEntry; onClose: () => void }> = ({ grn, onClose }) => {
  const sc = STATUS_CFG[grn.overallQCStatus] || STATUS_CFG.partial;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">{grn.grnNumber}</p>
            <h2 className="text-base font-bold text-white">GRN — {grn.poNumber}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{grn.projectName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.cls}`}>QC: {sc.label}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${grn.status === 'posted' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'}`}>{grn.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Vendor', value: grn.vendorName },
              { label: 'Received Date', value: grn.receivedDate },
              { label: 'Received By', value: grn.receivedBy },
              { label: 'Challan No.', value: grn.challanNumber || '—' },
              { label: 'Vehicle No.', value: grn.vehicleNumber || '—' },
              { label: 'Batch No.', value: grn.batchNumber || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Receipt Line Items</p>
            <div className="space-y-3">
              {grn.lineItems.map((item, i) => {
                const rc = RECEIPT_CFG[item.receiptStatus];
                const qcCfg = item.qcStatus === 'pass' ? STATUS_CFG.pass : item.qcStatus === 'fail' ? STATUS_CFG.fail : STATUS_CFG.partial;
                const RIcon = rc.icon;
                return (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{item.materialName}</h4>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${qcCfg.cls}`}>QC: {item.qcStatus}</span>
                        <RIcon className={`w-4 h-4 ${rc.cls}`} />
                        <span className={`text-xs font-semibold ${rc.cls}`}>{rc.label}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center"><p className="text-slate-400">Ordered</p><p className="font-bold text-slate-700 dark:text-slate-300">{item.orderedQty}</p></div>
                      <div className="text-center"><p className="text-slate-400">Received</p><p className={`font-bold ${item.receivedQty < item.orderedQty ? 'text-amber-600' : item.receivedQty > item.orderedQty ? 'text-blue-600' : 'text-emerald-600'}`}>{item.receivedQty}</p></div>
                      <div className="text-center"><p className="text-slate-400">Accepted</p><p className="font-bold text-emerald-600 dark:text-emerald-400">{item.acceptedQty}</p></div>
                      <div className="text-center"><p className="text-slate-400">Rejected</p><p className={`font-bold ${item.rejectedQty > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'}`}>{item.rejectedQty}</p></div>
                    </div>
                    {item.qcRemarks && <p className="mt-2 text-xs text-slate-500 italic">{item.qcRemarks}</p>}
                  </div>
                );
              })}
            </div>
          </div>
          {grn.remarks && <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"><p className="text-xs text-amber-700 dark:text-amber-400">{grn.remarks}</p></div>}
        </div>
      </div>
    </div>
  );
};

const CreateGRNModal: React.FC<{ po: PurchaseOrder; onClose: () => void }> = ({ po, onClose }) => {
  const { createGRN, currentUser } = useAppStore();
  const [form, setForm] = useState({
    siteId: '', receivedBy: currentUser?.name || '', challanNumber: '', vehicleNumber: '', batchNumber: '', date: new Date().toISOString().split('T')[0],
    lineItems: po.lineItems.map((item) => ({
      materialId: item.materialId,
      materialName: item.materialName,
      sku: item.hsnCode || item.materialId,
      unit: item.unit,
      orderedQty: item.quantity,
      receivedQty: item.quantity,
      acceptedQty: item.quantity,
      rejectedQty: 0,
      receiptStatus: 'exact' as 'exact' | 'short' | 'excess',
      qcStatus: 'pass' as 'pass' | 'fail' | 'pending',
      qcRemarks: '',
      rate: item.rate,
    })),
  });
  const [submitted, setSubmitted] = useState(false);

  const handleQtyChange = (i: number, receivedQty: number) => {
    setForm((prev) => {
      const items = [...prev.lineItems];
      const ordered = po.lineItems[i].quantity;
      const status: 'exact' | 'short' | 'excess' = receivedQty === ordered ? 'exact' : receivedQty < ordered ? 'short' : 'excess';
      items[i] = { ...items[i], receivedQty, acceptedQty: receivedQty, receiptStatus: status };
      return { ...prev, lineItems: items };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.siteId) return;
    const site = SITES.find((s) => s.id === form.siteId);
    const overallQC: 'pass' | 'fail' | 'partial' = form.lineItems.some((i) => i.qcStatus === 'fail') ? 'fail' : form.lineItems.some((i) => i.qcStatus !== 'pass') ? 'partial' : 'pass';
    createGRN({
      poId: po.id, poNumber: po.poNumber, vendorId: po.vendorId, vendorName: po.vendorName,
      projectId: po.projectId, projectName: po.projectName, siteId: form.siteId,
      receivedDate: form.date, receivedBy: form.receivedBy, challanNumber: form.challanNumber,
      vehicleNumber: form.vehicleNumber, batchNumber: form.batchNumber,
      lineItems: form.lineItems, overallQCStatus: overallQC, status: 'verified', verifiedBy: currentUser?.name, verifiedDate: form.date,
    });
    setSubmitted(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4 pt-6" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 rounded-t-2xl flex justify-between items-start">
          <div>
            <p className="text-xs text-amber-400 mb-1">Create GRN against</p>
            <h2 className="text-lg font-bold text-white">{po.poNumber}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{po.vendorName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        {submitted ? (
          <div className="p-8 text-center"><CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" /><p className="text-lg font-bold text-slate-900 dark:text-white">GRN Created!</p><p className="text-sm text-slate-500 mt-1">Stock has been updated automatically.</p></div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* 6(b) AI Document Reader (Illustrative Demo) */}
            <div className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    AI Invoice / Challan Reader
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 uppercase">
                      Demo
                    </span>
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Upload scanned tax invoice to auto-extract challan, vehicle, and line item counts
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setForm({
                    ...form,
                    siteId: SITES[0]?.id || 'SITE-01',
                    challanNumber: `CHL/TATA/2026-${Math.floor(1000 + Math.random() * 9000)}`,
                    vehicleNumber: 'MH-04-GP-8842',
                    batchNumber: 'BTC-TISCON-FE550-B8',
                  });
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Upload Invoice (Auto-Fill)</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Receiving Site *</label>
                <select value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="">Select Site</option>
                  {SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Received Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Challan Number</label>
                <input type="text" value={form.challanNumber} onChange={(e) => setForm({ ...form, challanNumber: e.target.value })} placeholder="Vendor challan no." className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Vehicle Number</label>
                <input type="text" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} placeholder="e.g. MH04-AZ-1234" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Receipt Details per Item</p>
              {form.lineItems.map((item, i) => (
                <div key={i} className="mb-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
                  <p className="font-medium text-slate-800 dark:text-slate-200 text-sm mb-3">{item.materialName} <span className="text-xs text-slate-400">({item.unit})</span></p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Ordered Qty</label>
                      <input type="number" value={item.orderedQty} readOnly className="w-full px-2 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-sm text-slate-600 dark:text-slate-400 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Received Qty</label>
                      <input type="number" value={item.receivedQty} onChange={(e) => handleQtyChange(i, parseFloat(e.target.value))} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">QC Status</label>
                      <select value={item.qcStatus} onChange={(e) => { const items = [...form.lineItems]; items[i] = { ...items[i], qcStatus: e.target.value as 'pass' | 'fail' | 'pending' }; setForm({ ...form, lineItems: items }); }} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none">
                        <option value="pass">Pass</option>
                        <option value="fail">Fail</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>
                  {item.receivedQty !== item.orderedQty && (
                    <div className={`mt-2 text-xs px-2 py-1 rounded-lg flex items-center gap-1 ${item.receivedQty < item.orderedQty ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400'}`}>
                      {item.receivedQty < item.orderedQty ? <MinusCircle className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {item.receiptStatus === 'short' ? `Short by ${item.orderedQty - item.receivedQty} ${item.unit}` : `Excess by ${item.receivedQty - item.orderedQty} ${item.unit}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors">Create GRN & Update Stock</button>
          </form>
        )}
      </div>
    </div>
  );
};

export const GRNPage: React.FC = () => {
  const { grnEntries, purchaseOrders } = useAppStore();
  const [search, setSearch] = useState('');
  const [selectedGRN, setSelectedGRN] = useState<GRNEntry | null>(null);
  const [createGRNForPO, setCreateGRNForPO] = useState<PurchaseOrder | null>(null);

  const filtered = useMemo(() => grnEntries.filter((g) => {
    const q = search.toLowerCase();
    return g.grnNumber.toLowerCase().includes(q) || g.vendorName.toLowerCase().includes(q) || g.projectName.toLowerCase().includes(q);
  }), [grnEntries, search]);

  const eligiblePOs = purchaseOrders.filter((po) => ['sent', 'acknowledged', 'partially_received'].includes(po.status));

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Goods Receipt Notes</h1>
          <p className="text-sm text-slate-500 mt-1">Record material receipts against POs · QC pass/fail · Auto stock update</p>
        </div>
      </div>

      {/* Create GRN from PO */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2"><Plus className="w-4 h-4 text-amber-600" /> Create GRN Against Open PO</h2>
        <div className="flex flex-wrap gap-2">
          {eligiblePOs.map((po) => (
            <button key={po.id} onClick={() => setCreateGRNForPO(po)} className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-colors">
              {po.poNumber} — {po.vendorName.split('–')[0].trim()}
            </button>
          ))}
          {eligiblePOs.length === 0 && <p className="text-xs text-slate-400">No open POs eligible for GRN</p>}
        </div>
      </div>

      {/* Search & List */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search GRN number, vendor, project..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
      </div>

      <div className="space-y-3">
        {filtered.map((grn) => {
          const sc = STATUS_CFG[grn.overallQCStatus] || STATUS_CFG.partial;
          const hasIssues = grn.lineItems.some((i) => i.receiptStatus !== 'exact' || i.qcStatus !== 'pass');
          return (
            <div key={grn.id} onClick={() => setSelectedGRN(grn)} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-500">{grn.grnNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.cls}`}>QC: {sc.label}</span>
                    {hasIssues && <span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 font-medium flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Issues</span>}
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400">{grn.poNumber} — {grn.vendorName.split('–')[0].trim()}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{grn.projectName} · {grn.lineItems.length} line items</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{grn.receivedDate}</p>
                  <p className="text-xs text-slate-400 mt-0.5">By: {grn.receivedBy}</p>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 ml-auto mt-1 transition-colors" />
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400"><ClipboardCheck className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No GRN entries found</p></div>}
      </div>

      {selectedGRN && <GRNDetailPanel grn={selectedGRN} onClose={() => setSelectedGRN(null)} />}
      {createGRNForPO && <CreateGRNModal po={createGRNForPO} onClose={() => setCreateGRNForPO(null)} />}
    </div>
  );
};
