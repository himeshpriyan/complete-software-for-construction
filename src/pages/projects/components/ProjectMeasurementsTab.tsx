import React, { useState } from 'react';
import { Project, MeasurementBookEntry } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import {
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Calculator,
  UserCheck,
  TrendingUp,
} from 'lucide-react';

interface ProjectMeasurementsTabProps {
  project: Project;
  mbEntries: MeasurementBookEntry[];
}

export const ProjectMeasurementsTab: React.FC<ProjectMeasurementsTabProps> = ({
  project,
  mbEntries,
}) => {
  const { createMBEntry } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for new MB entry with live auto-calc
  const [itemCode, setItemCode] = useState('CIV-042');
  const [description, setDescription] = useState('R.C.C M30 Concrete in Beams & Slabs');
  const [location, setLocation] = useState('Tower-A, 15th Floor Slab');
  const [unit, setUnit] = useState('cum');
  const [nos, setNos] = useState<number>(1);
  const [length, setLength] = useState<number>(18.5);
  const [width, setWidth] = useState<number>(12.0);
  const [height, setHeight] = useState<number>(0.15);
  const [rate, setRate] = useState<number>(6800);

  // Live client-side math
  const calculatedQty = Number((nos * (length || 1) * (width || 1) * (height || 1)).toFixed(3));
  const calculatedTotalAmount = Math.round(calculatedQty * rate);

  const cumulativeAmount = mbEntries.reduce((acc, m) => acc + (m.totalAmount || m.amount || 0), 0);

  const filteredEntries = mbEntries.filter((m) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const desc = (m.description || m.workDescription || '').toLowerCase();
      return (
        desc.includes(q) ||
        m.itemCode.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.mbNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddMB = (e: React.FormEvent) => {
    e.preventDefault();

    createMBEntry({
      projectId: project.id,
      projectName: project.name,
      itemCode,
      description,
      location,
      unit,
      length,
      width,
      height,
      quantity: calculatedQty,
      rate,
      totalAmount: calculatedTotalAmount,
      recordedBy: project.siteEngineer,
      recordedDate: new Date().toISOString().slice(0, 10),
      verifiedByQS: true,
      contractorSignoff: true,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Math Summary */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-amber-600" />
            Digital Measurement Book (MB)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            CPWD standard dimensional measurement ledger with live Length × Width × Height math
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase font-medium block">
              Total Certified Quantity Value
            </span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              ₹ {(cumulativeAmount / 100000).toFixed(2)} Lakhs
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Add Measurement
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Item Code, Description, Location, or MB #..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Measurement Book Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-3">MB Ref</th>
                <th className="py-3 px-3">Item & Description</th>
                <th className="py-3 px-3">Location / Grid</th>
                <th className="py-3 px-3 text-right">L (m)</th>
                <th className="py-3 px-3 text-right">W (m)</th>
                <th className="py-3 px-3 text-right">H (m)</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">Unit Rate</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
                <th className="py-3 px-3 text-center">QS Verified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredEntries.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                    {m.mbNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      <span className="text-[11px] font-mono text-slate-400 mr-1.5">{m.itemCode}</span>
                      {m.description || m.workDescription}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Recorded on {m.recordedDate || m.date} by {m.recordedBy}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                    {m.location}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                    {m.length ? m.length.toFixed(2) : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                    {m.width ? m.width.toFixed(2) : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                    {m.height ? m.height.toFixed(2) : '—'}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white font-mono">
                    {m.quantity.toLocaleString('en-IN')} <span className="text-slate-400 text-[10px] font-normal">{m.unit}</span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-400">
                    ₹ {m.rate.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-amber-600 dark:text-amber-400 font-mono">
                    ₹ {(m.totalAmount || m.amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {m.verifiedByQS ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> Certified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400 text-xs">
                    No measurement entries recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Measurement Modal with Live Computation */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-amber-600" />
                Record Digital Measurement (L × W × H)
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMB} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Item Code</label>
                  <input
                    type="text"
                    value={itemCode}
                    onChange={(e) => setItemCode(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Work Description</label>
                  <input
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Site Location / Grid</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Unit of Measurement</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="cum">cum (Cubic Meter)</option>
                    <option value="sqm">sqm (Square Meter)</option>
                    <option value="rmt">rmt (Running Meter)</option>
                    <option value="MT">MT (Metric Ton)</option>
                    <option value="nos">nos (Numbers)</option>
                  </select>
                </div>
              </div>

              {/* Dimensional Calculation Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Live Dimensional Calculation Formula
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Nos / Multiplier</label>
                    <input
                      type="number"
                      step="1"
                      value={nos}
                      onChange={(e) => setNos(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Length (L)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={length}
                      onChange={(e) => setLength(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Width (B)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Height/Depth (H)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700/80">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Calculated Quantity:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                      {calculatedQty} {unit}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-0.5">Unit Rate (₹)</label>
                    <input
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-right"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold">
                  <span>Computed Line Total:</span>
                  <span className="text-sm font-mono font-bold">
                    ₹ {calculatedTotalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-sm transition"
                >
                  Save to Measurement Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
