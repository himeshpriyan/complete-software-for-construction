import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { RABill, RABillStatus } from '../../types';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Eye,
  Download,
  Printer,
  Building2,
  Calendar,
  AlertCircle,
  QrCode,
  ShieldCheck,
  FileCheck,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';

const STEPPER_STAGES: { key: RABillStatus; label: string; role: string }[] = [
  { key: 'draft', label: 'Draft', role: 'Site Team' },
  { key: 'engineer_verified', label: 'Engineer Verified', role: 'Site Engineer' },
  { key: 'qs_verified', label: 'QS Verified', role: 'QS Lead' },
  { key: 'manager_approved', label: 'Manager Approved', role: 'Project Manager' },
  { key: 'client_submitted', label: 'Client Submitted', role: 'Billing Team' },
  { key: 'approved', label: 'Client Approved', role: 'Client Arch/Rep' },
  { key: 'paid', label: 'Paid', role: 'Treasury' },
];

const getStatusStepIndex = (status: RABillStatus): number => {
  const idx = STEPPER_STAGES.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
};

export const RABillsPage: React.FC = () => {
  const {
    raBills,
    projects,
    mbEntries,
    createRABill,
    updateRABillStatus,
    companyProfile,
    erpSettings,
  } = useAppStore();

  const [selectedBill, setSelectedBill] = useState<RABill | null>(raBills[0] || null);
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  // New RA Bill Form State
  const [newBillProjectId, setNewBillProjectId] = useState<string>('PRJ-001');
  const [newBillPeriodFrom, setNewBillPeriodFrom] = useState<string>('2026-09-01');
  const [newBillPeriodTo, setNewBillPeriodTo] = useState<string>('2026-09-20');
  const [selectedMbIds, setSelectedMbIds] = useState<string[]>([]);
  const [retentionPct, setRetentionPct] = useState<number>(5);
  const [advanceRecoveryPct, setAdvanceRecoveryPct] = useState<number>(10);
  const [remarks, setRemarks] = useState<string>('');

  // Available MB entries for chosen project
  const availableMbEntries = useMemo(() => {
    return mbEntries.filter((mb) => mb.projectId === newBillProjectId);
  }, [mbEntries, newBillProjectId]);

  // Filtered bills list
  const filteredBills = useMemo(() => {
    return raBills.filter((bill) => {
      const matchProj = filterProject === 'all' || bill.projectId === filterProject;
      const matchStat = filterStatus === 'all' || bill.status === filterStatus;
      const matchSearch =
        searchQuery === '' ||
        bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bill.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchStat && matchSearch;
    });
  }, [raBills, filterProject, filterStatus, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalBilled = raBills.reduce((acc, b) => acc + b.currentBillGross, 0);
    const totalOutstanding = raBills.reduce((acc, b) => acc + b.outstandingAmount, 0);
    const totalRetention = raBills.reduce((acc, b) => acc + b.retentionDeductionCurrent, 0);
    const totalPaid = raBills.reduce((acc, b) => acc + b.amountReceived, 0);
    return { totalBilled, totalOutstanding, totalRetention, totalPaid };
  }, [raBills]);

  // Handle generating new RA bill from MB entries
  const handleGenerateRABill = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newBillProjectId);
    const chosenMbs = availableMbEntries.filter((mb) => selectedMbIds.includes(mb.id));

    // Calculate gross amount
    const grossAmount = chosenMbs.reduce((acc, mb) => acc + (mb.totalAmount || mb.amount || 0), 0);
    const retAmt = Math.round((grossAmount * retentionPct) / 100);
    const advAmt = Math.round((grossAmount * advanceRecoveryPct) / 100);
    const tdsAmt = Math.round((grossAmount * 2) / 100);
    const cessAmt = Math.round((grossAmount * 1) / 100);
    const otherDeds = [
      { description: 'TDS (2%)', amount: tdsAmt },
      { description: 'Labour Welfare Cess (1%)', amount: cessAmt },
    ];
    const totalOther = tdsAmt + cessAmt;
    const taxableNet = grossAmount - retAmt - advAmt;
    const gstPct = erpSettings.companyGstRate || 18;
    const gstAmt = Math.round((taxableNet * gstPct) / 100);
    const netPayable = taxableNet - totalOther + gstAmt;

    // Previous gross for this project from existing bills
    const prevBills = raBills.filter((b) => b.projectId === newBillProjectId);
    const previousGross = prevBills.reduce((acc, b) => acc + b.currentBillGross, 0);

    const items = chosenMbs.map((mb, i) => ({
      id: `RAI-${Date.now()}-${i}`,
      mbEntryId: mb.id,
      itemCode: mb.itemCode,
      description: mb.description || mb.workDescription || 'Civil Works',
      unit: mb.unit,
      rate: mb.rate,
      previousQty: 0,
      previousAmount: 0,
      currentQty: mb.quantity,
      currentAmount: mb.totalAmount || mb.amount || 0,
      cumulativeQty: mb.quantity,
      cumulativeAmount: mb.totalAmount || mb.amount || 0,
    }));

    const created = createRABill({
      projectId: newBillProjectId,
      projectName: proj?.name || 'Superstructure Work',
      clientId: proj?.clientId || 'CLI-001',
      clientName: proj?.clientName || 'Client Developer',
      contractValue: proj?.contractValue || 100000000,
      periodFrom: newBillPeriodFrom,
      periodTo: newBillPeriodTo,
      items,
      previousBillGross: previousGross,
      currentBillGross: grossAmount,
      retentionPct,
      retentionDeductionCurrent: retAmt,
      retentionCumulative: retAmt,
      advanceRecoveryPct,
      advanceRecoveryCurrent: advAmt,
      advanceRecoveryCumulative: advAmt,
      otherDeductions: otherDeds,
      totalOtherDeductionsCurrent: totalOther,
      totalOtherDeductionsCumulative: totalOther,
      gstRatePct: gstPct,
      gstAmountCurrent: gstAmt,
      netPayableCurrent: netPayable,
      outstandingAmount: netPayable,
      mbEntryIds: selectedMbIds,
    });

    setSelectedBill(created);
    setIsGenerateModalOpen(false);
    setSelectedMbIds([]);
  };

  const handleAdvanceStatus = (bill: RABill) => {
    const curIdx = getStatusStepIndex(bill.status);
    if (curIdx < STEPPER_STAGES.length - 1) {
      const nextStage = STEPPER_STAGES[curIdx + 1].key;
      updateRABillStatus(bill.id, nextStage);
      // Update selected bill in local view
      setSelectedBill((prev) => (prev?.id === bill.id ? { ...prev, status: nextStage } : prev));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Running Account (RA) Bills & Client Invoicing
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
              Tax Compliant (GST {erpSettings.companyGstRate}%)
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Certified client bill statements compiled directly from Measurement Book (MB) entries with visual signoff stepper.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              // Pre-select all available MBs for first project
              if (availableMbEntries.length > 0) {
                setSelectedMbIds(availableMbEntries.map((m) => m.id));
              }
              setIsGenerateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md shadow-amber-600/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Generate RA Bill from MB</span>
          </button>
        </div>
      </div>

      {/* Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Invoiced (Current Periods)</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹ {(stats.totalBilled / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across {raBills.length} active project RA bills</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/20 shadow-sm">
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Total Outstanding (Receivables)
          </p>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">
            ₹ {(stats.totalOutstanding / 10000000).toFixed(2)} Cr
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span className="text-[11px] text-rose-600 font-medium">Pending client clearance / verification</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Retention Money Held</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹ {(stats.totalRetention / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">5% standard contract retention security</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Total Realized / Received
          </p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹ {(stats.totalPaid / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Direct bank credit to HDFC Main</p>
        </div>
      </div>

      {/* Main Grid: Bills List Table + Selected Document Statement */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Bills Filter & Table (5 cols on xl) */}
        <div className="xl:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search RA number, project, client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.split(' ')[0]} ({p.code})
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">All Statuses</option>
                {STEPPER_STAGES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3 max-h-[750px] overflow-y-auto pr-1">
            {filteredBills.map((bill) => {
              const isSelected = selectedBill?.id === bill.id;
              const hasOutstanding = bill.outstandingAmount > 0;
              const stepIdx = getStatusStepIndex(bill.status);

              return (
                <div
                  key={bill.id}
                  onClick={() => setSelectedBill(bill)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-400 dark:border-amber-700 shadow-md ring-1 ring-amber-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                          {bill.billNumber}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{bill.billDate}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                        {bill.projectName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{bill.clientName}</p>
                    </div>

                    <span
                      className={`text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        bill.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : bill.status === 'approved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                          : bill.status === 'client_submitted'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400'
                          : bill.status === 'manager_approved'
                          ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      {STEPPER_STAGES[stepIdx]?.label || bill.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Current Bill Gross</span>
                      <span className="font-bold font-mono text-slate-900 dark:text-white">
                        ₹ {bill.currentBillGross.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 block text-[11px]">Outstanding Due</span>
                      <span
                        className={`font-mono font-black ${
                          hasOutstanding
                            ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {hasOutstanding ? `₹ ${bill.outstandingAmount.toLocaleString('en-IN')}` : 'PAID IN FULL'}
                      </span>
                    </div>
                  </div>

                  {bill.eInvoice && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/60 dark:bg-emerald-950/30 px-2 py-1 rounded-md">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>E-Invoice Generated (Ack: {bill.eInvoice.ackNo})</span>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredBills.length === 0 && (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
                <Receipt className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No RA bills match your filters.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Clean Itemized Document Statement (7 cols on xl) */}
        <div className="xl:col-span-7">
          {selectedBill ? (
            <div className="space-y-4">
              {/* Stepper Progression Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Approval & Certification Stepper
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Current Stage: <strong className="text-amber-600">{STEPPER_STAGES[getStatusStepIndex(selectedBill.status)].label}</strong>
                    </p>
                  </div>

                  {getStatusStepIndex(selectedBill.status) < STEPPER_STAGES.length - 1 && (
                    <button
                      onClick={() => handleAdvanceStatus(selectedBill)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                    >
                      <span>Advance to: {STEPPER_STAGES[getStatusStepIndex(selectedBill.status) + 1].label}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Visual Stepper Strip */}
                <div className="overflow-x-auto pb-2">
                  <div className="flex items-center min-w-max">
                    {STEPPER_STAGES.map((step, idx) => {
                      const curIdx = getStatusStepIndex(selectedBill.status);
                      const isComplete = idx < curIdx;
                      const isCurrent = idx === curIdx;

                      return (
                        <div key={step.key} className="flex items-center">
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                isComplete
                                  ? 'bg-emerald-600 text-white'
                                  : isCurrent
                                  ? 'bg-amber-600 text-white ring-4 ring-amber-100 dark:ring-amber-950/60'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                              }`}
                            >
                              {isComplete ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                            </div>
                            <span
                              className={`text-[10px] mt-1.5 font-bold whitespace-nowrap ${
                                isCurrent
                                  ? 'text-amber-700 dark:text-amber-400'
                                  : isComplete
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[9px] text-slate-400">{step.role}</span>
                          </div>

                          {idx < STEPPER_STAGES.length - 1 && (
                            <div
                              className={`w-8 sm:w-12 h-0.5 mx-1 sm:mx-2 -mt-5 ${
                                idx < curIdx ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Real Document Statement Layout (Document-Style View) */}
              <div className="bg-white text-slate-900 rounded-2xl border border-slate-300 shadow-xl p-6 sm:p-10 font-sans space-y-6">
                {/* Document Top Header with Company Details & E-Invoice Badge */}
                <div className="flex flex-col sm:flex-row items-start justify-between pb-6 border-b-2 border-slate-900 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xl tracking-tighter shadow-md">
                      AB
                    </div>
                    <div>
                      <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">
                        {companyProfile.name}
                      </h2>
                      <p className="text-[11px] text-slate-600">{companyProfile.corporateAddress}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        GSTIN: <strong>{companyProfile.gstin}</strong> • PAN: {companyProfile.pan} • CIN: {companyProfile.cin}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-black font-mono text-xs rounded uppercase">
                      RUNNING ACCOUNT BILL #{selectedBill.raSequence}
                    </span>
                    <p className="font-mono text-xs font-bold text-slate-800 mt-1">{selectedBill.billNumber}</p>
                    <p className="text-[11px] text-slate-500">Bill Date: {selectedBill.billDate}</p>
                  </div>
                </div>

                {/* E-Invoice Mock Banner */}
                {selectedBill.eInvoice && (
                  <div className="p-3.5 bg-emerald-50/80 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-950">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>E-INVOICE GENERATED (NIC Portal Verified)</span>
                      </div>
                      <p className="font-mono text-[10px] text-slate-600">
                        IRN: <span className="text-slate-800">{selectedBill.eInvoice.irn.substring(0, 32)}...</span>
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Ack No: <strong>{selectedBill.eInvoice.ackNo}</strong> • Date: {selectedBill.eInvoice.ackDate}
                      </p>
                    </div>
                    <div className="w-12 h-12 border border-slate-400 bg-white flex items-center justify-center rounded p-1 shadow-xs">
                      <QrCode className="w-10 h-10 text-slate-800" />
                    </div>
                  </div>
                )}

                {/* Client & Contract Information */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Billed To (Client):</span>
                    <p className="font-black text-slate-900 text-sm">{selectedBill.clientName}</p>
                    <p className="text-slate-600 mt-0.5">Project: <strong>{selectedBill.projectName}</strong></p>
                    <p className="text-slate-500 font-mono text-[11px]">Contract Value: ₹ {(selectedBill.contractValue / 10000000).toFixed(2)} Cr</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Billing Period:</span>
                    <p className="text-slate-800 font-semibold">
                      From: <strong>{selectedBill.periodFrom}</strong> To: <strong>{selectedBill.periodTo}</strong>
                    </p>
                    <p className="text-slate-500 mt-1">Due Date: <strong className="text-rose-600">{selectedBill.dueDate}</strong></p>
                    <p className="text-slate-500 font-mono text-[11px]">Verified Against MB: {selectedBill.mbEntryIds.length || 3} recorded books</p>
                  </div>
                </div>

                {/* Itemized Work Statement Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Itemized Measurement Book Works Executed
                  </h4>
                  <div className="overflow-x-auto border border-slate-300 rounded-xl">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                        <tr>
                          <th className="p-2.5 text-center font-mono">#</th>
                          <th className="p-2.5 text-left">Item Code & Work Description</th>
                          <th className="p-2.5 text-center">Unit</th>
                          <th className="p-2.5 text-right font-mono">Rate (₹)</th>
                          <th className="p-2.5 text-right font-mono bg-slate-200/50">Current Qty</th>
                          <th className="p-2.5 text-right font-mono bg-amber-50">Current Amt (₹)</th>
                          <th className="p-2.5 text-right font-mono">Cumulative (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {selectedBill.items.length > 0 ? (
                          selectedBill.items.map((it, idx) => (
                            <tr key={it.id} className="hover:bg-slate-50">
                              <td className="p-2.5 text-center font-mono text-slate-400">{idx + 1}</td>
                              <td className="p-2.5">
                                <span className="font-mono text-[10px] text-amber-700 font-bold mr-1">
                                  [{it.itemCode}]
                                </span>
                                <span className="font-medium text-slate-800">{it.description}</span>
                              </td>
                              <td className="p-2.5 text-center text-slate-500">{it.unit}</td>
                              <td className="p-2.5 text-right font-mono">{it.rate.toLocaleString('en-IN')}</td>
                              <td className="p-2.5 text-right font-mono font-bold bg-slate-100/50">
                                {it.currentQty.toLocaleString('en-IN')}
                              </td>
                              <td className="p-2.5 text-right font-mono font-bold text-slate-900 bg-amber-50/50">
                                ₹ {it.currentAmount.toLocaleString('en-IN')}
                              </td>
                              <td className="p-2.5 text-right font-mono text-slate-600">
                                ₹ {it.cumulativeAmount.toLocaleString('en-IN')}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-slate-400 italic">
                              Turnkey Milestones statement for Superstructure RCC casting & facade installation.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Deductions & Net Payable Summary Statement */}
                <div className="flex flex-col sm:flex-row justify-end">
                  <div className="w-full sm:w-96 space-y-2 text-xs border border-slate-200 rounded-xl p-4 bg-slate-50">
                    <div className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-600 font-medium">Gross Work Done (Current Bill):</span>
                      <span className="font-mono font-bold text-slate-900">
                        ₹ {selectedBill.currentBillGross.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-200 text-rose-600">
                      <span>Less: Retention ({selectedBill.retentionPct}%):</span>
                      <span className="font-mono font-bold">
                        - ₹ {selectedBill.retentionDeductionCurrent.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-200 text-rose-600">
                      <span>Less: Advance Recovery ({selectedBill.advanceRecoveryPct}%):</span>
                      <span className="font-mono font-bold">
                        - ₹ {selectedBill.advanceRecoveryCurrent.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {selectedBill.otherDeductions.map((ded, i) => (
                      <div key={i} className="flex justify-between py-1 border-b border-slate-200 text-slate-600">
                        <span>Less: {ded.description}:</span>
                        <span className="font-mono font-medium text-rose-600">
                          - ₹ {ded.amount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700">
                      <span>Add: Works Contract GST ({selectedBill.gstRatePct}%):</span>
                      <span className="font-mono font-bold">
                        + ₹ {selectedBill.gstAmountCurrent.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-t-2 border-slate-900 text-sm font-black">
                      <span className="text-slate-900">Net Payable Current Bill:</span>
                      <span className="font-mono text-amber-700 text-base">
                        ₹ {selectedBill.netPayableCurrent.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 space-y-1">
                      <div className="flex justify-between">
                        <span>Cumulative Gross Billed:</span>
                        <span className="font-mono font-semibold">₹ {selectedBill.cumulativeGross.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Retention Held:</span>
                        <span className="font-mono font-semibold">₹ {selectedBill.retentionCumulative.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Balance Outstanding:</span>
                        <span className="font-mono font-black text-rose-600">
                          ₹ {selectedBill.outstandingAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sign-off Audit Signatures */}
                <div className="pt-6 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Prepared By</p>
                    <p className="font-bold text-slate-800 mt-1">Amit Patel</p>
                    <p className="text-[10px] text-slate-500">Site Engineer</p>
                    <span className="inline-block mt-1 text-[9px] text-emerald-600 font-bold">✓ Signed</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">QS Verified</p>
                    <p className="font-bold text-slate-800 mt-1">Pooja Hegde</p>
                    <p className="text-[10px] text-slate-500">Chief Quantity Surveyor</p>
                    <span className="inline-block mt-1 text-[9px] text-emerald-600 font-bold">✓ Verified</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">PM Approval</p>
                    <p className="font-bold text-slate-800 mt-1">Vikram Malhotra</p>
                    <p className="text-[10px] text-slate-500">Project Director</p>
                    <span className="inline-block mt-1 text-[9px] text-emerald-600 font-bold">✓ Approved</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Client Certification</p>
                    <p className="font-bold text-slate-800 mt-1">{selectedBill.clientName.split(' ')[0]} Rep</p>
                    <p className="text-[10px] text-slate-500">VP Projects</p>
                    <span className="inline-block mt-1 text-[9px] text-amber-600 font-bold">
                      {selectedBill.status === 'paid' || selectedBill.status === 'approved' ? '✓ Certified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
              <Receipt className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-semibold">Select an RA Bill on the left to view the itemized statement.</p>
            </div>
          )}
        </div>
      </div>

      {/* GENERATE RA BILL MODAL */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Generate RA Bill from Measurement Book (MB)
                </h3>
                <p className="text-xs text-slate-500">
                  Select recorded MB items to compile the itemized statement and calculate net payable.
                </p>
              </div>
              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateRABill} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Select Project
                  </label>
                  <select
                    value={newBillProjectId}
                    onChange={(e) => {
                      setNewBillProjectId(e.target.value);
                      setSelectedMbIds([]);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.code} - {p.name.substring(0, 20)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Period From
                  </label>
                  <input
                    type="date"
                    value={newBillPeriodFrom}
                    onChange={(e) => setNewBillPeriodFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Period To
                  </label>
                  <input
                    type="date"
                    value={newBillPeriodTo}
                    onChange={(e) => setNewBillPeriodTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              {/* MB Selection List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Measurement Book Entries ({availableMbEntries.length} found)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedMbIds.length === availableMbEntries.length) {
                        setSelectedMbIds([]);
                      } else {
                        setSelectedMbIds(availableMbEntries.map((m) => m.id));
                      }
                    }}
                    className="text-[11px] text-amber-600 font-bold hover:underline"
                  >
                    {selectedMbIds.length === availableMbEntries.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-800/40">
                  {availableMbEntries.map((mb) => {
                    const isChecked = selectedMbIds.includes(mb.id);
                    return (
                      <label
                        key={mb.id}
                        className="flex items-start gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs cursor-pointer hover:border-amber-400"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedMbIds([...selectedMbIds, mb.id]);
                            } else {
                              setSelectedMbIds(selectedMbIds.filter((id) => id !== mb.id));
                            }
                          }}
                          className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-amber-700 dark:text-amber-400">
                              {mb.mbNumber} ({mb.itemCode})
                            </span>
                            <span className="font-mono font-bold text-slate-900 dark:text-white">
                              ₹ {(mb.totalAmount || mb.amount || 0).toLocaleString('en-IN')}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                            {mb.description || mb.workDescription}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            Qty: {mb.quantity} {mb.unit} @ ₹ {mb.rate}/{mb.unit} • Loc: {mb.location}
                          </span>
                        </div>
                      </label>
                    );
                  })}

                  {availableMbEntries.length === 0 && (
                    <p className="text-center text-xs text-slate-400 py-4">
                      No MB entries recorded yet for this project.
                    </p>
                  )}
                </div>
              </div>

              {/* Deductions inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Retention Deduction (%)
                  </label>
                  <input
                    type="number"
                    value={retentionPct}
                    onChange={(e) => setRetentionPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Advance Recovery (%)
                  </label>
                  <input
                    type="number"
                    value={advanceRecoveryPct}
                    onChange={(e) => setAdvanceRecoveryPct(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Engineer Remarks / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Verification notes or joint measurement references..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={selectedMbIds.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-amber-600/20"
                >
                  Generate RA Bill Statement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
