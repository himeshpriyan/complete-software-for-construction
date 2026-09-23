import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  QAQCInspection,
  NonConformanceReport,
  NCRStage,
  InspectionType,
} from '../../types';
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Plus,
  Filter,
  Layers,
  FileCheck,
  Building2,
  Calendar,
  X,
  ChevronRight,
  ShieldCheck,
  Camera,
  UserCheck,
  AlertOctagon,
  ArrowRight,
  Award,
  ExternalLink,
} from 'lucide-react';

const NCR_STAGES: { key: NCRStage; label: string }[] = [
  { key: 'issue', label: '1. Issue' },
  { key: 'reason', label: '2. Reason' },
  { key: 'responsible_person', label: '3. Responsible' },
  { key: 'corrective_action', label: '4. Corrective Action' },
  { key: 'verification', label: '5. Verification' },
  { key: 'closed', label: '6. Closed' },
];

const INSPECTION_TYPES: { key: InspectionType | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All Disciplines' },
  { key: 'Concrete', label: 'Concrete' },
  { key: 'Steel', label: 'Steel' },
  { key: 'Material', label: 'Material' },
  { key: 'Welding', label: 'Welding' },
  { key: 'Waterproofing', label: 'Waterproofing' },
  { key: 'Flooring', label: 'Flooring' },
  { key: 'Work', label: 'Workmanship' },
];

