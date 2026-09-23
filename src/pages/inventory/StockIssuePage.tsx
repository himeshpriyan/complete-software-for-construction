import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { SITES } from '../../data/procurementSeed';
import { ArrowUpFromLine, CheckCircle2, Clock } from 'lucide-react';

export const StockIssuePage: React.FC = () => {
  const { materials, stockTransactions, addStockTransaction, currentUser } = useAppStore();
  const [form, setForm] = useState({ materialId: '', siteId: '', quantity: '', issuedTo: '', purpose: '', date: new Date().toISOString().split('T')[0] });
  const [submitted, setSubmitted] = useState(false);

  const selectedMat = materials.find((m) => m.id === form.materialId);
  const issues = stockTransactions.filter((t) => t.type === 'issue').slice(0, 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMat || !form.siteId || !form.quantity) return;
    const site = SITES.find((s) => s.id === form.siteId);
    addStockTransaction({
      type: 'issue',
      materialId: form.materialId,
      materialName: selectedMat.name,
      materialUnit: selectedMat.unit,
      siteId: form.siteId,
      siteName: site?.name || '',
      quantity: parseFloat(form.quantity),
      rate: selectedMat.currentRate,
      value: parseFloat(form.quantity) * selectedMat.currentRate,
      date: form.date,
      issuedTo: form.issuedTo,
      reason: form.purpose,
      referenceType: 'ISSUE',
      performedBy: currentUser?.name || 'Store Manager',
    });
    setSubmitted(true);
    setForm({ materialId: '', siteId: '', quantity: '', issuedTo: '', purpose: '', date: new Date().toISOString().split('T')[0] });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Site Issue</h1>
        <p className="text-sm text-slate-500 mt-1">Issue materials from a site store to a project team or subcontractor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Form */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ArrowUpFromLine className="w-4 h-4 text-amber-600" /> New Site Issue
          </h2>
          {submitted && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Stock issue recorded successfully
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Material', field: 'materialId', type: 'select', options: materials.map((m) => ({ value: m.id, label: `${m.sku} – ${m.name}` })) },
              { label: 'From Site', field: 'siteId', type: 'select', options: SITES.map((s) => ({ value: s.id, label: s.name })) },
              { label: 'Quantity', field: 'quantity', type: 'number', placeholder: `Qty (in ${selectedMat?.unit || 'unit'})` },
              { label: 'Issued To', field: 'issuedTo', type: 'text', placeholder: 'Engineer name or subcontractor' },
              { label: 'Purpose', field: 'purpose', type: 'text', placeholder: 'Describe purpose / activity' },
              { label: 'Date', field: 'date', type: 'date' },
            ].map(({ label, field, type, options, placeholder }) => (
              <div key={field}>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</label>
                {type === 'select' ? (
                  <select value={(form as never)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none">
                    <option value="">Select {label}</option>
                    {(options || []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : (
                  <input type={type} value={(form as never)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
                )}
              </div>
            ))}
            {selectedMat && form.quantity && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-400">
                Estimated value: ₹ {(parseFloat(form.quantity || '0') * selectedMat.currentRate).toLocaleString()} · Current stock: {selectedMat.currentStock} {selectedMat.unit}
              </div>
            )}
            <button type="submit" className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors">
              Record Issue
            </button>
          </form>
        </div>

        {/* Recent Issues */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" /> Recent Issues
          </h2>
          <div className="space-y-3">
            {issues.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No issues recorded yet</p>}
            {issues.map((tx) => (
              <div key={tx.id} className="flex items-start justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{tx.materialName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{tx.siteName} · To: {tx.issuedTo}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{tx.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-600 dark:text-amber-400">{tx.quantity} {tx.materialUnit}</p>
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
