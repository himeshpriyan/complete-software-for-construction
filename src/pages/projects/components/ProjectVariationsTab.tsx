import React, { useState } from 'react';
import { Project, VariationOrder } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import {
  TrendingUp,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  FileCheck,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from 'lucide-react';

interface ProjectVariationsTabProps {
  project: Project;
  variations: VariationOrder[];
}

export const ProjectVariationsTab: React.FC<ProjectVariationsTabProps> = ({
  project,
  variations,
}) => {
  const { createVariation, updateVariationStatus } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVOForAction, setSelectedVOForAction] = useState<VariationOrder | null>(null);
  const [approverComments, setApproverComments] = useState('');

  // Form State for new VO
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<VariationOrder['type']>('addition');
  const [amount, setAmount] = useState<number>(1500000);
  const [timeExtensionDays, setTimeExtensionDays] = useState<number>(15);
  const [justification, setJustification] = useState('Client requested upgrade to Italian marble flooring and premium bathroom CP fittings.');

  // Math Calculations: Original + Additions - Deletions = Revised Contract Value
  const approvedAdditions = variations
    .filter((v) => v.status === 'approved' && v.type === 'addition')
    .reduce((acc, v) => acc + (v.amount || 0), 0);

  const approvedDeletions = variations
    .filter((v) => v.status === 'approved' && v.type === 'deletion')
    .reduce((acc, v) => acc + (v.amount || 0), 0);

  const revisedContractValue = project.contractValue + approvedAdditions - approvedDeletions;

  const totalTimeExtensionDays = variations
    .filter((v) => v.status === 'approved')
    .reduce((acc, v) => acc + (v.timeExtensionDays || 0), 0);

  const formatCrores = (v: number) => `₹ ${(v / 10000000).toFixed(2)} Cr`;
  const formatLakhs = (v: number) => `₹ ${(v / 100000).toFixed(2)} L`;

  const filteredVariations = variations.filter((v) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const just = (v.justification || v.description || '').toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.variationNumber.toLowerCase().includes(q) ||
        just.includes(q)
      );
    }
    return true;
  });

  const handleCreateVO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createVariation({
      projectId: project.id,
      projectName: project.name,
      title,
      description,
      type,
      amount,
      timeExtensionDays,
      justification,
      dateProposed: new Date().toISOString().slice(0, 10),
      status: 'submitted',
      requestedBy: project.projectManager,
    });

    setTitle('');
    setDescription('');
    setIsAddModalOpen(false);
  };

  const handleUpdateStatus = (status: VariationOrder['status']) => {
    if (!selectedVOForAction) return;
    updateVariationStatus(selectedVOForAction.id, status, approverComments);
    setSelectedVOForAction(null);
    setApproverComments('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Contract Reconciliation Formula */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              Contract Variation & Change Order Ledger
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Approved additions, deletions, and cumulative revised contract value
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Raise Variation Order
          </button>
        </div>

        {/* Contract Reconciliation Math Equation Box */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 text-xs">
          <div className="flex-1 text-center sm:text-left">
            <span className="text-slate-400 block mb-0.5 uppercase tracking-wider text-[10px] font-semibold">
              Original BOQ Contract
            </span>
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {formatCrores(project.contractValue)}
            </span>
          </div>

          <div className="text-amber-500 font-bold text-lg hidden lg:block">+</div>

          <div className="flex-1 text-center sm:text-left">
            <span className="text-emerald-600 dark:text-emerald-400 block mb-0.5 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> Approved Additions
            </span>
            <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              +{formatLakhs(approvedAdditions)}
            </span>
          </div>

          <div className="text-amber-500 font-bold text-lg hidden lg:block">−</div>

          <div className="flex-1 text-center sm:text-left">
            <span className="text-rose-600 dark:text-rose-400 block mb-0.5 uppercase tracking-wider text-[10px] font-semibold flex items-center gap-1">
              <ArrowDownRight className="w-3 h-3" /> Approved Deletions
            </span>
            <span className="text-base font-bold text-rose-600 dark:text-rose-400">
              −{formatLakhs(approvedDeletions)}
            </span>
          </div>

          <div className="text-amber-500 font-bold text-lg hidden lg:block">=</div>

          <div className="flex-1 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center sm:text-left">
            <span className="text-amber-700 dark:text-amber-400 block mb-0.5 uppercase tracking-wider text-[10px] font-bold">
              Revised Contract Value
            </span>
            <span className="text-base font-extrabold text-amber-700 dark:text-amber-300">
              {formatCrores(revisedContractValue)}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center sm:text-left">
            <span className="text-blue-700 dark:text-blue-400 block mb-0.5 uppercase tracking-wider text-[10px] font-bold">
              Schedule Extension
            </span>
            <span className="text-base font-extrabold text-blue-700 dark:text-blue-300">
              +{totalTimeExtensionDays} Days
            </span>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Variation Order #, title, or justification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Variation Orders List */}
      <div className="space-y-3">
        {filteredVariations.map((vo) => (
          <div
            key={vo.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                    {vo.variationNumber}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      vo.type === 'addition'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : vo.type === 'deletion'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}
                  >
                    {vo.type}
                  </span>
                  <span className="text-xs text-slate-400">Proposed on {vo.dateProposed}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {vo.title}
                </h4>
              </div>

              <div className="flex items-center gap-3 self-start">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Cost Impact</span>
                  <span
                    className={`text-sm font-bold font-mono ${
                      vo.type === 'addition'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {vo.type === 'addition' ? '+' : '−'}{formatLakhs(vo.amount || 0)}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">Schedule</span>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    +{vo.timeExtensionDays || 0} Days
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    vo.status === 'approved'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : vo.status === 'rejected'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  }`}
                >
                  {vo.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Description & Justification */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Scope Details: </strong>
                {vo.description}
              </div>
              <div>
                <strong className="text-slate-800 dark:text-slate-200">Engineering Justification: </strong>
                {vo.justification}
              </div>
              {vo.approverComments && (
                <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <strong className="text-amber-600">Client Approver Note: </strong>
                  {vo.approverComments}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 text-xs">
              <span className="text-slate-400">Requested by: {vo.requestedBy}</span>

              {vo.status !== 'approved' && vo.status !== 'rejected' && (
                <button
                  onClick={() => {
                    setSelectedVOForAction(vo);
                    setApproverComments('');
                  }}
                  className="px-3 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-semibold transition"
                >
                  Review & Sign Off
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredVariations.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
            No variation orders found.
          </div>
        )}
      </div>

      {/* Review & Approve Modal */}
      {selectedVOForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Client & Consultant Sign-Off: {selectedVOForAction.variationNumber}
            </h4>
            <p className="text-xs text-slate-500">
              {selectedVOForAction.title} ({formatLakhs(selectedVOForAction.amount || 0)})
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-600 dark:text-slate-400 font-medium">
                Approver Endorsement Comments
              </label>
              <textarea
                rows={3}
                placeholder="Enter client formal approval references, revised delivery schedule remarks, or rejection cause..."
                value={approverComments}
                onChange={(e) => setApproverComments(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedVOForAction(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('rejected')}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700"
              >
                Reject Variation
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus('approved')}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
              >
                Approve & Reconcile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raise Variation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Raise New Variation / Change Order
            </h4>

            <form onSubmit={handleCreateVO} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Variation Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Additional Substation Foundation & DG Trenching"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Variation Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="addition">Addition (+)</option>
                    <option value="deletion">Deletion (−)</option>
                    <option value="scope_change">Scope Change</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Amount Impact (₹)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    Time Extension (Days)
                  </label>
                  <input
                    type="number"
                    value={timeExtensionDays}
                    onChange={(e) => setTimeExtensionDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Scope Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed specifications, item rates, and quantities..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Engineering Justification
                </label>
                <textarea
                  rows={2}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="Site condition change, client instruction, or structural recommendation..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-sm"
                >
                  Submit Variation Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
