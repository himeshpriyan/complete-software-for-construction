import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccountsLayout } from './AccountsLayout';
import {
  FileSpreadsheet,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  Building2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';

export const TransactionsLogPage: React.FC = () => {
  const { financialTransactions } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'receipt' | 'payment'>('all');

  const filtered = useMemo(() => {
    return financialTransactions.filter((tx) => {
      const matchSearch =
        searchTerm === '' ||
        tx.txNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.projectName && tx.projectName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchType = filterType === 'all' || tx.type === filterType;
      return matchSearch && matchType;
    });
  }, [financialTransactions, searchTerm, filterType]);

  const totalReceipts = financialTransactions
    .filter((tx) => tx.type === 'receipt')
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalPayments = financialTransactions
    .filter((tx) => tx.type === 'payment')
    .reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <AccountsLayout>
      <div className="space-y-6">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Total Inflows (Receipts)
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              ₹ {(totalReceipts / 10000000).toFixed(2)} Cr
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Client RA bill receipts cleared</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Total Outflows (Payments)
            </p>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
              ₹ {(totalPayments / 10000000).toFixed(2)} Cr
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Vendor, subcontract & site disbursals</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Net Cash Flow (Recorded)
            </p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">
              ₹ {((totalReceipts - totalPayments) / 10000000).toFixed(2)} Cr
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Surplus liquidity generated</p>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Payments & Receipts Transaction Log
              </h2>
              <p className="text-xs text-slate-500">
                Full chronological ledger of cash and bank settlements across all banking channels.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">All Flow Types</option>
                <option value="receipt">Receipts (Inflows)</option>
                <option value="payment">Payments (Outflows)</option>
              </select>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tx, counterparty, UTR..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-left">Tx Number</th>
                  <th className="py-3 px-4 text-center">Date</th>
                  <th className="py-3 px-4 text-center">Type</th>
                  <th className="py-3 px-4 text-left">Counterparty & Particulars</th>
                  <th className="py-3 px-4 text-left">Project Reference</th>
                  <th className="py-3 px-4 text-left">Bank / Channel</th>
                  <th className="py-3 px-4 text-center">Instrument / Ref</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {tx.txNumber}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.type === 'receipt'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {tx.type === 'receipt' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        {tx.type === 'receipt' ? 'Receipt' : 'Payment'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{tx.partyName}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{tx.description}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {tx.projectName || 'Corporate / General'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {tx.bankAccountName.split(' ')[0]} ({tx.paymentMode})
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {tx.referenceNumber}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-black ${
                        tx.type === 'receipt' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {tx.type === 'receipt' ? '+' : '-'} ₹ {tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Settled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AccountsLayout>
  );
};
