import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  Building2,
  Receipt,
  Download,
  ShieldCheck,
  CheckCircle2,
  Clock,
  LogOut,
  Layers,
  Camera,
  FileText,
  AlertCircle,
  Plus,
  X,
  CreditCard,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Sparkles,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

type ClientTab = 'progress' | 'photos' | 'bills' | 'documents' | 'tickets' | 'approvals';

interface ClientTicket {
  id: string;
  ticketNumber: string;
  issue: string;
  location: string;
  dateRaised: string;
  stage:
    | 'created'
    | 'engineer_assigned'
    | 'site_visit'
    | 'repair'
    | 'photo_proof'
    | 'client_confirmation'
    | 'closed';
  assignedEngineer: string;
  photoProofUrl?: string;
  status: 'open' | 'resolved';
}

const TICKET_STAGES = [
  { key: 'created', label: '1. Ticket Created' },
  { key: 'engineer_assigned', label: '2. Engineer Assigned' },
  { key: 'site_visit', label: '3. Site Visit' },
  { key: 'repair', label: '4. Repair Active' },
  { key: 'photo_proof', label: '5. Photo Proof' },
  { key: 'client_confirmation', label: '6. Client Confirm' },
  { key: 'closed', label: '7. Closed' },
];

export const ClientPortalPage: React.FC = () => {
  const { clients, projects, switchRole } = useAppStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ClientTab>('progress');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ClientTicket | null>(null);

  // Client's primary project (Lodha Skylines)
  const clientProject = projects[0] || {
    id: 'PRJ-001',
    name: 'Lodha Skylines Tower C Highrise',
    contractValue: 485000000,
    completionPercentage: 68,
    projectManager: 'Vikram Malhotra',
  };

  // Seeded client tickets with 7-stage workflow
  const [tickets, setTickets] = useState<ClientTicket[]>([
    {
      id: 'TCK-101',
      ticketNumber: 'TKT-2026-081',
      issue: 'Request inspection of perimeter sealant along West facade curtain wall',
      location: 'Tower C, 34th Floor Master Balconies',
      dateRaised: '2026-09-18',
      stage: 'photo_proof',
      assignedEngineer: 'Er. Rajesh Iyer (QA/QC Lead)',
      photoProofUrl:
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80',
      status: 'open',
    },
    {
      id: 'TCK-102',
      ticketNumber: 'TKT-2026-079',
      issue: 'Verify core cut drill diameter for 4-inch plumbing drain line in shaft 3',
      location: 'Tower C, 28th Floor Shaft B',
      dateRaised: '2026-09-14',
      stage: 'closed',
      assignedEngineer: 'Er. Amit Patel (Site Engineer)',
      photoProofUrl:
        'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=600&q=80',
      status: 'resolved',
    },
  ]);

  // Seeded Pending Client Approvals
  const [approvals, setApprovals] = useState([
    {
      id: 'APP-01',
      title: 'Variation Order VO-004: Italian Statuario Marble Upgrade',
      type: 'Variation Order',
      amount: '₹ 18,50,000',
      requestedBy: 'Architect Hafeez Contractor Assc.',
      date: '2026-09-19',
      status: 'pending' as 'pending' | 'approved' | 'rejected',
      details:
        'Substitution of standard vitrified tiles with imported Statuario Italian marble in 38th-floor luxury penthouses.',
    },
    {
      id: 'APP-02',
      title: 'Architectural Drawing Revision: Terrace Infinity Pool Pergola',
      type: 'Drawing Approval',
      amount: 'Schedule Neutral',
      requestedBy: 'Lead Structural Consultant',
      date: '2026-09-20',
      status: 'pending' as 'pending' | 'approved' | 'rejected',
      details:
        'Structural steel frame sizing adjustment for wind load resistance on 42nd level sky lounge.',
    },
  ]);

  // New Ticket Form State
  const [newTicketData, setNewTicketData] = useState({
    issue: '',
    location: '',
  });

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const count = tickets.length + 1;
    const item: ClientTicket = {
      id: `TCK-${Date.now()}`,
      ticketNumber: `TKT-2026-${String(count + 85).padStart(3, '0')}`,
      issue: newTicketData.issue,
      location: newTicketData.location,
      dateRaised: new Date().toISOString().split('T')[0],
      stage: 'created',
      assignedEngineer: 'Chief Resident Engineer',
      status: 'open',
    };
    setTickets([item, ...tickets]);
    setNewTicketData({ issue: '', location: '' });
    setShowNewTicketModal(false);
  };

  const advanceTicket = (ticket: ClientTicket) => {
    const idx = TICKET_STAGES.findIndex((s) => s.key === ticket.stage);
    if (idx < TICKET_STAGES.length - 1) {
      const nextStage = TICKET_STAGES[idx + 1].key as ClientTicket['stage'];
      const updated = tickets.map((t) =>
        t.id === ticket.id
          ? {
              ...t,
              stage: nextStage,
              status: nextStage === 'closed' ? ('resolved' as const) : ('open' as const),
            }
          : t
      );
      setTickets(updated);
    }
  };

  const handleReturnToAdmin = () => {
    switchRole('admin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 font-sans antialiased">
      {/* Client Warm Branded Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold shadow-md shadow-amber-600/20">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Lodha Developers — Client Project Portal
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                  Client VIP
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Project: {clientProject.name} • Project Lead: {clientProject.projectManager}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Issue / Ticket</span>
            </button>

            <button
              onClick={handleReturnToAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold border border-stone-200 transition"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500" />
              <span>Internal OS</span>
            </button>
          </div>
        </div>

        {/* Consumer-Friendly Warm Tab Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-6 overflow-x-auto text-xs font-bold border-t border-stone-100">
          {[
            { id: 'progress', label: 'Project Progress', icon: <Layers className="w-4 h-4" /> },
            { id: 'photos', label: 'Site Photo Gallery', icon: <Camera className="w-4 h-4" /> },
            { id: 'bills', label: 'Bills & Payments', icon: <Receipt className="w-4 h-4" /> },
            { id: 'documents', label: 'Project Documents', icon: <FileText className="w-4 h-4" /> },
            { id: 'tickets', label: 'My Tickets & Issues', icon: <AlertCircle className="w-4 h-4" /> },
            { id: 'approvals', label: 'Pending Approvals', icon: <CheckCircle2 className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ClientTab)}
              className={`py-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'border-amber-600 text-amber-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* TAB 1: PROJECT PROGRESS & TIMELINE */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            {/* Big Hero Card */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Current Execution Phase
                </span>
                <h2 className="text-2xl font-black text-slate-900">
                  Tower C: 38th Floor Core Slab Concreting
                </h2>
                <p className="text-xs text-slate-500 max-w-xl">
                  Superstructure construction is tracking on schedule. MEP vertical risers and plumbing shafts are 72% complete up to the 30th level.
                </p>
              </div>

              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-center min-w-[180px]">
                <span className="text-xs text-slate-500 block mb-1">Overall Completion</span>
                <span className="text-4xl font-black text-amber-600 font-mono">68%</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                  On Target for Dec 2026 Handover
                </span>
              </div>
            </div>

            {/* Milestones Stepper */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Key Contract Milestones & Target Dates
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { title: 'Substructure & Piles', status: 'Completed', date: 'Jan 2026', done: true },
                  { title: 'Plinth to 20th Floor', status: 'Completed', date: 'May 2026', done: true },
                  { title: '21st to 42nd Slab', status: 'Active (68%)', date: 'Oct 2026', active: true },
                  { title: 'Facade & Finishes', status: 'Upcoming', date: 'Nov 2026', done: false },
                  { title: 'Virtual Handover & OC', status: 'Target Dec 2026', date: 'Dec 2026', done: false },
                ].map((m, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                      m.done
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                        : m.active
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{m.title}</span>
                      {m.done && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] text-slate-500">{m.status}</p>
                    <p className="text-[10px] font-mono text-slate-400">{m.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SITE PHOTOS */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                title: '38th Floor Core Slab Reinforcement',
                date: 'Sep 21, 2026',
                caption: 'Rebar tie inspection passed prior to pump pour',
                url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=700&q=80',
              },
              {
                title: 'Main Entrance Double-Height Lobby',
                date: 'Sep 19, 2026',
                caption: 'Framework installation for Italian marble cladding',
                url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=700&q=80',
              },
              {
                title: 'Basement 2 DG Substation Installation',
                date: 'Sep 17, 2026',
                caption: 'Cummins 1500 kVA gensets positioned and vibration isolated',
                url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=700&q=80',
              },
            ].map((photo, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition space-y-3 p-3"
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-48 object-cover rounded-xl"
                />
                <div className="p-2 space-y-1 text-xs">
                  <div className="flex justify-between items-center text-slate-400 text-[11px]">
                    <span>High-Res Site Capture</span>
                    <span>{photo.date}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{photo.title}</h4>
                  <p className="text-slate-500 leading-snug">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: BILLS & PAYMENTS */}
        {activeTab === 'bills' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Running Account (RA) Bills & Payment Statements
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official certified payment certificates and payment history
                  </p>
                </div>
              </div>

              <div className="divide-y divide-stone-100 text-xs">
                {[
                  {
                    bill: 'RA Bill #09',
                    date: 'Sep 15, 2026',
                    amount: '₹ 1,24,00,000',
                    status: 'Due in 4 Days',
                    isDue: true,
                  },
                  {
                    bill: 'RA Bill #08',
                    date: 'Aug 18, 2026',
                    amount: '₹ 1,45,00,000',
                    status: 'Paid & Settled',
                    isPaid: true,
                  },
                  {
                    bill: 'RA Bill #07',
                    date: 'Jul 15, 2026',
                    amount: '₹ 1,32,00,000',
                    status: 'Paid & Settled',
                    isPaid: true,
                  },
                ].map((b, idx) => (
                  <div
                    key={idx}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900">{b.bill}</div>
                      <p className="text-slate-500 text-[11px]">
                        Issued on {b.date} • Certified by Lead QS
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold font-mono text-sm text-slate-900">{b.amount}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.isPaid
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {b.status}
                      </span>
                      <button
                        onClick={() => alert(`Downloading Statement for ${b.bill}`)}
                        className="p-2 border border-stone-200 rounded-lg hover:bg-stone-50 text-slate-600"
                        title="Download PDF Certificate"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTS REPOSITORY */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900">
              Verified Project Documents & Statutory Approvals
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {[
                { title: 'Registered EPC Main Contract Agreement', size: '8.4 MB PDF', date: '2026-01-10' },
                { title: 'Approved Architectural Floor Plans (Rev C)', size: '24.2 MB PDF', date: '2026-08-15' },
                { title: 'Structural Stability Certificate (Tower C)', size: '3.1 MB PDF', date: '2026-06-20' },
                { title: 'Provisional Fire NOC & Lift Shaft Clearances', size: '2.8 MB PDF', date: '2026-07-04' },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-stone-200 hover:border-amber-300 transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-600" />
                    <div>
                      <h4 className="font-bold text-slate-900">{doc.title}</h4>
                      <p className="text-slate-400 text-[11px]">
                        {doc.size} • Uploaded {doc.date}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert(`Downloading ${doc.title}`)}
                    className="p-2 rounded-lg bg-stone-50 hover:bg-amber-50 text-amber-700 transition"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CLIENT COMPLAINT / ISSUE WORKFLOW */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Client Complaint & Issue Resolution Lifecycle
                </h3>
                <p className="text-xs text-slate-500">
                  7-step transparent resolution: Ticket Created → Engineer Assigned → Visit → Repair → Photo Proof → Client Confirmation → Closed
                </p>
              </div>

              <button
                onClick={() => setShowNewTicketModal(true)}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Raise New Ticket
              </button>
            </div>

            <div className="space-y-4">
              {tickets.map((t) => {
                const currentStageIdx = TICKET_STAGES.findIndex((s) => s.key === t.stage);

                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-700">
                            {t.ticketNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              t.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {t.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-slate-900 mt-1">{t.issue}</h4>
                        <p className="text-xs text-slate-500">
                          Location: {t.location} • Raised on {t.dateRaised} • Assigned to {t.assignedEngineer}
                        </p>
                      </div>

                      {t.status === 'open' && (
                        <button
                          onClick={() => advanceTicket(t)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1 self-start"
                        >
                          <span>Progress Step</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* 7-Step Stepper */}
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                        {TICKET_STAGES.map((st, i) => {
                          const isDone = i < currentStageIdx || t.status === 'resolved';
                          const isCurrent = i === currentStageIdx && t.status !== 'resolved';

                          return (
                            <div
                              key={st.key}
                              className={`p-2.5 rounded-lg border text-center text-xs transition ${
                                isDone
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                  : isCurrent
                                  ? 'bg-amber-100 border-amber-400 text-amber-900 font-black shadow-xs'
                                  : 'bg-white border-stone-200 text-slate-400 opacity-60'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                {isDone ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : isCurrent ? (
                                  <Clock className="w-3 h-3 text-amber-600" />
                                ) : null}
                                <span className="text-[11px]">{st.label}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Photo proof preview */}
                    {t.photoProofUrl && (
                      <div className="flex items-center gap-4 text-xs pt-1 border-t border-stone-100">
                        <span className="font-bold text-slate-500">Rectification Evidence:</span>
                        <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-mono text-[11px] border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Site Photo Proof Attached
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: PENDING APPROVALS */}
        {activeTab === 'approvals' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Pending Variations & Design Ratifications
              </h3>
              <p className="text-xs text-slate-500">
                Direct client sign-off for variations and revised drawing issuances
              </p>
            </div>

            <div className="space-y-4">
              {approvals.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        {app.type}
                      </span>
                      <h4 className="font-bold text-base text-slate-900 mt-1">{app.title}</h4>
                      <p className="text-xs text-slate-500">
                        Requested by: {app.requestedBy} • Impact: {app.amount} • Submitted: {app.date}
                      </p>
                    </div>

                    {app.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setApprovals(
                              approvals.map((a) =>
                                a.id === app.id ? { ...a, status: 'approved' } : a
                              )
                            );
                          }}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-sm"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => {
                            setApprovals(
                              approvals.map((a) =>
                                a.id === app.id ? { ...a, status: 'rejected' } : a
                              )
                            );
                          }}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition flex items-center gap-1"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    "{app.details}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Raise New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                Raise Site Issue or Observation
              </h3>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue / Defect Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the issue, aesthetic concern or quality observation..."
                  value={newTicketData.issue}
                  onChange={(e) =>
                    setNewTicketData({ ...newTicketData, issue: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Location on Site
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tower C, 34th Floor Living Balcony"
                  value={newTicketData.location}
                  onChange={(e) =>
                    setNewTicketData({ ...newTicketData, location: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-slate-900"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800">
                Your ticket will be immediately routed to Resident Engineer Er. Vikram Malhotra and will begin the 7-step remediation workflow.
              </div>

              <div className="pt-2 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 border border-stone-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
