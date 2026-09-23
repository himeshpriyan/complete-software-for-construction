import React, { useState } from 'react';
import { Project, DailyProgressReport } from '../../../types';
import { useAppStore } from '../../../store/useAppStore';
import {
  HardHat,
  Calendar,
  Sun,
  Truck,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ProjectDPRTabProps {
  project: Project;
  dprs: DailyProgressReport[];
}

export const ProjectDPRTab: React.FC<ProjectDPRTabProps> = ({ project, dprs }) => {
  const { createDPR } = useAppStore();
  const [activeView, setActiveView] = useState<'create' | 'history'>('create');
  const [expandedDprId, setExpandedDprId] = useState<string | null>(dprs[0]?.id || null);

  // Form State for Today's DPR
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [shift, setShift] = useState<'day' | 'night' | 'general'>('day');
  const [weather, setWeather] = useState('Sunny, 31°C - No rain');
  const [safetyIncident, setSafetyIncident] = useState(false);
  const [safetyNotes, setSafetyNotes] = useState('Zero reportable lost-time injuries. Toolbox talk conducted on scaffolding safety at 08:30 AM.');

  // Trade Manpower Headcount Table
  const [manpowerRows, setManpowerRows] = useState([
    { trade: 'Masons', plannedCount: 16, actualCount: 16 },
    { trade: 'Bar Benders', plannedCount: 14, actualCount: 12 },
    { trade: 'Carpenters / Shuttering', plannedCount: 20, actualCount: 18 },
    { trade: 'General Helpers', plannedCount: 30, actualCount: 28 },
    { trade: 'Electricians', plannedCount: 6, actualCount: 6 },
    { trade: 'Plumbers', plannedCount: 4, actualCount: 4 },
  ]);

  // Machinery / Equipment
  const [machineryRows, setMachineryRows] = useState([
    { equipmentName: 'Tower Crane TC-01', hoursOperated: 8.5, breakdownHours: 0, idleHours: 1.5 },
    { equipmentName: 'Transit Mixer TM-04', hoursOperated: 6.0, breakdownHours: 0, idleHours: 2.0 },
    { equipmentName: 'JCB Backhoe Loader', hoursOperated: 7.0, breakdownHours: 0, idleHours: 1.0 },
  ]);

  // Materials Received
  const [materialRows, setMaterialRows] = useState([
    { materialName: 'TMT Rebar 16mm Fe550D', quantity: 24.5, unit: 'MT', supplier: 'Tata Tiscon', challanNo: 'CH-99481' },
    { materialName: 'Ready-Mix Concrete M35', quantity: 72.0, unit: 'cum', supplier: 'UltraTech RMC', challanNo: 'CH-84722' },
  ]);

  // Work Executed Today (with Live Achievement %)
  const [workRows, setWorkRows] = useState([
    { description: 'Cast 14th Floor Tower-A Slab & Beams', location: 'Tower A - Grid E1 to G4', plannedQty: 65, achievedQty: 68, unit: 'cum' },
    { description: 'Column Reinforcement & Shuttering', location: '15th Floor Grid B2-D4', plannedQty: 18, achievedQty: 16, unit: 'columns' },
    { description: 'Blockwork 200mm AAC in 10th Floor', location: 'Flat 1001-1004', plannedQty: 120, achievedQty: 95, unit: 'sqm' },
  ]);

  const totalManpower = manpowerRows.reduce((acc, row) => acc + (Number(row.actualCount) || 0), 0);
  const totalPlannedManpower = manpowerRows.reduce((acc, row) => acc + (Number(row.plannedCount) || 0), 0);

  const handleAddManpower = () => {
    setManpowerRows([...manpowerRows, { trade: 'Trade Specialist', plannedCount: 4, actualCount: 4 }]);
  };

  const handleAddMachinery = () => {
    setMachineryRows([...machineryRows, { equipmentName: 'Concrete Pump / Boom Placer', hoursOperated: 6.0, breakdownHours: 0, idleHours: 2.0 }]);
  };

  const handleAddMaterial = () => {
    setMaterialRows([...materialRows, { materialName: 'River Sand / M-Sand', quantity: 30, unit: 'tons', supplier: 'Apex Aggregates', challanNo: 'CH-NEW' }]);
  };

  const handleAddWorkRow = () => {
    setWorkRows([...workRows, { description: 'New Structural Activity', location: 'Site Grid A1', plannedQty: 50, achievedQty: 50, unit: 'sqm' }]);
  };

  const handleSubmitDPR = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedWorkDone = workRows.map((w) => {
      const planned = Number(w.plannedQty) || 1;
      const achieved = Number(w.achievedQty) || 0;
      const achievementPercentage = Math.round((achieved / planned) * 100);
      return {
        description: w.description,
        location: w.location,
        plannedQty: planned,
        achievedQty: achieved,
        unit: w.unit,
        achievementPercentage,
      };
    });

    createDPR({
      projectId: project.id,
      projectName: project.name,
      date: reportDate,
      shift,
      weather,
      preparedBy: project.siteEngineer,
      approvedBy: project.projectManager,
      totalManpower,
      manpowerBreakdown: manpowerRows.map((m) => ({
        trade: m.trade,
        plannedCount: Number(m.plannedCount),
        actualCount: Number(m.actualCount),
      })),
      machineryUsed: machineryRows.map((m) => ({
        equipmentName: m.equipmentName,
        hoursOperated: Number(m.hoursOperated),
        breakdownHours: Number(m.breakdownHours),
        idleHours: Number(m.idleHours),
      })),
      materialsReceived: materialRows.map((m) => ({
        materialName: m.materialName,
        quantity: Number(m.quantity),
        unit: m.unit,
        supplier: m.supplier,
        challanNo: m.challanNo,
      })),
      workDone: formattedWorkDone,
      safetyIncidents: safetyIncident,
      safetyNotes,
    });

    setActiveView('history');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-600" />
            Daily Progress Report (DPR) Workspace
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Log shift manpower, plant/machinery hours, material gate receipts, and output %
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveView('create')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeView === 'create'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            ✏️ New DPR Entry
          </button>
          <button
            onClick={() => setActiveView('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              activeView === 'history'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            📜 DPR History ({dprs.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: CREATE DPR FORM */}
      {activeView === 'create' && (
        <form onSubmit={handleSubmitDPR} className="space-y-6">
          {/* Shift Metadata Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              1. Shift & Site Conditions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={reportDate}
                  onChange={(e) => setReportDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Shift</label>
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                >
                  <option value="day">Day Shift (08:00 - 17:00)</option>
                  <option value="night">Night Shift (20:00 - 05:00)</option>
                  <option value="general">General Shift (09:00 - 18:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Weather Condition</label>
                <input
                  type="text"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Total Deployed Workers</label>
                <div className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 font-bold">
                  {totalManpower} Workers (Planned: {totalPlannedManpower})
                </div>
              </div>
            </div>
          </div>

          {/* Manpower Headcount Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  2. Trade Manpower Breakdown
                </h4>
                <p className="text-xs text-slate-500">Track labor deployment across subcontractors and trades</p>
              </div>
              <button
                type="button"
                onClick={handleAddManpower}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Trade
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Trade Specialization</th>
                    <th className="py-2.5 px-3 w-36">Planned Count</th>
                    <th className="py-2.5 px-3 w-36">Actual Present</th>
                    <th className="py-2.5 px-3 text-right w-16">Remove</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {manpowerRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.trade}
                          onChange={(e) => {
                            const newRows = [...manpowerRows];
                            newRows[idx].trade = e.target.value;
                            setManpowerRows(newRows);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={row.plannedCount}
                          onChange={(e) => {
                            const newRows = [...manpowerRows];
                            newRows[idx].plannedCount = Number(e.target.value);
                            setManpowerRows(newRows);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={row.actualCount}
                          onChange={(e) => {
                            const newRows = [...manpowerRows];
                            newRows[idx].actualCount = Number(e.target.value);
                            setManpowerRows(newRows);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold text-amber-600"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setManpowerRows(manpowerRows.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 transition"
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

          {/* Plant & Machinery Log */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  3. Plant & Equipment Log
                </h4>
                <p className="text-xs text-slate-500">Operating hours, idle time, and breakdown maintenance</p>
              </div>
              <button
                type="button"
                onClick={handleAddMachinery}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Machine
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Equipment Designation</th>
                    <th className="py-2.5 px-3 w-32">Operated (Hrs)</th>
                    <th className="py-2.5 px-3 w-32">Breakdown (Hrs)</th>
                    <th className="py-2.5 px-3 w-32">Idle (Hrs)</th>
                    <th className="py-2.5 px-3 text-right w-16">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {machineryRows.map((row, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.equipmentName}
                          onChange={(e) => {
                            const newRows = [...machineryRows];
                            newRows[idx].equipmentName = e.target.value;
                            setMachineryRows(newRows);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.5"
                          value={row.hoursOperated}
                          onChange={(e) => {
                            const newRows = [...machineryRows];
                            newRows[idx].hoursOperated = Number(e.target.value);
                            setMachineryRows(newRows);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.5"
                          value={row.breakdownHours}
                          onChange={(e) => {
                            const newRows = [...machineryRows];
                            newRows[idx].breakdownHours = Number(e.target.value);
                            setMachineryRows(newRows);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-rose-600 font-medium"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="0.5"
                          value={row.idleHours}
                          onChange={(e) => {
                            const newRows = [...machineryRows];
                            newRows[idx].idleHours = Number(e.target.value);
                            setMachineryRows(newRows);
                          }}
                          className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 font-medium"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setMachineryRows(machineryRows.filter((_, i) => i !== idx))}
                          className="text-slate-400 hover:text-rose-600 transition"
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

          {/* Work Done Today & Achievement % (Key requirement with auto-calc) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  4. Work Completed Today (Auto-Calculated Achievement %)
                </h4>
                <p className="text-xs text-slate-500">
                  Outputs live-calculate achievement ratio: green ≥ 100%, amber 80-99%, red &lt; 80%
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddWorkRow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Output Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Description of Work Executed</th>
                    <th className="py-2.5 px-3">Location / Grid</th>
                    <th className="py-2.5 px-3 w-24">Planned Qty</th>
                    <th className="py-2.5 px-3 w-24">Achieved Qty</th>
                    <th className="py-2.5 px-3 w-20">Unit</th>
                    <th className="py-2.5 px-3 text-center w-28">Achievement %</th>
                    <th className="py-2.5 px-3 text-right w-12">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {workRows.map((row, idx) => {
                    const planned = Number(row.plannedQty) || 1;
                    const achieved = Number(row.achievedQty) || 0;
                    const pct = Math.round((achieved / planned) * 100);

                    const badgeColor =
                      pct >= 100
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-300'
                        : pct >= 80
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-300';

                    return (
                      <tr key={idx}>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.description}
                            onChange={(e) => {
                              const newRows = [...workRows];
                              newRows[idx].description = e.target.value;
                              setWorkRows(newRows);
                            }}
                            className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.location}
                            onChange={(e) => {
                              const newRows = [...workRows];
                              newRows[idx].location = e.target.value;
                              setWorkRows(newRows);
                            }}
                            className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={row.plannedQty}
                            onChange={(e) => {
                              const newRows = [...workRows];
                              newRows[idx].plannedQty = Number(e.target.value);
                              setWorkRows(newRows);
                            }}
                            className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            value={row.achievedQty}
                            onChange={(e) => {
                              const newRows = [...workRows];
                              newRows[idx].achievedQty = Number(e.target.value);
                              setWorkRows(newRows);
                            }}
                            className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-semibold"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={row.unit}
                            onChange={(e) => {
                              const newRows = [...workRows];
                              newRows[idx].unit = e.target.value;
                              setWorkRows(newRows);
                            }}
                            className="w-full px-2.5 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white uppercase text-center"
                          />
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => setWorkRows(workRows.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-600 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Safety & Environment */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              5. HSE & Safety Observations
            </h4>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={safetyIncident}
                  onChange={(e) => setSafetyIncident(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                Flag safety incident or near-miss today
              </label>
            </div>
            <textarea
              rows={2}
              value={safetyNotes}
              onChange={(e) => setSafetyNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              placeholder="Daily toolbox talk notes, PPE inspections, or corrective actions taken..."
            />
          </div>

          {/* Submit Action */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setActiveView('history')}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition"
            >
              <Send className="w-4 h-4" />
              Publish DPR to In-Memory Ledger
            </button>
          </div>
        </form>
      )}

      {/* VIEW 2: HISTORICAL DPR LOGS */}
      {activeView === 'history' && (
        <div className="space-y-4">
          {dprs.map((report) => {
            const isExpanded = expandedDprId === report.id;
            return (
              <div
                key={report.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedDprId(isExpanded ? null : report.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
                      <HardHat className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                          {report.dprNumber}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          Date: {report.date}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Shift: <span className="uppercase font-medium">{report.shift}</span> • Manpower: <span className="font-semibold text-slate-800 dark:text-slate-200">{report.totalManpower} pax</span> • Weather: {report.weather}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-xs text-slate-400">Prepared by: {report.preparedBy}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-5 bg-slate-50/50 dark:bg-slate-800/20 text-xs">
                    {/* Work Achieved Summary */}
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                        Work Executed & Output Achievement
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {(report.workDone || report.workCompleted || []).map((w, i) => {
                          const desc = w.description || w.activity || 'Output';
                          const pct = w.achievementPercentage !== undefined ? w.achievementPercentage : (w.achievementPct || 0);
                          return (
                            <div
                              key={i}
                              className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5"
                            >
                              <div className="flex justify-between font-semibold text-slate-900 dark:text-white">
                                <span>{desc}</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    pct >= 100
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                                  }`}
                                >
                                  {pct}% Achieved
                                </span>
                              </div>
                              <div className="text-slate-500 flex justify-between text-[11px]">
                                <span>Loc: {w.location}</span>
                                <span>
                                  {w.achievedQty} / {w.plannedQty} {w.unit}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Manpower & Machinery */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <h6 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Trade Deployment</h6>
                        <div className="space-y-1.5">
                          {(report.manpowerBreakdown || report.manpower || []).map((m, idx) => (
                            <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400">
                              <span>{m.trade}</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {m.actualCount} <span className="text-slate-400 font-normal">/ {m.plannedCount}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                        <h6 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Plant & Machinery Hours</h6>
                        <div className="space-y-1.5">
                          {(report.machineryUsed || report.machinery || []).map((mc, idx) => (
                            <div key={idx} className="flex justify-between text-slate-600 dark:text-slate-400">
                              <span>{mc.equipmentName || mc.name}</span>
                              <span className="font-medium text-slate-900 dark:text-white">
                                {mc.hoursOperated || mc.workingHours || 0} hrs <span className="text-slate-400 font-normal">(Idle: {mc.idleHours || 0}h)</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Safety notes */}
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300">
                      <div className="font-semibold mb-0.5">Safety & Quality Observations</div>
                      <div>{report.safetyNotes}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {dprs.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
              No Daily Progress Reports recorded yet for this project.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
