import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { SalariedEmployee } from '../../types';
import {
  Users,
  Search,
  Plus,
  Filter,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  CreditCard,
  CheckCircle2,
  X,
  UserCheck,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';

export const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const { salariedEmployees } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<SalariedEmployee | null>(null);

  const departments = useMemo(() => {
    const depts = new Set(salariedEmployees.map((e) => e.department));
    return ['ALL', ...Array.from(depts)];
  }, [salariedEmployees]);

  const filteredEmployees = useMemo(() => {
    return salariedEmployees.filter((emp) => {
      const matchDept = deptFilter === 'ALL' || emp.department === deptFilter;
      const matchStatus = statusFilter === 'ALL' || emp.status === statusFilter;
      const matchSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchStatus && matchSearch;
    });
  }, [salariedEmployees, deptFilter, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-indigo-600" />
            Salaried Staff & Engineers Master
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Permanent technical staff, project managers, lead QS, safety officers, and executive team
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
            {salariedEmployees.length} Total Registered Staff
          </span>
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
            placeholder="Search staff by name, code, designation..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                Department: {d}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="resigned">Resigned</option>
          </select>
        </div>
      </div>

      {/* Staff Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            onClick={() => navigate(`/hr/employees/${emp.id}`)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-lg hover:border-amber-400 hover:-translate-y-1 transition-all space-y-4 flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-xs group-hover:scale-105 transition-transform ${emp.avatarColor}`}
                  >
                    {emp.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                      {emp.designation}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    emp.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                  }`}
                >
                  {emp.status.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Employee Code:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {emp.empCode}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Department:</span>
                  <span className="font-medium">{emp.department}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Monthly CTC / Base:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    ₹ {emp.baseSalary.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-400">Joined:</span>
                  <span>{emp.joinDate}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 text-xs space-y-1.5 text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{emp.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                PAN: {emp.pan}
              </span>
              <span className="text-amber-600 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                Full Profile & Report <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${selectedEmployee.avatarColor}`}
                >
                  {selectedEmployee.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-xs text-indigo-600">{selectedEmployee.empCode}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Employment Details
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block">Designation</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedEmployee.designation}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Department</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedEmployee.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Type</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                      {selectedEmployee.employmentType.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Date of Joining</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedEmployee.joinDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  Statutory & Direct Bank Deposit Info
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bank Name:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {selectedEmployee.bankName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Account Number:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {selectedEmployee.bankAccount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Income Tax PAN:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {selectedEmployee.pan}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">EPF UAN / Account:</span>
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {selectedEmployee.pfNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
