import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccountsLayout } from './AccountsLayout';
import {
  Landmark,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Calendar,
  Search,
  ExternalLink,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const BankAccountsPage: React.FC = () => {
  const { bankAccounts, financialTransactions } = useAppStore();
  const [selectedBankId, setSelectedBankId] = useState<string>(bankAccounts[0]?.id || 'BANK-01');

  const selectedBank = bankAccounts.find((b) => b.id === selectedBankId) || bankAccounts[0];

  return (
    <AccountsLayout>
      <div className="space-y-6">
        {/* Bank Account Master Cards */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
            Company Bank Accounts & Sanctioned Credit Lines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bankAccounts.map((account) => {
              const isSelected = selectedBankId === account.id;
              return (
                <div
                  key={account.id}
                  onClick={() => setSelectedBankId(account.id)}
                  className={`p-5 rounded-2xl border transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500 shadow-md ring-1 ring-amber-400'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <Landmark className="w-5 h-5 text-amber-600" />
                    </div>
                    {account.isPrimary && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                        Primary Operating A/c
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-slate-900 dark:text-white text-base mt-3">
                    {account.bankName}
                  </h3>
                  <p className="font-mono text-xs text-slate-500 mt-0.5">
                    A/c: •••• {account.accountNumber.slice(-4)} ({account.accountType})
                  </p>
                  <p className="text-[11px] text-slate-400">IFSC: {account.ifscCode}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">Balance / Limit</span>
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                      {account.balanceFormatted}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bank Statement Transactions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {selectedBank.bankName} — Live Clearing Feed
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Account No: {selectedBank.accountNumber} • Branch: {selectedBank.branchAddress}
              </p>
            </div>

            <button
              onClick={() => alert('Bank feed refreshed from OpenBanking / NetBanking API.')}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
            >
              Reconcile Transactions
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-left">Ref / Tx Number</th>
                  <th className="py-3 px-4 text-center">Date</th>
                  <th className="py-3 px-4 text-left">Particulars & Counterparty</th>
                  <th className="py-3 px-4 text-left">Project Reference</th>
                  <th className="py-3 px-4 text-center">Mode</th>
                  <th className="py-3 px-4 text-right">Debit (Withdrawal)</th>
                  <th className="py-3 px-4 text-right">Credit (Deposit)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {financialTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {tx.referenceNumber}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{tx.partyName}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{tx.description}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {tx.projectName || 'General / Treasury'}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-medium">
                      {tx.paymentMode}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {tx.type === 'payment' ? `- ₹ ${tx.amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {tx.type === 'receipt' ? `+ ₹ ${tx.amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Cleared
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
