import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  User,
  MessageSquare,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Compass,
  FileCheck2,
  Tag,
  DollarSign,
  ExternalLink,
} from 'lucide-react';
import { Lead, LeadActivity, LeadStage } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { CRM_PIPELINE_STAGES } from '../../data/crmSeed';
import { formatCurrency } from '../../utils/cn';
import { logLeadActivity, updateLeadStage } from '../../services/crmService';

interface LeadDetailPanelProps {
  lead: Lead;
  onClose: () => void;
  onScheduleSiteVisit?: (lead: Lead) => void;
  onMarkLost?: (lead: Lead) => void;
}

export const LeadDetailPanel: React.FC<LeadDetailPanelProps> = ({
  lead,
  onClose,
  onScheduleSiteVisit,
  onMarkLost,
}) => {
  const navigate = useNavigate();
  const [activeActivityTab, setActiveActivityTab] = useState<'note' | 'call' | 'whatsapp' | 'email'>('note');
  const [activityNote, setActivityNote] = useState('');
  const [currentLead, setCurrentLead] = useState<Lead>(lead);

  const stageConfig = CRM_PIPELINE_STAGES.find((s) => s.id === currentLead.stage) || CRM_PIPELINE_STAGES[0];

  const handleStageChange = async (newStage: LeadStage) => {
    if (newStage === 'lost' && onMarkLost) {
      onMarkLost(currentLead);
      return;
    }
    await updateLeadStage(currentLead.id, newStage);
    setCurrentLead({ ...currentLead, stage: newStage });
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityNote.trim()) return;

    const titles = {
      note: 'Field Note Added',
      call: 'Phone Call Logged',
      whatsapp: 'WhatsApp Communication',
      email: 'Email Interaction',
    };

    const newAct: Omit<LeadActivity, 'id' | 'timestamp' | 'relativeTime'> = {
      type: activeActivityTab,
      title: titles[activeActivityTab],
      notes: activityNote.trim(),
      authorName: 'Siddharth Rao',
      authorRole: 'Sales Head',
    };

    await logLeadActivity(currentLead.id, newAct);
    const added: LeadActivity = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: 'Today, Just now',
      relativeTime: 'Just now',
      ...newAct,
    };

    setCurrentLead({
      ...currentLead,
      activities: [added, ...currentLead.activities],
    });
    setActivityNote('');
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Lead Profile Header */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {currentLead.id}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${stageConfig.bg} ${stageConfig.color}`}>
                {stageConfig.label}
              </span>
              <span className="text-[11px] text-slate-400">
                {currentLead.daysInStage} days in stage
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">
              {currentLead.customerName}
            </h2>
            {currentLead.company && (
              <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-slate-400" />
                {currentLead.company}
              </p>
            )}
          </div>

          <div className="text-left sm:text-right space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Estimated Budget
            </span>
            <span className="text-xl font-black font-mono text-amber-700">
              {formatCurrency(currentLead.budget)}
            </span>
          </div>
        </div>

        {/* Quick Contact Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-xs">
          <a
            href={`tel:${currentLead.mobile}`}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-500 transition-colors"
          >
            <Phone className="h-3.5 w-3.5 text-emerald-600" />
            <span className="font-medium text-slate-700 truncate">{currentLead.mobile}</span>
          </a>
          <a
            href={`mailto:${currentLead.email}`}
            className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 hover:border-amber-500 transition-colors"
          >
            <Mail className="h-3.5 w-3.5 text-sky-600" />
            <span className="font-medium text-slate-700 truncate">{currentLead.email}</span>
          </a>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            <span className="font-medium text-slate-700 truncate">{currentLead.location}</span>
          </div>
        </div>
      </div>

      {/* Stage Progression Selector Bar */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Pipeline Progression Stage
          </label>
          <span className="text-[11px] text-amber-700 font-bold">
            Rep: {currentLead.assignedSalesperson}
          </span>
        </div>
        <select
          value={currentLead.stage}
          onChange={(e) => handleStageChange(e.target.value as LeadStage)}
          className="w-full px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
        >
          {CRM_PIPELINE_STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              Stage: {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Conversion Quick Actions */}
      <div className="flex flex-wrap gap-2">
        {currentLead.stage !== 'site_visit' && (
          <button
            onClick={() => onScheduleSiteVisit && onScheduleSiteVisit(currentLead)}
            className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Compass className="h-4 w-4" />
            <span>Schedule Site Visit</span>
          </button>
        )}
        <button
          onClick={() => handleStageChange('estimation')}
          className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <FileCheck2 className="h-4 w-4" />
          <span>Move to Estimation</span>
        </button>
        {currentLead.stage !== 'lost' && (
          <button
            onClick={() => onMarkLost && onMarkLost(currentLead)}
            className="px-3 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
          >
            Mark Lost
          </button>
        )}
      </div>

      {/* Commercial Lifecycle Deep-Link Flow */}
      <div className="p-3.5 bg-slate-900 rounded-xl text-white space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">
            Commercial Lifecycle Deep-Links
          </span>
          <span className="text-[10px] text-slate-400">Jump directly to downstream module</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { label: 'Site Visit', path: '/crm/site-visits' },
            { label: 'Estimate', path: '/estimation/estimates' },
            { label: 'Quotation', path: '/estimation/quotations' },
            { label: 'Contract', path: '/contracts' },
            { label: 'Project', path: '/projects' },
            { label: 'Billing', path: '/billing/ra-bills' },
            { label: 'Accounts', path: '/accounts/receivables' },
          ].map((step, idx, arr) => (
            <React.Fragment key={step.label}>
              <button
                onClick={() => {
                  onClose();
                  navigate(step.path);
                }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white font-medium text-[11px] transition-colors flex items-center gap-1"
              >
                <span>{step.label}</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-70" />
              </button>
              {idx < arr.length - 1 && <span className="text-slate-600 text-[10px]">→</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Scope & Requirements Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Project Requirements</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Type</span>
            <span className="font-bold text-slate-800">{currentLead.projectType}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Land Area</span>
            <span className="font-bold text-slate-800">{currentLead.landArea}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Built-up Area</span>
            <span className="font-bold text-slate-800">{currentLead.builtUpArea}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Expected Start</span>
            <span className="font-bold text-slate-800">{currentLead.expectedStartDate}</span>
          </div>
        </div>

        {currentLead.notes && (
          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-100 leading-relaxed">
            <span className="font-bold text-slate-900 block mb-0.5">Requirement Notes:</span>
            {currentLead.notes}
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>Acquisition Source: <strong className="text-slate-700">{currentLead.source}</strong></span>
          <span>Created on: {currentLead.createdDate}</span>
        </div>
      </div>

      {/* Log Activity Quick-Add Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Quick Log Activity</h4>
          <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
            {[
              { id: 'note', label: 'Note' },
              { id: 'call', label: 'Call' },
              { id: 'whatsapp', label: 'WhatsApp' },
              { id: 'email', label: 'Email' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveActivityTab(tab.id as typeof activeActivityTab)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition-all ${
                  activeActivityTab === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleAddActivity} className="space-y-2">
          <textarea
            rows={2}
            value={activityNote}
            onChange={(e) => setActivityNote(e.target.value)}
            placeholder={`Log details of your ${activeActivityTab} with ${currentLead.customerName}...`}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!activityNote.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Log Entry</span>
            </button>
          </div>
        </form>
      </div>

      {/* Vertical Activity Timeline */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>Interaction History & Timeline</span>
          <span className="text-[11px] text-slate-400 font-normal">
            {currentLead.activities.length} Events Logged
          </span>
        </h4>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {currentLead.activities.map((act) => {
            const iconMap = {
              note: <MessageSquare className="h-3 w-3 text-amber-600" />,
              call: <Phone className="h-3 w-3 text-emerald-600" />,
              whatsapp: <Send className="h-3 w-3 text-emerald-600" />,
              email: <Mail className="h-3 w-3 text-sky-600" />,
              site_visit: <Compass className="h-3 w-3 text-indigo-600" />,
              status_change: <CheckCircle2 className="h-3 w-3 text-amber-600" />,
            };

            return (
              <div key={act.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-6 top-1.5 h-4 w-4 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {iconMap[act.type]}
                      <span className="font-bold text-xs text-slate-900">{act.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{act.relativeTime}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-snug">{act.notes}</p>
                  <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>By: {act.authorName}</span>
                    <span>{act.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
