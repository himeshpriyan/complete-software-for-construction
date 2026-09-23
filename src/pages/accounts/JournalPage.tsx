import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccountsLayout } from './AccountsLayout';
import {
  BookOpen,
  Calendar,
  Building2,
  CheckCircle2,
  Search,
  Filter,
  FileText,
} from 'lucide-react';

export const JournalPage: React.FC = () => {
  const { journalEntries } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = journalEntries.filter(
    (j) =>
      searchTerm === '' ||
      j.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.narration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.lines.some((l) => l.accountName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AccountsLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              General Journal Entries (Double-Entry Bookkeeping)
            </h2>
            <p className="text-xs text-slate-500">
              Complete general ledger audit journal recording works revenue, retentions, inventory capitalization, and taxes.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search voucher, ledger, narration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
            />
          </div>
        </div>

        {/* Journal Entries List */}
        <div className="space-y-4">
          {filtered.map((entry) => {
            const totalDebit = entry.lines.reduce((acc, l) => acc + l.debit, 0);
            const totalCredit = entry.lines.reduce((acc, l) => acc + l.credit, 0);

            return (
              <div
                key={entry.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                      {entry.voucherNo}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{entry.date}</span>
                    {entry.projectId && (
                      <span className="text-[11px] font-semibold text-slate-400">
                        Project: <strong>{entry.projectId}</strong>
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full self-start sm:self-auto">
                    <CheckCircle2 className="w-3 h-3" />
                    Balanced & Posted
                  </span>
                </div>

                {/* Ledger Lines Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="text-slate-400 font-semibold border-b border-slate-100 dark:border-slate-800/80">
                      <tr>
                        <th className="py-2 text-left">Ledger Account Particulars</th>
                        <th className="py-2 text-right w-36 font-mono">Debit (₹)</th>
                        <th className="py-2 text-right w-36 font-mono">Credit (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40">
                      {entry.lines.map((l, i) => (
                        <tr key={i}>
                          <td className="py-2 font-medium text-slate-800 dark:text-slate-200">
                            {l.debit > 0 ? (
                              <span>{l.accountName}</span>
                            ) : (
                              <span className="pl-6 text-slate-600 dark:text-slate-400">
                                To {l.accountName}
                              </span>
                            )}
                          </td>
                          <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {l.debit > 0 ? l.debit.toLocaleString('en-IN') : '—'}
                          </td>
                          <td className="py-2 text-right font-mono font-bold text-slate-900 dark:text-white">
                            {l.credit > 0 ? l.credit.toLocaleString('en-IN') : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-slate-200 dark:border-slate-700 font-bold">
                      <tr>
                        <td className="py-2 text-slate-500 uppercase text-[10px]">Voucher Total</td>
                        <td className="py-2 text-right font-mono text-emerald-600 font-black">
                          ₹ {totalDebit.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 text-right font-mono text-emerald-600 font-black">
                          ₹ {totalCredit.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Narration */}
                <p className="text-[11px] text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {entry.narration}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </AccountsLayout>
  );
};
