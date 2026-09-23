import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  User,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CreditCard,
  Briefcase,
  ArrowLeft,
  Printer,
  Download,
  Share2,
  TrendingUp,
  UserCheck,
  UserX,
  Award,
  Layers,
  CheckSquare,
  FileSpreadsheet,
  ChevronRight,
  HeartHandshake,
  DollarSign,
  IdCard,
} from 'lucide-react';
import { SalariedEmployee, StaffAttendanceDay, LeaveRequest, MonthlyPayslip } from '../../types';

export const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    salariedEmployees,
    staffAttendance,
    leaveRequests,
    leaveBalances,
    payslips,
    projects,
  } = useAppStore();

  // Find employee by ID or Code
  const employee: SalariedEmployee | undefined = useMemo(() => {
    return salariedEmployees.find(
      (e) => e.id === id || e.empCode.toLowerCase() === id?.toLowerCase()
    );
  }, [salariedEmployees, id]);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendance' | 'leaves' | 'projects' | 'payroll' | 'report'
  >('overview');

  // If employee not found
  if (!employee) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm max-w-lg mx-auto my-12">
        <UserX className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Employee Record Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          No salaried staff or engineer matches the identifier <span className="font-mono">{id}</span>.
        </p>
        <button
          onClick={() => navigate('/hr/employees')}
          className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
        >
          Return to Staff Directory
        </button>
      </div>
    );
  }

  // Related attendance records for this employee
  const employeeAttendance: StaffAttendanceDay[] = useMemo(() => {
    return staffAttendance.filter((a) => a.empId === employee.id);
  }, [staffAttendance, employee.id]);

  // Related leave requests for this employee
  const employeeLeaves: LeaveRequest[] = useMemo(() => {
    return leaveRequests.filter((l) => l.empId === employee.id);
  }, [leaveRequests, employee.id]);

  // Leave balance for this employee
  const balance = leaveBalances[employee.id] || {
    empId: employee.id,
    casualTotal: 12,
    casualUsed: 2,
    sickTotal: 10,
    sickUsed: 1,
    permissionTotal: 4,
    permissionUsed: 1,
  };

  // Related payslips
  const employeePayslips: MonthlyPayslip[] = useMemo(() => {
    return payslips.filter((p) => p.empId === employee.id);
  }, [payslips, employee.id]);

  // Synthetic 30-day attendance history calculation for comprehensive reporting
  const workingDaysInPeriod = 26;
  const presentDays = employeeAttendance.filter((a) => a.status === 'present').length || 23;
  const halfDays = employeeAttendance.filter((a) => a.status === 'half_day').length || 1;
  const absentDays = employeeAttendance.filter((a) => a.status === 'absent').length || 1;
  const onLeaveDays = employeeAttendance.filter((a) => a.status === 'on_leave').length || 1;

  const totalCalculatedHours = presentDays * 8.5 + halfDays * 4.5;
  const totalOtHours = employeeAttendance.reduce((sum, a) => sum + (a.otHours || 0), 0) || 14.5;
  const attendancePercentage = Math.round(((presentDays + halfDays * 0.5) / workingDaysInPeriod) * 100);

  // Assigned Construction Projects
  const assignedProjects = useMemo(() => {
    if (employee.department.includes('Civil') || employee.department.includes('Project')) {
      return projects.slice(0, 2);
    }
    if (employee.department.includes('Quantity') || employee.department.includes('Contracts')) {
      return projects.slice(0, 3);
    }
    return projects.slice(0, 1);
  }, [projects, employee.department]);

  // Permissions / Gate Passes Log (Sample On-Duty / Site Permission passes)
  const permissionLogs = [
    {
      id: 'OD-2026-081',
      date: '2026-09-18',
      type: 'On-Duty Site Pass',
      outTime: '11:00 AM',
      inTime: '03:30 PM',
      duration: '4.5 hrs',
      purpose: 'Cube compressive strength test inspection at NABL Certified Test Lab',
      authorizedBy: 'Vikram Malhotra (Project Director)',
      status: 'Approved',
    },
    {
      id: 'OD-2026-042',
      date: '2026-09-10',
      type: 'Client Coordination Pass',
      outTime: '02:00 PM',
      inTime: '05:30 PM',
      duration: '3.5 hrs',
      purpose: 'Joint measurement verification with client billing engineer at Horizon Heights',
      authorizedBy: 'Rajesh Sharma (MD & CEO)',
      status: 'Approved',
    },
    {
      id: 'OD-2026-015',
      date: '2026-09-02',
      type: 'Vendor Yard Inspection',
      outTime: '10:30 AM',
      inTime: '01:00 PM',
      duration: '2.5 hrs',
      purpose: 'Structural steel rebars batch quality testing & test certificate verification',
      authorizedBy: 'Vikram Malhotra (Project Director)',
      status: 'Approved',
    },
  ];

  // Print function
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. TOP BREADCRUMB & BACK ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/hr/employees"
            className="text-slate-500 hover:text-amber-600 font-semibold flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Staff Master</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link
            to="/hr/attendance"
            className="text-slate-500 hover:text-amber-600 font-semibold transition"
          >
            Attendance Register
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
            {employee.empCode}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
            title="Print Official Staff Report"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-white" />
            <span>Complete Audit Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. HERO PROFILE HEADER CARD */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Amber accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-400" />

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
          {/* Avatar Container */}
          <div
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-md shrink-0 ${employee.avatarColor}`}
          >
            {employee.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>

          {/* Profile Name & Roles */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {employee.name}
              </h1>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                {employee.empCode}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  employee.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                ● {employee.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-amber-700">
              {employee.designation} &bull;{' '}
              <span className="text-slate-500">{employee.department}</span>
            </p>

            {/* Quick Contact & Details Strip */}
            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500">
              <a
                href={`mailto:${employee.email}`}
                className="flex items-center gap-1.5 hover:text-amber-600 transition"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{employee.email}</span>
              </a>
              <a
                href={`tel:${employee.phone}`}
                className="flex items-center gap-1.5 hover:text-amber-600 transition font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{employee.phone}</span>
              </a>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Joined {employee.joinDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Head Office & Assigned Sites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Pill Block */}
        <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6 shrink-0">
          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Monthly Base CTC
            </p>
            <p className="text-xl font-black text-slate-900 font-mono">
              ₹ {employee.baseSalary.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] font-semibold text-emerald-600">
              PF & ESIC Registered
            </p>
          </div>
        </div>
      </div>

      {/* 3. HERO METRICS / KPI CARDS (Specifically requested: Present Days, Working Hours, Leaves Taken, Permissions) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* KPI 1: Days Present */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              DAYS PRESENT
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">
              {presentDays}{' '}
              <span className="text-xs font-semibold text-slate-400">
                / {workingDaysInPeriod} Days
              </span>
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${attendancePercentage}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-emerald-600">
                {attendancePercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Working Hours */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              WORKING HOURS
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Clock className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900 font-mono">
              {totalCalculatedHours}{' '}
              <span className="text-xs font-semibold text-slate-400">Hrs</span>
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">
              Avg <strong className="text-slate-700">8.5 hrs</strong> / working day
            </p>
          </div>
        </div>

        {/* KPI 3: Overtime Hours */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              OVERTIME (OT)
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-amber-600 font-mono">
              +{totalOtHours}{' '}
              <span className="text-xs font-semibold text-slate-400">Hrs</span>
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-1">
              Site casting & night shift credit
            </p>
          </div>
        </div>

        {/* KPI 4: Leaves Taken */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              LEAVE TAKEN
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">
              {balance.casualUsed + balance.sickUsed}{' '}
              <span className="text-xs font-semibold text-slate-400">
                / {balance.casualTotal + balance.sickTotal}
              </span>
            </p>
            <p className="text-[11px] font-semibold text-purple-700 mt-1">
              {balance.casualTotal + balance.sickTotal - (balance.casualUsed + balance.sickUsed)} days balance left
            </p>
          </div>
        </div>

        {/* KPI 5: Permissions & OD Passes */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              PERMISSION / OD
            </span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <IdCard className="w-4 h-4 stroke-[2]" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-black text-slate-900">
              {permissionLogs.length}{' '}
              <span className="text-xs font-semibold text-slate-400">Approved</span>
            </p>
            <p className="text-[11px] font-semibold text-teal-700 mt-1">
              On-duty field passes logged
            </p>
          </div>
        </div>
      </div>

      {/* 4. NAVIGATION TABS */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Complete Profile & Bank</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'attendance'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Attendance Log ({presentDays} Days)</span>
          </button>

          <button
            onClick={() => setActiveTab('leaves')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'leaves'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Leaves & Permissions ({balance.casualUsed + balance.sickUsed} Taken)</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'projects'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Assigned Projects ({assignedProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payroll')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'payroll'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Salary & Payslips</span>
          </button>

          <button
            onClick={() => setActiveTab('report')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === 'report'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Full Audit Report Sheet</span>
          </button>
        </div>
      </div>

      {/* 5. TAB CONTENTS */}

      {/* TAB 1: OVERVIEW & COMPLETE PERSONAL / COMPLIANCE DOSSIER */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card A: Personal & Contact Dossier */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Personal & Emergency Contact Details
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Full Legal Name:</span>
                <span className="font-bold text-slate-800">{employee.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Employee Code:</span>
                <span className="font-mono font-bold text-slate-900">{employee.empCode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Official Email:</span>
                <span className="font-medium text-slate-800">{employee.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Direct Phone:</span>
                <span className="font-mono font-medium text-slate-800">{employee.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Blood Group:</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.2 rounded">
                  O+ Positive (Medical Verified)
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Emergency Contact:</span>
                <span className="font-medium text-slate-800">
                  Sunita Sharma (Spouse) &bull; +91 98201 44321
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Permanent Address:</span>
                <span className="font-medium text-slate-700 text-right max-w-xs">
                  Plot 42, Green Valley Enclave, Sector 15, Vashi, Navi Mumbai 400703
                </span>
              </div>
            </div>
          </div>

          {/* Card B: Employment & Role Dossier */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Briefcase className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Employment Terms & Organization Role
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Department:</span>
                <span className="font-bold text-slate-800">{employee.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Official Designation:</span>
                <span className="font-bold text-slate-900">{employee.designation}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Employment Contract:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                  Permanent Full-Time Salaried
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Date of Joining:</span>
                <span className="font-medium text-slate-800">{employee.joinDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Probation / Status:</span>
                <span className="font-semibold text-slate-800">Confirmed (Permanent)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Reporting Authority:</span>
                <span className="font-bold text-indigo-700">
                  {employee.id === 'EMP-001' ? 'Board of Directors' : 'Rajesh Sharma (MD & CEO)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Biometric Device ID:</span>
                <span className="font-mono text-slate-600">BIO-STATION-HQ-08</span>
              </div>
            </div>
          </div>

          {/* Card C: Statutory, Tax & Banking Information */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Statutory, PF, ESI & Tax Compliance
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Income Tax PAN:</span>
                <span className="font-mono font-bold text-slate-800">{employee.pan}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">PF UAN Number:</span>
                <span className="font-mono font-bold text-slate-800">{employee.pfNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">ESIC Insurance ID:</span>
                <span className="font-mono font-medium text-slate-800">31-00-449281-000-0001</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Aadhaar Verification:</span>
                <span className="font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded">
                  Verified &bull;&bull;&bull;&bull; 8829
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Professional Tax State:</span>
                <span className="font-medium text-slate-800">Maharashtra (₹ 200/mo)</span>
              </div>
            </div>
          </div>

          {/* Card D: Bank Account & Disbursal Details */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Direct Salary Disbursal Account
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Bank Name:</span>
                <span className="font-bold text-slate-800">{employee.bankName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Account Number:</span>
                <span className="font-mono font-bold text-slate-900">{employee.bankAccount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">IFSC Code:</span>
                <span className="font-mono font-bold text-indigo-700">HDFC0000128</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Account Type:</span>
                <span className="font-medium text-slate-800">Corporate Salary Account</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-400 font-medium">Branch Location:</span>
                <span className="font-medium text-slate-800">BKC Corporate Branch, Mumbai</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED ATTENDANCE LOG & TIMESHEETS */}
      {activeTab === 'attendance' && (
        <div className="space-y-5">
          {/* Summary Strip */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">
                  MONTHLY ATTENDANCE
                </span>
                <span className="text-base font-black text-slate-900">
                  {presentDays} Days Present &bull; {halfDays} Half Day
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">
                  TOTAL LOGGED HOURS
                </span>
                <span className="text-base font-black text-indigo-700 font-mono">
                  {totalCalculatedHours} hrs
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">
                  TOTAL OVERTIME
                </span>
                <span className="text-base font-black text-amber-600 font-mono">
                  +{totalOtHours} hrs
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold">
                Attendance Compliance: {attendancePercentage}%
              </span>
            </div>
          </div>

          {/* Daily Attendance Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Daily Biometric Punch Records &times; September 2026
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">
                Verified with Site Geofencing & Central HRMS
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Date & Day</th>
                    <th className="px-4 py-3 font-mono">Punch In</th>
                    <th className="px-4 py-3 font-mono">Punch Out</th>
                    <th className="px-4 py-3 font-mono">Total Duration</th>
                    <th className="px-4 py-3 font-mono">Overtime</th>
                    <th className="px-4 py-3">Workstation / Geo Site</th>
                    <th className="px-4 py-3">Biometric Check</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {/* Generated daily logs for the current month */}
                  {Array.from({ length: 15 }).map((_, i) => {
                    const dayNum = 15 - i;
                    const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
                    const isSunday = dayNum % 7 === 0;
                    const isHalfDay = dayNum === 11;
                    const isAbsent = dayNum === 5;
                    const ot = dayNum % 3 === 0 ? 1.5 : dayNum % 4 === 0 ? 2.0 : 0;

                    const status = isSunday
                      ? 'WEEKLY_OFF'
                      : isAbsent
                      ? 'ABSENT'
                      : isHalfDay
                      ? 'HALF_DAY'
                      : 'PRESENT';

                    return (
                      <tr key={dateStr} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3 font-medium text-slate-900">
                          {dateStr} &bull;{' '}
                          <span className="text-slate-400 font-normal">
                            {isSunday ? 'Sunday' : 'Weekday'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {isSunday || isAbsent ? '—' : '09:02 AM'}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {isSunday || isAbsent
                            ? '—'
                            : isHalfDay
                            ? '01:30 PM'
                            : ot > 0
                            ? '08:00 PM'
                            : '06:30 PM'}
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-slate-800">
                          {isSunday || isAbsent
                            ? '0 hrs'
                            : isHalfDay
                            ? '4.5 hrs'
                            : ot > 0
                            ? '10.5 hrs'
                            : '9.0 hrs'}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          {ot > 0 ? (
                            <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                              +{ot} hrs
                            </span>
                          ) : (
                            <span className="text-slate-300">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {isSunday
                            ? 'Weekend'
                            : 'Horizon Heights Site Office & Head Office'}
                        </td>
                        <td className="px-4 py-3">
                          {!isSunday && !isAbsent ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Fingerprint Verified
                            </span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              status === 'PRESENT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : status === 'HALF_DAY'
                                ? 'bg-amber-100 text-amber-800'
                                : status === 'WEEKLY_OFF'
                                ? 'bg-slate-100 text-slate-600'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEAVES & PERMISSION OD PASSES */}
      {activeTab === 'leaves' && (
        <div className="space-y-6">
          {/* Leave Entitlements Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Casual Leave (CL)</span>
              <p className="text-xl font-black text-slate-900 mt-1">
                {balance.casualUsed} <span className="text-xs font-normal text-slate-400">/ {balance.casualTotal} Used</span>
              </p>
              <p className="text-xs font-bold text-emerald-600 mt-1">
                {balance.casualTotal - balance.casualUsed} Days Remaining
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Sick Leave (SL)</span>
              <p className="text-xl font-black text-slate-900 mt-1">
                {balance.sickUsed} <span className="text-xs font-normal text-slate-400">/ {balance.sickTotal} Used</span>
              </p>
              <p className="text-xs font-bold text-emerald-600 mt-1">
                {balance.sickTotal - balance.sickUsed} Days Remaining
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Monthly Permissions</span>
              <p className="text-xl font-black text-slate-900 mt-1">
                {permissionLogs.length} <span className="text-xs font-normal text-slate-400">/ 4 Allowed</span>
              </p>
              <p className="text-xs font-bold text-indigo-600 mt-1">
                {4 - permissionLogs.length} Passes Balance
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Paid Leave / Earned</span>
              <p className="text-xl font-black text-slate-900 mt-1">
                0 <span className="text-xs font-normal text-slate-400">/ 15 Used</span>
              </p>
              <p className="text-xs font-bold text-amber-600 mt-1">
                15 Days Carried Forward
              </p>
            </div>
          </div>

          {/* Section 1: Leave History Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Formal Leave Applications History
              </h3>
              <span className="text-[11px] text-slate-400 font-semibold">
                Approved by Management
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Leave Type</th>
                    <th className="px-4 py-3">Duration (Dates)</th>
                    <th className="px-4 py-3">Days</th>
                    <th className="px-4 py-3">Reason / Justification</th>
                    <th className="px-4 py-3">Applied Date</th>
                    <th className="px-4 py-3">Approved By</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="px-5 py-3.5 font-bold text-slate-900">Casual Leave</td>
                    <td className="px-4 py-3.5 font-mono text-slate-700">2026-08-14 to 2026-08-15</td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">2 Days</td>
                    <td className="px-4 py-3.5 text-slate-600">Family function at hometown</td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono">2026-08-10</td>
                    <td className="px-4 py-3.5 text-slate-800">Rajesh Sharma</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        APPROVED
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3.5 font-bold text-slate-900">Sick Leave</td>
                    <td className="px-4 py-3.5 font-mono text-slate-700">2026-07-22 to 2026-07-22</td>
                    <td className="px-4 py-3.5 font-bold text-slate-800">1 Day</td>
                    <td className="px-4 py-3.5 text-slate-600">Viral fever & medical rest certificate provided</td>
                    <td className="px-4 py-3.5 text-slate-500 font-mono">2026-07-22</td>
                    <td className="px-4 py-3.5 text-slate-800">Vikram Malhotra</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        APPROVED
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: On-Duty (OD) Permissions & Gate Passes Table */}
          <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Official Site Permission Passes & On-Duty (OD) Register
              </h3>
              <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                Work-related Out-of-Office Passes
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3">Pass Ref</th>
                    <th className="px-4 py-3">Pass Date</th>
                    <th className="px-4 py-3 font-mono">Out Time</th>
                    <th className="px-4 py-3 font-mono">In Time</th>
                    <th className="px-4 py-3 font-mono">Duration</th>
                    <th className="px-4 py-3">Official Reason / Purpose</th>
                    <th className="px-4 py-3">Approving Authority</th>
                    <th className="px-5 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {permissionLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-900">{log.id}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-700">{log.date}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-700">{log.outTime}</td>
                      <td className="px-4 py-3.5 font-mono text-slate-700">{log.inTime}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-indigo-700">{log.duration}</td>
                      <td className="px-4 py-3.5 text-slate-800 max-w-sm">{log.purpose}</td>
                      <td className="px-4 py-3.5 text-slate-700">{log.authorizedBy}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ASSIGNED CONSTRUCTION PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Active Construction Sites & Workfront Responsibilities
            </h3>
            <span className="text-xs font-semibold text-slate-400">
              {assignedProjects.length} Assigned Project(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-amber-400 transition cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Building2 className="w-5 h-5 stroke-[1.8]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {p.code} &bull; {p.location}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                    {p.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    Role: <strong className="text-slate-800">{employee.designation}</strong>
                  </span>
                  <span className="text-amber-600 font-bold group-hover:translate-x-0.5 transition flex items-center gap-1">
                    Open Site Workfront <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SALARY & MONTHLY PAYSLIPS */}
      {activeTab === 'payroll' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 pb-3 border-b border-slate-100">
              Monthly Salary Disbursal History & Payslips
            </h3>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Payslip Ref</th>
                    <th className="px-4 py-3">Salary Month</th>
                    <th className="px-4 py-3 font-mono">Present Days</th>
                    <th className="px-4 py-3 font-mono">Gross Pay</th>
                    <th className="px-4 py-3 font-mono">PF Deductions</th>
                    <th className="px-4 py-3 font-mono font-bold text-slate-900">Net Paid</th>
                    <th className="px-4 py-3">Payment Status</th>
                    <th className="px-4 py-3 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {employeePayslips.length > 0 ? (
                    employeePayslips.map((ps) => (
                      <tr key={ps.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                          {ps.payslipNumber}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-800">{ps.month}</td>
                        <td className="px-4 py-3.5 font-mono">{ps.presentDays} / 26</td>
                        <td className="px-4 py-3.5 font-mono">₹ {ps.grossSalary.toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3.5 font-mono text-rose-600">
                          - ₹ {(ps.pfDeduction + ps.ptDeduction).toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3.5 font-mono font-black text-slate-900 text-sm">
                          ₹ {ps.netSalary.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            BANK TRANSFERRED
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={handlePrint}
                            className="text-amber-600 hover:text-amber-700 font-bold flex items-center justify-end gap-1 ml-auto"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Slip</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        PAY-2026-08-{employee.empCode}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-800">August 2026</td>
                      <td className="px-4 py-3.5 font-mono">25 / 26</td>
                      <td className="px-4 py-3.5 font-mono">
                        ₹ {employee.baseSalary.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-rose-600">- ₹ 2,000</td>
                      <td className="px-4 py-3.5 font-mono font-black text-slate-900 text-sm">
                        ₹ {(employee.baseSalary - 2000).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          BANK TRANSFERRED
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={handlePrint}
                          className="text-amber-600 hover:text-amber-700 font-bold flex items-center justify-end gap-1 ml-auto"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Slip</span>
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: COMPLETE OFFICIAL REPORT SHEET (Printable Dossier) */}
      {activeTab === 'report' && (
        <div className="bg-white border border-slate-300 rounded-2xl p-8 shadow-sm space-y-6 print:border-none print:shadow-none">
          {/* Official Company Letterhead Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Build<span className="text-amber-600">OS</span> INFRASTRUCTURE CORP.
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                ISO 9001:2015 Certified Construction & Engineering Enterprise &bull; Reg. No: MH-2022-0941
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
                OFFICIAL EMPLOYEE DOSSIER
              </span>
              <span className="font-mono text-[11px] text-slate-500">
                Generated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Employee Basic Summary Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee Name</span>
              <span className="font-black text-slate-900 text-sm">{employee.name}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee Code</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{employee.empCode}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Designation</span>
              <span className="font-bold text-slate-800">{employee.designation}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
              <span className="font-bold text-slate-800">{employee.department}</span>
            </div>
          </div>

          {/* Performance & Metrics Snapshot */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1">
              1. Attendance & Working Hours Report
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Total Days Present</span>
                <span className="text-base font-bold text-slate-900">{presentDays} / {workingDaysInPeriod} Days ({attendancePercentage}%)</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Total Working Hours</span>
                <span className="text-base font-bold text-slate-900">{totalCalculatedHours} hrs</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Overtime Accrued</span>
                <span className="text-base font-bold text-amber-700">+{totalOtHours} hrs</span>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-lg">
                <span className="text-slate-400 text-[10px] uppercase block font-semibold">Leave Availed</span>
                <span className="text-base font-bold text-purple-700">{balance.casualUsed + balance.sickUsed} Days</span>
              </div>
            </div>
          </div>

          {/* Statutory, Bank & Compliance Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b pb-1">
              2. Statutory & Remuneration Audit
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Monthly Base Pay</span>
                <span className="font-mono font-bold text-slate-900">₹ {employee.baseSalary.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PAN Card</span>
                <span className="font-mono font-bold text-slate-800">{employee.pan}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">PF UAN Ref</span>
                <span className="font-mono font-bold text-slate-800">{employee.pfNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Salary Bank A/C</span>
                <span className="font-mono font-bold text-slate-800">{employee.bankName} - {employee.bankAccount}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal Block */}
          <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div>
              <div className="h-10 border-b border-dashed border-slate-400 w-48 mb-1" />
              <p className="font-bold text-slate-900">HR & Admin Incharge</p>
              <p className="text-[10px] text-slate-400">BuildOS Operations HQ</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-2 border-slate-300 flex items-center justify-center font-bold text-[9px] uppercase tracking-tighter text-slate-400 rotate-12">
                OFFICIAL SEAL
              </div>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-dashed border-slate-400 w-48 mb-1 ml-auto" />
              <p className="font-bold text-slate-900">Managing Director / CEO</p>
              <p className="text-[10px] text-slate-400">Authorized Signatory</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
