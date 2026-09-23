import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Boxes,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Grid,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SYSTEM_MODULES, SystemModule } from '../../config/modules';
import { LucideIcon } from '../../components/common/LucideIcon';

export const ModuleHubView: React.FC = () => {
  const navigate = useNavigate();
  const { materials, projects, projectTasks } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const activeProjectsCount = projects.filter(
    (p) => p.status === 'active' || p.status === 'in_progress'
  ).length;

  const lowStockCount = materials.filter(
    (m) => m.currentStock <= m.reorderLevel
  ).length;

  const categories: SystemModule['category'][] = [
    'Sales & Pre-Construction',
    'Site & Project Execution',
    'Supply Chain & Inventory',
    'Resources & Plant',
    'Compliance & Quality',
    'Finance & Accounts',
    'Organization & Admin',
  ];

  // Filter modules by search and category pill
  const filteredModules = useMemo(() => {
    return SYSTEM_MODULES.filter((m) => {
      const matchesCategory =
        selectedCategory === 'ALL' || m.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.label.toLowerCase().includes(q) ||
        m.shortLabel.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.subItems.some((s) => s.label.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6 sm:space-y-7 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* ========================================================================= */}
      {/* 1. TOP KPI HERO CARDS (Crisp, spacious, clean pastel)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Available Materials */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center gap-3.5 sm:gap-4 hover:shadow-md hover:border-slate-300 transition-all duration-200">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
            <Boxes className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600 stroke-[1.9]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              AVAILABLE MATERIALS
            </p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              {materials.length} <span className="text-xs font-semibold text-slate-500">SKUs</span>
            </p>
          </div>
        </div>

        {/* Card 2: Active Sites */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center gap-3.5 sm:gap-4 hover:shadow-md hover:border-slate-300 transition-all duration-200">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 stroke-[1.9]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              ACTIVE SITES
            </p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              {activeProjectsCount}{' '}
              <span className="text-xs font-semibold text-slate-500">Sites</span>
            </p>
          </div>
        </div>

        {/* Card 3: Total Workfront Tasks */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center gap-3.5 sm:gap-4 hover:shadow-md hover:border-slate-300 transition-all duration-200">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 stroke-[1.9]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              OPEN WORKFRONTS
            </p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              {projectTasks.length}{' '}
              <span className="text-xs font-semibold text-slate-500">Tasks</span>
            </p>
          </div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] flex items-center gap-3.5 sm:gap-4 hover:shadow-md hover:border-slate-300 transition-all duration-200">
          <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600 stroke-[1.9]" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
              LOW STOCK ALERTS
            </p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              {lowStockCount}{' '}
              <span className="text-xs font-semibold text-slate-500">Items</span>
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SEARCH & CATEGORY FILTER BAR                                           */}
      {/* ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 19 enterprise modules & sub-tools..."
              className="w-full pl-10 pr-12 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2 font-semibold"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 self-stretch sm:self-auto justify-between sm:justify-end">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-semibold border border-amber-200/80 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Click any module to open its scoped sidebar
            </span>
          </div>
        </div>

        {/* Quick Filter Pills (hidden scrollbar) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 text-xs [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            All Modules ({SYSTEM_MODULES.length})
          </button>
          {categories.map((cat) => {
            const count = SYSTEM_MODULES.filter((m) => m.category === cat).length;
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. CATEGORIZED MODULE GRIDS (Spacious 6 to 8 columns on desktop)          */}
      {/* ========================================================================= */}
      {categories.map((category) => {
        const modsInCategory = filteredModules.filter((m) => m.category === category);
        if (modsInCategory.length === 0) return null;

        return (
          <div key={category} className="space-y-3.5">
            {/* Section Header */}
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/80">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="text-xs sm:text-xs font-black uppercase tracking-wider text-slate-500">
                  {category.toUpperCase()} MODULES
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {modsInCategory.length} {modsInCategory.length === 1 ? 'Module' : 'Modules'}
              </span>
            </div>

            {/* Grid of Module Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 sm:gap-3.5">
              {modsInCategory.map((mod) => (
                <div
                  key={mod.id}
                  onClick={() => navigate(mod.path)}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center text-center shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:shadow-xl hover:border-amber-400 hover:-translate-y-1 transition-all duration-200 cursor-pointer group relative overflow-hidden"
                >
                  {/* Soft Pastel Icon Container */}
                  <div
                    className={`w-13 h-13 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 shadow-2xs border ${mod.iconBg}`}
                  >
                    <LucideIcon name={mod.icon} size={22} className="stroke-[1.9]" />
                  </div>

                  {/* Module Short Title */}
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight">
                    {mod.shortLabel}
                  </h4>

                  {/* Subtitle / Sub-tools Count */}
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 group-hover:text-slate-600 font-medium">
                    {mod.subItems.length} Sub-tools
                  </p>

                  {/* Badge */}
                  {mod.badge && (
                    <span className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 group-hover:border-amber-400/50">
                      {mod.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
