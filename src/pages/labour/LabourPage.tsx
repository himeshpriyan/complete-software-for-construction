import React, { useState, useMemo } from 'react';
import { labourSeed, attendanceSeed, monthlySummarySeed } from '../../data/resourceSeed';
import {
  Users, Search, ChevronRight, Smartphone, QrCode, Fingerprint,
  MapPin, Monitor, CheckCircle2, XCircle, Clock, Moon, Calendar, BarChart3
} from 'lucide-react';
import { Labour, AttendanceEntry, AttendanceCaptureMethod, AttendanceStatus } from '../../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const TRADE_COLORS: Record<string, string> = {
  Mason: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  'Bar Bender': 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  Carpenter: 'bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  Electrician: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400',
  Plumber: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400',
  Painter: 'bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400',
  Welder: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  Helper: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  Waterproofing: 'bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400',
  Tiles: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  Shuttering: 'bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-400',
  Excavation: 'bg-lime-100 text-lime-700 dark:bg-lime-950/50 dark:text-lime-400',
  'Safety Marshal': 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
  Operator: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400',
  Driver: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
};

const CAPTURE_ICONS: Record<AttendanceCaptureMethod, React.FC<{ className?: string }>> = {
  Mobile: Smartphone, QR: QrCode, Biometric: Fingerprint,
  'GPS Geofence': MapPin, Manual: Monitor,
};

const CAPTURE_COLORS: Record<AttendanceCaptureMethod, string> = {
  Mobile: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  QR: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  Biometric: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  'GPS Geofence': 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  Manual: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; bg: string; icon: React.FC<{ className?: string }> }> = {
  present: { label: 'P', bg: 'bg-emerald-500', icon: CheckCircle2 },
  absent: { label: 'A', bg: 'bg-rose-500', icon: XCircle },
  half_day: { label: 'H', bg: 'bg-amber-400', icon: Clock },
  overtime: { label: 'OT', bg: 'bg-blue-500', icon: Moon },
  holiday: { label: 'HO', bg: 'bg-slate-400', icon: Calendar },
  leave: { label: 'L', bg: 'bg-orange-400', icon: Calendar },
};

