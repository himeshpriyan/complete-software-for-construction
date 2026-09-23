import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LeaveRequest, LeaveType, LeaveStatus } from '../../types';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Filter,
  Search,
  UserCheck,
  Building,
  Calendar,
  X,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const LeavePage: React.FC = () => {
  const {
    salariedEmployees,
    leaveRequests,
    leaveBalances,
    applyLeaveRequest,
    updateLeaveStatus,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | LeaveStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | LeaveType>('ALL');

  // Apply Leave Modal
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedRequestForAction, setSelectedRequestForAction] = useState<LeaveRequest | null>(null);
  const [approverRemarks, setApproverRemarks] = useState('');

  const [newRequest, setNewRequest] = useState<{
    empId: string;
    leaveType: LeaveType;
    fromDate: string;
    toDate: string;
    days: number;
    reason: string;
  }>({
    empId: salariedEmployees[0]?.id || 'EMP-001',
    leaveType: 'Casual',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    days: 2,
    reason: '',
  });

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((lr) => {
      const matchStatus = statusFilter === 'ALL' || lr.status === statusFilter;
      const matchType = typeFilter === 'ALL' || lr.leaveType === typeFilter;
      const matchSearch =
        lr.empName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lr.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lr.reason.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });
  }, [leaveRequests, statusFilter, typeFilter, searchQuery]);

  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'approved').length;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = salariedEmployees.find((e) => e.id === newRequest.empId);
    applyLeaveRequest({
      empId: newRequest.empId,
      empName: emp?.name || 'Staff Member',
      department: emp?.department || 'Operations',
      leaveType: newRequest.leaveType,
      fromDate: newRequest.fromDate,
      toDate: newRequest.toDate,
      days: Number(newRequest.days) || 1,
      reason: newRequest.reason,
    });
    setShowApplyModal(false);
  };

  const handleAction = (status: 'approved' | 'rejected') => {
    if (!selectedRequestForAction) return;
    updateLeaveStatus(
      selectedRequestForAction.id,
      status,
      approverRemarks || (status === 'approved' ? 'Sanctioned as per company policy' : 'Project deliverables scheduled')
    );
    setSelectedRequestForAction(null);
    setApproverRemarks('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-indigo-600" />
            Leave Management & Entitlement Balances
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Casual, Sick, and Permission leave requests, multi-level approvals, and real-time employee leave ledgers
          </p>
        </div>

        <button
          onClick={() => setShowApplyModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Apply Leave Request
        </button>
      </div>

      {/* Leave Balance Tracker Per Employee */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Annual Entitlement & Leave Balance Tracker
            </h3>
            <p className="text-xs text-slate-500">
              Live balances for Casual Leave (CL), Sick Leave (SL), and Permission Hours
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            FY 2026-2027 Cycle
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {salariedEmployees.slice(0, 4).map((emp) => {
            const bal = leaveBalances[emp.id] || {
              casualTotal: 12,
              casualUsed: 3,
              sickTotal: 10,
              sickUsed: 2,
              permissionTotal: 6,
              permissionUsed: 1,
            };

            const clRemaining = bal.casualTotal - bal.casualUsed;
            const slRemaining = bal.sickTotal - bal.sickUsed;
            const permRemaining = bal.permissionTotal - bal.permissionUsed;

            return (
              <div
                key={emp.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${emp.avatarColor}`}
                  >
                    {emp.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                      {emp.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono">{emp.empCode}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Casual (CL):</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {clRemaining} left <span className="text-slate-400 font-normal">({bal.casualUsed}/{bal.casualTotal})</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Sick (SL):</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {slRemaining} left <span className="text-slate-400 font-normal">({bal.sickUsed}/{bal.sickTotal})</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Permission:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {permRemaining} left <span className="text-slate-400 font-normal">({bal.permissionUsed}/{bal.permissionTotal})</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
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
            placeholder="Search by employee, reason..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            {(['ALL', 'pending', 'approved', 'rejected'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition uppercase ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'ALL' | LeaveType)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="Casual">Casual Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Permission">Permission</option>
          </select>
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Employee & Dept</th>
                <th className="px-4 py-3.5">Leave Type</th>
                <th className="px-4 py-3.5">Duration (From - To)</th>
                <th className="px-4 py-3.5">Days</th>
                <th className="px-4 py-3.5">Reason</th>
                <th className="px-4 py-3.5">Applied Date</th>
                <th className="px-4 py-3.5">Workflow Status</th>
                <th className="px-5 py-3.5 text-right">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredRequests.map((lr) => (
                <tr key={lr.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {lr.empName}
                    </div>
                    <div className="text-[11px] text-slate-400">{lr.department}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="px-2.5 py-1 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
                      {lr.leaveType}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-800 dark:text-slate-200">
                    {lr.fromDate} to {lr.toDate}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                    {lr.days} {lr.days === 1 ? 'day' : 'days'}
                  </td>
                  <td className="px-4 py-3.5 max-w-[200px] text-slate-700 dark:text-slate-300">
                    "{lr.reason}"
                  </td>
                  <td className="px-4 py-3.5 text-slate-400 font-mono">{lr.appliedOn}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max ${
                        lr.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300'
                          : lr.status === 'pending'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300'
                      }`}
                    >
                      {lr.status === 'approved' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : lr.status === 'pending' ? (
                        <Clock className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {lr.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    {lr.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedRequestForAction(lr);
                          }}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-sm transition"
                        >
                          Review & Decide
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        {lr.approvedBy ? `Reviewed by ${lr.approvedBy}` : 'Completed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review & Decide Modal */}
      {selectedRequestForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Leave Request Approval
              </h3>
              <button
                onClick={() => setSelectedRequestForAction(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-400">Employee:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedRequestForAction.empName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type & Duration:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedRequestForAction.leaveType} ({selectedRequestForAction.days} days)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date Range:</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">
                    {selectedRequestForAction.fromDate} to {selectedRequestForAction.toDate}
                  </span>
                </div>
                <div className="pt-1 text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 block mb-0.5">Reason:</span>
                  "{selectedRequestForAction.reason}"
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Approver Remarks / Instructions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Approved. Coordinate handover with site engineer."
                  value={approverRemarks}
                  onChange={(e) => setApproverRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleAction('rejected')}
                  className="px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-400 rounded-lg text-xs font-bold transition border border-rose-200"
                >
                  Reject Request
                </button>
                <button
                  onClick={() => handleAction('approved')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Approve Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
                Submit Leave Application
              </h3>
              <button onClick={() => setShowApplyModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Employee
                  </label>
                  <select
                    value={newRequest.empId}
                    onChange={(e) => setNewRequest({ ...newRequest, empId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    {salariedEmployees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name} ({e.empCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Leave Type
                  </label>
                  <select
                    value={newRequest.leaveType}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, leaveType: e.target.value as LeaveType })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Casual">Casual Leave (CL)</option>
                    <option value="Sick">Sick Leave (SL)</option>
                    <option value="Permission">Permission (Half-day / 3hr)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newRequest.fromDate}
                    onChange={(e) => setNewRequest({ ...newRequest, fromDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newRequest.toDate}
                    onChange={(e) => setNewRequest({ ...newRequest, toDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Days Count
                  </label>
                  <input
                    type="number"
                    min={0.5}
                    step={0.5}
                    required
                    value={newRequest.days}
                    onChange={(e) => setNewRequest({ ...newRequest, days: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Leave
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the reason for leave..."
                  value={newRequest.reason}
                  onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
