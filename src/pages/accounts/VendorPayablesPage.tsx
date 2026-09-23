import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccountsLayout } from './AccountsLayout';
import {
  ArrowUpRight,
  Search,
  Building2,
  Calendar,
  AlertCircle,
  Truck,
  Wrench,
  CheckCircle2,
  CreditCard,
} from 'lucide-react';

export const VendorPayablesPage: React.FC = () => {
  const { vendorPayables, recordPaymentReceipt } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBucket, setFilterBucket] = useState<'all' | '0-30' | '31-60' | '61-90' | '90+'>('all');
  const [filterPartyType, setFilterPartyType] = useState<'all' | 'vendor' | 'subcontractor'>('all');

  // Bucket Totals
  const bucketTotals = useMemo(() => {
    const buckets = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0, total: 0 };
    vendorPayables.forEach((p) => {
      buckets[p.agingBucket] += p.balanceDue;
      buckets.total += p.balanceDue;
    });
    return buckets;
  }, [vendorPayables]);

  const filtered = useMemo(() => {
    return vendorPayables.filter((item) => {
      const matchSearch =
        searchTerm === '' ||
        item.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.billOrPONumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBucket = filterBucket === 'all' || item.agingBucket === filterBucket;
      const matchType = filterPartyType === 'all' || item.partyType === filterPartyType;
      return matchSearch && matchBucket && matchType;
    });
  }, [vendorPayables, searchTerm, filterBucket, filterPartyType]);

  return (
    <AccountsLayout>
      <div className="space-y-6">
        {/* Aging Summary Tiles */}
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
            <p className="text-[11px] text-slate-500 mt-0.5">Scheduled payment cycle</p>
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
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">Due for batch disbursal</p>
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
            <p className="text-[11px] text-orange-600 font-medium mt-0.5">Vendor follow-up urgent</p>
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
              <span className="font-bold uppercase tracking-wider">90+ Days (Overdue)</span>
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
            </div>
            <p className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1.5 font-mono">
              ₹ {(bucketTotals['90+'] / 10000000).toFixed(2)} Cr
            </p>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">Hold pending material reconciliation</p>
          </div>
        </div>

        {/* Payables Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Vendor & Subcontractor Payables Schedule
              </h2>
              <p className="text-xs text-slate-500">
                Tracking outstanding payables against purchase orders and subcontract running bills.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterPartyType}
                onChange={(e) => setFilterPartyType(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">All Payables</option>
                <option value="vendor">Material Vendors Only</option>
                <option value="subcontractor">Subcontractors Only</option>
              </select>

              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search vendor or PO..."
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
                  <th className="py-3 px-4 text-left">Payee & Project</th>
                  <th className="py-3 px-4 text-center">Type</th>
                  <th className="py-3 px-4 text-left">PO / Bill Ref</th>
                  <th className="py-3 px-4 text-center">Due Date</th>
                  <th className="py-3 px-4 text-right">Total Payable</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Balance Due</th>
                  <th className="py-3 px-4 text-center">Aging Bucket</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{item.partyName}</p>
                      <p className="text-[11px] text-slate-400">{item.projectName}</p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.partyType === 'vendor'
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                            : 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400'
                        }`}
                      >
                        {item.partyType === 'vendor' ? <Truck className="w-3 h-3" /> : <Wrench className="w-3 h-3" />}
                        {item.partyType === 'vendor' ? 'Vendor' : 'Subcontractor'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {item.billOrPONumber}
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          recordPaymentReceipt({
                            date: new Date().toISOString().split('T')[0],
                            type: 'payment',
                            partyName: item.partyName,
                            partyType: item.partyType,
                            projectId: item.projectId,
                            projectName: item.projectName,
                            amount: item.balanceDue,
                            paymentMode: 'NEFT/RTGS',
                            referenceNumber: `HDFCP${Date.now().toString().slice(-8)}`,
                            bankAccountName: 'HDFC Bank Ltd Main Current',
                            description: `Payment release against ${item.billOrPONumber}`,
                            status: 'completed',
                          });
                          alert(`Disbursal of ₹ ${(item.balanceDue).toLocaleString('en-IN')} to ${item.partyName} released via NEFT.`);
                        }}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 font-bold rounded-lg transition"
                      >
                        Pay Now
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
