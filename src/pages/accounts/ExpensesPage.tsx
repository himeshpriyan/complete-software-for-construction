import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AccountsLayout } from './AccountsLayout';
import { ExpenseCategory, ExpenseEntry } from '../../types';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  Building2,
  Calendar,
  CheckCircle2,
  Paperclip,
  Upload,
  X,
  CreditCard,
  DollarSign,
  Tag,
} from 'lucide-react';

const CATEGORIES: ExpenseCategory[] = [
  'Site Overhead',
  'Fuel & Transport',
  'Office Rent & Admin',
  'Safety Equipment',
  'Legal & Statutory Fees',
  'Testing & Inspections',
  'Utilities',
  'Machinery Hire',
  'Misc',
];

export const ExpensesPage: React.FC = () => {
  const { expenses, projects, addExpense, erpSettings } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formCategory, setFormCategory] = useState<ExpenseCategory>('Site Overhead');
  const [formProjectId, setFormProjectId] = useState<string>('PRJ-001');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [formAmount, setFormAmount] = useState<number>(25000);
  const [formPayee, setFormPayee] = useState<string>('');
  const [formPaidThrough, setFormPaidThrough] = useState<'Bank Transfer' | 'Petty Cash' | 'Cheque' | 'Credit Card'>('Bank Transfer');
  const [formNotes, setFormNotes] = useState<string>('');

  // Category Total Aggregations
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    let totalAll = 0;
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
      totalAll += e.amount;
    });
    return { totals, totalAll };
  }, [expenses]);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        searchTerm === '' ||
        e.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCat = selectedCategory === 'all' || e.category === selectedCategory;
      const matchProj = selectedProject === 'all' || e.projectId === selectedProject;
      return matchSearch && matchCat && matchProj;
    });
  }, [expenses, searchTerm, selectedCategory, selectedProject]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === formProjectId);
    const gstAmt = Math.round((formAmount * (erpSettings.companyGstRate || 18)) / 100);

    addExpense({
      date: formDate,
      category: formCategory,
      projectId: formProjectId,
      projectName: proj?.name || 'Site Superstructure',
      amount: formAmount,
      paidThrough: formPaidThrough,
      payee: formPayee || 'Vendor / Service Provider',
      gstAmount: gstAmt,
      approvedBy: 'Vikram Malhotra (Project Director)',
      status: 'approved',
      notes: formNotes,
    });

    setIsAddModalOpen(false);
    setFormPayee('');
    setFormNotes('');
  };

  return (
    <AccountsLayout>
      <div className="space-y-6">
        {/* Header with Add Expense button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Categorized Site Operating Expenses
            </h2>
            <p className="text-xs text-slate-500">
              Direct and indirect project operational expense vouchers, overhead, and utility disbursements.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Expense Voucher</span>
          </button>
        </div>

        {/* Category Pill Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            All Categories ({expenses.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = expenses.filter((e) => e.category === cat).length;
            const isSel = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isSel
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>{cat}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSel ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Expenses Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.split(' ')[0]} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search expense, payee, notes..."
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
                  <th className="py-3 px-4 text-left">Category</th>
                  <th className="py-3 px-4 text-left">Project & Payee</th>
                  <th className="py-3 px-4 text-left">Notes / Description</th>
                  <th className="py-3 px-4 text-center">Payment Mode</th>
                  <th className="py-3 px-4 text-right">Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {item.expenseNumber}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-mono text-[11px]">
                      {item.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{item.payee}</p>
                      {item.projectName && <p className="text-[11px] text-slate-400">{item.projectName}</p>}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {item.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-500 font-medium">
                      {item.paidThrough}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                      ₹ {item.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD EXPENSE MODAL */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Record Site Expense Voucher
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Expense Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Project
                    </label>
                    <select
                      value={formProjectId}
                      onChange={(e) => setFormProjectId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                    >
                      {projects.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.code}
                        </option>
                      ))}
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

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Paid Through
                    </label>
                    <select
                      value={formPaidThrough}
                      onChange={(e) => setFormPaidThrough(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Petty Cash">Petty Cash</option>
                      <option value="Cheque">Cheque</option>
                      <option value="Credit Card">Corporate Card</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Payee / Vendor Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indian Oil Bulk Fuel Depot"
                    value={formPayee}
                    onChange={(e) => setFormPayee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Description & Justification
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide purpose of expense..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                  <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
                  <span className="text-[11px] text-slate-500 font-medium">
                    Upload Tax Invoice / Cash Receipt (Mock PDF/JPG)
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20"
                  >
                    Save Expense
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
