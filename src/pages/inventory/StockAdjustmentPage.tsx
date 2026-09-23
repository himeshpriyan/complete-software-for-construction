import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SITES } from '../../data/procurementSeed';
import { SlidersHorizontal, CheckCircle2, Clock } from 'lucide-react';

const ADJUSTMENT_TYPES = ['Damage', 'Wastage', 'Theft', 'Count Correction', 'Monsoon Loss', 'Expired/Unusable'];

export const StockAdjustmentPage: React.FC = () => {
  const { materials, stockTransactions, addStockTransaction, currentUser } = useAppStore();
  const [form, setForm] = useState({ materialId: '', siteId: '', adjustmentType: '', quantity: '', isNegative: 'true', reason: '', date: new Date().toISOString().split('T')[0] });
  const [submitted, setSubmitted] = useState(false);

  const selectedMat = materials.find((m) => m.id === form.materialId);
  const adjustments = stockTransactions.filter((t) => t.type === 'adjustment').slice(0, 15);
  const adjQty = parseFloat(form.quantity || '0') * (form.isNegative === 'true' ? -1 : 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMat || !form.siteId || !form.quantity) return;
    const site = SITES.find((s) => s.id === form.siteId);
    addStockTransaction({
      type: 'adjustment',
      materialId: form.materialId,
      materialName: selectedMat.name,
      materialUnit: selectedMat.unit,
      siteId: form.siteId,
      siteName: site?.name || '',
      quantity: adjQty,
      rate: selectedMat.currentRate,
      value: adjQty * selectedMat.currentRate,
      date: form.date,
      reason: `${form.adjustmentType}: ${form.reason}`,
      referenceType: 'ADJUSTMENT',
      performedBy: currentUser?.name || 'Store Manager',
    });
    setSubmitted(true);
    setForm({ materialId: '', siteId: '', adjustmentType: '', quantity: '', isNegative: 'true', reason: '', date: new Date().toISOString().split('T')[0] });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Stock Adjustment</h1>
        <p className="text-sm text-slate-500 mt-1">Write-off damaged, wasted, or miscounted stock. All adjustments require a reason.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-rose-600" /> New Adjustment
          </h2>
          {submitted && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Adjustment recorded successfully
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Material</label>
              <select value={form.materialId} onChange={(e) => setForm({ ...form, materialId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="">Select Material</option>
                {materials.map((m) => <option key={m.id} value={m.id}>{m.sku} – {m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Site</label>
              <select value={form.siteId} onChange={(e) => setForm({ ...form, siteId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="">Select Site</option>
                {SITES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Adjustment Type</label>
              <select value={form.adjustmentType} onChange={(e) => setForm({ ...form, adjustmentType: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none">
                <option value="">Select Type</option>
                {ADJUSTMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Direction</label>
                <select value={form.isNegative} onChange={(e) => setForm({ ...form, isNegative: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none">
                  <option value="true">Write-off (−)</option>
                  <option value="false">Write-in (+)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Quantity {selectedMat ? `(${selectedMat.unit})` : ''}</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Qty" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Reason / Remarks <span className="text-rose-500">*</span></label>
              <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Describe what happened in detail" rows={3} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none" />
            </div>
            {selectedMat && form.quantity && (
              <div className={`p-3 rounded-lg text-xs border ${adjQty < 0 ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400' : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'}`}>
                Adjustment: {adjQty > 0 ? '+' : ''}{adjQty} {selectedMat.unit} · Write-off value: ₹ {Math.abs(adjQty * selectedMat.currentRate).toLocaleString()}
              </div>
            )}
            <button type="submit" className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors">Record Adjustment</button>
          </form>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /> Adjustment Log</h2>
          <div className="space-y-3">
            {adjustments.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No adjustments recorded</p>}
            {adjustments.map((tx) => (
              <div key={tx.id} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{tx.materialName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{tx.siteName.split(' – ')[0]} · {tx.date}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{tx.reason}</p>
                </div>
                <div className="text-right ml-3">
                  <p className={`text-sm font-bold ${tx.quantity < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {tx.quantity > 0 ? '+' : ''}{tx.quantity} {tx.materialUnit}
                  </p>
                  <p className="text-xs text-slate-500">₹ {Math.abs(tx.value).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
