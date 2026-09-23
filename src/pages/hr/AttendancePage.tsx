import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
  Building,
  Search,
  Filter,
  Users,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { salariedEmployees, staffAttendance, markStaffAttendance } = useAppStore();

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');

  const departments = useMemo(() => {
    const depts = new Set(salariedEmployees.map((e) => e.department));
    return ['ALL', ...Array.from(depts)];
  }, [salariedEmployees]);

  // Merge employee master with attendance for the selected date
  const attendanceList = useMemo(() => {
    return salariedEmployees.map((emp) => {
      const record = staffAttendance.find(
        (a) => a.empId === emp.id && a.date === selectedDate
      );

      return {
        emp,
        record: record || {
          id: `ATT-MOCK-${emp.id}`,
          empId: emp.id,
          empName: emp.name,
          date: selectedDate,
          checkIn: '09:00 AM',
          checkOut: '06:30 PM',
          status: 'present' as const,
          otHours: 0,
          location: 'Site / Head Office',
        },
      };
    });
  }, [salariedEmployees, staffAttendance, selectedDate]);

  const filteredList = useMemo(() => {
    return attendanceList.filter(({ emp }) => {
      const matchDept = filterDept === 'ALL' || emp.department === filterDept;
      const matchSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [attendanceList, filterDept, searchQuery]);

  const totalStaff = salariedEmployees.length;
  const presentCount = attendanceList.filter((a) => a.record.status === 'present').length;
  const halfDayCount = attendanceList.filter((a) => a.record.status === 'half_day').length;
  const onLeaveCount = attendanceList.filter((a) => a.record.status === 'on_leave').length;
  const absentCount = attendanceList.filter((a) => a.record.status === 'absent').length;

  const attendanceRate = totalStaff > 0 ? Math.round(((presentCount + halfDayCount * 0.5) / totalStaff) * 100) : 100;

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-indigo-600" />
            Office & Engineering Staff Attendance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Daily check-in / check-out times, biometric site verification, and overtime hours
          </p>
        </div>

        {/* Date Selector Navigation */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-sm">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 font-semibold text-xs text-slate-800 dark:text-slate-200 font-mono">
            <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
            {selectedDate}
          </div>
          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Present on Site / Office
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {presentCount}
            </span>
            <span className="text-xs text-slate-400">of {totalStaff}</span>
          </div>
          <p className="text-xs text-emerald-600 font-medium mt-1">{attendanceRate}% attendance</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            On Approved Leave
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {onLeaveCount}
            </span>
            <span className="text-xs text-slate-400">staff</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">HR sanctioned</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Half-Day Marked
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {halfDayCount}
            </span>
            <span className="text-xs text-slate-400">staff</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">First / Second half</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Unexcused Absent
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {absentCount}
            </span>
            <span className="text-xs text-slate-400">staff</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Auto-notified on app</p>
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
            placeholder="Search employee by name, code..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                Department: {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Register Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Employee Name & Code</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Check-In</th>
                <th className="px-4 py-3.5">Check-Out</th>
                <th className="px-4 py-3.5">Duty Station</th>
                <th className="px-4 py-3.5">OT Hours</th>
                <th className="px-4 py-3.5">Current Status</th>
                <th className="px-5 py-3.5 text-right">Quick Mark Action (Tap Targets)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredList.map(({ emp, record }) => {
                const status = record.status;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5">
                      <Link
                        to={`/hr/employees/${emp.id}`}
                        className="flex items-center gap-3 group cursor-pointer"
                        title="Click to view complete employee profile & attendance dossier"
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs group-hover:scale-105 transition-transform ${emp.avatarColor}`}
                        >
                          {emp.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                            <span>{emp.name}</span>
                            <span className="text-[10px] text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                              &rarr; View Dossier
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">
                            {emp.empCode} • {emp.designation}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                      {emp.department}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-800 dark:text-slate-200">
                      {status === 'absent' || status === 'on_leave' ? '—' : record.checkIn}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-800 dark:text-slate-200">
                      {status === 'absent' || status === 'on_leave' ? '—' : record.checkOut}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{record.location}</td>
                    <td className="px-4 py-3.5 font-mono">
                      {record.otHours > 0 ? (
                        <span className="font-bold text-indigo-600">+{record.otHours} hrs</span>
                      ) : (
                        '0'
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          status === 'present'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300'
                            : status === 'half_day'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                            : status === 'on_leave'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                        <button
                          onClick={() => markStaffAttendance(emp.id, 'present', '09:00 AM', '06:30 PM')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded transition ${
                            status === 'present'
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                          }`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => markStaffAttendance(emp.id, 'half_day', '09:00 AM', '01:30 PM')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded transition ${
                            status === 'half_day'
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                          }`}
                        >
                          HD
                        </button>
                        <button
                          onClick={() => markStaffAttendance(emp.id, 'on_leave')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded transition ${
                            status === 'on_leave'
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                          }`}
                        >
                          L
                        </button>
                        <button
                          onClick={() => markStaffAttendance(emp.id, 'absent')}
                          className={`px-2.5 py-1 text-[11px] font-bold rounded transition ${
                            status === 'absent'
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                          }`}
                        >
                          A
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
