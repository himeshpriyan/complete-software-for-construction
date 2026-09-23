import { useAppStore } from '../store/useAppStore';
import { Lead, LeadStage, SiteVisit, FollowUp, LeadActivity } from '../types';

export const getLeads = async (stage?: LeadStage | 'ALL', query?: string, salesperson?: string): Promise<Lead[]> => {
  let leads = useAppStore.getState().leads;

  if (stage && stage !== 'ALL') {
    leads = leads.filter((l) => l.stage === stage);
  }

  if (salesperson && salesperson !== 'ALL') {
    leads = leads.filter((l) => l.assignedSalesperson === salesperson);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase();
    leads = leads.filter(
      (l) =>
        l.customerName.toLowerCase().includes(q) ||
        (l.company && l.company.toLowerCase().includes(q)) ||
        l.location.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q)
    );
  }

  return leads;
};

export const getLeadById = async (id: string): Promise<Lead | undefined> => {
  return useAppStore.getState().leads.find((l) => l.id === id);
};

export const createLead = async (leadData: Omit<Lead, 'id' | 'daysInStage' | 'createdDate' | 'activities'>): Promise<Lead> => {
  return useAppStore.getState().createLead(leadData);
};

export const updateLeadStage = async (
  id: string,
  newStage: LeadStage,
  lostReason?: Lead['lostReason'],
  lostNotes?: string
): Promise<void> => {
  useAppStore.getState().updateLeadStage(id, newStage, lostReason, lostNotes);
};

export const logLeadActivity = async (
  leadId: string,
  activity: Omit<LeadActivity, 'id' | 'timestamp' | 'relativeTime'>
): Promise<void> => {
  useAppStore.getState().addLeadActivity(leadId, activity);
};

export const getSiteVisits = async (status?: SiteVisit['status'] | 'ALL'): Promise<SiteVisit[]> => {
  let visits = useAppStore.getState().siteVisits;
  if (status && status !== 'ALL') {
    visits = visits.filter((v) => v.status === status);
  }
  return visits;
};

export const createSiteVisit = async (visitData: Omit<SiteVisit, 'id'>): Promise<SiteVisit> => {
  return useAppStore.getState().createSiteVisit(visitData);
};

export const updateSiteVisitStatus = async (
  id: string,
  status: SiteVisit['status'],
  remarks?: string
): Promise<void> => {
  useAppStore.getState().updateSiteVisitStatus(id, status, remarks);
};

export const getFollowUps = async (status?: FollowUp['status'] | 'ALL'): Promise<FollowUp[]> => {
  let followUps = useAppStore.getState().followUps;
  if (status && status !== 'ALL') {
    followUps = followUps.filter((f) => f.status === status);
  }
  return followUps;
};

export const completeFollowUp = async (id: string): Promise<void> => {
  useAppStore.getState().completeFollowUp(id);
};

export const rescheduleFollowUp = async (id: string, newDate: string, newTime: string): Promise<void> => {
  useAppStore.getState().rescheduleFollowUp(id, newDate, newTime);
};

export const getCRMAnalytics = async () => {
  const leads = useAppStore.getState().leads;
  const siteVisits = useAppStore.getState().siteVisits;

  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.stage === 'won');
  const wonValue = wonLeads.reduce((acc, l) => acc + l.budget, 0);
  const conversionRate = totalLeads > 0 ? ((wonLeads.length / totalLeads) * 100).toFixed(1) : '0';
  const siteVisitsCount = siteVisits.length;
  const quotationsSent = leads.filter((l) => ['quotation', 'negotiation', 'approved', 'contract', 'won'].includes(l.stage)).length;
  const totalPipelineValue = leads.filter((l) => l.stage !== 'lost').reduce((acc, l) => acc + l.budget, 0);

  // Leads by stage for funnel
  const stageCounts = [
    { stage: 'New Lead', count: leads.filter((l) => l.stage === 'new_lead').length },
    { stage: 'Contacted', count: leads.filter((l) => l.stage === 'contacted').length },
    { stage: 'Req. Collected', count: leads.filter((l) => l.stage === 'requirement_collected').length },
    { stage: 'Site Visit', count: leads.filter((l) => l.stage === 'site_visit').length },
    { stage: 'Estimation', count: leads.filter((l) => l.stage === 'estimation').length },
    { stage: 'Quotation', count: leads.filter((l) => l.stage === 'quotation').length },
    { stage: 'Negotiation', count: leads.filter((l) => l.stage === 'negotiation').length },
    { stage: 'Approved', count: leads.filter((l) => l.stage === 'approved').length },
    { stage: 'Contract', count: leads.filter((l) => l.stage === 'contract').length },
    { stage: 'Won', count: leads.filter((l) => l.stage === 'won').length },
  ];

  // Leads by source
  const sourceMap: Record<string, number> = {};
  leads.forEach((l) => {
    sourceMap[l.source] = (sourceMap[l.source] || 0) + 1;
  });
  const sourceData = Object.entries(sourceMap).map(([source, count]) => ({
    name: source,
    value: count,
  }));

  // 6-month sales trend mock data
  const monthlyTrends = [
    { month: 'Apr 2026', leads: 12, wonValueCr: 18.5, quotations: 5 },
    { month: 'May 2026', leads: 15, wonValueCr: 24.0, quotations: 7 },
    { month: 'Jun 2026', leads: 18, wonValueCr: 31.5, quotations: 8 },
    { month: 'Jul 2026', leads: 22, wonValueCr: 28.0, quotations: 10 },
    { month: 'Aug 2026', leads: 20, wonValueCr: 38.0, quotations: 11 },
    { month: 'Sep 2026', leads: 25, wonValueCr: 42.5, quotations: 14 },
  ];

  return {
    totalLeads,
    conversionRate,
    siteVisitsCount,
    quotationsSent,
    wonValue,
    totalPipelineValue,
    stageCounts,
    sourceData,
    monthlyTrends,
  };
};
