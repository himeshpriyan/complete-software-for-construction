import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  RepoDocument,
  DocumentRepoCategory,
  DrawingRegisterItem,
  DrawingDiscipline,
  DrawingVersion,
  SiteInstruction,
  MeetingRecord,
  MeetingType,
  MeetingMinuteItem,
  LegalComplianceItem,
} from '../../types';
import {
  FolderOpen,
  FileText,
  Compass,
  AlertTriangle,
  Users,
  ShieldCheck,
  Search,
  Plus,
  Filter,
  Download,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  X,
  History,
  Tag,
  Paperclip,
  CheckSquare,
  AlertCircle,
  FileCheck,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

const DOC_CATEGORIES: (DocumentRepoCategory | 'ALL')[] = [
  'ALL',
  'Drawings',
  'Contracts',
  'PO',
  'Invoices',
  'Bills',
  'Certificates',
  'Test Reports',
  'Approvals',
  'Photos',
  'Agreements',
];

const DISCIPLINES: (DrawingDiscipline | 'ALL')[] = [
  'ALL',
  'Architectural',
  'Structural',
  'Electrical',
  'Plumbing',
  'HVAC',
  'Fire',
  'MEP',
];

export const DocumentsPage: React.FC = () => {
  const {
    repoDocuments,
    drawingRegister,
    siteInstructions,
    meetingRecords,
    legalComplianceItems,
    projects,
    addRepoDocument,
    addDrawingRevision,
    createSiteInstruction,
    updateSiteInstructionStatus,
    createMeetingRecord,
    updateMinuteStatus,
    updateComplianceItem,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<
    'vault' | 'drawings' | 'instructions' | 'mom' | 'compliance'
  >('vault');

  // Search & Project Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('ALL');

  // Tab-specific filters
  const [selectedCategory, setSelectedCategory] = useState<DocumentRepoCategory | 'ALL'>('ALL');
  const [selectedDiscipline, setSelectedDiscipline] = useState<DrawingDiscipline | 'ALL'>('ALL');
  const [selectedMeetingType, setSelectedMeetingType] = useState<MeetingType | 'ALL'>('ALL');
  const [instructionStatusFilter, setInstructionStatusFilter] = useState<string>('ALL');

  // Modals & Drawers
  const [showUploadDocModal, setShowUploadDocModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [selectedDrawingForRevision, setSelectedDrawingForRevision] = useState<DrawingRegisterItem | null>(null);
  const [showInstructionModal, setShowInstructionModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingRecord | null>(meetingRecords[0] || null);
  const [activeVersionHistoryDrawing, setActiveVersionHistoryDrawing] = useState<DrawingRegisterItem | null>(null);

  // Form states
  const [newDoc, setNewDoc] = useState<{
    title: string;
    category: DocumentRepoCategory;
    projectId: string;
    fileSize: string;
    fileType: string;
    tags: string;
  }>({
    title: '',
    category: 'Drawings',
    projectId: projects[0]?.id || 'PRJ-001',
    fileSize: '4.2 MB',
    fileType: 'PDF',
    tags: 'structural, final, approved',
  });

  const [newRev, setNewRev] = useState<{
    version: string;
    changesSummary: string;
    uploadedBy: string;
  }>({
    version: 'Rev C',
    changesSummary: '',
    uploadedBy: 'Ar. Rajesh Shah (Principal Architect)',
  });

  const [newInstruction, setNewInstruction] = useState<{
    projectId: string;
    responsiblePerson: string;
    text: string;
    priority: 'urgent' | 'high' | 'medium';
    dueDate: string;
  }>({
    projectId: projects[0]?.id || 'PRJ-001',
    responsiblePerson: '',
    text: '',
    priority: 'high',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
  });

  const [newMeeting, setNewMeeting] = useState<{
    title: string;
    type: MeetingType;
    projectId: string;
    location: string;
    chairPerson: string;
    attendees: string;
    firstDiscussion: string;
    firstDecision: string;
    firstAction: string;
    firstResponsible: string;
    firstDueDate: string;
  }>({
    title: '',
    type: 'Site',
    projectId: projects[0]?.id || 'PRJ-001',
    location: 'Project Site Office Conference Room',
    chairPerson: 'Er. Sandeep Patil (Project Manager)',
    attendees: 'Client Rep, Structural Consultant, MEP Lead, Lead QS',
    firstDiscussion: 'Review of week 38 concrete casting progress and MEP shaft clearance.',
    firstDecision: 'Approved shift to 24/7 dewatering schedule.',
    firstAction: 'Submit revised pour card sequence to consultant.',
    firstResponsible: 'Site In-Charge',
    firstDueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
  });

  // Filtered Documents
  const filteredDocs = useMemo(() => {
    return repoDocuments.filter((doc) => {
      const matchCat = selectedCategory === 'ALL' || doc.category === selectedCategory;
      const matchProj = selectedProjectId === 'ALL' || doc.projectId === selectedProjectId;
      const matchSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.docNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchProj && matchSearch;
    });
  }, [repoDocuments, selectedCategory, selectedProjectId, searchQuery]);

  // Filtered Drawings
  const filteredDrawings = useMemo(() => {
    return drawingRegister.filter((drg) => {
      const matchDisc = selectedDiscipline === 'ALL' || drg.discipline === selectedDiscipline;
      const matchProj = selectedProjectId === 'ALL' || drg.projectId === selectedProjectId;
      const matchSearch =
        drg.drawingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drg.currentRevision.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDisc && matchProj && matchSearch;
    });
  }, [drawingRegister, selectedDiscipline, selectedProjectId, searchQuery]);

  // Filtered Site Instructions
  const filteredInstructions = useMemo(() => {
    return siteInstructions.filter((si) => {
      const matchStatus = instructionStatusFilter === 'ALL' || si.status === instructionStatusFilter;
      const matchProj = selectedProjectId === 'ALL' || si.projectId === selectedProjectId;
      const matchSearch =
        si.instructionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        si.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        si.responsiblePerson.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchProj && matchSearch;
    });
  }, [siteInstructions, instructionStatusFilter, selectedProjectId, searchQuery]);

  // Filtered Meetings
  const filteredMeetings = useMemo(() => {
    return meetingRecords.filter((m) => {
      const matchType = selectedMeetingType === 'ALL' || m.type === selectedMeetingType;
      const matchProj = selectedProjectId === 'ALL' || m.projectId === selectedProjectId;
      const matchSearch =
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.meetingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.chairPerson.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchProj && matchSearch;
    });
  }, [meetingRecords, selectedMeetingType, selectedProjectId, searchQuery]);

  // Filtered Compliance Items
  const filteredCompliance = useMemo(() => {
    return legalComplianceItems.filter((c) => {
      const matchProj = selectedProjectId === 'ALL' || !c.projectId || c.projectId === selectedProjectId;
      const matchSearch =
        c.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.documentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.authority.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchProj && matchSearch;
    });
  }, [legalComplianceItems, selectedProjectId, searchQuery]);

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newDoc.projectId);
    addRepoDocument({
      title: newDoc.title,
      category: newDoc.category,
      projectId: newDoc.projectId,
      projectName: proj?.name || 'Project Site',
      uploadedBy: 'Current User (Engineer)',
      fileSize: newDoc.fileSize,
      fileType: newDoc.fileType,
      tags: newDoc.tags.split(',').map((t) => t.trim()),
    });
    setNewDoc({ ...newDoc, title: '' });
    setShowUploadDocModal(false);
  };

  const handleAddRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrawingForRevision) return;

    addDrawingRevision(selectedDrawingForRevision.id, {
      version: newRev.version,
      uploadedDate: new Date().toISOString().split('T')[0],
      uploadedBy: newRev.uploadedBy,
      changesSummary: newRev.changesSummary || 'Updated as per site structural coordination meeting.',
      status: 'approved',
      approvedDate: new Date().toISOString().split('T')[0],
      approvedBy: 'Er. Rajesh Iyer (Lead QA / QS)',
    });
    setShowRevisionModal(false);
  };

  const handleCreateInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newInstruction.projectId);
    createSiteInstruction({
      projectId: newInstruction.projectId,
      projectName: proj?.name || 'Project Site',
      date: new Date().toISOString().split('T')[0],
      issuedBy: 'Er. Sandeep Patil (Project Manager)',
      responsiblePerson: newInstruction.responsiblePerson,
      text: newInstruction.text,
      priority: newInstruction.priority,
      dueDate: newInstruction.dueDate,
      status: 'open',
    });
    setNewInstruction({ ...newInstruction, text: '', responsiblePerson: '' });
    setShowInstructionModal(false);
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === newMeeting.projectId);
    const item = createMeetingRecord({
      title: newMeeting.title,
      type: newMeeting.type,
      projectId: newMeeting.projectId,
      projectName: proj?.name || 'All Sites',
      date: new Date().toISOString().split('T')[0],
      time: '11:00 AM - 12:30 PM',
      location: newMeeting.location,
      chairPerson: newMeeting.chairPerson,
      attendees: newMeeting.attendees.split(',').map((a) => a.trim()),
      minutes: [
        {
          id: `MIN-${Date.now()}`,
          discussion: newMeeting.firstDiscussion,
          decision: newMeeting.firstDecision,
          action: newMeeting.firstAction,
          responsible: newMeeting.firstResponsible,
          dueDate: newMeeting.firstDueDate,
          status: 'open',
        },
      ],
    });
    setSelectedMeeting(item);
    setShowMeetingModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FolderOpen className="w-7 h-7 text-indigo-600" />
            Documents, Drawings & Site Governance
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Centralized document vault, multi-discipline drawing register with superseded version control, MOM & statutory compliance
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'vault' && (
            <button
              onClick={() => setShowUploadDocModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Upload Document
            </button>
          )}

          {activeTab === 'instructions' && (
            <button
              onClick={() => setShowInstructionModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Issue Site Instruction
            </button>
          )}

          {activeTab === 'mom' && (
            <button
              onClick={() => setShowMeetingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Meeting Minutes
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex flex-wrap gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('vault')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'vault'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Document Vault ({repoDocuments.length})
        </button>

        <button
          onClick={() => setActiveTab('drawings')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'drawings'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Compass className="w-4 h-4" />
          Drawing Register & Version Control ({drawingRegister.length})
        </button>

        <button
          onClick={() => setActiveTab('instructions')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'instructions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          Site Instructions ({siteInstructions.length})
        </button>

        <button
          onClick={() => setActiveTab('mom')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'mom'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4" />
          Minutes of Meeting (MOM) ({meetingRecords.length})
        </button>

        <button
          onClick={() => setActiveTab('compliance')}
          className={`pb-3 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'compliance'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Legal & Compliance ({legalComplianceItems.length})
        </button>
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search records, numbers, titles, tags..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Subcategory selectors based on active tab */}
          {activeTab === 'vault' && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as DocumentRepoCategory | 'ALL')}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              {DOC_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  Category: {c}
                </option>
              ))}
            </select>
          )}

          {activeTab === 'drawings' && (
            <select
              value={selectedDiscipline}
              onChange={(e) => setSelectedDiscipline(e.target.value as DrawingDiscipline | 'ALL')}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              {DISCIPLINES.map((d) => (
                <option key={d} value={d}>
                  Discipline: {d}
                </option>
              ))}
            </select>
          )}

          {activeTab === 'instructions' && (
            <select
              value={instructionStatusFilter}
              onChange={(e) => setInstructionStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="complied">Complied</option>
            </select>
          )}

          {activeTab === 'mom' && (
            <select
              value={selectedMeetingType}
              onChange={(e) => setSelectedMeetingType(e.target.value as MeetingType | 'ALL')}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="ALL">All Meeting Types</option>
              <option value="Client">Client Meetings</option>
              <option value="Site">Site Progress</option>
              <option value="Contractor">Contractor Coordination</option>
              <option value="Internal">Internal Technical</option>
            </select>
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

      {/* TAB 1: CENTRAL DOCUMENT VAULT */}
      {activeTab === 'vault' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold border-b border-slate-200 dark:border-slate-800 text-[11px]">
                <tr>
                  <th className="px-5 py-3.5">Doc # & Title</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Project</th>
                  <th className="px-4 py-3.5">Uploaded By</th>
                  <th className="px-4 py-3.5">Date & Size</th>
                  <th className="px-4 py-3.5">Tags</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span>{doc.title}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {doc.docNumber}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200 font-medium">
                      {doc.projectName}
                    </td>
                    <td className="px-4 py-3.5">{doc.uploadedBy}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-slate-800 dark:text-slate-200">{doc.uploadedDate}</div>
                      <div className="text-[11px] text-slate-400">
                        {doc.fileSize} • {doc.fileType}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {doc.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => alert(`Downloading ${doc.title} (${doc.fileSize})...`)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
                        title="Download / View"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DRAWING REGISTER & VERSION CONTROL UI */}
      {activeTab === 'drawings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredDrawings.map((drg) => (
              <div
                key={drg.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {drg.drawingNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {drg.discipline}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300">
                        Active: {drg.currentRevision} (Approved)
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                      {drg.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                      <span>{drg.projectName}</span>
                      <span>•</span>
                      <span>Approved: {drg.approvedDate || 'Pending'}</span>
                      <span>•</span>
                      <span>{drg.versions.length} Total Versions in History</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => {
                        setSelectedDrawingForRevision(drg);
                        setShowRevisionModal(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Upload Revision
                    </button>
                  </div>
                </div>

                {/* Clear Version Control UI (V1, V2, V3 – Approved) */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" />
                      Drawing Version History (Old versions visibly superseded & locked)
                    </span>
                    <span className="text-[10px] text-slate-400">Auditable Immutable Log</span>
                  </div>

                  <div className="space-y-2">
                    {drg.versions.map((v, vIdx) => {
                      const isCurrent = v.version === drg.currentRevision && v.status === 'approved';

                      return (
                        <div
                          key={vIdx}
                          className={`p-3 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                            isCurrent
                              ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                              : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 opacity-75'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg font-mono font-bold text-xs ${
                                isCurrent
                                  ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200'
                                  : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                              }`}
                            >
                              {v.version}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
                                <span>{v.changesSummary}</span>
                                {isCurrent ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white uppercase">
                                    Current Approved
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 uppercase">
                                    Superseded
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                Uploaded by {v.uploadedBy} on {v.uploadedDate}
                                {v.approvedBy && ` • Approved by ${v.approvedBy} (${v.approvedDate})`}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => alert(`Viewing drawing ${drg.drawingNumber} (${v.version})`)}
                              className="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 font-medium"
                            >
                              View PDF
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SITE INSTRUCTIONS */}
      {activeTab === 'instructions' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredInstructions.map((si) => (
            <div
              key={si.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3.5 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      {si.instructionNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        si.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400'
                          : si.priority === 'high'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400'
                      }`}
                    >
                      {si.priority}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>{si.projectName}</span>
                    <span>•</span>
                    <span>Issued: {si.date}</span>
                  </div>
                </div>

                <select
                  value={si.status}
                  onChange={(e) =>
                    updateSiteInstructionStatus(
                      si.id,
                      e.target.value as 'open' | 'in_progress' | 'complied' | 'cancelled'
                    )
                  }
                  className={`text-xs font-bold uppercase tracking-wider rounded-lg px-2.5 py-1 border focus:outline-none ${
                    si.status === 'complied'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : si.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="complied">Complied</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200">
                "{si.text}"
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400">Responsible:</span>{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {si.responsiblePerson}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Compliance Due:</span>{' '}
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {si.dueDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Issued by: {si.issuedBy}</span>
                <span className="flex items-center gap-1 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                  <Paperclip className="w-3.5 h-3.5" />
                  Proof Attached
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: MEETING MANAGEMENT / MINUTES OF MEETING (MOM) */}
      {activeTab === 'mom' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Meeting List Sidebar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Meetings & Minutes Register
            </h3>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredMeetings.map((m) => (
                <div
                  key={m.id}
                  onClick={() => setSelectedMeeting(m)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition ${
                    selectedMeeting?.id === m.id
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-sm'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      {m.meetingNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {m.type}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {m.title}
                  </h4>
                  <div className="flex items-center justify-between text-xs text-slate-400 mt-1.5">
                    <span>{m.date}</span>
                    <span>{m.minutes.length} Action Items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Meeting Minutes Detail View */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
            {selectedMeeting ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
                        {selectedMeeting.meetingNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200">
                        {selectedMeeting.type} Meeting
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {selectedMeeting.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {selectedMeeting.projectName} • {selectedMeeting.date} ({selectedMeeting.time}) • {selectedMeeting.location}
                    </p>
                  </div>

                  <div className="text-right text-xs">
                    <span className="text-slate-400 block">Chairperson</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {selectedMeeting.chairPerson}
                    </span>
                  </div>
                </div>

                {/* Attendees */}
                <div className="text-xs">
                  <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                    Attendees Present
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMeeting.attendees.map((att, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                      >
                        {att}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Table: Discussion | Decision | Action | Responsible | Due Date | Status */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    Minutes of Meeting Action Matrix
                  </h4>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="px-3.5 py-3">Discussion</th>
                          <th className="px-3.5 py-3">Decision</th>
                          <th className="px-3.5 py-3">Action</th>
                          <th className="px-3 py-3">Responsible</th>
                          <th className="px-3 py-3">Due Date</th>
                          <th className="px-3 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                        {selectedMeeting.minutes.map((min) => (
                          <tr key={min.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="px-3.5 py-3 text-slate-900 dark:text-white font-medium max-w-[180px]">
                              {min.discussion}
                            </td>
                            <td className="px-3.5 py-3 text-slate-700 dark:text-slate-300 max-w-[160px]">
                              {min.decision}
                            </td>
                            <td className="px-3.5 py-3 text-indigo-600 dark:text-indigo-400 font-semibold max-w-[160px]">
                              {min.action}
                            </td>
                            <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">
                              {min.responsible}
                            </td>
                            <td className="px-3 py-3 whitespace-nowrap text-amber-600 dark:text-amber-400 font-mono">
                              {min.dueDate}
                            </td>
                            <td className="px-3 py-3 text-right whitespace-nowrap">
                              <select
                                value={min.status}
                                onChange={(e) =>
                                  updateMinuteStatus(
                                    selectedMeeting.id,
                                    min.id,
                                    e.target.value as 'open' | 'in_progress' | 'closed'
                                  )
                                }
                                className={`text-[10px] font-bold uppercase rounded px-2 py-0.5 border ${
                                  min.status === 'closed'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : min.status === 'in_progress'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : 'bg-amber-100 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="open">Open</option>
                                <option value="in_progress">In Progress</option>
                                <option value="closed">Closed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                Select a meeting from the left list to view minutes and actions.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: LEGAL & COMPLIANCE TRACKER */}
      {activeTab === 'compliance' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Statutory, Project & Vendor Compliance Tracker
              </h3>
              <p className="text-xs text-slate-500">
                Tracking GST filings, labour licenses, plant insurances, pollution clearances, and certificates
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200">
              {legalComplianceItems.filter((i) => i.status === 'valid').length} / {legalComplianceItems.length} Compliant
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 uppercase font-semibold text-[11px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Compliance Item & Authority</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Project Scope</th>
                  <th className="px-4 py-3.5">Document #</th>
                  <th className="px-4 py-3.5">Expiry Date</th>
                  <th className="px-4 py-3.5">Days to Expiry</th>
                  <th className="px-4 py-3.5">Responsible Officer</th>
                  <th className="px-5 py-3.5 text-right">Status Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredCompliance.map((item) => {
                  const isExpiringSoon = item.status === 'expiring_soon';
                  const isExpired = item.status === 'expired';
                  const isValid = item.status === 'valid';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="px-5 py-3.5">
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {item.item}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{item.authority}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-800 dark:text-slate-200">
                        {item.projectName || 'Corporate / Pan-India'}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {item.documentNumber}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-900 dark:text-white">
                        {item.expiryDate}
                      </td>
                      <td className="px-4 py-3.5 font-semibold">
                        <span
                          className={
                            isExpired
                              ? 'text-rose-600 font-bold'
                              : isExpiringSoon
                              ? 'text-amber-600 font-bold'
                              : 'text-slate-700 dark:text-slate-300'
                          }
                        >
                          {item.daysToExpiry < 0
                            ? `${Math.abs(item.daysToExpiry)} days overdue`
                            : `${item.daysToExpiry} days left`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">{item.responsibleOfficer}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            isValid
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300'
                              : isExpiringSoon
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300'
                          }`}
                        >
                          {isValid ? 'Valid' : isExpiringSoon ? 'Expiring Soon' : 'Expired'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-indigo-600" />
                Upload Repository Document
              </h3>
              <button onClick={() => setShowUploadDocModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDoc} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Structural Stability Certificate Tower C"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Document Category
                  </label>
                  <select
                    value={newDoc.category}
                    onChange={(e) =>
                      setNewDoc({ ...newDoc, category: e.target.value as DocumentRepoCategory })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    {DOC_CATEGORIES.filter((c) => c !== 'ALL').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project
                  </label>
                  <select
                    value={newDoc.projectId}
                    onChange={(e) => setNewDoc({ ...newDoc, projectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. soil test, foundation, geotechnical"
                  value={newDoc.tags}
                  onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadDocModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                >
                  Upload & Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Revision Modal */}
      {showRevisionModal && selectedDrawingForRevision && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  Upload Superseding Revision
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedDrawingForRevision.drawingNumber} — {selectedDrawingForRevision.title}
                </p>
              </div>
              <button onClick={() => setShowRevisionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRevision} className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 text-xs text-amber-800 dark:text-amber-300">
                Uploading a new revision will automatically mark the current active revision ({selectedDrawingForRevision.currentRevision}) as <strong>Superseded</strong>. Old revisions cannot be deleted.
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    New Revision Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rev D"
                    value={newRev.version}
                    onChange={(e) => setNewRev({ ...newRev, version: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Uploaded By (Consultant / Architect)
                  </label>
                  <input
                    type="text"
                    required
                    value={newRev.uploadedBy}
                    onChange={(e) => setNewRev({ ...newRev, uploadedBy: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Revision Changes Summary
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the revisions made in this version (e.g. column re-sizing, duct routing change)..."
                  value={newRev.changesSummary}
                  onChange={(e) => setNewRev({ ...newRev, changesSummary: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                >
                  Publish Approved Revision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Site Instruction Modal */}
      {showInstructionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                Issue Site Instruction
              </h3>
              <button onClick={() => setShowInstructionModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInstruction} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project
                  </label>
                  <select
                    value={newInstruction.projectId}
                    onChange={(e) =>
                      setNewInstruction({ ...newInstruction, projectId: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={newInstruction.priority}
                    onChange={(e) =>
                      setNewInstruction({
                        ...newInstruction,
                        priority: e.target.value as 'urgent' | 'high' | 'medium',
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent (Immediate stop / fix)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Responsible Person / Contractor
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Er. Gaurav Sawant / Star MEP Services"
                  value={newInstruction.responsiblePerson}
                  onChange={(e) =>
                    setNewInstruction({ ...newInstruction, responsiblePerson: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instruction Text
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the formal directive, method correction or specific safety instruction..."
                  value={newInstruction.text}
                  onChange={(e) =>
                    setNewInstruction({ ...newInstruction, text: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Compliance Due Date
                </label>
                <input
                  type="date"
                  required
                  value={newInstruction.dueDate}
                  onChange={(e) =>
                    setNewInstruction({ ...newInstruction, dueDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInstructionModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold"
                >
                  Issue Instruction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Meeting Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Record Minutes of Meeting (MOM)
              </h3>
              <button onClick={() => setShowMeetingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekly MEP Coordination & Tower Crane Clearance"
                  value={newMeeting.title}
                  onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Meeting Type
                  </label>
                  <select
                    value={newMeeting.type}
                    onChange={(e) =>
                      setNewMeeting({ ...newMeeting, type: e.target.value as MeetingType })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Site">Site Progress</option>
                    <option value="Client">Client Coordination</option>
                    <option value="Contractor">Contractor Interface</option>
                    <option value="Internal">Internal Technical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project
                  </label>
                  <select
                    value={newMeeting.projectId}
                    onChange={(e) => setNewMeeting({ ...newMeeting, projectId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attendees (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Er. Rajesh Iyer, Amit Patel, Consultant Rep"
                  value={newMeeting.attendees}
                  onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block mb-2">
                  First Minute Action Item
                </span>
                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    required
                    placeholder="Discussion: Topics covered..."
                    value={newMeeting.firstDiscussion}
                    onChange={(e) => setNewMeeting({ ...newMeeting, firstDiscussion: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Decision: Agreed resolution..."
                    value={newMeeting.firstDecision}
                    onChange={(e) => setNewMeeting({ ...newMeeting, firstDecision: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Action Required..."
                      value={newMeeting.firstAction}
                      onChange={(e) => setNewMeeting({ ...newMeeting, firstAction: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Responsible Person..."
                      value={newMeeting.firstResponsible}
                      onChange={(e) => setNewMeeting({ ...newMeeting, firstResponsible: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMeetingModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold"
                >
                  Save Meeting Minutes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
