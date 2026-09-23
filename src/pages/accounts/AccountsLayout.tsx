import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import {
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Wallet,
  Landmark,
  FileSpreadsheet,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  Settings2,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

interface AccountsLayoutProps {
  children: React.ReactNode;
}

export const AccountsLayout: React.FC<AccountsLayoutProps> = ({ children }) => {
  const location = useLocation();
  const {
    customerReceivables,
    vendorPayables,
    pettyCashLedgers,
    bankAccounts,
    erpSettings,
    updateErpSettings,
  } = useAppStore();

  const [isSyncing, setIsSyncing] = useState(false);

  // Compute Outstanding Summaries
  const totalReceivables = customerReceivables.reduce((acc, r) => acc + r.balanceDue, 0);
  const totalPayables = vendorPayables.reduce((acc, p) => acc + p.balanceDue, 0);
  const totalPettyCash = Object.values(pettyCashLedgers).reduce((acc, l) => acc + l.currentBalance, 0);
  const netWorkingCapital = totalReceivables - totalPayables;

  const handleSyncErp = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      updateErpSettings({
        lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        syncStatus: 'synced',
      });
    }, 1200);
  };

  const navTabs = [
    { label: 'Customer Receivables', path: '/accounts/receivables', icon: ArrowDownLeft, badge: customerReceivables.filter(r => r.status === 'overdue').length },
    { label: 'Vendor Payables', path: '/accounts/payables', icon: ArrowUpRight, badge: vendorPayables.filter(p => p.status === 'overdue').length },
    { label: 'Site Expenses', path: '/accounts/expenses', icon: Receipt },
    { label: 'Petty Cash (Site Imprest)', path: '/accounts/petty-cash', icon: Wallet },
    { label: 'Bank & Escrow', path: '/accounts/bank', icon: Landmark },
    { label: 'Payments & Receipts', path: '/accounts/transactions', icon: FileSpreadsheet },
    { label: 'Journal Entries', path: '/accounts/journal', icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {/* Top Title & ERP Integration Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Accounts, Financial Ledgers & Treasury
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time accounts receivable aging, vendor & subcontractor payables, site imprest, and double-entry journals.
          </p>
        </div>

        {/* ERP Integration Badge / Toggle (Tally, Zoho, SAP) */}
        <div className="flex items-center gap-3 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs self-start lg:self-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Integrates with Tally Prime / Zoho Books / SAP
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>

          <div className="flex items-center gap-1.5 text-xs">
            <select
              value={erpSettings.activeErp}
              onChange={(e) => updateErpSettings({ activeErp: e.target.value as any })}
              className="px-2 py-1 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold cursor-pointer outline-none"
            >
              <option value="tally">Tally Prime (XML/ODBC)</option>
              <option value="zoho">Zoho Books (REST API)</option>
              <option value="sap">SAP S/4HANA (BAPI)</option>
            </select>

            <button
              onClick={handleSyncErp}
              disabled={isSyncing}
              title="Manual ERP Sync"
              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Outstanding Summary Cards (Company-Wide Financial Health) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Receivables</p>
            <span className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600">
              <ArrowDownLeft className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹ {(totalReceivables / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Across {customerReceivables.length} client certificates</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vendor & Sub Payables</p>
            <span className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            ₹ {(totalPayables / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Materials POs & Subcontract bills</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Working Capital</p>
            <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            ₹ {(netWorkingCapital / 10000000).toFixed(2)} Cr
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Receivables minus Payables</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Site Petty Cash In Hand</p>
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600">
              <Wallet className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            ₹ {(totalPettyCash).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Liquid cash across all site cashboxes</p>
        </div>
      </div>

      {/* Sub-Navigation Strip */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-1.5 overflow-x-auto scrollbar-none shadow-xs">
        <div className="flex items-center gap-1.5 min-w-max">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.path;
            return (
              <NavLink
                key={tab.path}
                to={tab.path}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-xs shadow-amber-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                    }`}
                  >
                    {tab.badge} overdue
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Active Sub-Page Content */}
      {children}
    </div>
  );
};
