import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HardHat,
  Shield,
  Users,
  ArrowRight,
  Building,
  CheckCircle2,
  Lock,
  Sparkles,
  Receipt,
  ShoppingBag,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { UserRole, User } from '../../types';

export const LoginPage: React.FC = () => {
  const { login, loginAsUser, systemUsers } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('project_manager');
  const [isClientMode, setIsClientMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const navigate = useNavigate();

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email, isClientMode ? 'client' : selectedRole);
    navigate(isClientMode ? '/client-portal' : '/');
  };

  const handleQuickDemoLogin = (roleKey: string) => {
    login(roleKey);
    navigate(roleKey === 'client' ? '/client-portal' : '/');
  };

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    const user = systemUsers.find((u) => u.id === userId);
    if (user) {
      loginAsUser(user);
      navigate(user.role === 'client' ? '/client-portal' : '/');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-10 sm:px-6 lg:px-8 relative overflow-hidden antialiased">
      {/* Background architectural grid pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="sm:mx-auto sm:w-full sm:max-w-lg relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-amber-600 items-center justify-center text-slate-950 shadow-lg shadow-amber-600/30">
            <HardHat className="h-8 w-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Build<span className="text-amber-500">OS</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Enterprise Operating System for Construction, EPC & Real Estate
          </p>
        </div>

        {/* Mode Switch Tabs (Staff Portal vs Client Portal) */}
        <div className="mt-6 flex rounded-lg bg-slate-900/90 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setIsClientMode(false)}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              !isClientMode
                ? 'bg-amber-600 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Internal Team Workspace
          </button>
          <button
            type="button"
            onClick={() => setIsClientMode(true)}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              isClientMode
                ? 'bg-amber-600 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Client Access Portal
          </button>
        </div>

        {/* Main Card */}
        <div className="mt-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-md space-y-6">
          {/* Quick Demo Access Presets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                1-Click Demo Login Presets
              </span>
              <span className="text-[10px] text-amber-500 font-medium">Instant Access</span>
            </div>

            {!isClientMode ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {/* 1. Super Admin */}
                <button
                  onClick={() => handleQuickDemoLogin('super_admin')}
                  className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-amber-500/50 flex items-center justify-between group transition-all text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-amber-400 truncate">
                        Rajesh Sharma
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">Super Admin / MD</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-amber-500 group-hover:translate-x-0.5" />
                </button>

                {/* 2. Project Manager */}
                <button
                  onClick={() => handleQuickDemoLogin('project_manager')}
                  className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-blue-500/50 flex items-center justify-between group transition-all text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                      <HardHat className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-blue-400 truncate">
                        Vikram Malhotra
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">Senior Project Manager</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5" />
                </button>

                {/* 3. Site Engineer */}
                <button
                  onClick={() => handleQuickDemoLogin('site_engineer')}
                  className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-emerald-500/50 flex items-center justify-between group transition-all text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Building className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                        Amit Patel
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">Site Operations / DPR</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5" />
                </button>

                {/* 4. Accounts */}
                <button
                  onClick={() => handleQuickDemoLogin('accounts')}
                  className="p-2.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 hover:border-cyan-500/50 flex items-center justify-between group transition-all text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
                      <Receipt className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white group-hover:text-cyan-400 truncate">
                        Ananya Roy
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">VP Finance & Accounts</p>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5" />
                </button>
              </div>
            ) : (
              /* Client Preset */
              <button
                onClick={() => handleQuickDemoLogin('client')}
                className="w-full p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-between group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-white group-hover:text-amber-300">
                      Rajesh Kumar (Lodha Skylines)
                    </p>
                    <p className="text-[11px] text-amber-200/80">
                      Enterprise Client Rep • 3 Contracted Sites
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-amber-400 group-hover:translate-x-1" />
              </button>
            )}
          </div>

          {/* Select From All 35+ Seeded Personnel Dropdown */}
          {!isClientMode && (
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Or Select Any Seeded Employee (35+ Staff Across 15 Roles)
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => handleUserSelect(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="">-- Choose a user to log in and test their role --</option>
                {systemUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.roleTitle} ({u.branchName.split('(')[1]?.replace(')', '') || u.branchName})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                Selecting a user logs you in instantly and adapts the sidebar navigation to their role!
              </p>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold text-[10px] tracking-wider">
                Or enter demo credentials
              </span>
            </div>
          </div>

          {/* Custom Form */}
          <form onSubmit={handleCustomLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300">Work Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isClientMode ? 'rajesh.kumar@lodhasky.com' : 'name@apexbuildos.com'}
                className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {!isClientMode && (
              <div>
                <label className="block text-xs font-medium text-slate-300">Role for Custom Login</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="super_admin">Super Administrator</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="site_engineer">Site Engineer</option>
                  <option value="accounts">Accounts & Finance</option>
                  <option value="purchase_manager">Purchase Manager</option>
                  <option value="safety_officer">Safety Officer</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-amber-600/20"
            >
              Enter Workspace
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500 space-y-1">
          <p>BuildOS Construction Operating System • Part 1 Master Configuration</p>
          <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400">
            <span>35+ Seeded Personnel</span>
            <span>•</span>
            <span>15 Role Profiles</span>
            <span>•</span>
            <span>6-Tab Company Master</span>
          </div>
        </div>
      </div>
    </div>
  );
};
