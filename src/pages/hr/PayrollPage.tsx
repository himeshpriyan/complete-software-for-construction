import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MonthlyPayslip, SalariedEmployee } from '../../types';
import {
  Banknote,
  Search,
  Plus,
  Filter,
  Download,
  Printer,
  Calendar,
  Building,
  CheckCircle2,
  Clock,
  X,
  CreditCard,
  FileSpreadsheet,
  FileCheck,
} from 'lucide-react';

export const PayrollPage: React.FC = () => {
  const {
    salariedEmployees,
    payslips,
    generateMonthlyPayslip,
  } = useAppStore();

  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayslip, setSelectedPayslip] = useState<MonthlyPayslip | null>(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedEmpForGenerate, setSelectedEmpForGenerate] = useState(
    salariedEmployees[0]?.id || 'EMP-001'
  );

  const filteredPayslips = useMemo(() => {
    return payslips.filter((ps) => {
      const matchMonth = ps.month.toLowerCase().includes(selectedMonth.toLowerCase().split(' ')[0]);
      const matchSearch =
        ps.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ps.payslipNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ps.department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSearch;
    });
  }, [payslips, selectedMonth, searchQuery]);

  // Aggregate totals
  const totalGross = filteredPayslips.reduce((sum, p) => sum + p.grossSalary, 0);
  const totalDeductions = filteredPayslips.reduce((sum, p) => sum + p.totalDeductions, 0);
  const totalNet = filteredPayslips.reduce((sum, p) => sum + p.netSalary, 0);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const ps = generateMonthlyPayslip(selectedEmpForGenerate, selectedMonth);
    setSelectedPayslip(ps);
    setShowGenerateModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Banknote className="w-7 h-7 text-indigo-600" />
            Salaried Staff Payroll & Payslip Generation
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated salary computation from attendance, OT, PF, PT, TDS deductions, and itemized payslip printing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm"
          >
            <option value="September 2026">Payroll Month: September 2026</option>
            <option value="August 2026">Payroll Month: August 2026</option>
            <option value="July 2026">Payroll Month: July 2026</option>
          </select>

          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Compute & Issue Payslip
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Gross Payroll
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-slate-900 dark:text-white">
            ₹ {(totalGross / 100000).toFixed(2)} L
          </div>
          <p className="text-xs text-slate-400 mt-1">
            CTC for {filteredPayslips.length} processed staff
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Statutory Deductions
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
            ₹ {(totalDeductions / 100000).toFixed(2)} L
          </div>
          <p className="text-xs text-slate-400 mt-1">PF (12%), PT, TDS withholdings</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Net Direct Bank Disbursals
          </span>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ₹ {(totalNet / 100000).toFixed(2)} L
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">NEFT / RTGS batched</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Disbursal Status
          </span>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              {filteredPayslips.filter((p) => p.status === 'disbursed').length} Disbursed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">All accounts verified</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payslip, employee name, department..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs text-slate-500">
            Showing {filteredPayslips.length} payslips for {selectedMonth}
          </span>
        </div>
      </div>

      {/* Payroll Computation Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Payslip # & Employee</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Days (Present / Pay)</th>
                <th className="px-4 py-3.5 text-right">Basic + HRA + Allowances</th>
                <th className="px-4 py-3.5 text-right">OT & Incentives</th>
                <th className="px-4 py-3.5 text-right">Gross Salary</th>
                <th className="px-4 py-3.5 text-right">Total Deductions (PF/TDS)</th>
                <th className="px-4 py-3.5 text-right font-bold text-slate-900 dark:text-white">
                  Net Payable Salary
                </th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredPayslips.map((ps) => (
                <tr key={ps.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {ps.empName}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                      {ps.payslipNumber} • {ps.designation}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                    {ps.department}
                  </td>
                  <td className="px-4 py-3.5 font-mono">
                    <span className="font-bold text-slate-900 dark:text-white">{ps.presentDays}</span>
                    <span className="text-slate-400"> / {ps.payableDays} days</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono">
                    ₹ {(ps.basicSalary + ps.hra + ps.allowances).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-emerald-600">
                    {ps.otPay + ps.incentives > 0
                      ? `+₹ ${(ps.otPay + ps.incentives).toLocaleString('en-IN')}`
                      : '—'}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹ {ps.grossSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-rose-600">
                    −₹ {ps.totalDeductions.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    ₹ {ps.netSalary.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ps.status === 'disbursed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300'
                      }`}
                    >
                      {ps.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedPayslip(ps)}
                      className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded text-xs font-semibold transition border border-indigo-200 dark:border-indigo-800"
                    >
                      View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Detail / Printable Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            {/* Modal Header Actions */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 print:hidden">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  Official Salary Certificate / Payslip
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print / PDF
                </button>
                <button
                  onClick={() => setSelectedPayslip(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Payslip Body */}
            <div className="p-8 space-y-6 text-slate-800 dark:text-slate-200 print:p-0">
              {/* Company Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 dark:border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    BUILDOS INFRASTRUCTURE PVT LTD
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Corporate Tower, Level 14, Bandra Kurla Complex, Mumbai 400051
                  </p>
                  <p className="text-xs text-slate-500">
                    GSTIN: 27AABCB1234F1Z5 • CIN: U45200MH2018PTC305891
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                    Payslip For Month
                  </div>
                  <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedPayslip.month}
                  </div>
                  <div className="text-xs font-mono text-slate-400">{selectedPayslip.payslipNumber}</div>
                </div>
              </div>

              {/* Employee & Bank Info Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Employee Name:</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedPayslip.empName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Employee ID:</span>
                    <span className="font-mono font-semibold">{selectedPayslip.empId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Designation:</span>
                    <span className="font-semibold">{selectedPayslip.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span>{selectedPayslip.department}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Account:</span>
                    <span className="font-mono font-semibold">{selectedPayslip.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Income Tax PAN:</span>
                    <span className="font-mono font-semibold">{selectedPayslip.pan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Days in Month / Payable:</span>
                    <span className="font-bold">{selectedPayslip.payableDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Present Days:</span>
                    <span className="font-bold text-emerald-600">{selectedPayslip.presentDays} Days</span>
                  </div>
                </div>
              </div>

              {/* Earnings vs Deductions Table */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                  <div className="p-3">Earnings (A)</div>
                  <div className="p-3 border-l border-slate-200 dark:border-slate-700">
                    Deductions (B)
                  </div>
                </div>

                <div className="grid grid-cols-2 text-xs divide-x divide-slate-200 dark:divide-slate-700 font-medium">
                  {/* Earnings Left */}
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Basic Salary</span>
                      <span className="font-mono font-semibold">
                        ₹ {selectedPayslip.basicSalary.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">House Rent Allowance (HRA)</span>
                      <span className="font-mono font-semibold">
                        ₹ {selectedPayslip.hra.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Site & Special Allowances</span>
                      <span className="font-mono font-semibold">
                        ₹ {selectedPayslip.allowances.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Overtime (OT) Pay</span>
                      <span className="font-mono font-semibold">
                        ₹ {selectedPayslip.otPay.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Site Performance Incentives</span>
                      <span className="font-mono font-semibold">
                        ₹ {selectedPayslip.incentives.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Deductions Right */}
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Employee Provident Fund (EPF 12%)</span>
                      <span className="font-mono font-semibold text-rose-600">
                        ₹ {selectedPayslip.pfDeduction.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Professional Tax (PT)</span>
                      <span className="font-mono font-semibold text-rose-600">
                        ₹ {selectedPayslip.ptDeduction.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tax Deducted at Source (TDS)</span>
                      <span className="font-mono font-semibold text-rose-600">
                        ₹ {selectedPayslip.tdsDeduction.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Staff Loan & Salary Advances</span>
                      <span className="font-mono font-semibold text-rose-600">
                        ₹ {selectedPayslip.advances.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Subtotals */}
                <div className="grid grid-cols-2 text-xs font-bold bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 divide-x divide-slate-200 dark:divide-slate-700">
                  <div className="p-3 flex justify-between">
                    <span>Total Gross Earnings:</span>
                    <span className="font-mono">₹ {selectedPayslip.grossSalary.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-3 flex justify-between text-rose-600">
                    <span>Total Deductions:</span>
                    <span className="font-mono">−₹ {selectedPayslip.totalDeductions.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay Callout */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <span className="text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-bold block">
                    Net Take-Home Salary Transferred
                  </span>
                  <span className="text-xs text-slate-500">
                    Direct NEFT Transfer to {selectedPayslip.bankAccount}
                  </span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                  ₹ {selectedPayslip.netSalary.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Signature Footer */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <div className="h-10"></div>
                  <div className="border-t border-slate-300 dark:border-slate-600 pt-1 font-semibold text-slate-600 dark:text-slate-400">
                    Authorized Signatory (Finance & HR)
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-10"></div>
                  <div className="border-t border-slate-300 dark:border-slate-600 pt-1 font-semibold text-slate-600 dark:text-slate-400">
                    Employee Acknowledgement
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compute & Issue Payslip Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Banknote className="w-5 h-5 text-indigo-600" />
                Compute Monthly Payslip
              </h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Employee
                </label>
                <select
                  value={selectedEmpForGenerate}
                  onChange={(e) => setSelectedEmpForGenerate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                >
                  {salariedEmployees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name} ({e.empCode}) — ₹ {e.baseSalary.toLocaleString('en-IN')}/mo
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pay Period Month
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedMonth}
                  className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300"
                />
              </div>

              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300 space-y-1">
                <div className="font-bold">Automated Formula Engine:</div>
                <div>• Basic: 50% of Base CTC</div>
                <div>• HRA: 25% | Allowances: 25%</div>
                <div>• Statutory EPF: 12% on Basic</div>
                <div>• Professional Tax (PT): ₹ 200 standard</div>
                <div>• Standard TDS: 10% calculated withhold</div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                >
                  Generate Payslip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
