import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SITES } from '../../data/procurementSeed';
import { ArrowRightLeft, CheckCircle2, Clock } from 'lucide-react';

export const StockTransferPage: React.FC = () => {
  const { materials, stockTransactions, addStockTransaction, currentUser } = useAppStore();
  const [form, setForm] = useState({ materialId: '', fromSiteId: '', toSiteId: '', quantity: '', reason: '', date: new Date().toISOString().split('T')[0] });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const selectedMat = materials.find((m) => m.id === form.materialId);
  const transfers = stockTransactions.filter((t) => t.type === 'transfer_out').slice(0, 15);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.fromSiteId === form.toSiteId) { setError('From and To sites cannot be the same.'); return; }
    if (!selectedMat || !form.quantity) return;
    const fromSite = SITES.find((s) => s.id === form.fromSiteId);
    const toSite = SITES.find((s) => s.id === form.toSiteId);
    const qty = parseFloat(form.quantity);
    // Transfer Out
    addStockTransaction({ type: 'transfer_out', materialId: form.materialId, materialName: selectedMat.name, materialUnit: selectedMat.unit, siteId: form.fromSiteId, siteName: fromSite?.name || '', quantity: qty, rate: selectedMat.currentRate, value: qty * selectedMat.currentRate, date: form.date, transferToSiteId: form.toSiteId, transferToSiteName: toSite?.name || '', reason: form.reason, referenceType: 'TRANSFER', performedBy: currentUser?.name || 'Store Manager' });
    setSubmitted(true);
    setForm({ materialId: '', fromSiteId: '', toSiteId: '', quantity: '', reason: '', date: new Date().toISOString().split('T')[0] });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stock Transfer</h1>
        <p className="text-sm text-slate-500 mt-1">Transfer materials between sites (e.g. Head Office Store → Site A)</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-blue-600" /> New Transfer
          </h2>
          {submitted && <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-800"><CheckCircle2 className="w-4 h-4 shrink-0" /> Transfer recorded successfully</div>}
          {error && <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 text-sm border border-rose-200 dark:border-rose-800">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Material</label>
              <select value={form.materialId} onChange={(e) => setForm({ ...form, materialId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">Select Material</option>
                {materials.map((m) => <option key={m.id} value={m.id}>{m.sku} – {m.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">From Site</label>
                <select value={form.fromSiteId} onChange={(e) => setForm({ ...form, fromSiteId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Site</option>
                  {SITES.map((s) => <option key={s.id} value={s.id}>{s.name.split(' – ')[0]}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">To Site</label>
                <select value={form.toSiteId} onChange={(e) => setForm({ ...form, toSiteId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select Site</option>
                  {SITES.map((s) => <option key={s.id} value={s.id}>{s.name.split(' – ')[0]}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Quantity {selectedMat ? `(${selectedMat.unit})` : ''}</label>
              <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Enter quantity" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Reason for Transfer</label>
              <input type="text" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="e.g. Site requirement, urgent mobilization" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors">Record Transfer</button>
          </form>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /> Transfer History</h2>
          <div className="space-y-3">
            {transfers.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No transfers recorded</p>}
            {transfers.map((tx) => (
              <div key={tx.id} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{tx.materialName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{tx.siteName.split(' – ')[0]} → {tx.transferToSiteName?.split(' – ')[0]}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{tx.date} · {tx.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{tx.quantity} {tx.materialUnit}</p>
                  <p className="text-xs text-slate-500">₹ {tx.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