// ─── Quick Attendance Card (mobile-first) ────────────────────────────────────
const AttendanceTapCard: React.FC<{ entry: AttendanceEntry; onMark: (id: string, status: AttendanceStatus) => void }> = ({ entry, onMark }) => {
  const sc = STATUS_CONFIG[entry.status];
  const CaptureIcon = CAPTURE_ICONS[entry.captureMethod];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${sc.bg}`}>
          {sc.label}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{entry.labourName}</p>
          <p className="text-xs text-slate-500">{entry.labourTrade}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1 ${CAPTURE_COLORS[entry.captureMethod]}`}>
            <CaptureIcon className="w-3 h-3" /> {entry.captureMethod}
          </span>
        </div>
      </div>
      {/* Big tap-target buttons */}
      <div className="grid grid-cols-4 gap-1.5">
        {(['present', 'half_day', 'overtime', 'absent'] as AttendanceStatus[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const isActive = entry.status === s;
          return (
            <button
              key={s}
              onClick={() => onMark(entry.id, s)}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all select-none ${isActive ? `${cfg.bg} text-white shadow-md scale-105` : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              {cfg.label === 'OT' ? 'OT' : cfg.label === 'H' ? 'Half' : cfg.label}
            </button>
          );
        })}
      </div>
      {entry.hoursWorked !== undefined && entry.status !== 'absent' && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>{entry.inTime} – {entry.outTime}</span>
          <span>{entry.hoursWorked}h worked{entry.overtimeHours ? ` · ${entry.overtimeHours}h OT` : ''}</span>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
type Tab = 'list' | 'attendance' | 'summary';

export const LabourPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('attendance');
  const [search, setSearch] = useState('');
  const [tradeFilter, setTradeFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('2026-09-22');
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>(() => {
    const map: Record<string, AttendanceStatus> = {};
    attendanceSeed.forEach((a) => { if (!map[a.id]) map[a.id] = a.status; });
    return map;
  });

  const trades = useMemo(() => Array.from(new Set(labourSeed.map((l) => l.trade))).sort(), []);

  const filteredLabour = useMemo(() => labourSeed.filter((l) => {
    const q = search.toLowerCase();
    return (
      (l.name.toLowerCase().includes(q) || l.trade.toLowerCase().includes(q) || l.idNumber.includes(q)) &&
      (tradeFilter === 'all' || l.trade === tradeFilter)
    );
  }), [search, tradeFilter]);

  const todayEntries = useMemo(() =>
    attendanceSeed.filter((a) => a.date === selectedDate).slice(0, 20),
    [selectedDate]
  );

  const handleMark = (entryId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({ ...prev, [entryId]: status }));
  };

  // Stats
  const presentToday = todayEntries.filter((e) => ['present', 'overtime'].includes(attendanceState[e.id] || e.status)).length;
  const absentToday = todayEntries.filter((e) => attendanceState[e.id] === 'absent' || (!attendanceState[e.id] && e.status === 'absent')).length;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-6">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Labour Master & Attendance</h1>
        <p className="text-sm text-slate-500 mt-1">{labourSeed.filter((l) => l.status === 'active').length} active workers · Mobile-first attendance marking</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-5 w-fit">
        {([['attendance', 'Mark Attendance'], ['list', 'Labour Master'], ['summary', 'Monthly Summary']] as [Tab, string][]).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── ATTENDANCE TAB ── */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* Date + Stats */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
              <div className="flex gap-2 text-xs font-medium">
                <span className="px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">✓ {presentToday} Present</span>
                <span className="px-2.5 py-1.5 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400">✗ {absentToday} Absent</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {(['Mobile', 'QR', 'Biometric', 'GPS Geofence', 'Manual'] as AttendanceCaptureMethod[]).map((m) => {
                const Icon = CAPTURE_ICONS[m];
                return (
                  <span key={m} className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium ${CAPTURE_COLORS[m]}`}>
                    <Icon className="w-3 h-3" /> {m}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {todayEntries.map((entry) => (
              <AttendanceTapCard
                key={entry.id}
                entry={{ ...entry, status: attendanceState[entry.id] || entry.status }}
                onMark={handleMark}
              />
            ))}
          </div>
          <p className="text-xs text-slate-400 text-center">Tap P / Half / OT / A to mark attendance · Changes saved in session</p>
        </div>
      )}

      {/* ── LABOUR LIST TAB ── */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, trade, ID..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>
            <select value={tradeFilter} onChange={(e) => setTradeFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-amber-500 outline-none">
              <option value="all">All Trades</option>
              {trades.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60">
                  <tr>
                    {['Name', 'Trade', 'Skill', 'Project', 'Daily Wage', 'OT Rate', 'Contractor', 'PF', 'ESI', 'Status'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredLabour.map((l) => (
                    <tr key={l.id} className="hover:bg-amber-50/50 dark:hover:bg-amber-950/10 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{l.name}</p>
                          <p className="text-xs font-mono text-slate-400">{l.idNumber.slice(0, 9)}…</p>
                        </div>
                      </td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TRADE_COLORS[l.trade] || ''}`}>{l.trade}</span></td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">{l.skillGrade}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{l.projectName}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">₹ {l.dailyWage}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">₹ {l.overtimeRate}/hr</td>
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{l.subcontractorName || 'Direct'}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${l.pfEnrolled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{l.pfEnrolled ? 'Yes' : 'No'}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${l.esiEnrolled ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{l.esiEnrolled ? 'Yes' : 'No'}</span></td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── MONTHLY SUMMARY TAB ── */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Monthly Attendance Summary — September 2026</h2>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60">
                  <tr>
                    {['Worker', 'Trade', 'Present', 'Absent', 'Half-Day', 'OT Hours', 'Gross Wage', 'PF (−)', 'ESI (−)', 'Net Payable'].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {monthlySummarySeed.map((s) => (
                    <tr key={s.labourId} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">{s.labourName}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TRADE_COLORS[s.labourTrade] || ''}`}>{s.labourTrade}</span></td>
                      <td className="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">{s.presentDays}</td>
                      <td className="px-4 py-3 text-center font-semibold text-rose-600 dark:text-rose-400">{s.absentDays}</td>
                      <td className="px-4 py-3 text-center text-amber-600 dark:text-amber-400">{s.halfDays}</td>
                      <td className="px-4 py-3 text-center text-blue-600 dark:text-blue-400 font-medium">{s.totalOTHours}h</td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">₹ {s.grossWage.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-rose-600 dark:text-rose-400 whitespace-nowrap">₹ {s.pfDeduction.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-rose-600 dark:text-rose-400 whitespace-nowrap">₹ {s.esiDeduction.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">₹ {s.netPayable.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-800/60">
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-sm font-bold text-slate-700 dark:text-slate-300">Total Payroll Outflow</td>
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">₹ {monthlySummarySeed.reduce((s, r) => s + r.grossWage, 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-bold text-rose-600">₹ {monthlySummarySeed.reduce((s, r) => s + r.pfDeduction, 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-bold text-rose-600">₹ {monthlySummarySeed.reduce((s, r) => s + r.esiDeduction, 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-bold text-emerald-700 dark:text-emerald-300">₹ {monthlySummarySeed.reduce((s, r) => s + r.netPayable, 0).toLocaleString('en-IN')}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
