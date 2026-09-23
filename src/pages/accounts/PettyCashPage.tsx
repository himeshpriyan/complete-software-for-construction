import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccountsLayout } from './AccountsLayout';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Search,
  X,
  CreditCard,
  UserCheck,
} from 'lucide-react';

export const PettyCashPage: React.FC = () => {
  const { pettyCashLedgers, addPettyCashEntry, projects } = useAppStore();

  const siteKeys = Object.keys(pettyCashLedgers);
  const [selectedSiteId, setSelectedSiteId] = useState<string>(siteKeys[0] || 'PRJ-001');
  const [searchTerm, setSearchTerm] = useState('');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  // Form State
  const [formType, setFormType] = useState<'in' | 'out'>('out');
  const [formCategory, setFormCategory] = useState<string>('Emergency Hardware');
  const [formAmount, setFormAmount] = useState<number>(3500);
  const [formDescription, setFormDescription] = useState<string>('');
  const [formPersonName, setFormPersonName] = useState<string>('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const currentLedger = pettyCashLedgers[selectedSiteId] || {
    siteId: selectedSiteId,
    siteName: 'Site Imprest',
    custodianName: 'Site Supervisor',
    imprestLimit: 100000,
    currentBalance: 50000,
    lastReplenishmentDate: '2026-09-15',
    entries: [],
  };

  const filteredEntries = currentLedger.entries.filter(
    (e) =>
      searchTerm === '' ||
      e.voucherNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIn = currentLedger.entries
    .filter((e) => e.type === 'in')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalOut = currentLedger.entries
    .filter((e) => e.type === 'out')
    .reduce((acc, e) => acc + e.amount, 0);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    addPettyCashEntry(selectedSiteId, {
      siteId: selectedSiteId,
      date: formDate,
      siteName: currentLedger.siteName,
      type: formType,
      category: formCategory,
      description: formDescription || (formType === 'in' ? 'Replenishment' : 'Site expense'),
      amount: formAmount,
      personName: formPersonName || 'Site Staff',
      approvedBy: 'Amit Patel (Site Engineer)',
      receiptAvailable: true,
    });

    setIsEntryModalOpen(false);
    setFormDescription('');
    setFormPersonName('');
  };

  return (
    <AccountsLayout>
      <div className="space-y-6">
        {/* Site Imprest Selector & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Site Cashbox:
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              {siteKeys.map((key) => {
                const isSelected = selectedSiteId === key;
                const ledger = pettyCashLedgers[key];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedSiteId(key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {ledger.siteName.split(' ')[0]} ({key})
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFormType('in');
                setFormCategory('Imprest Replenishment');
                setIsEntryModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>+ Cash In (Replenish)</span>
            </button>

            <button
              onClick={() => {
                setFormType('out');
                setFormCategory('Emergency Hardware');
                setIsEntryModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Cash Out (Expense)</span>
            </button>
          </div>
        </div>

        {/* Ledger Balance & Imprest Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sanctioned Imprest Limit</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 font-mono">
              ₹ {currentLedger.imprestLimit.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Approved site cash ceiling</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 shadow-sm">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
              Current Cash in Hand
            </p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">
              ₹ {currentLedger.currentBalance.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-amber-700 font-medium mt-0.5">
              Custodian: {currentLedger.custodianName.split(' ')[0]}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Total Inward (Top-ups)
            </p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">
              ₹ {totalIn.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Replenishments from Bank</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Total Outward (Disbursed)
            </p>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 font-mono">
              ₹ {totalOut.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Daily operational site vouchers</p>
          </div>
        </div>

        {/* Running Ledger Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {currentLedger.siteName} — Running Cash Ledger
              </h2>
              <p className="text-xs text-slate-500">
                Continuous sequential running balance ledger with supporting voucher numbers.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search voucher, person, item..."
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
                  <th className="py-3 px-4 text-left">Voucher No</th>
                  <th className="py-3 px-4 text-center">Date</th>
                  <th className="py-3 px-4 text-left">Category & Description</th>
                  <th className="py-3 px-4 text-left">Person / Bearer</th>
                  <th className="py-3 px-4 text-right">Cash In (₹)</th>
                  <th className="py-3 px-4 text-right">Cash Out (₹)</th>
                  <th className="py-3 px-4 text-right">Running Balance (₹)</th>
                  <th className="py-3 px-4 text-center">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEntries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {e.voucherNo}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">
                      {e.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-800 dark:text-slate-200 block">
                        {e.category}
                      </span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{e.description}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                      {e.personName}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      {e.type === 'in' ? `+ ₹ ${e.amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      {e.type === 'out' ? `- ₹ ${e.amount.toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-black text-amber-700 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20">
                      ₹ {e.runningBalance.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {e.receiptAvailable ? (
                        <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          Attached
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px]">No Bill</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD PETTY CASH MODAL */}
        {isEntryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {formType === 'in' ? 'Replenish Site Imprest (Cash In)' : 'Record Site Expense (Cash Out)'}
                </h3>
                <button onClick={() => setIsEntryModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddEntry} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Entry Type
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    >
                      <option value="out">Cash Out (Disbursal)</option>
                      <option value="in">Cash In (Top-Up)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={(e) => setFormDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Worker Chai, Fasteners"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Amount (₹)
                    </label>
                    <input
                      type="number"
                      required
                      value={formAmount}
                      onChange={(e) => setFormAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Person Receiving / Handing Over
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patil (Storekeeper)"
                    value={formPersonName}
                    onChange={(e) => setFormPersonName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Voucher Description / Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Particulars of cash transaction..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsEntryModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20"
                  >
                    Save Entry
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AccountsLayout>
  );
};
