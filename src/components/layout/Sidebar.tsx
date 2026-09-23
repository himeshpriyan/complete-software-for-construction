import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  HardHat,
  Sparkles,
  ArrowLeft,
  Grid,
  Layers,
  ChevronDown,
  LayoutDashboard,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { SYSTEM_MODULES, getActiveModule, SystemModule } from '../../config/modules';
import { LucideIcon } from '../common/LucideIcon';
import { StatusBadge } from '../ui/StatusBadge';
import { cn } from '../../utils/cn';

interface SidebarProps {
  isMobileDrawer?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileDrawer = false }) => {
  const { isSidebarCollapsed, setMobileDrawerOpen, currentUser } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const [isModuleSwitcherOpen, setIsModuleSwitcherOpen] = useState(false);

  const activeModule: SystemModule | null = getActiveModule(location.pathname);

  const handleLinkClick = () => {
    if (isMobileDrawer) {
      setMobileDrawerOpen(false);
    }
  };

  const currentRole = currentUser?.role || 'super_admin';

  // Group modules by category for the Hub view
  const categories = Array.from(
    new Set(SYSTEM_MODULES.map((item) => item.category))
  );

  return (
    <aside
      className={cn(
        'bg-[#0a0f1d] text-slate-300 flex flex-col transition-all duration-200 select-none z-40',
        !isMobileDrawer && [
          'hidden md:flex flex-shrink-0 h-screen sticky top-0 border-r border-slate-800/70',
          isSidebarCollapsed ? 'w-16' : 'w-60 lg:w-64',
        ],
        isMobileDrawer && 'w-full h-full'
      )}
    >
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-slate-800/60 bg-[#070b14]">
        <NavLink
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-2.5 min-w-0"
        >
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-xs flex-shrink-0 font-bold">
            <HardHat className="h-4.5 w-4.5 text-slate-950 stroke-[2.4]" />
          </div>

          {(!isSidebarCollapsed || isMobileDrawer) && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-white font-sans">
                  Build<span className="text-amber-500">OS</span>
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/25">
                  DEMO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase truncate">
                Construction ERP & CRM
              </p>
            </div>
          )}
        </NavLink>
      </div>

      {/* ========================================================================= */}
      {/* CASE A: USER IS INSIDE A SPECIFIC MODULE -> SHOW ONLY THAT MODULE'S MENU */}
      {/* ========================================================================= */}
      {activeModule ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Back to All Modules Hub button */}
          {(!isSidebarCollapsed || isMobileDrawer) && (
            <div className="p-3 pb-2 space-y-2.5 border-b border-slate-800/60 bg-black/10">
              <NavLink
                to="/"
                onClick={handleLinkClick}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-slate-300 hover:text-white transition-all text-xs font-semibold group shadow-2xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-500 group-hover:-translate-x-0.5 transition-transform" />
                <span className="flex-1 truncate">All Modules Hub</span>
                <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-white/10 text-slate-400">Esc</span>
              </NavLink>

              {/* Active Module Card */}
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] relative shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-500/15 text-amber-400 shrink-0">
                      <LucideIcon name={activeModule.icon} size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate tracking-tight">
                        {activeModule.shortLabel}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        {activeModule.category}
                      </p>
                    </div>
                  </div>

                  {/* Module Switcher Dropdown Trigger */}
                  <button
                    type="button"
                    onClick={() => setIsModuleSwitcherOpen(!isModuleSwitcherOpen)}
                    className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-white/10 transition-colors"
                    title="Switch module"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Quick Module Switcher Dropdown */}
                {isModuleSwitcherOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0d1322] border border-slate-700/80 rounded-2xl shadow-2xl p-1.5 z-50 max-h-64 overflow-y-auto space-y-0.5 backdrop-blur-xl">
                    <p className="px-2.5 py-1 text-[9px] font-extrabold uppercase text-slate-400 tracking-wider">
                      Switch to Module
                    </p>
                    {SYSTEM_MODULES.map((mod) => (
                      <button
                        key={mod.id}
                        onClick={() => {
                          setIsModuleSwitcherOpen(false);
                          handleLinkClick();
                          navigate(mod.path);
                        }}
                        className={cn(
                          'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-colors',
                          mod.id === activeModule.id
                            ? 'bg-amber-500/20 text-amber-300 font-bold'
                            : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                        )}
                      >
                        <LucideIcon name={mod.icon} size={14} />
                        <span className="truncate font-medium">{mod.shortLabel}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Module-Scoped Sub Navigation Items */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
            {(!isSidebarCollapsed || isMobileDrawer) && (
              <p className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="h-3 w-3 text-amber-500" />
                {activeModule.shortLabel} Tools ({activeModule.subItems.length})
              </p>
            )}

            {activeModule.subItems.map((sub) => {
              const fullCurrentUrl = location.pathname + location.search;

              let isSubActive = false;
              if (sub.path.includes('?')) {
                // If sub item specifies a query param (e.g. ?tab=planning), match exact path + search
                isSubActive = fullCurrentUrl === sub.path;
              } else if (sub.path === activeModule.path) {
                // Main module root (e.g. /projects) is active only if exact path without tabs
                isSubActive = location.pathname === sub.path && !location.search.includes('tab=');
              } else {
                // Distinct sub-routes (e.g. /projects/tasks, /projects/dpr)
                isSubActive =
                  location.pathname === sub.path ||
                  (location.pathname.startsWith(sub.path + '/') && !location.search.includes('tab='));
              }

              return (
                <NavLink
                  key={sub.id}
                  to={sub.path}
                  onClick={handleLinkClick}
                  className={cn(
                    'group flex items-center justify-between rounded-lg text-xs font-medium transition-colors relative',
                    isSubActive
                      ? 'bg-amber-600/20 text-white font-semibold border border-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                    isSidebarCollapsed && !isMobileDrawer ? 'px-3 py-2.5 justify-center' : 'px-2.5 py-2'
                  )}
                  title={sub.label}
                >
                  {isSubActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-1 bg-amber-500 rounded-r" />
                  )}

                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span
                      className={cn(
                        'flex-shrink-0 transition-colors',
                        isSubActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    >
                      <LucideIcon name={sub.icon || 'Circle'} size={15} />
                    </span>

                    {(!isSidebarCollapsed || isMobileDrawer) && (
                      <span className="truncate">{sub.label}</span>
                    )}
                  </div>

                  {(!isSidebarCollapsed || isMobileDrawer) && (
                    <div className="flex items-center gap-1 flex-shrink-0 ml-1">
                      {sub.count !== undefined && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-800 text-slate-400 border border-slate-700/60">
                          {sub.count}
                        </span>
                      )}
                      {sub.badge && (
                        <StatusBadge
                          variant={sub.badgeVariant || 'neutral'}
                          label={sub.badge}
                          dot={false}
                          size="sm"
                        />
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* CASE B: USER IS AT ROOT / OR MODULE HUB -> SHOW MODULE HUB NAVIGATION     */
        /* ========================================================================= */
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {/* Main Hub Links */}
          <div className="space-y-0.5 pb-2 border-b border-slate-800/80">
            <NavLink
              to="/"
              onClick={handleLinkClick}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors',
                  isActive
                    ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                    : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                )
              }
            >
              <Grid className="w-4 h-4 text-amber-500" />
              {(!isSidebarCollapsed || isMobileDrawer) && (
                <div className="flex items-center justify-between flex-1">
                  <span>Module Hub</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-500/20 text-amber-400">
                    20 Modules
                  </span>
                </div>
              )}
            </NavLink>
          </div>

          {/* Module Categories Directory */}
          {categories.map((category) => {
            const modsInCategory = SYSTEM_MODULES.filter((m) => m.category === category);

            return (
              <div key={category} className="space-y-1">
                {(!isSidebarCollapsed || isMobileDrawer) && (
                  <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {category}
                  </p>
                )}

                {modsInCategory.map((mod) => (
                  <NavLink
                    key={mod.id}
                    to={mod.path}
                    onClick={handleLinkClick}
                    className={cn(
                      'group flex items-center justify-between rounded-lg text-xs font-medium transition-colors',
                      'text-slate-300 hover:bg-slate-800 hover:text-white',
                      isSidebarCollapsed && !isMobileDrawer ? 'px-3 py-2.5 justify-center' : 'px-2.5 py-1.5'
                    )}
                    title={mod.label}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="flex-shrink-0 text-slate-400 group-hover:text-amber-400 transition-colors">
                        <LucideIcon name={mod.icon} size={15} />
                      </span>

                      {(!isSidebarCollapsed || isMobileDrawer) && (
                        <span className="truncate">{mod.shortLabel}</span>
                      )}
                    </div>

                    {(!isSidebarCollapsed || isMobileDrawer) && mod.badge && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-800 text-slate-400">
                        {mod.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Role Indicator Banner */}
      {(!isSidebarCollapsed || isMobileDrawer) && currentRole !== 'super_admin' && (
        <div className="mx-2 mb-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="h-3 w-3 text-amber-400 flex-shrink-0" />
            <span className="font-semibold text-amber-300 truncate">
              {currentUser?.roleTitle || currentRole.replace('_', ' ')}
            </span>
          </div>
          <span className="text-[9px] font-mono text-amber-500 font-bold">Role</span>
        </div>
      )}

      {/* Footer / User Profile */}
      {(!isSidebarCollapsed || isMobileDrawer) && (
        <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between bg-slate-950/20">
          <div className="truncate">
            <span className="font-semibold text-slate-300 block truncate">
              {currentUser?.name || 'Administrator'}
            </span>
            <span className="text-[10px] text-amber-400 capitalize">
              {currentUser?.roleTitle || currentRole}
            </span>
          </div>
          <span
            className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0"
            title="System Active"
          />
        </div>
      )}
    </aside>
  );
};
