import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  ChevronRight,
  Building2,
  Shield,
  LogOut,
  UserCheck,
  HardHat,
  ExternalLink,
  Grid,
} from 'lucide-react';
import { getActiveModule } from '../../config/modules';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui/Avatar';
import { UserRole } from '../../types';
import { NotificationCenterModal } from '../notifications/NotificationCenterModal';

export const Header: React.FC = () => {
  const {
    currentUser,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    toggleSidebar,
    setMobileDrawerOpen,
    setSearchOpen,
    switchRole,
    logout,
  } = useAppStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const activeModule = getActiveModule(location.pathname);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleSelect = (role: UserRole) => {
    switchRole(role);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl sticky top-0 z-30 px-3 sm:px-6 flex items-center justify-between gap-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      {/* Left: Mobile Drawer Trigger / Desktop Sidebar Toggle + Logo */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Desktop sidebar toggle button (only when inside a module) */}
        {location.pathname !== '/' && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Toggle Sidebar Rail"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        {/* Brand Logo (Always on mobile, or on desktop when on Home Hub) */}
        <Link
          to="/"
          className={`flex items-center gap-2.5 ${location.pathname !== '/' ? 'lg:hidden' : 'flex'}`}
        >
          <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500 shadow-xs flex-shrink-0">
            <HardHat className="h-4.5 w-4.5 stroke-[2.2]" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-base tracking-tight text-slate-900">
              Build<span className="text-amber-600">OS</span>
            </span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-600 border border-amber-500/25">
              DEMO
            </span>
          </div>
        </Link>

        {/* Branch / Entity Selector (Desktop & Tablet) */}
        <div className="hidden sm:flex items-center gap-1.5 ml-1 pl-3 border-l border-slate-200/80">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <select
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200/80 rounded-lg py-1 pl-2 pr-6 font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
          >
            <option value="ALL">All Hubs & Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.code} - {b.city}
              </option>
            ))}
          </select>
        </div>

        {/* Active Module Indicator & Quick Return to Hub */}
        {activeModule && (
          <div className="hidden xl:flex items-center gap-1.5 ml-2 pl-3 border-l border-slate-200/80 text-xs">
            <Link
              to="/"
              className="text-slate-500 hover:text-amber-600 flex items-center gap-1 font-semibold transition-colors px-2 py-0.5 rounded-md hover:bg-amber-50"
              title="Return to All Modules Hub"
            >
              <Grid className="w-3.5 h-3.5 text-amber-600" />
              <span>Hub</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="font-extrabold text-slate-800 px-2 py-0.5 rounded-md bg-slate-100">
              {activeModule.shortLabel}
            </span>
          </div>
        )}
      </div>

      {/* Center / Search: Omnisearch Shortcut Input */}
      <div className="flex-1 max-w-md mx-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full text-left flex items-center justify-between px-3.5 py-1.5 text-xs bg-slate-100/70 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200/70 hover:border-slate-300 transition-all min-h-[36px] shadow-2xs"
        >
          <div className="flex items-center gap-2.5 truncate">
            <Search className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate font-medium">Search projects, BOQ, clients, POs...</span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right: Demo Data Badge, Notifications, Quick Role Switcher & User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Persistent Showcase DEMO DATA Badge */}
        <div
          title="Interactive Showcase Demo Environment - All modules fully loaded with mock data"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-black uppercase tracking-wider select-none shrink-0 shadow-2xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="hidden xs:inline sm:inline">Demo Data</span>
          <span className="xs:hidden sm:hidden inline">Demo</span>
        </div>

        {/* Notifications Trigger */}
        <div>
          <button
            onClick={() => setIsNotifOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 relative min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white" />
            )}
          </button>

          <NotificationCenterModal
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>

        {/* User Profile & Demo Role Switcher */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors min-h-[36px]"
          >
            <Avatar name={currentUser?.name || 'User'} size="xs" statusIndicator="online" />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-none">
                {currentUser?.name}
              </p>
              <p className="text-[10px] text-amber-700 font-medium capitalize mt-0.5">
                {currentUser?.roleTitle || currentUser?.role}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 z-50 p-2 divide-y divide-slate-100">
              {/* Profile Overview */}
              <div className="p-2 space-y-1">
                <p className="text-xs font-bold text-slate-900">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  {currentUser?.roleTitle}
                </span>
              </div>

              {/* Fast Role Switcher (Demo Feature) */}
              <div className="py-2 space-y-1">
                <span className="px-2 text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                  Switch Demo Role
                </span>
                <button
                  onClick={() => handleRoleSelect('admin')}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center justify-between ${
                    currentUser?.role === 'admin'
                      ? 'bg-amber-50 font-bold text-amber-800'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-amber-600" />
                    <span>Admin (MD / CEO)</span>
                  </div>
                  {currentUser?.role === 'admin' && <UserCheck className="h-3.5 w-3.5" />}
                </button>

                <button
                  onClick={() => handleRoleSelect('project_manager')}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center justify-between ${
                    currentUser?.role === 'project_manager'
                      ? 'bg-amber-50 font-bold text-amber-800'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HardHat className="h-3.5 w-3.5 text-blue-600" />
                    <span>Project Manager</span>
                  </div>
                  {currentUser?.role === 'project_manager' && <UserCheck className="h-3.5 w-3.5" />}
                </button>

                <button
                  onClick={() => handleRoleSelect('site_engineer')}
                  className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center justify-between ${
                    currentUser?.role === 'site_engineer'
                      ? 'bg-amber-50 font-bold text-amber-800'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Site Engineer</span>
                  </div>
                  {currentUser?.role === 'site_engineer' && <UserCheck className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Client Portal Link */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/client-portal');
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-md text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                    Client Portal View
                  </span>
                </button>
              </div>

              {/* Logout Action */}
              <div className="pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-1.5 rounded-md text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
