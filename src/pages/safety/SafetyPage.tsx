import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  SafetyIncident,
  IncidentSeverity,
  IncidentStage,
} from '../../types';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HardHat,
  Users,
  Search,
  Plus,
  Filter,
  FileCheck,
  Building2,
  Calendar,
  X,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  Zap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';

const INCIDENT_STAGES: { key: IncidentStage; label: string }[] = [
  { key: 'incident', label: '1. Incident' },
  { key: 'report', label: '2. Report' },
  { key: 'investigation', label: '3. Investigation' },
  { key: 'root_cause', label: '4. Root Cause' },
  { key: 'corrective_action', label: '5. Corrective Action' },
  { key: 'closed', label: '6. Closed' },
];

export const SafetyPage: React.FC = () => {
  const {
    safetyIncidents,
    ppeChecks,
    safetyInspections,
    nearMissLogs,
    toolboxMeetings,
    safetyTrainings,
    siteAudits,
    createSafetyIncident,
    updateIncidentStage,
    addNearMissLog,
    addToolboxMeeting,
    projects,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'incidents' | 'ppe' | 'inspections' | 'near_miss' | 'toolbox' | 'audits'
  >('dashboard');

  const [selectedIncident, setSelectedIncident] = useState<SafetyIncident | null>(safetyIncidents[0] || null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // New Incident Form
  const [formTitle, setFormTitle] = useState('');
  const [formProjectId, setFormProjectId] = useState('PRJ-001');
  const [formSeverity, setFormSeverity] = useState<IncidentSeverity>('minor');
  const [formLocation, setFormLocation] = useState('Tower C 37th Floor');
  const [formDescription, setFormDescription] = useState('');
  const [formInjuredPerson, setFormInjuredPerson] = useState('');

  // Safety Score Trend Data (last 6 months)
  const scoreTrendData = [
    { month: 'Apr', score: 91, incidents: 1 },
    { month: 'May', score: 93, incidents: 0 },
    { month: 'Jun', score: 92, incidents: 1 },
    { month: 'Jul', score: 95, incidents: 0 },
    { month: 'Aug', score: 96, incidents: 0 },
    { month: 'Sep', score: 97, incidents: 0 },
  ];

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === formProjectId);
    const created = createSafetyIncident({
      projectId: formProjectId,
      projectName: proj?.name || 'Site Superstructure',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      title: formTitle,
      severity: formSeverity,
      location: formLocation,
      reportedBy: 'Amit Patel (Site Engineer)',
      injuredPerson: formInjuredPerson || undefined,
      stage: 'incident',
      description: formDescription,
    });
    setSelectedIncident(created);
    setIsReportModalOpen(false);
    setFormTitle('');
    setFormDescription('');
  };

  const getStageIndex = (stage: IncidentStage) => {
    return INCIDENT_STAGES.findIndex((s) => s.key === stage);
  };

  const handleAdvanceStage = (inc: SafetyIncident) => {
    const curIdx = getStageIndex(inc.stage);
    if (curIdx < INCIDENT_STAGES.length - 1) {
      const nextStage = INCIDENT_STAGES[curIdx + 1].key;
      updateIncidentStage(inc.id, nextStage);
      setSelectedIncident((prev) => (prev?.id === inc.id ? { ...prev, stage: nextStage } : prev));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Hero Counter */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Safety Management & HSE Operations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300">
              ISO 45001 Certified
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Zero-Harm culture tracking: incidents workflow, PPE inspections, near-miss logging, and toolbox talks.
          </p>
        </div>

        {/* HERO STAT: Days Since Last Lost-Time Incident */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-700 text-white shadow-lg self-start lg:self-auto">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7 text-white" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider block">
              Safe Work Milestone
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black tracking-tight">248</span>
              <span className="text-sm font-bold text-emerald-100">Days Since Last LTI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 overflow-x-auto scrollbar-none shadow-xs">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'dashboard', label: 'Safety Dashboard', icon: Activity },
            { id: 'incidents', label: 'Incident Tracker & Stepper', icon: ShieldAlert, badge: safetyIncidents.filter((i) => i.stage !== 'closed').length },
            { id: 'ppe', label: 'PPE Compliance Checklists', icon: HardHat },
            { id: 'inspections', label: 'Site Safety Inspections', icon: FileCheck },
            { id: 'near_miss', label: 'Near-Miss Logs', icon: AlertTriangle, badge: nearMissLogs.filter((n) => n.status === 'open').length },
            { id: 'toolbox', label: 'Toolbox Talks (TBM)', icon: Users },
            { id: 'audits', label: 'Training & Audits', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. SAFETY DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Incidents This Month</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">0</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Zero recordable injuries in September</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PPE Compliance Index</p>
              <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">97.4%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Across 300+ field workers audited daily</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Toolbox Meetings (MTD)</p>
              <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1 font-mono">22</p>
              <p className="text-[11px] text-slate-500 mt-0.5">100% morning shifts initiated with TBM</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Open Action Items</p>
              <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">2</p>
              <p className="text-[11px] text-amber-600 font-medium mt-0.5">Under investigation / corrective action</p>
            </div>
          </div>

          {/* Score Trend Chart */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Safety Performance Index Trend (Last 6 Months)
            </h3>
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scoreTrendData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'HSE Score']}
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. INCIDENT REPORTING WITH 6-STAGE WORKFLOW STEPPER */}
      {activeTab === 'incidents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Incident / Accident Reporting & Remediation Stepper
              </h2>
              <p className="text-xs text-slate-500">
                Workflow: Incident → Report → Investigation → Root Cause → Corrective Action → Closed
              </p>
            </div>

            <button
              onClick={() => setIsReportModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ Report Incident / Accident</span>
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Incidents List */}
            <div className="xl:col-span-5 space-y-3">
              {safetyIncidents.map((inc) => {
                const isSelected = selectedIncident?.id === inc.id;
                const stageIdx = getStageIndex(inc.stage);
                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-500 shadow-md ring-1 ring-amber-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
                        {inc.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          inc.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-400'
                            : inc.severity === 'major'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2 line-clamp-1">
                      {inc.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{inc.location}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-mono text-[11px]">{inc.date}</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        Stage: {INCIDENT_STAGES[stageIdx]?.label || inc.stage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Incident Stepper Detail View */}
            <div className="xl:col-span-7">
              {selectedIncident ? (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
                  {/* Stepper Strip */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Incident Progression Stepper
                      </h3>
                      {getStageIndex(selectedIncident.stage) < INCIDENT_STAGES.length - 1 && (
                        <button
                          onClick={() => handleAdvanceStage(selectedIncident)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                        >
                          <span>Advance to Next Stage</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="overflow-x-auto pb-2">
                      <div className="flex items-center min-w-max">
                        {INCIDENT_STAGES.map((st, i) => {
                          const cur = getStageIndex(selectedIncident.stage);
                          const isDone = i < cur;
                          const isCurrent = i === cur;
                          return (
                            <div key={st.key} className="flex items-center">
                              <div className="flex flex-col items-center">
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isDone
                                      ? 'bg-emerald-600 text-white'
                                      : isCurrent
                                      ? 'bg-amber-600 text-white ring-4 ring-amber-100 dark:ring-amber-950'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                                </div>
                                <span
                                  className={`text-[10px] mt-1 font-bold ${
                                    isCurrent ? 'text-amber-600' : isDone ? 'text-emerald-600' : 'text-slate-400'
                                  }`}
                                >
                                  {st.label}
                                </span>
                              </div>
                              {i < INCIDENT_STAGES.length - 1 && (
                                <div
                                  className={`w-8 sm:w-12 h-0.5 mx-1 -mt-4 ${
                                    i < cur ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Incident Particulars */}
                  <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                        {selectedIncident.code}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {selectedIncident.title}
                      </h3>
                      <p className="text-slate-500 mt-0.5">
                        Project: <strong>{selectedIncident.projectName}</strong> • Location: <strong>{selectedIncident.location}</strong>
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                      <p className="text-slate-400 uppercase font-bold text-[10px]">Description</p>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">{selectedIncident.description}</p>
                    </div>

                    {selectedIncident.investigationDetails && (
                      <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-1">
                        <p className="text-blue-700 dark:text-blue-400 uppercase font-bold text-[10px]">Investigation Findings</p>
                        <p className="text-slate-800 dark:text-slate-200">{selectedIncident.investigationDetails}</p>
                      </div>
                    )}

                    {selectedIncident.rootCause && (
                      <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-1">
                        <p className="text-amber-700 dark:text-amber-400 uppercase font-bold text-[10px]">Root Cause</p>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{selectedIncident.rootCause}</p>
                      </div>
                    )}

                    {selectedIncident.correctiveAction && (
                      <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1">
                        <p className="text-emerald-700 dark:text-emerald-400 uppercase font-bold text-[10px]">Corrective Action Mandated</p>
                        <p className="text-slate-800 dark:text-slate-200 font-medium">{selectedIncident.correctiveAction}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 3. PPE COMPLIANCE CHECKLISTS */}
      {activeTab === 'ppe' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Daily PPE Compliance Checklists
              </h2>
              <p className="text-xs text-slate-500">
                Random shift audits of site labour personal protective equipment adherence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ppeChecks.map((rec) => (
              <div
                key={rec.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{rec.projectName}</h4>
                    <p className="text-xs text-slate-500">
                      Shift: {rec.shift} • Inspector: {rec.inspector} • {rec.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600 font-mono">
                      {rec.compliancePercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Compliance</span>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                  {rec.items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        {it.compliant ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                        )}
                        <span className="text-slate-800 dark:text-slate-200 font-medium">{it.name}</span>
                      </div>
                      <span className="font-mono text-slate-500 font-bold">{it.workersCount} Workers</span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg">
                  {rec.remarks}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SAFETY INSPECTION RECORDS */}
      {activeTab === 'inspections' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Critical Site Safety Inspection Records
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {safetyInspections.map((insp) => (
              <div
                key={insp.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    {insp.inspectionNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      insp.status === 'compliant'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Score: {insp.score}%
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase">
                  {insp.type.replace('_', ' ')} Inspection
                </h4>
                <p className="text-xs text-slate-500">
                  {insp.projectName} • Inspector: {insp.inspector}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {insp.items.map((it, idx) => (
                    <div key={idx} className="flex items-start gap-2 py-0.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span className="text-slate-700 dark:text-slate-300 text-[11px] leading-tight">
                        {it.check}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. NEAR-MISS LOGS */}
      {activeTab === 'near_miss' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Proactive Near-Miss & Hazard Observation Log
              </h2>
              <p className="text-xs text-slate-500">
                Worker-driven hazard reporting enabling preventive engineering fixes prior to injury.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-left">Code & Date</th>
                  <th className="py-3 px-4 text-left">Project & Reporter</th>
                  <th className="py-3 px-4 text-left">Hazard Description</th>
                  <th className="py-3 px-4 text-left">Potential Risk</th>
                  <th className="py-3 px-4 text-left">Preventive Engineering Fix</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {nearMissLogs.map((nm) => (
                  <tr key={nm.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {nm.code}
                      <span className="block text-[11px] text-slate-400 font-normal">{nm.date}</span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{nm.projectName}</p>
                      <p className="text-[11px] text-slate-400">By: {nm.reportedBy}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 max-w-xs">{nm.description}</td>
                    <td className="py-3 px-4 text-rose-600 font-medium max-w-xs">{nm.potentialHazard}</td>
                    <td className="py-3 px-4 text-emerald-700 dark:text-emerald-400 font-medium max-w-xs">
                      {nm.preventiveAction}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 font-bold text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Mitigated
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. TOOLBOX MEETINGS (TBM) */}
      {activeTab === 'toolbox' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Daily Morning Toolbox Meetings (TBM) Log
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolboxMeetings.map((tbm) => (
              <div
                key={tbm.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-700 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded">
                    {tbm.code}
                  </span>
                  <span className="font-mono text-slate-400">{tbm.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{tbm.topic}</h4>
                <p className="text-slate-500">Conducted By: <strong>{tbm.conductedBy}</strong></p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-indigo-600">Attendees: {tbm.attendeeCount} Workers</span>
                  <div className="flex gap-1">
                    {tbm.tradesInvolved.map((tr, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] rounded">
                        {tr}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. TRAINING & AUDITS */}
      {activeTab === 'audits' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              External Third-Party Site HSE Audits
            </h3>
            {siteAudits.map((aud) => (
              <div key={aud.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{aud.agency}</h4>
                  <span className="font-mono font-black text-emerald-600 text-base">Score: {aud.score}%</span>
                </div>
                <p className="text-slate-500">Lead Auditor: {aud.auditorName} • Date: {aud.date}</p>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                  {aud.keyFindings.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REPORT INCIDENT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Log Safety Incident / Accident
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportIncident} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Incident Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of incident..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Project
                  </label>
                  <select
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.code}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Severity
                  </label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="minor">Minor (First Aid)</option>
                    <option value="major">Major (Medical)</option>
                    <option value="critical">Critical (LTI)</option>
                    <option value="near_miss">Near-Miss Hazard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Exact Location on Site
                </label>
                <input
                  type="text"
                  required
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Injured Person (if any)
                </label>
                <input
                  type="text"
                  placeholder="Name and trade of worker..."
                  value={formInjuredPerson}
                  onChange={(e) => setFormInjuredPerson(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description of Sequence of Events
                </label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Submit Incident Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
