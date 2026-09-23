import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  ClipboardList, Plus, CheckCircle2, XCircle, AlertTriangle,
  Clock, ChevronRight, Search, Filter, ArrowRight, ExternalLink
} from 'lucide-react';
import { PurchaseRequisition } from '../../types';

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400' },
  approved: { label: 'Approved', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' },
  converted_rfq: { label: 'Converted to RFQ', cls: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400' },
  converted_po: { label: 'Converted to PO', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' },
  rejected: { label: 'Rejected', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' },
};
const PRIORITY_CFG: Record<string, string> = {
  urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  normal: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const PRDetailPanel: React.FC<{ pr: PurchaseRequisition; onClose: () => void }> = ({ pr, onClose }) => {
  const navigate = useNavigate();
  const { updatePRStatus, currentUser } = useAppStore();
  const sc = STATUS_CFG[pr.status] || STATUS_CFG.pending;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end" onClick={onClose}>
      <div className="w-full max-w-lg h-full bg-white dark:bg-slate-900 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">{pr.prNumber}</p>
            <h2 className="text-base font-bold text-white">{pr.materialName}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{pr.projectName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl leading-none">✕</button>
        </div>
        <div className="p-6 space-y-5">
          <div className="flex gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.cls}`}>{sc.label}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${PRIORITY_CFG[pr.priority]}`}>{pr.priority} Priority</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Quantity', value: `${pr.quantity} ${pr.materialUnit}` },
              { label: 'Required By', value: pr.requiredByDate },
              { label: 'Raised By', value: pr.raisedBy },
              { label: 'Raised Date', value: pr.raisedDate },
              { label: 'Approved By', value: pr.approvedBy || '—' },
              { label: 'Approved Date', value: pr.approvedDate || '—' },
            ].map(({ label, value }) => (
              <div key={label} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
            <p className="text-xs text-slate-500 mb-1">Purpose / Remarks</p>
            <p className="text-sm text-slate-700 dark:text-slate-300">{pr.purpose}</p>
          </div>
          {pr.rejectionReason && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800">
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mb-1">Rejection Reason</p>
              <p className="text-sm text-rose-700 dark:text-rose-300">{pr.rejectionReason}</p>
            </div>
          )}
          {pr.status === 'pending' && (
            <div className="flex gap-3">
              <button
                onClick={() => { updatePRStatus(pr.id, 'approved', currentUser?.name); onClose(); }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve
              </button>
              <button
                onClick={() => { updatePRStatus(pr.id, 'rejected', undefined, 'Rejected by management'); onClose(); }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          )}

          {/* Procurement Lifecycle Deep-Links */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Procurement Lifecycle Next Steps</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => { onClose(); navigate('/procurement/rfq'); }}
                className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-semibold hover:bg-purple-100 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Float RFQ</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { onClose(); navigate('/procurement/purchase-orders'); }}
                className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-semibold hover:bg-amber-100 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Direct PO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => { onClose(); navigate('/inventory/materials'); }}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors"
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

export const PurchaseRequestsPage: React.FC = () => {
  const { purchaseRequisitions, materials, projects, createPR, currentUser } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPR, setSelectedPR] = useState<PurchaseRequisition | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ projectId: '', materialId: '', quantity: '', requiredByDate: '', purpose: '', priority: 'normal' as const });
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => purchaseRequisitions.filter((pr) => {
    const q = search.toLowerCase();
    const ms = pr.materialName.toLowerCase().includes(q) || pr.projectName.toLowerCase().includes(q) || pr.prNumber.toLowerCase().includes(q);
    const st = statusFilter === 'all' || pr.status === statusFilter;
    return ms && st;
  }), [purchaseRequisitions, search, statusFilter]);

  const counts = useMemo(() => ({
    pending: purchaseRequisitions.filter((p) => p.status === 'pending').length,
    approved: purchaseRequisitions.filter((p) => p.status === 'approved').length,
    converted: purchaseRequisitions.filter((p) => p.status === 'converted_po' || p.status === 'converted_rfq').length,
    rejected: purchaseRequisitions.filter((p) => p.status === 'rejected').length,
  }), [purchaseRequisitions]);

  const selectedMat = materials.find((m) => m.id === form.materialId);
  const selectedProject = projects.find((p) => p.id === form.projectId);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.projectId || !form.materialId || !form.quantity) return;
    createPR({
      projectId: form.projectId,
      projectName: selectedProject?.name || '',
      materialId: form.materialId,
      materialName: selectedMat?.name || '',
      materialUnit: selectedMat?.unit || '',
      quantity: parseFloat(form.quantity),
      requiredByDate: form.requiredByDate,
      purpose: form.purpose,
      raisedBy: currentUser?.name || 'Site Engineer',
      raisedByRole: currentUser?.roleTitle || 'Site Engineer',
      priority: form.priority,
    });
    setSubmitted(true);
    setForm({ projectId: '', materialId: '', quantity: '', requiredByDate: '', purpose: '', priority: 'normal' });
    setTimeout(() => { setSubmitted(false); setShowCreate(false); }, 2000);
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Purchase Requisitions</h1>
          <p className="text-sm text-slate-500 mt-1">Raised by site engineers for material procurement</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New PR
        </button>
      </div>

      {/* Status KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: 'Pending Approval', value: counts.pending, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40' },
          { icon: CheckCircle2, label: 'Approved', value: counts.approved, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/40' },
          { icon: ClipboardList, label: 'Converted', value: counts.converted, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
          { icon: XCircle, label: 'Rejected', value: counts.rejected, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
        ].map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}><Icon className={`w-5 h-5 ${color}`} /></div>
            <div><p className="text-xs text-slate-500">{label}</p><p className={`text-xl font-bold ${color}`}>{value}</p></div>
          </div>
        ))}
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-800/50 p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Raise New Purchase Requisition</h2>
          {submitted && <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-800"><CheckCircle2 className="w-4 h-4 shrink-0" /> PR raised successfully</div>}
          <form onSubmit={handleCreate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Project *</label>
                <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="">Select Project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Material *</label>
                <select value={form.materialId} onChange={(e) => setForm({ ...form, materialId: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="">Select Material</option>
                  {materials.map((m) => <option key={m.id} value={m.id}>{m.sku} – {m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Quantity {selectedMat ? `(${selectedMat.unit})` : ''} *</label>
                <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="Enter quantity" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Required By Date *</label>
                <input type="date" value={form.requiredByDate} onChange={(e) => setForm({ ...form, requiredByDate: e.target.value })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as typeof form.priority })} className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Purpose / Activity</label>
                <input type="text" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} placeholder="Describe what this material is needed for" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors">Raise PR</button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search PR number, material, project..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none">
          <option value="all">All Status</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* PR List */}
      <div className="space-y-3">
        {filtered.map((pr) => {
          const sc = STATUS_CFG[pr.status] || STATUS_CFG.pending;
          return (
            <div key={pr.id} onClick={() => setSelectedPR(pr)} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-slate-500">{pr.prNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.cls}`}>{sc.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${PRIORITY_CFG[pr.priority]}`}>{pr.priority}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">{pr.materialName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{pr.projectName} · {pr.quantity} {pr.materialUnit}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-slate-400">Required by</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{pr.requiredByDate}</p>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 ml-auto mt-1 transition-colors" />
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                Raised by {pr.raisedBy} ({pr.raisedByRole}) · {pr.raisedDate}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && <div className="text-center py-12 text-slate-400"><ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" /><p className="text-sm">No requisitions found</p></div>}
      </div>

      {selectedPR && <PRDetailPanel pr={selectedPR} onClose={() => setSelectedPR(null)} />}
    </div>
  );
};
