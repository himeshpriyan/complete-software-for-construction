import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccountsLayout } from './AccountsLayout';
import {
  ArrowDownLeft,
  Calendar,
  Building2,
  AlertCircle,
  Search,
  CheckCircle2,
  Download,
  Filter,
  DollarSign,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const CustomerReceivablesPage: React.FC = () => {
  const { customerReceivables, recordPaymentReceipt } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBucket, setFilterBucket] = useState<'all' | '0-30' | '31-60' | '61-90' | '90+'>('all');

  // Bucket Totals
  const bucketTotals = useMemo(() => {
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0, total: 0 };
    customerReceivables.forEach((r) => {
      buckets[r.agingBucket] += r.balanceDue;
      buckets.total += r.balanceDue;
    });
    return buckets;
  }, [customerReceivables]);

  // Filtered List
  const filtered = useMemo(() => {
    return customerReceivables.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBucket = filterBucket === 'all' || item.agingBucket === filterBucket;
      return matchSearch && matchBucket;
    });
  }, [customerReceivables, searchTerm, filterBucket]);

  return (
    <AccountsLayout>
      <div className="space-y-6">
        {/* Aging Analysis Cards (0-30, 31-60, 61-90, 90+ days) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setFilterBucket(filterBucket === '0-30' ? 'all' : '0-30')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              filterBucket === '0-30'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider">0–30 Days (Current)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1.5 font-mono">
              ₹ {(bucketTotals['0-30'] / 10000000).toFixed(2)} Cr
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Within standard credit term</p>
          </div>

          <div
            onClick={() => setFilterBucket(filterBucket === '31-60' ? 'all' : '31-60')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              filterBucket === '31-60'
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider">31–60 Days</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <p className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1.5 font-mono">
              ₹ {(bucketTotals['31-60'] / 10000000).toFixed(2)} Cr
            </p>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">First reminder notice issued</p>
          </div>

          <div
            onClick={() => setFilterBucket(filterBucket === '61-90' ? 'all' : '61-90')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              filterBucket === '61-90'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider">61–90 Days</span>
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            </div>
            <p className="text-xl font-black text-orange-600 dark:text-orange-400 mt-1.5 font-mono">
              ₹ {(bucketTotals['61-90'] / 10000000).toFixed(2)} Cr
            </p>
            <p className="text-[11px] text-orange-600 font-medium mt-0.5">Escalated to VP Finance</p>
          </div>

          <div
            onClick={() => setFilterBucket(filterBucket === '90+' ? 'all' : '90+')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              filterBucket === '90+'
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold uppercase tracking-wider">90+ Days (Critical)</span>
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            </div>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1.5 font-mono">
              ₹ {(bucketTotals['90+'] / 10000000).toFixed(2)} Cr
            </p>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">Commercial dispute / holds</p>
          </div>
        </div>

        {/* Receivables Aging Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Customer Receivables Aging Schedule
              </h2>
              <p className="text-xs text-slate-500">
                Itemized outstanding amounts across project running bills with credit aging breakdown.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter client, project, bill..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              {filterBucket !== 'all' && (
                <button
                  onClick={() => setFilterBucket('all')}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg hover:text-slate-800"
                >
                  Clear ({filterBucket})
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-left">Client & Project</th>
                  <th className="py-3 px-4 text-left">RA Bill No</th>
                  <th className="py-3 px-4 text-center">Due Date</th>
                  <th className="py-3 px-4 text-right">Invoice Total</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Aging Bucket</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{item.clientName}</p>
                      <p className="text-[11px] text-slate-400">{item.projectName}</p>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                      {item.billNumber}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">
                      {item.dueDate}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-700 dark:text-slate-300">
                      ₹ {item.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-600">
                      ₹ {item.amountPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-rose-600 dark:text-rose-400">
                      ₹ {item.balanceDue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          item.agingBucket === '0-30'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                            : item.agingBucket === '31-60'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                            : item.agingBucket === '61-90'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-400'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                        }`}
                      >
                        {item.agingBucket} Days
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          item.status === 'overdue'
                            ? 'text-rose-600 font-extrabold'
                            : item.status === 'disputed'
                            ? 'text-orange-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          recordPaymentReceipt({
                            date: new Date().toISOString().split('T')[0],
                            type: 'receipt',
                            partyName: item.clientName,
                            partyType: 'client',
                            projectId: item.projectId,
                            projectName: item.projectName,
                            amount: item.balanceDue,
                            paymentMode: 'NEFT/RTGS',
                            referenceNumber: `UTR-${Date.now().toString().slice(-8)}`,
                            bankAccountName: 'HDFC Bank Ltd Main Current',
                            description: `Remittance clearance for ${item.billNumber}`,
                            status: 'completed',
                          });
                          alert(`Remittance of ₹ ${(item.balanceDue).toLocaleString('en-IN')} recorded successfully.`);
                        }}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold rounded-lg transition"
                      >
                        Record Receipt
                      </button>
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
