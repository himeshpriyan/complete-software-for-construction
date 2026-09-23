import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Tender } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  ScrollText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Building,
  Upload,
  ExternalLink,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const TendersPage: React.FC = () => {
  const { tenders, updateTenderStatus } = useAppStore();

  const [selectedTenderId, setSelectedTenderId] = useState<string>(tenders[0]?.id || '');
  const activeTender = useMemo(
    () => tenders.find((t) => t.id === selectedTenderId) || tenders[0],
    [tenders, selectedTenderId]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Metrics
  const totalBidsVal = useMemo(() => tenders.reduce((acc, t) => acc + t.bidValue, 0), [tenders]);
  const totalEmd = useMemo(() => tenders.reduce((acc, t) => acc + t.emdAmount, 0), [tenders]);
  const wonTenders = useMemo(() => tenders.filter((t) => t.status === 'won'), [tenders]);

  // Filtered tenders
  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesNum = t.tenderNumber.toLowerCase().includes(q);
        const matchesAuth = t.authorityName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesNum && !matchesAuth) return false;
      }
      return true;
    });
  }, [tenders, statusFilter, searchQuery]);

  // Helper to compute deadline countdown
  const getCountdown = (dateStr: string) => {
    const target = new Date(dateStr).getTime();
    const now = new Date('2026-09-22').getTime();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return { text: 'Bidding Closed', urgent: false };
    if (diffDays === 0) return { text: '⏰ Closes Today!', urgent: true };
    if (diffDays <= 3) return { text: `⏰ ${diffDays} Days Left (Urgent)`, urgent: true };
    return { text: `📅 ${diffDays} Days Left`, urgent: false };
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
        title="Tenders & Government E-Procurement"
        subtitle="Public infrastructure tenders, EMD tracking, eligibility verification matrix, and commercial bid submissions"
        badge={`${tenders.length} Active Bids`}
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Tenders"
          value={tenders.length.toString()}
          subtext="Under evaluation & bidding"
          icon="ScrollText"
          trend="up"
        />
        <StatCard
          title="Total Bids Valuation"
          value={`₹ ${(totalBidsVal / 10000000).toFixed(1)} Cr`}
          subtext="Cumulative tender bid values"
          icon="DollarSign"
          trend="up"
        />
        <StatCard
          title="Committed EMD"
          value={`₹ ${(totalEmd / 10000000).toFixed(2)} Cr`}
          subtext="Bank guarantees / FDR deposit"
          icon="ShieldCheck"
          trend="neutral"
        />
        <StatCard
          title="Awarded / Won"
          value={wonTenders.length.toString()}
          subtext={`₹ ${(wonTenders.reduce((sum, t) => sum + t.bidValue, 0) / 10000000).toFixed(1)} Cr Contracted`}
          icon="CheckCircle2"
          trend="up"
        />
      </div>

      {/* Main 2-Column Layout: Tender List (5 cols) + Tender Detail Inspector (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tenders Master List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search authority, tender no, title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 whitespace-nowrap">Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              >
                <option value="ALL">All Bidding Stages</option>
                <option value="received">Tender Received</option>
                <option value="evaluating">Under Evaluation</option>
                <option value="estimation">Estimation</option>
                <option value="management_approval">Management Approval</option>
                <option value="submitted">Submitted</option>
                <option value="won">Won / Awarded</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredTenders.map((t) => {
              const countdown = getCountdown(t.deadlineDate);
              const isSelected = activeTender?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTenderId(t.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all shadow-sm ${
                    isSelected
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-400 dark:border-amber-600 ring-1 ring-amber-400/50'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500 font-bold">
                        {t.tenderNumber}
                      </span>
                      <StatusBadge
                        variant={
                          t.status === 'won'
                            ? 'success'
                            : t.status === 'management_approval'
                            ? 'warning'
                            : t.status === 'submitted'
                            ? 'info'
                            : 'neutral'
                        }
                        label={t.status.replace('_', ' ').toUpperCase()}
                        size="sm"
                      />
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {t.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-1">{t.authorityName}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      {/* Deadline Countdown Badge */}
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                          countdown.urgent
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {countdown.text}
                      </span>

                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                        ₹ {(t.bidValue / 10000000).toFixed(2)} Cr
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tender Detail 360° Inspector */}
        <div className="lg:col-span-7">
          {activeTender ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
              {/* Header & Status Controller */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    {activeTender.tenderNumber}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {activeTender.title}
                  </h3>
                  <p className="text-xs text-slate-500">{activeTender.authorityName}</p>
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold">Workflow:</span>
                  <select
                    value={activeTender.status}
                    onChange={(e) => {
                      updateTenderStatus(activeTender.id, e.target.value as Tender['status']);
                      showToast(`Tender stage updated to ${e.target.value}`);
                    }}
                    className="py-1.5 px-2.5 text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-lg"
                  >
                    <option value="received">Tender Received</option>
                    <option value="evaluating">Under Evaluation</option>
                    <option value="estimation">Estimation</option>
                    <option value="management_approval">Management Approval</option>
                    <option value="submitted">Bid Submitted</option>
                    <option value="won">Won / Awarded</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>

              {/* Financial & Bid Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Authority Budget</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                    ₹ {(activeTender.estimatedBudget / 10000000).toFixed(2)} Cr
                  </p>
                </div>
                <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-900/40">
                  <span className="text-[10px] text-amber-700 dark:text-amber-400 uppercase font-semibold">
                    Our Commercial Bid
                  </span>
                  <p className="text-sm font-bold text-amber-800 dark:text-amber-300 font-mono mt-1">
                    ₹ {(activeTender.bidValue / 10000000).toFixed(2)} Cr
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Earnest Money (EMD)</span>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono mt-1">
                    ₹ {(activeTender.emdAmount / 100000).toFixed(2)} Lakhs
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold">Bid Deadline</span>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {activeTender.deadlineDate}
                  </p>
                  <p className="text-[10px] text-slate-400">{activeTender.deadlineTime}</p>
                </div>
              </div>

              {/* Eligibility Criteria Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Mandatory Eligibility Criteria Checklist
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                    {activeTender.eligibilityChecklist.filter((c) => c.compliant).length} of{' '}
                    {activeTender.eligibilityChecklist.length} Compliant
                  </span>
                </div>

                <div className="space-y-2">
                  {activeTender.eligibilityChecklist.map((crit) => (
                    <div
                      key={crit.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-start justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {crit.criterion}
                        </p>
                        <p className="text-[11px] text-slate-500">{crit.remarks}</p>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-1 rounded whitespace-nowrap ${
                          crit.compliant
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {crit.compliant ? 'Verified Compliant' : 'Non-Compliant'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Bid Checklist */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Technical Bid Submission Documents
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTender.technicalChecklist.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate text-slate-700 dark:text-slate-300">{doc.document}</span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${
                          doc.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {doc.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tender Documents Vault (Mock Files) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Authority Documents & GFC Drawings
                  </h4>
                  {activeTender.portalUrl && (
                    <a
                      href={activeTender.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                    >
                      <span>Portal Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                <div className="space-y-2">
                  {activeTender.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                          {doc.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({doc.size})</span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
                        {doc.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400 text-xs">
              Select a tender from the list to view eligibility details and bidding telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
