import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { BOQ, BOQItem, BOQTemplate } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  FolderDown,
  Save,
  Layers,
  Sparkles,
  Calculator,
  ArrowUpRight,
  Database,
  CheckCircle2,
  ChevronDown,
  Bot,
} from 'lucide-react';

const CATEGORIES: BOQItem['category'][] = [
  'Civil Works',
  'Structural & Steel',
  'Electrical',
  'Plumbing & Sanitary',
  'Finishes & Joinery',
];

export const BOQBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { boqs, boqTemplates, rateMaster, createBOQ, updateBOQ, saveAsBOQTemplate } = useAppStore();

  // Active BOQ selection
  const [selectedBoqId, setSelectedBoqId] = useState<string>(boqs[0]?.id || '');
  const activeBoq = useMemo(() => boqs.find((b) => b.id === selectedBoqId) || boqs[0], [boqs, selectedBoqId]);

  // Working state for active BOQ editing
  const [items, setItems] = useState<BOQItem[]>(activeBoq?.items || []);
  const [wastagePct, setWastagePct] = useState<number>(activeBoq?.wastagePct || 3.0);
  const [contingencyPct, setContingencyPct] = useState<number>(activeBoq?.contingencyPct || 2.0);
  const [profitPct, setProfitPct] = useState<number>(activeBoq?.profitPct || 12.0);
  const [gstPct, setGstPct] = useState<number>(activeBoq?.gstPct || 12.0);
  const [title, setTitle] = useState<string>(activeBoq?.title || 'BOQ Project');

  // Rate Master quick picker state
  const [ratePickerItemIndex, setRatePickerItemIndex] = useState<number | null>(null);

  // Template Modal states
  const [isLoadTemplateOpen, setIsLoadTemplateOpen] = useState(false);
  const [isSaveTemplateOpen, setIsSaveTemplateOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');

  // AI Assistant Modal state
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('G+14 residential tower, 60,000 sqft slab area, Mivan formwork, M40 concrete, Vitrified tile finish');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuggestedItems, setAiSuggestedItems] = useState<BOQItem[] | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync working state whenever selected BOQ changes
  const handleSelectBoq = (id: string) => {
    setSelectedBoqId(id);
    const target = boqs.find((b) => b.id === id);
    if (target) {
      setItems([...target.items]);
      setWastagePct(target.wastagePct);
      setContingencyPct(target.contingencyPct);
      setProfitPct(target.profitPct);
      setGstPct(target.gstPct);
      setTitle(target.title);
    }
  };

  // Live item modifications
  const handleItemChange = (index: number, field: keyof BOQItem, val: any) => {
    setItems((prev) => {
      const copy = [...prev];
      const target = { ...copy[index] };
      if (field === 'quantity' || field === 'rate') {
        const num = Math.max(0, Number(val) || 0);
        target[field] = num as never;
        target.amount = (field === 'quantity' ? num : target.quantity) * (field === 'rate' ? num : target.rate);
      } else {
        target[field] = val as never;
      }
      copy[index] = target;
      return copy;
    });
  };

  const handleAddItem = (cat: BOQItem['category']) => {
    const newItem: BOQItem = {
      id: `bi-${Date.now().toString().slice(-5)}`,
      category: cat,
      itemCode: `${cat.slice(0, 3).toUpperCase()}-${String(items.length + 1).padStart(3, '0')}`,
      description: `New ${cat} line item specification`,
      unit: 'sq.m',
      quantity: 100,
      rate: 1200,
      amount: 120000,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Apply Rate from Rate Master
  const handleApplyRate = (itemIndex: number, rateItem: typeof rateMaster[0]) => {
    setItems((prev) => {
      const copy = [...prev];
      const target = { ...copy[itemIndex] };
      target.description = rateItem.name;
      target.unit = rateItem.unit;
      target.rate = rateItem.currentRate;
      target.amount = target.quantity * rateItem.currentRate;
      target.remarks = `Rate synced from ${rateItem.supplier}`;
      copy[itemIndex] = target;
      return copy;
    });
    setRatePickerItemIndex(null);
    showToast(`Applied ${rateItem.name} rate (₹ ${rateItem.currentRate}/${rateItem.unit})`);
  };

  // Category group calculations
  const groupedItems = useMemo(() => {
    const map: Record<BOQItem['category'], { items: { item: BOQItem; originalIndex: number }[]; subtotal: number }> = {
      'Civil Works': { items: [], subtotal: 0 },
      'Structural & Steel': { items: [], subtotal: 0 },
      'Electrical': { items: [], subtotal: 0 },
      'Plumbing & Sanitary': { items: [], subtotal: 0 },
      'Finishes & Joinery': { items: [], subtotal: 0 },
    };

    items.forEach((item, index) => {
      if (map[item.category]) {
        map[item.category].items.push({ item, originalIndex: index });
        map[item.category].subtotal += item.amount;
      }
    });

    return map;
  }, [items]);

  // Bottom calculated adjustments rollup
  const calculationSummary = useMemo(() => {
    const rawTotal = items.reduce((sum, i) => sum + i.amount, 0);
    const wastageAmount = (rawTotal * wastagePct) / 100;
    const contingencyAmount = (rawTotal * contingencyPct) / 100;
    const directWithContingency = rawTotal + wastageAmount + contingencyAmount;
    const profitAmount = (directWithContingency * profitPct) / 100;
    const subtotal = directWithContingency + profitAmount;
    const gstAmount = (subtotal * gstPct) / 100;
    const grandTotal = subtotal + gstAmount;

    return {
      rawTotal,
      wastageAmount,
      contingencyAmount,
      directWithContingency,
      profitAmount,
      subtotal,
      gstAmount,
      grandTotal,
    };
  }, [items, wastagePct, contingencyPct, profitPct, gstPct]);

  // Save changes to current BOQ
  const handleSaveBOQ = () => {
    if (!activeBoq) return;
    updateBOQ(activeBoq.id, {
      title,
      items,
      wastagePct,
      contingencyPct,
      profitPct,
      gstPct,
      subtotal: calculationSummary.subtotal,
      grandTotal: calculationSummary.grandTotal,
    });
    showToast(`BOQ ${activeBoq.boqNumber} saved with updated adjustments`);
  };

  // Load from Template
  const handleLoadTemplate = (tpl: BOQTemplate) => {
    const newItems: BOQItem[] = tpl.items.map((tplItem, idx) => ({
      ...tplItem,
      id: `bi-${Date.now().toString().slice(-4)}-${idx}`,
      amount: tplItem.quantity * tplItem.rate,
    }));
    setItems(newItems);
    setTitle(`${tpl.name} - Project BOQ`);
    setIsLoadTemplateOpen(false);
    showToast(`Loaded ${tpl.items.length} items from ${tpl.name}`);
  };

  // Save as Template
  const handleSaveAsTemplateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTemplateName.trim()) return;

    saveAsBOQTemplate({
      name: newTemplateName,
      description: newTemplateDesc || `Custom user template with ${items.length} line items`,
      projectType: activeBoq?.projectType || 'Commercial',
      items: items.map(({ id, amount, ...rest }) => rest),
    });

    setIsSaveTemplateOpen(false);
    setNewTemplateName('');
    setNewTemplateDesc('');
    showToast('Saved current BOQ as reusable template');
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
        title="Bill of Quantities (BOQ) Builder"
        subtitle="Grouped category line items, template injection, Rate Master sync, and statutory adjustment markups"
        badge={`${items.length} Total Items`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsLoadTemplateOpen(true)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FolderDown className="w-3.5 h-3.5 text-blue-600" />
              <span>Load Template</span>
            </button>
            <button
              onClick={() => setIsSaveTemplateOpen(true)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-emerald-600" />
              <span>Save as Template</span>
            </button>
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-semibold rounded-lg transition shadow-sm flex items-center gap-1.5"
            >
              <Bot className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Estimate Assistant</span>
              <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono">Demo</span>
            </button>
            <button
              onClick={handleSaveBOQ}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save BOQ</span>
            </button>
          </div>
        }
      />

      {/* BOQ Selector & Top Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Active Project BOQ:</span>
          <select
            value={selectedBoqId}
            onChange={(e) => handleSelectBoq(e.target.value)}
            className="w-full md:w-80 text-xs font-semibold py-2 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
          >
            {boqs.map((b) => (
              <option key={b.id} value={b.id}>
                {b.boqNumber} — {b.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-600 dark:text-slate-400">
          <div>
            <span>Base Items Sum: </span>
            <strong className="text-slate-900 dark:text-slate-100">
              ₹ {(calculationSummary.rawTotal / 10000000).toFixed(2)} Cr
            </strong>
          </div>
          <div>
            <span>Final Total: </span>
            <strong className="text-amber-600 dark:text-amber-400 text-sm">
              ₹ {(calculationSummary.grandTotal / 10000000).toFixed(2)} Cr
            </strong>
          </div>
        </div>
      </div>

      {/* GROUPED HIERARCHICAL BOQ TABLES */}
      <div className="space-y-6">
        {CATEGORIES.map((cat) => {
          const group = groupedItems[cat];
          return (
            <div
              key={cat}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
            >
              {/* Category Group Header */}
              <div className="bg-slate-100 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                    {cat}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    ({group.items.length} {group.items.length === 1 ? 'item' : 'items'})
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    Subtotal: ₹ {group.subtotal.toLocaleString('en-IN')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddItem(cat)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 px-2.5 py-1 rounded transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Item</span>
                  </button>
                </div>
              </div>

              {/* Items Table */}
              {group.items.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 italic">
                  No line items in this category. Click &quot;Add Item&quot; to include specifications.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 font-semibold border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="p-2.5 w-24">Item Code</th>
                        <th className="p-2.5">Description & Specifications</th>
                        <th className="p-2.5 w-20 text-center">Unit</th>
                        <th className="p-2.5 w-24 text-right">Quantity</th>
                        <th className="p-2.5 w-28 text-right">Rate (₹)</th>
                        <th className="p-2.5 w-32 text-right">Amount (₹)</th>
                        <th className="p-2.5 w-28 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {group.items.map(({ item, originalIndex }) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.itemCode}
                              onChange={(e) => handleItemChange(originalIndex, 'itemCode', e.target.value)}
                              className="w-full text-[11px] font-mono p-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleItemChange(originalIndex, 'description', e.target.value)}
                              className="w-full text-xs p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            />
                            {item.remarks && (
                              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.remarks}</p>
                            )}
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => handleItemChange(originalIndex, 'unit', e.target.value)}
                              className="w-full text-xs p-1 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => handleItemChange(originalIndex, 'quantity', e.target.value)}
                              className="w-full text-xs p-1 text-right font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              value={item.rate}
                              onChange={(e) => handleItemChange(originalIndex, 'rate', e.target.value)}
                              className="w-full text-xs p-1 text-right font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                            ₹ {item.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => setRatePickerItemIndex(originalIndex)}
                                className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 text-[10px] font-semibold text-slate-600 hover:text-amber-700 rounded transition-colors"
                                title="Sync from Rate Master"
                              >
                                Sync Rate
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(originalIndex)}
                                className="text-slate-400 hover:text-rose-600 p-1"
                                title="Delete row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* BOTTOM CALCULATED ADJUSTMENT ROWS & FINAL ROLLUP */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          Statutory Adjustments, Overheads & Margin Ledger
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Material Wastage (%)</label>
            <input
              type="number"
              step="0.5"
              value={wastagePct}
              onChange={(e) => setWastagePct(Number(e.target.value) || 0)}
              className="w-full text-xs p-2 font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
            <p className="text-[10px] text-slate-400 mt-1">₹ {calculationSummary.wastageAmount.toLocaleString('en-IN')}</p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Site Contingency (%)</label>
            <input
              type="number"
              step="0.5"
              value={contingencyPct}
              onChange={(e) => setContingencyPct(Number(e.target.value) || 0)}
              className="w-full text-xs p-2 font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
            <p className="text-[10px] text-slate-400 mt-1">₹ {calculationSummary.contingencyAmount.toLocaleString('en-IN')}</p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Contractor Profit (%)</label>
            <input
              type="number"
              step="0.5"
              value={profitPct}
              onChange={(e) => setProfitPct(Number(e.target.value) || 0)}
              className="w-full text-xs p-2 font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
            <p className="text-[10px] text-slate-400 mt-1">₹ {calculationSummary.profitAmount.toLocaleString('en-IN')}</p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Works Contract GST (%)</label>
            <input
              type="number"
              value={gstPct}
              onChange={(e) => setGstPct(Number(e.target.value) || 0)}
              className="w-full text-xs p-2 font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
            />
            <p className="text-[10px] text-slate-400 mt-1">₹ {calculationSummary.gstAmount.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Grand Total Bar */}
        <div className="p-4 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-200">
              BOQ Grand Total (Including Taxes & Margins)
            </span>
            <p className="text-2xl font-black font-mono">
              ₹ {(calculationSummary.grandTotal / 10000000).toFixed(2)} Crores
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono bg-black/20 px-3 py-1.5 rounded-lg">
              ₹ {calculationSummary.grandTotal.toLocaleString('en-IN')}
            </span>
            <button
              onClick={() => navigate('/estimation/quotations')}
              className="px-4 py-2 bg-white text-amber-700 hover:bg-amber-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
            >
              <span>Generate Quotation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* RATE MASTER QUICK PICKER MODAL */}
      {ratePickerItemIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Rate Master Reference</h3>
                  <p className="text-xs text-slate-500">Select standard rate to apply to row #{ratePickerItemIndex + 1}</p>
                </div>
              </div>
              <button
                onClick={() => setRatePickerItemIndex(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {rateMaster.map((rate) => (
                <div
                  key={rate.id}
                  onClick={() => handleApplyRate(ratePickerItemIndex, rate)}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-50/20 dark:hover:bg-amber-950/20 cursor-pointer transition-all"
                >
                  <div>
                    <span className="font-mono text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      {rate.code}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{rate.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      {rate.category} • Supplier: {rate.supplier}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      ₹ {rate.currentRate.toLocaleString('en-IN')} / {rate.unit}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Verified Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LOAD FROM TEMPLATE MODAL */}
      {isLoadTemplateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600">
                  <FolderDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Load BOQ Template</h3>
                  <p className="text-xs text-slate-500">Inject standardized item catalog into active project</p>
                </div>
              </div>
              <button
                onClick={() => setIsLoadTemplateOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {boqTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleLoadTemplate(tpl)}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 cursor-pointer transition-all space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{tpl.name}</h4>
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-semibold">
                      {tpl.projectType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{tpl.description}</p>
                  <p className="text-[11px] text-slate-400 pt-1 font-mono">Contains {tpl.items.length} seeded items</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SAVE AS TEMPLATE MODAL */}
      {isSaveTemplateOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
                  <Save className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Save as BOQ Template</h3>
                  <p className="text-xs text-slate-500">Save current line items for reuse in future bids</p>
                </div>
              </div>
              <button
                onClick={() => setIsSaveTemplateOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAsTemplateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Standard Commercial Fitout BOQ"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Description / Use Case
                </label>
                <textarea
                  rows={2}
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  placeholder="e.g. Standard specifications for multi-tenant retail building..."
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSaveTemplateOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* AI Estimate Assistant Modal (Illustrative Demo) */}
      {isAiAssistantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-900 to-slate-900 text-white">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                  <Bot className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    AI Estimate & BOQ Assistant
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                      Illustrative Demo
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Describe your project scope to generate an instant baseline BOQ with quantities & rates
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiAssistantOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Describe Project Specifications / Bill Scope:
                </label>
                <textarea
                  rows={3}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. G+14 residential tower, 60,000 sqft slab area, Mivan formwork, M40 concrete..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Sample Preset Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] text-slate-400 font-medium">Quick Sample Prompts:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Highrise Residential Tower (G+24, Mivan)',
                    'Commercial IT Tech Park (Grade-A Office, Glass Facade)',
                    'Elevated Metro Viaduct (Precast U-Girders & Piers)',
                    'Industrial PEB Warehouse (Heavy Steel Truss Shed)',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiPrompt(preset)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] transition"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={isGeneratingAi}
                  onClick={() => {
                    setIsGeneratingAi(true);
                    setTimeout(() => {
                      setIsGeneratingAi(false);
                      setAiSuggestedItems([
                        {
                          id: `ai-1-${Date.now()}`,
                          category: 'Civil Works',
                          itemCode: 'CIV-081',
                          description: 'Earthwork excavation in all kinds of soil including shoring, strutting & dewatering',
                          unit: 'cu.m',
                          quantity: 4500,
                          rate: 220,
                          amount: 990000,
                        },
                        {
                          id: `ai-2-${Date.now()}`,
                          category: 'Civil Works',
                          itemCode: 'CIV-082',
                          description: 'Plain Cement Concrete (PCC) 1:4:8 under foundations and raft leveling bed',
                          unit: 'cu.m',
                          quantity: 380,
                          rate: 4200,
                          amount: 1596000,
                        },
                        {
                          id: `ai-3-${Date.now()}`,
                          category: 'Structural & Steel',
                          itemCode: 'STR-083',
                          description: 'Design Mix Ready Mix Concrete M40 Grade in Columns, Shear Walls & Raft',
                          unit: 'cu.m',
                          quantity: 2600,
                          rate: 6850,
                          amount: 17810000,
                        },
                        {
                          id: `ai-4-${Date.now()}`,
                          category: 'Structural & Steel',
                          itemCode: 'STR-084',
                          description: 'Thermo-Mechanically Treated (TMT) Fe550D High Yield Rebars cutting & bending',
                          unit: 'MT',
                          quantity: 280,
                          rate: 64500,
                          amount: 18060000,
                        },
                        {
                          id: `ai-5-${Date.now()}`,
                          category: 'Structural & Steel',
                          itemCode: 'STR-085',
                          description: 'Aluminium Mivan Modular Formwork system shuttering for monolithic casting',
                          unit: 'sq.m',
                          quantity: 12500,
                          rate: 480,
                          amount: 6000000,
                        },
                        {
                          id: `ai-6-${Date.now()}`,
                          category: 'Finishes & Joinery',
                          itemCode: 'FIN-086',
                          description: 'Double charged vitrified tile flooring 800x800mm with polymer modified adhesive',
                          unit: 'sq.m',
                          quantity: 5200,
                          rate: 1150,
                          amount: 5980000,
                        },
                      ]);
                    }, 600);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAi ? 'Synthesizing BOQ...' : 'Generate Suggested BOQ'}</span>
                </button>
              </div>

              {/* Generated Result Preview */}
              {aiSuggestedItems && (
                <div className="mt-4 p-4 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">
                        AI Recommended Schedule ({aiSuggestedItems.length} items)
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Total Estimated Net Value: ₹ {(aiSuggestedItems.reduce((s, i) => s + i.amount, 0) / 10000000).toFixed(2)} Cr
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setItems(aiSuggestedItems);
                        setIsAiAssistantOpen(false);
                        showToast(`Inserted ${aiSuggestedItems.length} AI suggested items into BOQ!`);
                      }}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Insert into Active BOQ</span>
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-900 text-[11px]">
                    {aiSuggestedItems.map((item, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                            {item.itemCode}
                          </span>
                          <span className="text-slate-800 dark:text-slate-200 ml-2 font-medium">
                            {item.description}
                          </span>
                        </div>
                        <div className="text-right whitespace-nowrap font-mono">
                          <span className="text-slate-500">{item.quantity} {item.unit} @ ₹{item.rate}</span>
                          <span className="font-bold text-slate-900 dark:text-white ml-2">
                            ₹ {(item.amount / 100000).toFixed(1)} L
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
