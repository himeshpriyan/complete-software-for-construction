import React, { useState, useMemo } from 'react';
import {
  Kanban,
  List,
  Plus,
  Filter,
  Search,
  Building,
  MapPin,
  Calendar,
  AlertCircle,
  X,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { FilterBar } from '../../components/ui/FilterBar';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { LeadDetailPanel } from './LeadDetailPanel';
import { useAppStore } from '../../store/useAppStore';
import { Lead, LeadStage, LeadSource, ProjectType, ColumnDef } from '../../types';
import { CRM_PIPELINE_STAGES } from '../../data/crmSeed';
import { formatCurrency, cn } from '../../utils/cn';
import { updateLeadStage, createLead } from '../../services/crmService';

export const LeadsPipelinePage: React.FC = () => {
  const { leads, openSlideOver, closeSlideOver, addLeadActivity, createSiteVisit } = useAppStore();

  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [salespersonFilter, setSalespersonFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [projectTypeFilter, setProjectTypeFilter] = useState('ALL');

  // Lost modal state
  const [lostModalLead, setLostModalLead] = useState<Lead | null>(null);
  const [lostReason, setLostReason] = useState<Lead['lostReason']>('Competitor');
  const [lostNotes, setLostNotes] = useState('');

  // New Lead Form State
  const [newLeadForm, setNewLeadForm] = useState({
    customerName: '',
    company: '',
    mobile: '',
    email: '',
    location: '',
    projectType: 'Commercial' as ProjectType,
    landArea: '',
    builtUpArea: '',
    budget: 50000000,
    expectedStartDate: '2026-11-01',
    notes: '',
    source: 'Website' as LeadSource,
    assignedSalesperson: 'Siddharth Rao',
    salespersonId: 'USR-022',
    stage: 'new_lead' as LeadStage,
  });

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (salespersonFilter !== 'ALL' && lead.assignedSalesperson !== salespersonFilter) return false;
      if (sourceFilter !== 'ALL' && lead.source !== sourceFilter) return false;
      if (projectTypeFilter !== 'ALL' && lead.projectType !== projectTypeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.customerName.toLowerCase().includes(q);
        const matchesCompany = lead.company?.toLowerCase().includes(q);
        const matchesLoc = lead.location.toLowerCase().includes(q);
        const matchesId = lead.id.toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesLoc && !matchesId) return false;
      }
      return true;
    });
  }, [leads, salespersonFilter, sourceFilter, projectTypeFilter, searchQuery]);

  // Open Lead Detail in SlideOver
  const handleOpenLeadDetail = (lead: Lead) => {
    openSlideOver(
      `Lead Profile: ${lead.customerName}`,
      <LeadDetailPanel
        lead={lead}
        onClose={closeSlideOver}
        onScheduleSiteVisit={(l) => {
          closeSlideOver();
          handleOpenScheduleVisit(l);
        }}
        onMarkLost={(l) => {
          closeSlideOver();
          setLostModalLead(l);
        }}
      />,
      `${lead.projectType} Project • Budget: ${formatCurrency(lead.budget)}`
    );
  };

  // Schedule Site Visit Drawer
  const handleOpenScheduleVisit = (lead: Lead) => {
    let visitForm = {
      leadId: lead.id,
      leadName: lead.customerName,
      customerName: lead.customerName,
      customerPhone: lead.mobile,
      siteLocation: lead.location,
      city: lead.location.split(',')[1]?.trim() || 'Mumbai',
      geoCoordinates: '19.0176° N, 72.8561° E',
      landDimensions: lead.landArea || '120 ft × 80 ft',
      soilType: 'Clayey Silt with Basalt Bed',
      roadAccess: true,
      electricityAccess: true,
      waterSource: 'Municipal' as const,
      existingStructureNotes: 'Empty site ready for joint demarcation.',
      siteConstraints: 'No critical overhead lines.',
      photos: [],
      status: 'scheduled' as const,
      assignedEngineer: 'Amit Patel',
      visitDate: '2026-09-25',
      visitTime: '11:00 AM',
    };

    openSlideOver(
      'Schedule Site Inspection Visit',
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Dispatch a resident site engineer to verify plot boundaries, soil condition, and utility infrastructure.
        </p>
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs">
          <p className="font-bold text-amber-900">{lead.customerName}</p>
          <p className="text-amber-800">{lead.location} • Budget: {formatCurrency(lead.budget)}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Inspection Date</label>
            <input
              type="date"
              defaultValue={visitForm.visitDate}
              onChange={(e) => (visitForm.visitDate = e.target.value)}
              className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700">Inspection Time</label>
            <input
              type="text"
              defaultValue={visitForm.visitTime}
              onChange={(e) => (visitForm.visitTime = e.target.value)}
              className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Assigned Resident Engineer</label>
          <select
            defaultValue={visitForm.assignedEngineer}
            onChange={(e) => (visitForm.assignedEngineer = e.target.value)}
            className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
          >
            <option value="Amit Patel">Amit Patel (Site Engineer - Civil)</option>
            <option value="Gaurav Sawant">Gaurav Sawant (Structural Specialist)</option>
            <option value="Prashant Iyer">Prashant Iyer (Resident Engineer - Bengaluru)</option>
            <option value="Abhishek Roy">Abhishek Roy (Civil Engineer - NCR)</option>
          </select>
        </div>
        <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button onClick={closeSlideOver} className="px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-slate-100">
            Cancel
          </button>
          <button
            onClick={() => {
              createSiteVisit(visitForm);
              closeSlideOver();
            }}
            className="px-4 py-2 text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
          >
            Confirm & Dispatch Engineer
          </button>
        </div>
      </div>
    );
  };

  // Open Create Lead SlideOver
  const handleOpenCreateLead = () => {
    openSlideOver(
      'Register New Pre-Construction Lead',
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!newLeadForm.customerName) return;
          createLead({
            ...newLeadForm,
            budget: Number(newLeadForm.budget),
          });
          closeSlideOver();
        }}
        className="space-y-4 text-xs"
      >
        <p className="text-slate-500">Capture initial project scope, client budget, and assign a sales representative.</p>

        <div>
          <label className="block font-semibold text-slate-700">Client / Developer Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. K. Raheja Corp Realties"
            onChange={(e) => setNewLeadForm({ ...newLeadForm, customerName: e.target.value })}
            className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700">Mobile Phone *</label>
            <input
              type="text"
              required
              placeholder="+91 98200 12345"
              onChange={(e) => setNewLeadForm({ ...newLeadForm, mobile: e.target.value })}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              placeholder="contact@client.com"
              onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700">Project Location (City / Area)</label>
            <input
              type="text"
              placeholder="e.g. Bandra Kurla Complex, Mumbai"
              onChange={(e) => setNewLeadForm({ ...newLeadForm, location: e.target.value })}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700">Project Type</label>
            <select
              value={newLeadForm.projectType}
              onChange={(e) => setNewLeadForm({ ...newLeadForm, projectType: e.target.value as ProjectType })}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Commercial">Commercial</option>
              <option value="Residential">Residential</option>
              <option value="Industrial">Industrial</option>
              <option value="Renovation">Renovation</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700">Land Area</label>
            <input
              type="text"
              placeholder="e.g. 2.5 Acres / 15,000 sq ft"
              onChange={(e) => setNewLeadForm({ ...newLeadForm, landArea: e.target.value })}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700">Required Built-up Area</label>
            <input
              type="text"
              placeholder="e.g. 1,40,000 sq.ft"
              onChange={(e) => setNewLeadForm({ ...newLeadForm, builtUpArea: e.target.value })}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700">Budget Range (INR)</label>
            <input
              type="number"
              defaultValue={newLeadForm.budget}
              onChange={(e) => setNewLeadForm({ ...newLeadForm, budget: Number(e.target.value) })}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700">Lead Source</label>
            <select
              value={newLeadForm.source}
              onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value as LeadSource })}
              className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Website">Website</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Justdial">Justdial</option>
              <option value="IndiaMART">IndiaMART</option>
              <option value="Referral">Referral</option>
              <option value="Exhibition">Exhibition</option>
              <option value="Direct Enquiry">Direct Enquiry</option>
              <option value="Existing Client">Existing Client</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700">Assigned Salesperson</label>
          <select
            value={newLeadForm.assignedSalesperson}
            onChange={(e) => {
              const name = e.target.value;
              const id = name === 'Natasha Bose' ? 'USR-023' : 'USR-022';
              setNewLeadForm({ ...newLeadForm, assignedSalesperson: name, salespersonId: id });
            }}
            className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="Siddharth Rao">Siddharth Rao (Head of BD & Sales)</option>
            <option value="Natasha Bose">Natasha Bose (Manager - Client Relations)</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-700">Requirement Notes & Specs</label>
          <textarea
            rows={3}
            placeholder="Special architectural or structural requirements..."
            onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
            className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button type="button" onClick={closeSlideOver} className="px-3 py-1.5 text-slate-600 rounded-lg hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm"
          >
            Save Lead to Pipeline
          </button>
        </div>
      </form>
    );
  };

  // Lost Lead Modal Confirmation
  const handleConfirmLost = () => {
    if (!lostModalLead) return;
    updateLeadStage(lostModalLead.id, 'lost', lostReason, lostNotes);
    setLostModalLead(null);
    setLostNotes('');
  };

  // List View Columns
  const listColumns: ColumnDef<Lead>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '90px',
      sortable: true,
      render: (l) => <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{l.id}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer & Company',
      sortable: true,
      render: (l) => (
        <div>
          <p className="font-bold text-slate-900 leading-snug">{l.customerName}</p>
          <p className="text-[11px] text-slate-500">{l.company || l.location}</p>
        </div>
      ),
    },
    {
      key: 'stage',
      header: 'Pipeline Stage',
      sortable: true,
      width: '160px',
      render: (l) => {
        const s = CRM_PIPELINE_STAGES.find((st) => st.id === l.stage);
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s?.bg} ${s?.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${s?.dot}`} />
            {s?.label}
          </span>
        );
      },
    },
    {
      key: 'projectType',
      header: 'Type',
      sortable: true,
      width: '110px',
      render: (l) => <span className="text-slate-700 font-medium">{l.projectType}</span>,
    },
    {
      key: 'budget',
      header: 'Budget Range',
      sortable: true,
      align: 'right',
      width: '130px',
      render: (l) => <span className="font-mono font-bold text-slate-900">{formatCurrency(l.budget)}</span>,
    },
    {
      key: 'assignedSalesperson',
      header: 'Sales Rep',
      sortable: true,
      width: '140px',
      render: (l) => (
        <div className="flex items-center gap-1.5">
          <Avatar name={l.assignedSalesperson} size="xs" />
          <span className="text-xs text-slate-700 truncate">{l.assignedSalesperson}</span>
        </div>
      ),
    },
    {
      key: 'daysInStage',
      header: 'Stage Time',
      align: 'center',
      width: '100px',
      render: (l) => (
        <span className={cn('text-xs font-medium', l.daysInStage > 7 ? 'text-amber-700 font-bold' : 'text-slate-500')}>
          {l.daysInStage} days
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Pre-Construction Lead Pipeline"
        subtitle="Manage customer inquiries from initial outreach to contract sign-off across all active stages."
        breadcrumbs={[{ label: 'CRM', path: '/crm/leads' }, { label: 'Leads Pipeline' }]}
        badge={`${leads.length} Active Inquiries`}
        actions={
          <div className="flex items-center gap-2">
            {/* Kanban vs List Switcher */}
            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all',
                  viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <Kanban className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all',
                  viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                )}
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Data Table</span>
              </button>
            </div>

            <button
              onClick={handleOpenCreateLead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>New Lead</span>
            </button>
          </div>
        }
      />

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search lead name, company, city, or ID..."
        hasActiveFilters={salespersonFilter !== 'ALL' || sourceFilter !== 'ALL' || projectTypeFilter !== 'ALL' || !!searchQuery}
        onResetFilters={() => {
          setSalespersonFilter('ALL');
          setSourceFilter('ALL');
          setProjectTypeFilter('ALL');
          setSearchQuery('');
        }}
        filterGroups={[
          {
            id: 'salesperson',
            label: 'Sales Rep',
            selectedValue: salespersonFilter,
            onChange: setSalespersonFilter,
            options: [
              { label: 'All Sales Reps', value: 'ALL' },
              { label: 'Siddharth Rao', value: 'Siddharth Rao' },
              { label: 'Natasha Bose', value: 'Natasha Bose' },
            ],
          },
          {
            id: 'type',
            label: 'Project Type',
            selectedValue: projectTypeFilter,
            onChange: setProjectTypeFilter,
            options: [
              { label: 'All Types', value: 'ALL' },
              { label: 'Commercial', value: 'Commercial' },
              { label: 'Residential', value: 'Residential' },
              { label: 'Industrial', value: 'Industrial' },
              { label: 'Renovation', value: 'Renovation' },
              { label: 'Infrastructure', value: 'Infrastructure' },
            ],
          },
          {
            id: 'source',
            label: 'Source',
            selectedValue: sourceFilter,
            onChange: setSourceFilter,
            options: [
              { label: 'All Sources', value: 'ALL' },
              { label: 'Website', value: 'Website' },
              { label: 'Direct Enquiry', value: 'Direct Enquiry' },
              { label: 'Referral', value: 'Referral' },
              { label: 'Existing Client', value: 'Existing Client' },
              { label: 'IndiaMART', value: 'IndiaMART' },
              { label: 'Google Ads', value: 'Google Ads' },
            ],
          },
        ]}
      />

      {/* VIEW 1: KANBAN BOARD (Desktop horizontal columns + Mobile stacked stage cards) */}
      {viewMode === 'kanban' && (
        <div className="space-y-4">
          {/* Desktop Kanban (> md): Horizontal Scroll Multi-Column Board */}
          <div className="hidden md:flex gap-3 overflow-x-auto pb-6 pt-1 select-none min-h-[600px]">
            {CRM_PIPELINE_STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
              const totalBudget = stageLeads.reduce((acc, l) => acc + l.budget, 0);

              return (
                <div
                  key={stage.id}
                  className="w-72 flex-shrink-0 bg-slate-100/70 rounded-xl border border-slate-200/90 flex flex-col max-h-[800px]"
                >
                  {/* Column Header */}
                  <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white rounded-t-xl">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${stage.dot}`} />
                      <h3 className="font-bold text-xs text-slate-800">{stage.label}</h3>
                    </div>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                      {stageLeads.length}
                    </span>
                  </div>

                  {/* Column Total Budget */}
                  {totalBudget > 0 && (
                    <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500 font-mono flex items-center justify-between">
                      <span>Total Volume:</span>
                      <span className="font-bold text-slate-700">{formatCurrency(totalBudget)}</span>
                    </div>
                  )}

                  {/* Cards Scroll Area */}
                  <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                    {stageLeads.length > 0 ? (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => handleOpenLeadDetail(lead)}
                          className="p-3 bg-white rounded-lg border border-slate-200/80 shadow-card hover:shadow-subtle hover:border-amber-500 cursor-pointer transition-all space-y-2 group"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-50 px-1 rounded">
                              {lead.id}
                            </span>
                            <span className={cn('text-[10px] font-medium', lead.daysInStage > 7 ? 'text-amber-700 font-bold' : 'text-slate-400')}>
                              {lead.daysInStage}d in stage
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-xs text-slate-900 group-hover:text-amber-700 leading-snug">
                              {lead.customerName}
                            </h4>
                            {lead.company && (
                              <p className="text-[11px] text-slate-500 truncate">{lead.company}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                            <span className="font-mono font-bold text-slate-900">
                              {formatCurrency(lead.budget)}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                              {lead.projectType}
                            </span>
                          </div>

                          {/* Sales Rep Avatar & Quick Move */}
                          <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                            <div className="flex items-center gap-1.5 truncate">
                              <Avatar name={lead.assignedSalesperson} size="xs" />
                              <span className="text-[10px] truncate">{lead.assignedSalesperson.split(' ')[0]}</span>
                            </div>

                            {/* Stage Mover Selector */}
                            <select
                              value={lead.stage}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                const next = e.target.value as LeadStage;
                                if (next === 'lost') {
                                  setLostModalLead(lead);
                                } else {
                                  updateLeadStage(lead.id, next);
                                }
                              }}
                              className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 font-medium hover:border-slate-300"
                            >
                              {CRM_PIPELINE_STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  → {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        No leads in stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile Kanban (< md): Grouped Stage Cards (Impractical to touch drag, so use native dropdowns) */}
          <div className="block md:hidden space-y-4">
            {CRM_PIPELINE_STAGES.map((stage) => {
              const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
              if (stageLeads.length === 0) return null;

              return (
                <div key={stage.id} className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
                  <div className={`p-3 border-b flex items-center justify-between ${stage.bg}`}>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${stage.dot}`} />
                      <h4 className={`font-bold text-xs uppercase tracking-wider ${stage.color}`}>
                        {stage.label}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white text-slate-700 shadow-2xs">
                      {stageLeads.length} leads
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => handleOpenLeadDetail(lead)}
                        className="p-3.5 space-y-2 active:bg-slate-50 min-h-[44px]"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h5 className="font-bold text-sm text-slate-900">{lead.customerName}</h5>
                            <p className="text-xs text-slate-500">{lead.location} • {lead.projectType}</p>
                          </div>
                          <span className="font-mono font-bold text-sm text-amber-700">
                            {formatCurrency(lead.budget)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-400">Rep: {lead.assignedSalesperson}</span>
                          <select
                            value={lead.stage}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => {
                              e.stopPropagation();
                              const next = e.target.value as LeadStage;
                              if (next === 'lost') {
                                setLostModalLead(lead);
                              } else {
                                updateLeadStage(lead.id, next);
                              }
                            }}
                            className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700 font-semibold"
                          >
                            {CRM_PIPELINE_STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                Move to: {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: LIST VIEW */}
      {viewMode === 'list' && (
        <DataTable<Lead>
          data={filteredLeads}
          columns={listColumns}
          pageSize={10}
          onRowClick={handleOpenLeadDetail}
          searchable={false}
        />
      )}

      {/* Lost Reason Modal */}
      {lostModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setLostModalLead(null)} />
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-md w-full p-5 relative z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Mark Lead as Lost</h3>
                <p className="text-xs text-slate-500 mt-0.5">{lostModalLead.customerName} ({lostModalLead.id})</p>
              </div>
              <button onClick={() => setLostModalLead(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Primary Reason for Loss *</label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value as Lead['lostReason'])}
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                >
                  <option value="Budget">Budget / Price Mismatch</option>
                  <option value="Timeline">Timeline / Schedule Conflict</option>
                  <option value="Competitor">Lost to Competitor (L&T, Shapoorji, etc.)</option>
                  <option value="Not Serious">Client Not Serious / Shelved Project</option>
                  <option value="Other">Other / Regulatory Delay</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700">Competitor / Debrief Notes</label>
                <textarea
                  rows={3}
                  value={lostNotes}
                  onChange={(e) => setLostNotes(e.target.value)}
                  placeholder="Record competitor rates, client feedback, or reasons for future retrospective..."
                  className="mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setLostModalLead(null)}
                className="px-3 py-1.5 text-xs text-slate-600 rounded-lg hover:bg-slate-100 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLost}
                className="px-4 py-2 text-xs bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm"
              >
                Confirm Lost Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
