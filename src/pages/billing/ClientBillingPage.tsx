import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClientBillingPage: React.FC = () => {
  const { raBills, projects, customerReceivables } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const certifiedBills = raBills.filter(
    (b) => b.status === 'approved' || b.status === 'paid' || b.status === 'client_submitted'
  );

  const totalCertified = certifiedBills.reduce((acc, b) => acc + b.currentBillGross, 0);
  const totalReceived = raBills.reduce((acc, b) => acc + b.amountReceived, 0);
  const totalPendingCertification = raBills
    .filter((b) => b.status === 'draft' || b.status === 'engineer_verified' || b.status === 'qs_verified' || b.status === 'manager_approved')
    .reduce((acc, b) => acc + b.currentBillGross, 0);

  const collectionEfficiency = totalCertified > 0 ? Math.round((totalReceived / (totalCertified * 0.95)) * 100) : 85;

  const filteredBills = certifiedBills.filter(
    (b) =>
      b.billNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Client Certified Invoicing & Certificates
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tracking architect and engineer certified payment certificates issued across turnkey client accounts.
          </p>
        </div>

        <Link
          to="/billing/ra-bills"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <FileText className="w-4 h-4" />
          <span>View All RA Bills</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Certified Billing Volume</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ₹ {(totalCertified / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Approved by client representatives</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Under Certification (WIP)</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            ₹ {(totalPendingCertification / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">In engineering / QS verification</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cumulative Collections</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            ₹ {(totalReceived / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Direct bank transfers received</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Collection Efficiency</p>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {collectionEfficiency}%
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Against net payable certificates</p>
        </div>
      </div>

      {/* Certified Invoices Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Client Certified Certificates & Invoices
          </h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search certificate or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-left">Bill / Cert No</th>
                <th className="py-3 px-4 text-left">Client & Project</th>
                <th className="py-3 px-4 text-center">Period</th>
                <th className="py-3 px-4 text-right">Certified Gross</th>
                <th className="py-3 px-4 text-right">Net Payable</th>
                <th className="py-3 px-4 text-right">Amount Received</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">E-Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredBills.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {b.billNumber}
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{b.clientName}</p>
                    <p className="text-[11px] text-slate-400">{b.projectName}</p>
                  </td>
                  <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">
                    {b.periodFrom} to {b.periodTo}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                    ₹ {b.currentBillGross.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-700 dark:text-amber-400">
                    ₹ {b.netPayableCurrent.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                    ₹ {b.amountReceived.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        b.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : b.status === 'approved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400'
                      }`}
                    >
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {b.eInvoice ? (
                      <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                        <ShieldCheck className="w-3 h-3" />
                        Ack #{b.eInvoice.ackNo.slice(-5)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
