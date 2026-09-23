import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Estimate, EstimateLineItem, ProjectType } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Calculator,
  Plus,
  Search,
  Building2,
  FileSpreadsheet,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Trash2,
  Edit3,
  CheckCircle2,
  Sparkles,
  Layers,
  Percent,
} from 'lucide-react';

export const EstimatesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { estimates, leads, createEstimate, updateEstimate } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Modal / Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEstimateId, setEditingEstimateId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [leadId, setLeadId] = useState(leads[0]?.id || '');
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>('Residential');
  const [builtUpArea, setBuiltUpArea] = useState('1,20,000 sq.ft');
  const [structureType, setStructureType] = useState<Estimate['structureType']>('RCC Framed');
  const [notes, setNotes] = useState('');
  const [profitMarginPct, setProfitMarginPct] = useState<number>(12);
  const [gstPct, setGstPct] = useState<number>(12);
  const [estimatorName, setEstimatorName] = useState('Priya Sundaram (Chief QS)');
  const [version, setVersion] = useState('Rev 1.0');

  // Interactive line items for live recalculation
  const [lineItems, setLineItems] = useState<EstimateLineItem[]>([
    {
      id: 'item-1',
      category: 'Material',
      description: 'Ready-Mix Concrete M30 / M35 Pumped',
      unit: 'cum',
      quantity: 4200,
      rate: 4850,
      amount: 4200 * 4850,
    },
    {
      id: 'item-2',
      category: 'Material',
      description: 'TMT FE500D Reinforcement Steel Bars',
      unit: 'MT',
      quantity: 650,
      rate: 64500,
      amount: 650 * 64500,
    },
    {
      id: 'item-3',
      category: 'Labour',
      description: 'Structural shuttering, bar-bending, and pouring gang',
      unit: 'sq.ft',
      quantity: 120000,
      rate: 480,
      amount: 120000 * 480,
    },
    {
      id: 'item-4',
      category: 'Equipment',
      description: 'Tower crane and heavy concrete boom placer rental',
      unit: 'month',
      quantity: 12,
      rate: 450000,
      amount: 12 * 450000,
    },
    {
      id: 'item-5',
      category: 'Transport',
      description: 'Transit mixer haulage & site dumping logistics',
      unit: 'trip',
      quantity: 850,
      rate: 8500,
      amount: 850 * 8500,
    },
    {
      id: 'item-6',
      category: 'Overhead',
      description: 'Site engineering supervision, survey, and QA laboratory',
      unit: 'month',
      quantity: 12,
      rate: 650000,
      amount: 12 * 650000,
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Live client-side calculation breakdown
  const calculations = useMemo(() => {
    const materialCost = lineItems
      .filter((i) => i.category === 'Material')
      .reduce((sum, i) => sum + i.amount, 0);

    const labourCost = lineItems
      .filter((i) => i.category === 'Labour')
      .reduce((sum, i) => sum + i.amount, 0);

    const equipmentCost = lineItems
      .filter((i) => i.category === 'Equipment')
      .reduce((sum, i) => sum + i.amount, 0);

    const transportCost = lineItems
      .filter((i) => i.category === 'Transport')
      .reduce((sum, i) => sum + i.amount, 0);

    const overheadCost = lineItems
      .filter((i) => i.category === 'Overhead')
      .reduce((sum, i) => sum + i.amount, 0);

    const directCost = materialCost + labourCost + equipmentCost + transportCost + overheadCost;
    const profitAmount = (directCost * profitMarginPct) / 100;
    const subtotal = directCost + profitAmount;
    const gstAmount = (subtotal * gstPct) / 100;
    const grandTotal = subtotal + gstAmount;

    return {
      materialCost,
      labourCost,
      equipmentCost,
      transportCost,
      overheadCost,
      directCost,
      profitAmount,
      subtotal,
      gstAmount,
      grandTotal,
    };
  }, [lineItems, profitMarginPct, gstPct]);

  // Overall metric totals
  const totalEstimatesVal = useMemo(
    () => estimates.reduce((sum, e) => sum + e.totalEstimateValue, 0),
    [estimates]
  );
  const approvedCount = useMemo(
    () => estimates.filter((e) => e.status === 'approved' || e.status === 'converted').length,
    [estimates]
  );

  // Filtered estimates list
  const filteredEstimates = useMemo(() => {
    return estimates.filter((e) => {
      if (typeFilter !== 'ALL' && e.projectType !== typeFilter) return false;
      if (statusFilter !== 'ALL' && e.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = e.title.toLowerCase().includes(q);
        const matchesProj = e.projectName.toLowerCase().includes(q);
        const matchesLead = (e.leadName || '').toLowerCase().includes(q);
        const matchesNum = e.estimateNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesProj && !matchesLead && !matchesNum) return false;
      }
      return true;
    });
  }, [estimates, typeFilter, statusFilter, searchQuery]);

  // Handle open editor for new estimate
  const handleOpenNew = () => {
    setEditingEstimateId(null);
    setTitle('New Construction Cost Estimate');
    const firstLead = leads[0];
    setLeadId(firstLead ? firstLead.id : '');
    setProjectName(firstLead ? `${firstLead.customerName} Commercial Complex` : 'Skyline Heights');
    setProjectType(firstLead ? firstLead.projectType : 'Commercial');
    setBuiltUpArea(firstLead ? firstLead.builtUpArea : '1,50,000 sq.ft');
    setStructureType('RCC Framed');
    setNotes('Standardized structural take-off based on preliminary schematic drawings.');
    setProfitMarginPct(12);
    setGstPct(12);
    setIsEditorOpen(true);
  };

  // Handle open editor for editing existing
  const handleOpenEdit = (est: Estimate) => {
    setEditingEstimateId(est.id);
    setTitle(est.title);
    setLeadId(est.leadId || '');
    setProjectName(est.projectName);
    setProjectType(est.projectType);
    setBuiltUpArea(est.builtUpArea);
    setStructureType(est.structureType);
    setNotes(est.notes);
    setProfitMarginPct(est.profitMarginPct);
    setGstPct(est.gstPct);
    setLineItems([...est.lineItems]);
    setEstimatorName(est.estimatorName);
    setVersion(est.version);
    setIsEditorOpen(true);
  };

  // Line item updates with real client-side math
  const handleItemChange = (index: number, field: keyof EstimateLineItem, val: any) => {
    setLineItems((prev) => {
      const copy = [...prev];
      const target = { ...copy[index] };
      if (field === 'quantity' || field === 'rate') {
        const numVal = Math.max(0, Number(val) || 0);
        target[field] = numVal as never;
        target.amount = (field === 'quantity' ? numVal : target.quantity) * (field === 'rate' ? numVal : target.rate);
      } else {
        target[field] = val as never;
      }
      copy[index] = target;
      return copy;
    });
  };

  const handleAddLineItem = () => {
    const newItem: EstimateLineItem = {
      id: `item-${Date.now().toString().slice(-4)}`,
      category: 'Material',
      description: 'New Line Item Specification',
      unit: 'sq.m',
      quantity: 100,
      rate: 1500,
      amount: 150000,
    };
    setLineItems((prev) => [...prev, newItem]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Save Estimate
  const handleSaveEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    const selLead = leads.find((l) => l.id === leadId);

    if (editingEstimateId) {
      updateEstimate(editingEstimateId, {
        title,
        leadId,
        leadName: selLead ? selLead.customerName : undefined,
        projectName,
        projectType,
        builtUpArea,
        structureType,
        notes,
        materialCost: calculations.materialCost,
        labourCost: calculations.labourCost,
        equipmentCost: calculations.equipmentCost,
        transportCost: calculations.transportCost,
        overheadCost: calculations.overheadCost,
        profitMarginPct,
        profitAmount: calculations.profitAmount,
        subtotal: calculations.subtotal,
        gstPct,
        gstAmount: calculations.gstAmount,
        totalEstimateValue: calculations.grandTotal,
        lineItems,
        estimatorName,
        version,
      });
      showToast(`Updated estimate ${editingEstimateId} successfully`);
    } else {
      const created = createEstimate({
        title,
        leadId,
        leadName: selLead ? selLead.customerName : undefined,
        projectName,
        projectType,
        builtUpArea,
        structureType,
        notes,
        materialCost: calculations.materialCost,
        labourCost: calculations.labourCost,
        equipmentCost: calculations.equipmentCost,
        transportCost: calculations.transportCost,
        overheadCost: calculations.overheadCost,
        profitMarginPct,
        profitAmount: calculations.profitAmount,
        subtotal: calculations.subtotal,
        gstPct,
        gstAmount: calculations.gstAmount,
        totalEstimateValue: calculations.grandTotal,
        lineItems,
        status: 'draft',
        estimatorName,
        version,
      });
      showToast(`Created new estimate ${created.estimateNumber}`);
    }

    setIsEditorOpen(false);
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
        title="Cost Estimation & Quantity Survey"
        subtitle="Live reactive construction cost breakdown, direct component modeling, and client margin calculation"
        badge={`${estimates.length} Estimates`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/estimation/boq')}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
              <span>BOQ Builder</span>
            </button>
            <button
              onClick={handleOpenNew}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Estimate</span>
            </button>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Estimates"
          value={estimates.length.toString()}
          subtext="Active pre-bid cost models"
          icon="Calculator"
          trend="up"
        />
        <StatCard
          title="Cumulative Estimate Value"
          value={`₹ ${(totalEstimatesVal / 10000000).toFixed(1)} Cr`}
          subtext="Total surveyed value"
          icon="TrendingUp"
          trend="up"
        />
        <StatCard
          title="Approved Estimates"
          value={approvedCount.toString()}
          subtext="Ready for BOQ & Quotations"
          icon="CheckCircle2"
          trend="up"
        />
        <StatCard
          title="Average Margin"
          value="12.0%"
          subtext="Gross markup on direct cost"
          icon="Percent"
          trend="neutral"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search estimate, project, or lead..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Types</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="converted">Converted to Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estimates Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEstimates.map((est) => (
          <div
            key={est.id}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  {est.estimateNumber}
                </span>
                <StatusBadge
                  variant={
                    est.status === 'converted'
                      ? 'success'
                      : est.status === 'approved'
                      ? 'info'
                      : est.status === 'under_review'
                      ? 'warning'
                      : 'neutral'
                  }
                  label={est.status.replace('_', ' ').toUpperCase()}
                  size="sm"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {est.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{est.projectName}</p>
              </div>

              {/* Specs Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {est.projectType}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {est.builtUpArea}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {est.structureType}
                </span>
              </div>

              {/* Component breakdown bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Materials: ₹ {(est.materialCost / 10000000).toFixed(2)} Cr</span>
                  <span>Labour: ₹ {(est.labourCost / 10000000).toFixed(2)} Cr</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(est.materialCost / (est.subtotal || 1)) * 100}%` }}
                    className="bg-amber-500 h-full"
                    title="Materials"
                  />
                  <div
                    style={{ width: `${(est.labourCost / (est.subtotal || 1)) * 100}%` }}
                    className="bg-blue-500 h-full"
                    title="Labour"
                  />
                  <div
                    style={{ width: `${(est.equipmentCost / (est.subtotal || 1)) * 100}%` }}
                    className="bg-emerald-500 h-full"
                    title="Equipment"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Estimate</span>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                  ₹ {(est.totalEstimateValue / 10000000).toFixed(2)} Cr
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(est)}
                  className="p-1.5 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 bg-slate-100 dark:bg-slate-800 rounded-md transition-colors"
                  title="Edit & Recalculate"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/estimation/boq')}
                  className="px-2.5 py-1.5 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-400 rounded-md text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <span>BOQ</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULL ESTIMATE BUILDER & REAL-TIME RECALCULATOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {editingEstimateId ? `Edit & Recalculate: ${editingEstimateId}` : 'Interactive Cost Estimator'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust line item quantities, unit rates, or margins to see instant client-side cost rollup.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-base font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEstimate} className="space-y-6">
              {/* Top Meta Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Estimate Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Linked Lead / Client</label>
                  <select
                    value={leadId}
                    onChange={(e) => setLeadId(e.target.value)}
                    className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                  >
                    {leads.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.customerName} ({l.location})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Built-Up Area</label>
                  <input
                    type="text"
                    value={builtUpArea}
                    onChange={(e) => setBuiltUpArea(e.target.value)}
                    placeholder="e.g. 2,40,000 sq.ft"
                    className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Structure Type</label>
                  <select
                    value={structureType}
                    onChange={(e) => setStructureType(e.target.value as Estimate['structureType'])}
                    className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                  >
                    <option value="RCC Framed">RCC Framed Structure</option>
                    <option value="Steel PEB">Pre-Engineered Building (PEB)</option>
                    <option value="Composite Structural">Composite Steel-Concrete</option>
                    <option value="Modular Prefab">Modular Prefab Pods</option>
                  </select>
                </div>
              </div>

              {/* LIVE RECALCULATING LINE ITEMS TABLE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Editable Cost Line Items ({lineItems.length})
                    </h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">
                      Live Recalculating
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddLineItem}
                    className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 w-24">Category</th>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5 w-20 text-center">Unit</th>
                        <th className="p-2.5 w-24 text-right">Quantity</th>
                        <th className="p-2.5 w-28 text-right">Rate (₹)</th>
                        <th className="p-2.5 w-32 text-right">Amount (₹)</th>
                        <th className="p-2.5 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {lineItems.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30">
                          <td className="p-2">
                            <select
                              value={item.category}
                              onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                              className="w-full text-[11px] p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            >
                              <option value="Material">Material</option>
                              <option value="Labour">Labour</option>
                              <option value="Equipment">Equipment</option>
                              <option value="Transport">Transport</option>
                              <option value="Overhead">Overhead</option>
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                              className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                              className="w-full text-xs p-1.5 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                              className="w-full text-xs p-1.5 text-right font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={item.rate}
                              onChange={(e) => handleItemChange(idx, 'rate', e.target.value)}
                              className="w-full text-xs p-1.5 text-right font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            ₹ {item.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveLineItem(idx)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Delete row"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CALCULATION ROLLUP & FINANCIAL CONTROLS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                {/* Left side: Component breakdown */}
                <div className="lg:col-span-6 space-y-2 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-3">
                    Sub-Component Rollup (Direct Costs)
                  </h4>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">1. Total Material Cost:</span>
                    <span className="font-mono font-semibold">₹ {calculations.materialCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">2. Total Direct Labour Cost:</span>
                    <span className="font-mono font-semibold">₹ {calculations.labourCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">3. Equipment & Plant Hire:</span>
                    <span className="font-mono font-semibold">₹ {calculations.equipmentCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">4. Transportation & Freight:</span>
                    <span className="font-mono font-semibold">₹ {calculations.transportCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">5. Site Engineering Overheads:</span>
                    <span className="font-mono font-semibold">₹ {calculations.overheadCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-slate-800 dark:text-slate-200 pt-2">
                    <span>Base Construction Prime Cost:</span>
                    <span className="font-mono">₹ {calculations.directCost.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Right side: Margins, GST & Final Rollup */}
                <div className="lg:col-span-6 space-y-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Contractor Profit Margin (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={profitMarginPct}
                        onChange={(e) => setProfitMarginPct(Number(e.target.value) || 0)}
                        className="w-full text-xs p-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                        Applicable GST Rate (%)
                      </label>
                      <select
                        value={gstPct}
                        onChange={(e) => setGstPct(Number(e.target.value) || 0)}
                        className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                      >
                        <option value="12">12% Works Contract GST</option>
                        <option value="18">18% Standard Commercial GST</option>
                        <option value="5">5% Affordable Housing GST</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 text-xs border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Profit Margin ({profitMarginPct}%):</span>
                      <span className="font-mono">₹ {calculations.profitAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Net Subtotal (Before Tax):</span>
                      <span className="font-mono">₹ {calculations.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>GST Amount ({gstPct}%):</span>
                      <span className="font-mono">₹ {calculations.gstAmount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* PROMINENT TOTAL ESTIMATE BANNER */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl shadow-md flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
                        Total Estimate Value
                      </span>
                      <p className="text-xl font-black font-mono">
                        ₹ {(calculations.grandTotal / 10000000).toFixed(2)} Cr
                      </p>
                    </div>
                    <span className="text-xs font-mono bg-black/20 px-2.5 py-1 rounded-md">
                      ₹ {calculations.grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Save & Finalize Estimate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
