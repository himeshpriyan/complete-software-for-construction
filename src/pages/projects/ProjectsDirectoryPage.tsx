import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Project, ProjectHealth, ProjectStatus } from '../../types';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  UserCheck,
  LayoutGrid,
  List,
} from 'lucide-react';

export const ProjectsDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, contracts, createProject } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // New Project Form State
  const [selectedContractId, setSelectedContractId] = useState<string>('');
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState(`PRJ-00${projects.length + 1}`);
  const [newClient, setNewClient] = useState('');
  const [newLocation, setNewLocation] = useState('Mumbai, Maharashtra');
  const [newContractValue, setNewContractValue] = useState<number>(450000000);
  const [newBudget, setNewBudget] = useState<number>(390000000);
  const [newPM, setNewPM] = useState('Vikram Malhotra');
  const [newSiteEngineer, setNewSiteEngineer] = useState('Amit Patel');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [newEndDate, setNewEndDate] = useState('2027-06-30');
  const [newPhase, setNewPhase] = useState('Mobilization & Excavation');

  // Handle selecting contract to auto-fill
  const handleSelectContract = (contractId: string) => {
    setSelectedContractId(contractId);
    const contract = contracts.find((c) => c.id === contractId);
    if (contract) {
      setNewName(contract.title);
      setNewClient(contract.clientName);
      setNewContractValue(contract.contractValue);
      setNewBudget(Math.round(contract.contractValue * 0.88));
      setNewStartDate(contract.startDate);
      setNewEndDate(contract.endDate);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created = createProject({
      code: newCode,
      name: newName,
      clientName: newClient || 'Private Developer',
      location: newLocation,
      contractId: selectedContractId || undefined,
      contractValue: Number(newContractValue),
      budget: Number(newBudget),
      actualCost: 0,
      completionPercentage: 0,
      plannedPercentage: 5,
      delayDays: 0,
      health: 'on_track',
      status: 'planning',
      startDate: newStartDate,
      expectedEndDate: newEndDate,
      projectManager: newPM,
      siteEngineer: newSiteEngineer,
      currentPhase: newPhase,
    });

    setIsNewProjectModalOpen(false);
    navigate(`/projects/${created.id}`);
  };

  // Portfolio KPIs
  const totalValue = projects.reduce((acc, p) => acc + p.contractValue, 0);
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const onTrackCount = projects.filter((p) => p.health === 'on_track').length;
  const atRiskCount = projects.filter((p) => p.health === 'at_risk').length;
  const delayedCount = projects.filter((p) => p.health === 'delayed').length;
  const avgCompletion = Math.round(
    projects.reduce((acc, p) => acc + (p.completionPercentage ?? 0), 0) / Math.max(1, projects.length)
  );

  const formatCrores = (val: number) => `₹ ${(val / 10000000).toFixed(2)} Cr`;

  // Filtering
  const filteredProjects = projects.filter((p) => {
    if (healthFilter !== 'ALL' && p.health !== healthFilter) return false;
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.projectManager.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getHealthBadge = (health: ProjectHealth) => {
    switch (health) {
      case 'on_track':
        return {
          label: '🟢 On Track',
          classes: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        };
      case 'at_risk':
        return {
          label: '🟡 At Risk',
          classes: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800',
        };
      case 'delayed':
        return {
          label: '🔴 Delayed',
          classes: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800 animate-pulse',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & New Project Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-amber-600" />
            Project Management Master Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Active civil infrastructure & high-rise portfolios, schedule tracking, and field execution
          </p>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {/* Portfolio Analytics Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Projects
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {projects.length} Sites
          </div>
          <div className="text-xs text-slate-400 mt-1">Under execution</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Order Book Value
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white">
            {formatCrores(totalValue)}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1">Active Contracts</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Avg Completion
          </div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">
            {avgCompletion}%
          </div>
          <div className="text-xs text-slate-400 mt-1">Physical execution</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            🟢 On Track
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
            {onTrackCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Milestones intact</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            🟡 At Risk
          </div>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400">
            {atRiskCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Requires intervention</div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            🔴 Delayed
          </div>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400">
            {delayedCount}
          </div>
          <div className="text-xs text-slate-400 mt-1">Critical path lag</div>
        </div>
      </div>

      {/* Filter & View Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, code, client, or PM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Health Filter */}
          <select
            value={healthFilter}
            onChange={(e) => setHealthFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Health Conditions</option>
            <option value="on_track">🟢 On Track</option>
            <option value="at_risk">🟡 At Risk</option>
            <option value="delayed">🔴 Delayed</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Lifecycle Statuses</option>
            <option value="active">Active Execution</option>
            <option value="planning">Planning & Mobilization</option>
            <option value="handover">Handover & Snagging</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs transition ${viewMode === 'grid'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs transition ${viewMode === 'table'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                  : 'text-slate-400 hover:text-slate-600'
                }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* VIEW 1: GRID CARDS VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => {
            const badge = getHealthBadge(proj.health);
            return (
              <div
                key={proj.id}
                onClick={() => navigate(`/projects/${proj.id}`)}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-amber-500/50 cursor-pointer transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400">
                        {proj.code}
                      </span>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.classes}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Project Title */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition line-clamp-1">
                      {proj.name}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{proj.clientName}</span>
                    </div>
                  </div>

                  {/* Location & PM */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{proj.location}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{proj.projectManager}</span>
                    </div>
                  </div>

                  {/* Progress Bars (Planned vs Actual) */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Progress:</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {proj.completionPercentage}% <span className="text-slate-400 font-normal">(Plan: {proj.plannedPercentage}%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(proj.completionPercentage ?? 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Financials & Deadline */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-medium">Contract Value</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCrores(proj.contractValue)}
                    </span>
                  </div>

                  <div className="text-right flex items-center gap-1 text-amber-600 group-hover:translate-x-1 transition font-semibold">
                    <span>Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: COMPACT TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Project Name & Client</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Project Manager</th>
                  <th className="py-3 px-4 text-right">Contract Value</th>
                  <th className="py-3 px-4 text-center">Progress</th>
                  <th className="py-3 px-4 text-center">Health</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProjects.map((p) => {
                  const badge = getHealthBadge(p.health);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400 whitespace-nowrap">
                        {p.code}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                        <div className="text-slate-500 text-[11px]">{p.clientName}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{p.location}</td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">{p.projectManager}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                        {formatCrores(p.contractValue)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-500"
                              style={{ width: `${p.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold">{p.completionPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${badge.classes}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="text-amber-600 font-semibold hover:underline">
                          Open 11-Tabs →
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

      {/* New Project Setup Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-amber-600" />
              New Project Setup & Mobilization
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
              {/* Optional: Pick Contract from Part 3 */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  Link Existing Contract (Auto-Fills Budget & Client)
                </label>
                <select
                  value={selectedContractId}
                  onChange={(e) => handleSelectContract(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option value="">-- Standalone Project (No Contract Link) --</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.contractNumber} - {c.title} ({formatCrores(c.contractValue)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Code *</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Client Entity</label>
                  <input
                    type="text"
                    required
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Site Location</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Contract Value (₹)</label>
                  <input
                    type="number"
                    value={newContractValue}
                    onChange={(e) => setNewContractValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Target Budget (₹)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Project Manager</label>
                  <input
                    type="text"
                    value={newPM}
                    onChange={(e) => setNewPM(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Site Engineer</label>
                  <input
                    type="text"
                    value={newSiteEngineer}
                    onChange={(e) => setNewSiteEngineer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">Target Completion</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700 shadow-sm"
                >
                  Initialize Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
