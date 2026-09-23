import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Contract, PaymentMilestone } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  FileCheck,
  Building,
  Calendar,
  DollarSign,
  Briefcase,
  Download,
  CheckCircle2,
  HardHat,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';

export const ContractsPage: React.FC = () => {
  const navigate = useNavigate();
  const { contracts, updateContractStatus, convertContractToProject } = useAppStore();

  const [selectedContractId, setSelectedContractId] = useState<string>(contracts[0]?.id || '');
  const activeContract = useMemo(
    () => contracts.find((c) => c.id === selectedContractId) || contracts[0],
    [contracts, selectedContractId]
  );

  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'documents' | 'terms'>('overview');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics
  const totalContractVal = useMemo(
    () => contracts.reduce((sum, c) => sum + c.contractValue, 0),
    [contracts]
  );
  const activeContractsCount = useMemo(
    () => contracts.filter((c) => c.status === 'signed' || c.status === 'active').length,
    [contracts]
  );

  // Handle Convert to Project
  const handleConvertToProject = () => {
    if (!activeContract) return;
    const { projectId, projectName } = convertContractToProject(activeContract.id);
    showToast(`Successfully converted to Project ${projectId} (${projectName})! Navigating to Projects...`);
    setTimeout(() => {
      navigate('/projects');
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-amber-500/40 text-white px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Contract Management & Commercial Agreements"
        subtitle="Formal construction contracts, milestone payment schedules, retention money ledgers, and project conversion"
        badge={`${contracts.length} Enterprise Contracts`}
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Contracts"
          value={contracts.length.toString()}
          subtext={`${activeContractsCount} signed & active`}
          icon="FileCheck"
          trend="up"
        />
        <StatCard
          title="Active Contract Order Book"
          value={`₹ ${(totalContractVal / 10000000).toFixed(1)} Cr`}
          subtext="Executed client commitments"
          icon="DollarSign"
          trend="up"
        />
        <StatCard
          title="Avg Retention Rate"
          value="5.0%"
          subtext="Withheld during 12-mo DLP"
          icon="ShieldCheck"
          trend="neutral"
        />
        <StatCard
          title="Mobilization Advance"
          value="10 - 15%"
          subtext="Backed by unconditional BG"
          icon="Briefcase"
          trend="up"
        />
      </div>

      {/* Main 2-Column Layout: Contracts List (4 cols) + Contract 360 Workspace (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Contract Selector List */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Contract Repository
          </h3>

          <div className="space-y-2.5">
            {contracts.map((c) => {
              const isSelected = activeContract?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContractId(c.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
                    isSelected
                      ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600 ring-1 ring-amber-400/50'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                        {c.contractNumber}
                      </span>
                      <StatusBadge
                        variant={
                          c.status === 'active' || c.status === 'signed'
                            ? 'success'
                            : c.status === 'under_review'
                            ? 'warning'
                            : 'neutral'
                        }
                        label={c.status.replace('_', ' ').toUpperCase()}
                        size="sm"
                      />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {c.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-1">{c.clientName}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {c.startDate.slice(0, 7)} to {c.endDate.slice(0, 7)}
                      </span>
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        ₹ {(c.contractValue / 10000000).toFixed(2)} Cr
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Contract 360 Workspace */}
        <div className="lg:col-span-8">
          {activeContract ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              {/* Top Banner & Convert to Project CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {activeContract.contractNumber}
                    </span>
                    <StatusBadge
                      variant={
                        activeContract.status === 'active' || activeContract.status === 'signed'
                          ? 'success'
                          : 'warning'
                      }
                      label={activeContract.status.toUpperCase()}
                      size="sm"
                    />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {activeContract.title}
                  </h2>
                  <p className="text-xs text-slate-500">{activeContract.clientName}</p>
                </div>

                {/* PROMINENT CONVERT TO PROJECT BUTTON */}
                <button
                  onClick={handleConvertToProject}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <HardHat className="w-4 h-4" />
                  <span>Convert to Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'overview'
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Contract Summary
                </button>
                <button
                  onClick={() => setActiveTab('milestones')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'milestones'
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Payment Milestones ({activeContract.paymentMilestones.length})
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'documents'
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Contract Documents ({activeContract.documents.length})
                </button>
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'terms'
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Clauses & Exclusions
                </button>
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4 text-xs">
                  {/* Financial Key Parameters */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Total Contract Value</span>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                        ₹ {(activeContract.contractValue / 10000000).toFixed(2)} Cr
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Advance Advance %</span>
                      <p className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono mt-1">
                        {activeContract.advancePct}%
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Retention Money</span>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                        {activeContract.retentionPct}%
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">DLP Warranty</span>
                      <p className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                        {activeContract.warrantyPeriodMonths} Months
                      </p>
                    </div>
                  </div>

                  {/* Scope Summary */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Scope of Work Summary</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {activeContract.scopeSummary}
                    </p>
                  </div>

                  {/* Schedule Timeline */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Commencement Date</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{activeContract.startDate}</p>
                    </div>
                    <div className="text-center font-mono text-xs text-amber-600 dark:text-amber-400 font-semibold">
                      <span>━━━━ Turnkey Execution ━━━━</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Completion Deadline</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{activeContract.endDate}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PAYMENT MILESTONES TABLE */}
              {activeTab === 'milestones' && (
                <div className="space-y-3">
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3">Milestone Event Description</th>
                          <th className="p-3 text-center w-24">Share (%)</th>
                          <th className="p-3 text-right w-36">Amount (₹)</th>
                          <th className="p-3 text-center w-28">Target Date</th>
                          <th className="p-3 text-center w-28">Billing Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {activeContract.paymentMilestones.map((ms) => (
                          <tr key={ms.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                            <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                              {ms.milestoneName}
                            </td>
                            <td className="p-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                              {ms.percentage}%
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                              ₹ {(ms.amount / 10000000).toFixed(2)} Cr
                            </td>
                            <td className="p-3 text-center font-mono text-slate-500">{ms.dueDate}</td>
                            <td className="p-3 text-center">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  ms.status === 'paid'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                    : ms.status === 'invoiced'
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}
                              >
                                {ms.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: CONTRACT DOCUMENTS VAULT */}
              {activeTab === 'documents' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeContract.documents.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="truncate">
                            <h5 className="font-bold text-slate-900 dark:text-slate-100 truncate">{doc.name}</h5>
                            <span className="text-[10px] text-slate-400">
                              {doc.category} • {doc.size}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => showToast(`Mock downloading ${doc.name}`)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 rounded-md"
                          title="Download File"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: CLAUSES & EXCLUSIONS */}
              {activeTab === 'terms' && (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">
                      Liquidated Damages & Delay Penalty Clause
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {activeContract.penaltyClause}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Contractual Exclusions</h4>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                      {activeContract.exclusions.map((exc, i) => (
                        <li key={i}>{exc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-xs">
              Select a contract agreement from the left to view milestone schedules and documents.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