export const QualityPage: React.FC = () => {
  const {
    qaqcInspections,
    ncrs,
    projects,
    createQAQCInspection,
    createNCR,
    updateNCRStage,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'inspections' | 'ncr' | 'dashboard'>('inspections');
  const [selectedType, setSelectedType] = useState<InspectionType | 'ALL'>('ALL');
  const [ncrFilter, setNcrFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');

  // Modal states
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showNCRModal, setShowNCRModal] = useState(false);
  const [selectedNCR, setSelectedNCR] = useState<NonConformanceReport | null>(null);
  const [selectedInspection, setSelectedInspection] = useState<QAQCInspection | null>(null);

  // New Inspection Form State
  const [newInsp, setNewInsp] = useState<{
    projectId: string;
    inspectionType: InspectionType;
    location: string;
    inspector: string;
    contractorRep: string;
    status: 'pass' | 'fail' | 'conditional';
    remarks: string;
  }>({
    projectId: projects[0]?.id || 'PRJ-001',
    inspectionType: 'Concrete',
    location: '',
    inspector: 'Er. Rajesh Iyer (Lead QA/QC)',
    contractorRep: 'Mr. Arvind Sharma (Site Rep)',
    status: 'pass',
    remarks: '',
  });

  // New NCR Form State
  const [newNCR, setNewNCR] = useState<{
    projectId: string;
    trade: string;
    location: string;
    severity: 'critical' | 'major' | 'minor';
    issueDescription: string;
    responsiblePerson: string;
    reasonAnalysis: string;
    correctiveActionPlan: string;
  }>({
    projectId: projects[0]?.id || 'PRJ-001',
    trade: 'Concrete Works',
    location: '',
    severity: 'major',
    issueDescription: '',
    responsiblePerson: 'Er. Sandeep Patil (Site Incharge)',
    reasonAnalysis: '',
    correctiveActionPlan: '',
  });

  // Filtered QA/QC Inspections
  const filteredInspections = useMemo(() => {
    return qaqcInspections.filter((insp) => {
      const matchType = selectedType === 'ALL' || insp.inspectionType === selectedType;
      const matchProject = selectedProjectId === 'ALL' || insp.projectId === selectedProjectId;
      const matchSearch =
        (insp.reportNumber || insp.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
        insp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insp.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insp.inspector.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchProject && matchSearch;
    });
  }, [qaqcInspections, selectedType, selectedProjectId, searchQuery]);

  // Filtered NCRs
  const filteredNCRs = useMemo(() => {
    return ncrs.filter((ncr) => {
      const matchStatus = ncrFilter === 'all' || ncr.status === ncrFilter;
      const matchProject = selectedProjectId === 'ALL' || ncr.projectId === selectedProjectId;
      const matchSearch =
        ncr.ncrNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ncr.issueDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ncr.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ncr.trade.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchProject && matchSearch;
    });
  }, [ncrs, ncrFilter, selectedProjectId, searchQuery]);

  // Stats
  const totalInspections = qaqcInspections.length;
  const passedInspections = qaqcInspections.filter((i) => i.status === 'pass').length;
  const failedInspections = qaqcInspections.filter((i) => i.status === 'fail').length;
  const passRate = totalInspections > 0 ? Math.round((passedInspections / totalInspections) * 100) : 100;
  const openNCRs = ncrs.filter((n) => n.status === 'open').length;
  const closedNCRs = ncrs.filter((n) => n.status === 'closed').length;

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newInsp.projectId);
    createQAQCInspection({
      projectId: newInsp.projectId,
      projectName: proj?.name || 'Project Site',
      date: new Date().toISOString().split('T')[0],
      inspectionType: newInsp.inspectionType,
      location: newInsp.location || 'General Site Area',
      inspector: newInsp.inspector,
      contractorRep: newInsp.contractorRep,
      status: newInsp.status,
      checkPoints: [
        {
          parameter: `${newInsp.inspectionType} Specification Tolerance & Alignment`,
          specified: 'IS 456 / MoRTH Standards compliance',
          observed: 'Standard site test protocol applied',
          pass: newInsp.status !== 'fail',
        },
      ],
      photoEvidence: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
      ],
      remarks: newInsp.remarks || 'Inspection completed and verified against QA manual.',
    });
    setShowInspectionModal(false);
  };

  const handleCreateNCR = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newNCR.projectId);
    createNCR({
      projectId: newNCR.projectId,
      projectName: proj?.name || 'Active Project',
      issueDate: new Date().toISOString().split('T')[0],
      location: newNCR.location || 'Main Structure Floor 1',
      trade: newNCR.trade,
      severity: newNCR.severity,
      issueDescription: newNCR.issueDescription,
      responsiblePerson: newNCR.responsiblePerson,
      stage: 'issue',
      reasonAnalysis: newNCR.reasonAnalysis,
      correctiveActionPlan: newNCR.correctiveActionPlan,
      status: 'open',
      photoBefore: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
    });
    setShowNCRModal(false);
  };

  const advanceNCRStage = (ncr: NonConformanceReport) => {
    const currentIndex = NCR_STAGES.findIndex((s) => s.key === ncr.stage);
    if (currentIndex < NCR_STAGES.length - 1) {
      const nextStage = NCR_STAGES[currentIndex + 1].key;
      updateNCRStage(ncr.id, nextStage, {
        ...(nextStage === 'verification'
          ? {
              verifiedBy: 'Er. Rajesh Iyer (QA/QC Head)',
              verifiedDate: new Date().toISOString().split('T')[0],
              photoAfter:
                'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
            }
          : {}),
      });
      if (selectedNCR && selectedNCR.id === ncr.id) {
        setSelectedNCR({ ...selectedNCR, stage: nextStage, status: nextStage === 'closed' ? 'closed' : 'open' });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-indigo-600" />
            Quality Management (QA/QC)
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Material and structural inspection checklists, photographic evidence, and 6-stage NCR lifecycle tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInspectionModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Record Inspection
          </button>
          <button
            onClick={() => setShowNCRModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
          >
            <AlertOctagon className="w-4 h-4" />
            Raise NCR
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total QA Inspections
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 dark:text-white">
              {totalInspections}
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              {passRate}% Pass Rate
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Across 8 structural disciplines</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Passed Checks
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {passedInspections}
            </span>
            <span className="text-xs text-slate-400">of {totalInspections} checked</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">100% photo-verified on site</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Open NCRs
            </span>
            <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rose-600 dark:text-rose-400">
              {openNCRs}
            </span>
            <span className="text-xs font-semibold text-rose-500">Requires rectification</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{closedNCRs} NCRs cleared & closed</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Failed / Conditional
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {failedInspections}
            </span>
            <span className="text-xs text-slate-400">under re-inspection</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Rectification notices served</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex gap-6">
        <button
          onClick={() => setActiveTab('inspections')}
          className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'inspections'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          QA/QC Inspections ({qaqcInspections.length})
        </button>
        <button
          onClick={() => setActiveTab('ncr')}
          className={`pb-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'ncr'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          NCR Register ({ncrs.length})
          {openNCRs > 0 && (
            <span className="px-2 py-0.5 text-xs bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 rounded-full font-bold">
              {openNCRs} Open
            </span>
          )}
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'inspections' ? 'Search inspections, inspector, location...' : 'Search NCRs, trade, responsible...'}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {activeTab === 'inspections' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {INSPECTION_TYPES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setSelectedType(t.key)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition whitespace-nowrap ${
                    selectedType === t.key
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {activeTab === 'ncr' && (
            <div className="flex items-center gap-1.5">
              {(['all', 'open', 'closed'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setNcrFilter(st)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border uppercase tracking-wider transition ${
                    ncrFilter === st
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {st} NCRs
                </button>
              ))}
            </div>
          )}

          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: QA/QC INSPECTIONS */}
      {activeTab === 'inspections' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredInspections.map((insp) => (
            <div
              key={insp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition space-y-4"
            >
              {/* Top Meta */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {insp.reportNumber || insp.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {insp.inspectionType}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {insp.location}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{insp.projectName}</span>
                    <span>•</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{insp.date}</span>
                  </div>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                    insp.status === 'pass'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : insp.status === 'fail'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                  }`}
                >
                  {insp.status === 'pass' ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5" />
                  )}
                  {insp.status}
                </span>
              </div>

              {/* Checkpoints table */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-3 border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Verified Inspection Checkpoints ({insp.checkPoints.length})
                </div>
                {insp.checkPoints.map((cp, cpIdx) => (
                  <div
                    key={cpIdx}
                    className="flex items-start justify-between gap-3 py-1 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0"
                  >
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {cp.parameter}
                      </span>
                      <span className="text-slate-500 block text-[11px]">{cp.specified} · Observed: {cp.observed}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                        cp.pass
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                      }`}
                    >
                      {cp.pass ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Remarks */}
              <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                "{insp.remarks}"
              </p>

              {/* Photos & Signatures */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-indigo-500" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {insp.photoEvidence.length} Photographic Proof Attached
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">Inspector Sign-off</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {insp.inspector}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: NCR (NON-CONFORMANCE REPORT) LIFECYCLE STEPPER */}
      {activeTab === 'ncr' && (
        <div className="space-y-6">
          {filteredNCRs.map((ncr) => {
            const currentStageIndex = NCR_STAGES.findIndex((s) => s.key === ncr.stage);

            return (
              <div
                key={ncr.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-6"
              >
                {/* Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
                        {ncr.ncrNumber}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          ncr.severity === 'critical'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                            : ncr.severity === 'major'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800'
                        }`}
                      >
                        {ncr.severity} Severity
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {ncr.trade}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                      {ncr.issueDescription}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span>{ncr.projectName}</span>
                      <span>•</span>
                      <span>Location: {ncr.location}</span>
                      <span>•</span>
                      <span>Issued: {ncr.issueDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        ncr.status === 'closed'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      {ncr.status === 'closed' ? 'Closed & Verified' : 'Action In Progress'}
                    </span>
                    {ncr.status === 'open' && (
                      <button
                        onClick={() => advanceNCRStage(ncr)}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition flex items-center gap-1"
                      >
                        Advance Workflow
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 6-Stage Visual Stepper */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Non-Conformance Remediation Lifecycle (6 Steps)
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {NCR_STAGES.map((st, i) => {
                      const isCompleted = i < currentStageIndex || ncr.status === 'closed';
                      const isCurrent = i === currentStageIndex && ncr.status === 'open';

                      return (
                        <div
                          key={st.key}
                          className={`p-3 rounded-lg border text-center transition ${
                            isCompleted
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                              : isCurrent
                              ? 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 font-bold shadow-sm'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60'
                          }`}
                        >
                          <div className="text-xs font-semibold flex items-center justify-center gap-1.5">
                            {isCompleted ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : isCurrent ? (
                              <Clock className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                            ) : null}
                            <span>{st.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed Root Cause & Corrective Action */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Reason / Root Cause Analysis
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {ncr.reasonAnalysis || 'Root cause investigation under progress by site engineer.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Corrective Action Plan
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      {ncr.correctiveActionPlan || 'Method statement submitted for client engineer approval.'}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                      Responsible Person & QA Sign-off
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">
                      Responsible: {ncr.responsiblePerson}
                    </p>
                    {ncr.verifiedBy && (
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                        Verified by {ncr.verifiedBy} ({ncr.verifiedDate})
                      </p>
                    )}
                  </div>
                </div>

                {/* Before / After Photo Evidence Mock */}
                {(ncr.photoBefore || ncr.photoAfter) && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-xs">
                    <span className="font-bold text-slate-500">Photographic Evidence:</span>
                    {ncr.photoBefore && (
                      <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 font-mono text-[11px] border border-rose-200">
                        Defect Capture: [Photo Before]
                      </span>
                    )}
                    {ncr.photoAfter && (
                      <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-mono text-[11px] border border-emerald-200">
                        Rectified Result: [Photo After]
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Record Inspection Modal */}
      {showInspectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                Record QA/QC Inspection
              </h3>
              <button
                onClick={() => setShowInspectionModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project
                </label>
                <select
                  value={newInsp.projectId}
                  onChange={(e) => setNewInsp({ ...newInsp, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Inspection Discipline
                  </label>
                  <select
                    value={newInsp.inspectionType}
                    onChange={(e) =>
                      setNewInsp({ ...newInsp, inspectionType: e.target.value as InspectionType })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Concrete">Concrete</option>
                    <option value="Steel">Steel</option>
                    <option value="Material">Material</option>
                    <option value="Welding">Welding</option>
                    <option value="Waterproofing">Waterproofing</option>
                    <option value="Flooring">Flooring</option>
                    <option value="Work">Workmanship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Inspection Verdict
                  </label>
                  <select
                    value={newInsp.status}
                    onChange={(e) =>
                      setNewInsp({ ...newInsp, status: e.target.value as 'pass' | 'fail' | 'conditional' })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    <option value="pass">Pass (Conforms to IS code)</option>
                    <option value="conditional">Conditional (Minor snags)</option>
                    <option value="fail">Fail (Requires NCR)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Member Reference
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower C, 38th Floor Beam B-12 to B-16"
                  value={newInsp.location}
                  onChange={(e) => setNewInsp({ ...newInsp, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Inspector (QA/QC)
                  </label>
                  <input
                    type="text"
                    value={newInsp.inspector}
                    onChange={(e) => setNewInsp({ ...newInsp, inspector: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contractor Representative
                  </label>
                  <input
                    type="text"
                    value={newInsp.contractorRep}
                    onChange={(e) => setNewInsp({ ...newInsp, contractorRep: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Remarks & Observations
                </label>
                <textarea
                  rows={3}
                  placeholder="Dimensional verification, slump test, rebound hammer readings..."
                  value={newInsp.remarks}
                  onChange={(e) => setNewInsp({ ...newInsp, remarks: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInspectionModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                >
                  Save Inspection Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Raise NCR Modal */}
      {showNCRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                Raise Non-Conformance Report (NCR)
              </h3>
              <button onClick={() => setShowNCRModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNCR} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project
                </label>
                <select
                  value={newNCR.projectId}
                  onChange={(e) => setNewNCR({ ...newNCR, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Trade / Scope
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Concrete / Shuttering / Waterproofing"
                    value={newNCR.trade}
                    onChange={(e) => setNewNCR({ ...newNCR, trade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Severity
                  </label>
                  <select
                    value={newNCR.severity}
                    onChange={(e) =>
                      setNewNCR({ ...newNCR, severity: e.target.value as 'critical' | 'major' | 'minor' })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    <option value="minor">Minor (Tolerable cosmetic defect)</option>
                    <option value="major">Major (Structural or design deviation)</option>
                    <option value="critical">Critical (Immediate work stoppage)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / Grid Reference
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pier P-112 footing or Floor 12 Shear Wall SW-4"
                  value={newNCR.location}
                  onChange={(e) => setNewNCR({ ...newNCR, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Description
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Detail the exact non-conformance observed on site..."
                  value={newNCR.issueDescription}
                  onChange={(e) => setNewNCR({ ...newNCR, issueDescription: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Responsible Engineer / Subcontractor
                </label>
                <input
                  type="text"
                  required
                  value={newNCR.responsiblePerson}
                  onChange={(e) => setNewNCR({ ...newNCR, responsiblePerson: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNCRModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold"
                >
                  Submit NCR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
