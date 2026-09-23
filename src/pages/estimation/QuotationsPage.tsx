import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Quotation, QuotationVersion } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  FileText,
  Download,
  Share2,
  Mail,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  Building,
  Printer,
  ChevronDown,
  Sparkles,
  History,
  PenTool,
  Send,
  XCircle,
} from 'lucide-react';

export const QuotationsPage: React.FC = () => {
  const { quotations, updateQuotationStatus, companyProfile } = useAppStore();

  const [selectedQuoteId, setSelectedQuoteId] = useState<string>(quotations[0]?.id || '');
  const activeQuote = useMemo(
    () => quotations.find((q) => q.id === selectedQuoteId) || quotations[0],
    [quotations, selectedQuoteId]
  );

  const [activeVersion, setActiveVersion] = useState<string>(activeQuote?.version || 'Rev 1.0');
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [signatoryName, setSignatoryName] = useState('Rajesh Kumar');
  const [signatoryDesignation, setSignatoryDesignation] = useState('Executive Vice President');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync version whenever selected quote changes
  const handleSelectQuote = (id: string) => {
    setSelectedQuoteId(id);
    const target = quotations.find((q) => q.id === id);
    if (target) {
      setActiveVersion(target.version);
    }
  };

  // Handle Mock Print / Download PDF
  const handleDownloadPDF = () => {
    window.print();
  };

  // Handle WhatsApp Share
  const handleShareWhatsApp = () => {
    if (!activeQuote) return;
    const msg = encodeURIComponent(
      `Hello ${activeQuote.customerName}, please find the formal quotation for ${activeQuote.projectTitle} (Ref: ${activeQuote.quoteNumber}, ${activeQuote.version}) from Apex Buildcon. Total Value: ₹ ${(activeQuote.grandTotal / 10000000).toFixed(2)} Cr.`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    showToast('WhatsApp share window opened');
  };

  // Handle Email Share
  const handleShareEmail = () => {
    if (!activeQuote) return;
    const subject = encodeURIComponent(`Formal Quotation: ${activeQuote.projectTitle} [${activeQuote.quoteNumber}]`);
    const body = encodeURIComponent(
      `Dear ${activeQuote.customerName},\n\nPlease review our formal commercial proposal for ${activeQuote.projectTitle}.\n\nTotal Contract Quotation: ₹ ${(activeQuote.grandTotal / 10000000).toFixed(2)} Cr\nValidity: ${activeQuote.validityDays} Days\n\nRegards,\nCommercial Estimations Team\nApex Buildcon Infrastructure Pvt Ltd`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    showToast('Drafted email in default mail client');
  };

  // Handle E-Signature Acceptance
  const handleAcceptSignature = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeQuote) return;
    updateQuotationStatus(activeQuote.id, 'accepted', `${signatoryName} (${signatoryDesignation})`);
    setIsSignModalOpen(false);
    showToast(`Quotation signed & accepted by ${signatoryName}`);
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

      {/* Page Header (Hidden on Print) */}
      <div className="print:hidden">
        <PageHeader
          title="Client Quotations & Commercial Proposals"
          subtitle="Generate company letterhead formal proposals, track client revision cycles, and collect digital signatures"
          badge={`${quotations.length} Active Quotes`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 text-xs font-semibold rounded-lg transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Share WhatsApp</span>
              </button>
              <button
                onClick={handleShareEmail}
                className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800 text-xs font-semibold rounded-lg transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Share Email</span>
              </button>
            </div>
          }
        />
      </div>

      {/* Controls Bar: Quotation Selector & Status Flow (Hidden on Print) */}
      {activeQuote && (
        <div className="print:hidden bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Select Proposal:</span>
              <select
                value={selectedQuoteId}
                onChange={(e) => handleSelectQuote(e.target.value)}
                className="text-xs font-bold py-1.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
              >
                {quotations.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.quoteNumber} — {q.customerName}
                  </option>
                ))}
              </select>
            </div>

            {/* Revision Version Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Revision:</span>
              <select
                value={activeVersion}
                onChange={(e) => setActiveVersion(e.target.value)}
                className="text-xs font-semibold py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-amber-600 dark:text-amber-400 font-mono"
              >
                {activeQuote.versionsList.map((v) => (
                  <option key={v.versionNumber} value={v.versionNumber}>
                    {v.versionNumber} ({v.date})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Progression Bar */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <span className="text-xs text-slate-500 font-medium mr-1">Status Lifecycle:</span>

            {activeQuote.status === 'draft' && (
              <button
                onClick={() => {
                  updateQuotationStatus(activeQuote.id, 'sent');
                  showToast('Quotation marked as Sent to client');
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Mark as Sent</span>
              </button>
            )}

            {(activeQuote.status === 'sent' || activeQuote.status === 'negotiation') && (
              <button
                onClick={() => {
                  updateQuotationStatus(activeQuote.id, 'negotiation');
                  showToast('Quotation entered Under Negotiation stage');
                }}
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold"
              >
                Enter Negotiation
              </button>
            )}

            {activeQuote.status !== 'accepted' && (
              <button
                onClick={() => setIsSignModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Client Accept (E-Sign)</span>
              </button>
            )}

            {activeQuote.status !== 'rejected' && activeQuote.status !== 'accepted' && (
              <button
                onClick={() => {
                  updateQuotationStatus(activeQuote.id, 'rejected');
                  showToast('Quotation marked as Rejected');
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-lg text-xs font-semibold"
              >
                Reject
              </button>
            )}

            <StatusBadge
              variant={
                activeQuote.status === 'accepted'
                  ? 'success'
                  : activeQuote.status === 'negotiation'
                  ? 'warning'
                  : activeQuote.status === 'sent'
                  ? 'info'
                  : 'neutral'
              }
              label={activeQuote.status.toUpperCase()}
            />
          </div>
        </div>
      )}

      {/* COMPANY LETTERHEAD DOCUMENT VIEW (Visually replicates real PDF layout) */}
      {activeQuote && (
        <div className="bg-white text-slate-900 rounded-2xl border border-slate-300 shadow-xl max-w-4xl mx-auto p-8 sm:p-12 space-y-8 font-sans">
          {/* Letterhead Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-2xl tracking-tighter shadow-md">
                AB
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  APEX BUILDCON INFRASTRUCTURE PVT LTD
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Apex Tower, Level 14, Senapati Bapat Marg, Lower Parel, Mumbai - 400013
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  GSTIN: 27AABCA1234F1Z8 • CIN: U45200MH2012PTC234567 • ISO 9001:2015
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 font-bold font-mono rounded">
                FORMAL QUOTATION
              </span>
              <p className="font-mono font-bold text-sm text-slate-900 mt-1">{activeQuote.quoteNumber}</p>
              <p className="text-slate-500 text-[11px]">Date: {activeQuote.date}</p>
              <p className="text-slate-500 text-[11px] font-semibold">{activeQuote.version}</p>
            </div>
          </div>

          {/* Client & Project Destination Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quotation Prepared For:</span>
              <h2 className="text-sm font-bold text-slate-900 mt-1">{activeQuote.customerName}</h2>
              {activeQuote.companyName && <p className="font-medium text-slate-700">{activeQuote.companyName}</p>}
              <p className="text-slate-600 mt-0.5">{activeQuote.location}</p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project Scope:</span>
              <p className="text-sm font-bold text-slate-900 mt-1">{activeQuote.projectTitle}</p>
              <p className="text-slate-600 mt-0.5">Validity: {activeQuote.validityDays} Calendar Days</p>
              <p className="text-slate-600">Completion: {activeQuote.deliveryTimeline}</p>
            </div>
          </div>

          {/* Itemized BOQ Summary Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Commercial Schedule of Rates & BOQ Summary
            </h3>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <tr>
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3">Scope Description</th>
                    <th className="p-3 w-28 text-right">Basis</th>
                    <th className="p-3 w-36 text-right">Lump Sum / Rate (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 text-center font-mono">1</td>
                    <td className="p-3 font-medium">Sub-Structure, Basements & Heavy Foundation Raft Works</td>
                    <td className="p-3 text-right text-slate-500 font-mono">Turnkey Milestones</td>
                    <td className="p-3 text-right font-mono font-bold">₹ 28,56,00,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-center font-mono">2</td>
                    <td className="p-3 font-medium">Superstructure Monolithic RCC & High-Speed Mivan Aluminium Casting</td>
                    <td className="p-3 text-right text-slate-500 font-mono"> floors 1 to 54</td>
                    <td className="p-3 text-right font-mono font-bold">₹ 53,99,00,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-center font-mono">3</td>
                    <td className="p-3 font-medium">Exterior Architectural Thermal Glazing & Curtain Wall Facade</td>
                    <td className="p-3 text-right text-slate-500 font-mono">24,000 sq.m</td>
                    <td className="p-3 text-right font-mono font-bold">₹ 18,72,00,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 text-center font-mono">4</td>
                    <td className="p-3 font-medium">Core MEP (HVAC Chillers, Substation Transformers & Fire Hydrant System)</td>
                    <td className="p-3 text-right text-slate-500 font-mono">Turnkey Package</td>
                    <td className="p-3 text-right font-mono font-bold">₹ 9,44,42,857</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Commercial Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Taxable Net Amount:</span>
                <span className="font-mono font-bold">₹ {activeQuote.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">Works Contract GST (12%):</span>
                <span className="font-mono font-bold">₹ {activeQuote.gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-2 border-b-2 border-slate-900 text-sm font-black">
                <span className="text-slate-900">Total Quotation Value:</span>
                <span className="font-mono text-amber-700">₹ {activeQuote.grandTotal.toLocaleString('en-IN')}</span>
              </div>
              <p className="text-[11px] text-right text-slate-500 italic">
                (Indian Rupees {(activeQuote.grandTotal / 10000000).toFixed(2)} Crores Only)
              </p>
            </div>
          </div>

          {/* Commercial Terms & Conditions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-4 border-t border-slate-200">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Payment Terms</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {activeQuote.paymentTerms.map((term, i) => (
                  <li key={i}>{term}</li>
                ))}
              </ul>

              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pt-3">
                Warranty & Defects Liability
              </h4>
              <p className="text-slate-600">{activeQuote.warranty}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Scope Exclusions</h4>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                {activeQuote.exclusions.map((exc, i) => (
                  <li key={i}>{exc}</li>
                ))}
              </ul>

              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] pt-3">Delivery Timeline</h4>
              <p className="text-slate-600">{activeQuote.deliveryTimeline}</p>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t-2 border-slate-900 text-xs">
            <div className="space-y-4">
              <span className="text-[10px] text-slate-400 uppercase font-bold">For Apex Buildcon Infrastructure</span>
              <div className="pt-8">
                <div className="w-48 border-b border-slate-400" />
                <p className="font-bold text-slate-900 mt-1">Siddharth Rao</p>
                <p className="text-slate-500 text-[11px]">Senior VP - Commercial & Estimations</p>
              </div>
            </div>

            <div className="space-y-4 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Accepted & Confirmed By Client</span>
              <div className="pt-8 flex flex-col items-end">
                {activeQuote.signedBy ? (
                  <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-right space-y-0.5">
                    <div className="flex items-center gap-1 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Digitally Signed & Accepted</span>
                    </div>
                    <p className="text-[11px]">{activeQuote.signedBy}</p>
                    <p className="text-[10px] text-slate-500 font-mono">Timestamp: {activeQuote.signedAt}</p>
                  </div>
                ) : (
                  <>
                    <div className="w-48 border-b border-dashed border-slate-400" />
                    <p className="text-slate-400 text-[11px] italic mt-1">Awaiting client signature</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT E-SIGNATURE ACCEPTANCE MODAL */}
      {isSignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Client E-Signature Acceptance</h3>
                  <p className="text-xs text-slate-500">Record formal commercial agreement confirmation</p>
                </div>
              </div>
              <button
                onClick={() => setIsSignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAcceptSignature} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Authorized Signatory Name *
                </label>
                <input
                  type="text"
                  required
                  value={signatoryName}
                  onChange={(e) => setSignatoryName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Designation / Title *
                </label>
                <input
                  type="text"
                  required
                  value={signatoryDesignation}
                  onChange={(e) => setSignatoryDesignation(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-900 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
                <p className="font-semibold">Legal Commitment Acknowledgment:</p>
                <p>
                  By signing, client accepts quotation total value of{' '}
                  <strong>₹ {activeQuote ? (activeQuote.grandTotal / 10000000).toFixed(2) : 0} Cr</strong> under the
                  milestone terms specified in {activeQuote?.version}.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSignModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Confirm E-Signature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
