import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { FollowUp, Lead } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  PhoneCall,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  User,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Building,
} from 'lucide-react';

export const FollowUpsPage: React.FC = () => {
  const { followUps, leads, completeFollowUp, rescheduleFollowUp, createFollowUp, addLeadActivity } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'overdue' | 'today' | 'upcoming' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('ALL');

  // Modal / Slide-over states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [actionType, setActionType] = useState<FollowUp['actionType']>('Call');
  const [dueDate, setDueDate] = useState('2026-09-23');
  const [dueTime, setDueTime] = useState('11:00 AM');
  const [priority, setPriority] = useState<FollowUp['priority']>('medium');
  const [notes, setNotes] = useState('');
  const [assignedTo, setAssignedTo] = useState('Siddharth Rao');

  // Quick Action Modal states
  const [callModalFU, setCallModalFU] = useState<FollowUp | null>(null);
  const [callOutcome, setCallOutcome] = useState('Connected - Client interested');
  const [callNotes, setCallNotes] = useState('');

  const [rescheduleFU, setRescheduleFU] = useState<FollowUp | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('2026-09-24');
  const [rescheduleTime, setRescheduleTime] = useState('11:30 AM');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Derive counts
  const overdueItems = useMemo(() => followUps.filter((f) => f.status === 'overdue'), [followUps]);
  const todayItems = useMemo(
    () => followUps.filter((f) => f.status === 'pending' && (f.dueDate === '2026-09-22' || f.dueDate === 'Today')),
    [followUps]
  );
  const upcomingItems = useMemo(
    () => followUps.filter((f) => f.status === 'pending' && f.dueDate !== '2026-09-22' && f.dueDate !== 'Today'),
    [followUps]
  );
  const completedItems = useMemo(() => followUps.filter((f) => f.status === 'completed'), [followUps]);

  // Filtered list
  const filteredFollowUps = useMemo(() => {
    return followUps.filter((fu) => {
      // Tab filter
      if (activeTab === 'overdue' && fu.status !== 'overdue') return false;
      if (activeTab === 'today' && (fu.status !== 'pending' || (fu.dueDate !== '2026-09-22' && fu.dueDate !== 'Today'))) return false;
      if (activeTab === 'upcoming' && (fu.status !== 'pending' || fu.dueDate === '2026-09-22' || fu.dueDate === 'Today')) return false;
      if (activeTab === 'completed' && fu.status !== 'completed') return false;

      // Type filter
      if (typeFilter !== 'ALL' && fu.actionType !== typeFilter) return false;

      // Assignee filter
      if (assigneeFilter !== 'ALL' && fu.assignedTo !== assigneeFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = fu.customerName.toLowerCase().includes(q);
        const matchesProject = fu.projectTitle.toLowerCase().includes(q);
        const matchesNotes = fu.notes.toLowerCase().includes(q);
        const matchesPhone = fu.customerPhone.includes(q);
        if (!matchesName && !matchesProject && !matchesNotes && !matchesPhone) return false;
      }

      return true;
    });
  }, [followUps, activeTab, typeFilter, assigneeFilter, searchQuery]);

  // Distinct assignees
  const assignees = useMemo(() => {
    const setNames = new Set(followUps.map((f) => f.assignedTo));
    return Array.from(setNames);
  }, [followUps]);

  // Handle Log Call submission
  const handleLogCallSubmit = () => {
    if (!callModalFU) return;
    completeFollowUp(callModalFU.id);

    // Also add activity to the lead
    addLeadActivity(callModalFU.leadId, {
      type: 'call',
      title: `Call Logged: ${callOutcome}`,
      notes: callNotes ? `${callOutcome} — ${callNotes}` : callOutcome,
      authorName: callModalFU.assignedTo || 'Sales Rep',
      authorRole: 'Sales Manager',
    });

    showToast(`Call logged successfully for ${callModalFU.customerName}`);
    setCallModalFU(null);
    setCallNotes('');
  };

  // Handle WhatsApp click
  const handleWhatsAppClick = (fu: FollowUp) => {
    const cleanPhone = fu.customerPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${fu.customerName}, this is ${fu.assignedTo} from Apex Buildcon regarding your project: ${fu.projectTitle}. I wanted to follow up on your requirement.`
    );
    const waUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    window.open(waUrl, '_blank');

    addLeadActivity(fu.leadId, {
      type: 'whatsapp',
      title: `WhatsApp Message Dispatched`,
      notes: `Sent project follow-up template to ${fu.customerPhone}`,
      authorName: fu.assignedTo || 'Sales Rep',
      authorRole: 'Sales Manager',
    });

    showToast(`WhatsApp chat opened for ${fu.customerName}`);
  };

  // Handle Reschedule
  const handleRescheduleSubmit = () => {
    if (!rescheduleFU) return;
    rescheduleFollowUp(rescheduleFU.id, rescheduleDate, rescheduleTime);
    addLeadActivity(rescheduleFU.leadId, {
      type: 'note',
      title: `Follow-up Rescheduled to ${rescheduleDate} at ${rescheduleTime}`,
      notes: `Rescheduled by sales manager`,
      authorName: rescheduleFU.assignedTo || 'Sales Rep',
    });
    showToast(`Follow-up rescheduled to ${rescheduleDate}`);
    setRescheduleFU(null);
  };

  // Handle Schedule New
  const handleScheduleNew = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === selectedLeadId);
    if (!lead) return;

    createFollowUp({
      leadId: lead.id,
      customerName: lead.customerName,
      customerPhone: lead.mobile,
      projectTitle: `${lead.projectType} Construction (${lead.location})`,
      actionType,
      dueDate,
      dueTime,
      status: 'pending',
      priority,
      notes: notes || `Follow-up on ${lead.projectType} construction quotation`,
      assignedTo,
    });

    addLeadActivity(lead.id, {
      type: 'note',
      title: `New Follow-up Scheduled: ${actionType} on ${dueDate} ${dueTime}`,
      notes: notes || 'Scheduled follow-up',
      authorName: assignedTo,
    });

    showToast(`Follow-up scheduled for ${lead.customerName}`);
    setIsScheduleModalOpen(false);
    setNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-amber-500/40 text-white px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Follow-Ups & Call Center"
        subtitle="Manage daily sales cadence, track overdue customer commitments, and log touchpoints"
        badge={`${followUps.filter((f) => f.status !== 'completed').length} Pending`}
        actions={
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Follow-up</span>
          </button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Overdue Action"
          value={overdueItems.length.toString()}
          subtext="Requires immediate intervention"
          icon="AlertTriangle"
          trend="down"
        />
        <StatCard
          title="Due Today"
          value={todayItems.length.toString()}
          subtext="Scheduled for today's cadence"
          icon="Clock"
          trend="neutral"
        />
        <StatCard
          title="Upcoming Pipeline"
          value={upcomingItems.length.toString()}
          subtext="Scheduled next 7 days"
          icon="Calendar"
          trend="up"
        />
        <StatCard
          title="Completed Touchpoints"
          value={completedItems.length.toString()}
          subtext="Calls, chats & meetings closed"
          icon="CheckCircle2"
          trend="up"
        />
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        {/* Urgent Tab Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Activities ({followUps.length})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'overdue'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 hover:bg-rose-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Overdue ({overdueItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('today')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'today'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Due Today ({todayItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 hover:bg-blue-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Upcoming ({upcomingItems.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === 'completed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed ({completedItems.length})</span>
            </button>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by customer, phone, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Action Types</option>
              <option value="Call">Phone Call</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Meeting">In-Person Meeting</option>
              <option value="Site Inspection">Site Inspection</option>
              <option value="Email">Email</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 whitespace-nowrap">Sales Rep:</span>
            <select
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Sales Reps</option>
              {assignees.map((rep) => (
                <option key={rep} value={rep}>
                  {rep}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Follow-ups List */}
      {filteredFollowUps.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No follow-ups match criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, status tabs, or filters to find scheduled activities.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFollowUps.map((fu) => {
            const isOverdue = fu.status === 'overdue';
            const isCompleted = fu.status === 'completed';
            const isToday = !isOverdue && !isCompleted && (fu.dueDate === '2026-09-22' || fu.dueDate === 'Today');

            return (
              <div
                key={fu.id}
                className={`bg-white dark:bg-slate-900 rounded-xl border p-4 sm:p-5 transition-all shadow-sm ${
                  isOverdue
                    ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
                    : isToday
                    ? 'border-amber-300 dark:border-amber-900/50 bg-amber-50/10 dark:bg-amber-950/10'
                    : isCompleted
                    ? 'border-slate-200 dark:border-slate-800 opacity-75'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Client Info & Activity */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Priority Tag */}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          fu.priority === 'high'
                            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                            : fu.priority === 'medium'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {fu.priority} Priority
                      </span>

                      {/* Type Badge */}
                      <span className="flex items-center gap-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
                        {fu.actionType === 'Call' && <PhoneCall className="w-3 h-3 text-emerald-600" />}
                        {fu.actionType === 'WhatsApp' && <MessageSquare className="w-3 h-3 text-emerald-600" />}
                        {fu.actionType === 'Meeting' && <User className="w-3 h-3 text-blue-600" />}
                        {fu.actionType === 'Site Inspection' && <Building className="w-3 h-3 text-amber-600" />}
                        <span>{fu.actionType}</span>
                      </span>

                      {/* Urgency Badge */}
                      {isOverdue && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          <span>OVERDUE ({fu.dueDate})</span>
                        </span>
                      )}
                      {isToday && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3" />
                          <span>DUE TODAY ({fu.dueTime})</span>
                        </span>
                      )}
                      {!isOverdue && !isToday && !isCompleted && (
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {fu.dueDate} at {fu.dueTime}
                          </span>
                        </span>
                      )}
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                      <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {fu.customerName}
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        {fu.projectTitle}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Notes:</span> {fu.notes}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-mono">{fu.customerPhone}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Assigned to: <strong className="text-slate-700 dark:text-slate-300">{fu.assignedTo}</strong></span>
                      </span>
                    </div>
                  </div>

                  {/* Right Column: 1-Click Action Buttons */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    {!isCompleted && (
                      <>
                        {/* Call Logged Button */}
                        <button
                          onClick={() => setCallModalFU(fu)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs font-semibold transition-colors"
                          title="Log call outcome"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call Logged</span>
                        </button>

                        {/* WhatsApp Button */}
                        <button
                          onClick={() => handleWhatsAppClick(fu)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/60 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800 rounded-lg text-xs font-semibold transition-colors"
                          title="Send message via WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>

                        {/* Reschedule Button */}
                        <button
                          onClick={() => {
                            setRescheduleFU(fu);
                            setRescheduleDate('2026-09-24');
                            setRescheduleTime('11:00 AM');
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                          title="Reschedule follow-up"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reschedule</span>
                        </button>

                        {/* Mark Done Button */}
                        <button
                          onClick={() => {
                            completeFollowUp(fu.id);
                            addLeadActivity(fu.leadId, {
                              type: 'note',
                              title: `Follow-up Marked as Completed`,
                              notes: `Resolved by ${fu.assignedTo}`,
                              authorName: fu.assignedTo,
                            });
                            showToast(`Marked ${fu.customerName}'s follow-up as complete`);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                          title="Mark complete"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Done</span>
                        </button>
                      </>
                    )}

                    {isCompleted && (
                      <span className="text-xs text-slate-400 italic px-2">Action completed</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Call Logged Modal */}
      {callModalFU && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Log Call Outcome</h3>
                  <p className="text-xs text-slate-500">Customer: {callModalFU.customerName}</p>
                </div>
              </div>
              <button
                onClick={() => setCallModalFU(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Call Disposition / Outcome
                </label>
                <select
                  value={callOutcome}
                  onChange={(e) => setCallOutcome(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Connected - Client interested in Quotation">Connected - Client interested in Quotation</option>
                  <option value="Connected - Budget discussion ongoing">Connected - Budget discussion ongoing</option>
                  <option value="Connected - Requested Site Visit inspection">Connected - Requested Site Visit inspection</option>
                  <option value="Ringing / No Answer">Ringing / No Answer</option>
                  <option value="Busy / Call back later requested">Busy / Call back later requested</option>
                  <option value="Switched off / Unreachable">Switched off / Unreachable</option>
                  <option value="Not Interested / Dropping project">Not Interested / Dropping project</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Discussion Notes & Next Steps
                </label>
                <textarea
                  rows={3}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="e.g. Client mentioned they need final architectural plans before finalizing contractor..."
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setCallModalFU(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogCallSubmit}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Save Call & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleFU && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Reschedule Follow-up</h3>
                  <p className="text-xs text-slate-500">{rescheduleFU.customerName}</p>
                </div>
              </div>
              <button
                onClick={() => setRescheduleFU(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRescheduleDate('2026-09-23');
                    setRescheduleTime('10:00 AM');
                  }}
                  className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <p className="font-semibold text-slate-800 dark:text-slate-200">Tomorrow Morning</p>
                  <p className="text-[11px] text-slate-500">10:00 AM</p>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRescheduleDate('2026-09-25');
                    setRescheduleTime('03:30 PM');
                  }}
                  className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-left hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <p className="font-semibold text-slate-800 dark:text-slate-200">In 3 Days</p>
                  <p className="text-[11px] text-slate-500">03:30 PM</p>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Custom Date
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Custom Time
                  </label>
                  <input
                    type="text"
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    placeholder="e.g. 02:00 PM"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setRescheduleFU(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRescheduleSubmit}
                className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule New Follow-up Modal */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Schedule New Follow-up</h3>
                  <p className="text-xs text-slate-500">Add a touchpoint to sales cadence</p>
                </div>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleNew} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Lead / Client *
                </label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                >
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.customerName} — {l.projectType} ({l.location})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Action Type *
                  </label>
                  <select
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value as FollowUp['actionType'])}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  >
                    <option value="Call">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Meeting">Client Meeting</option>
                    <option value="Site Inspection">Site Inspection</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as FollowUp['priority'])}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  >
                    <option value="high">High Priority (Urgent)</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    placeholder="e.g. 11:30 AM"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Assign To Salesperson
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                >
                  <option value="Siddharth Rao">Siddharth Rao (Senior Sales Manager)</option>
                  <option value="Natasha Bose">Natasha Bose (Enterprise BD)</option>
                  <option value="Pooja Kulkarni">Pooja Kulkarni (Retail Sales Rep)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Follow-up Notes / Objective
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Objective of the conversation (e.g. confirm approval of structural BOQ)..."
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
