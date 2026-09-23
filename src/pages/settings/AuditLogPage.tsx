import React, { useState, useMemo } from 'react';
import {
  History,
  Shield,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Calendar,
  Clock,
  Search,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { Avatar } from '../../components/ui/Avatar';
import { FilterBar } from '../../components/ui/FilterBar';
import { useAppStore } from '../../store/useAppStore';
import { AuditLogEntry, ColumnDef } from '../../types';

export const AuditLogPage: React.FC = () => {
  const { auditLogs } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('ALL');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Derive unique users and modules for filter chips
  const uniqueUsers = useMemo(() => {
    const map = new Map<string, string>();
    auditLogs.forEach((l) => map.set(l.userId, l.userName));
    return Array.from(map.entries()).map(([id, name]) => ({ value: id, label: name }));
  }, [auditLogs]);

  const uniqueModules = useMemo(() => {
    const set = new Set<string>();
    auditLogs.forEach((l) => set.add(l.module));
    return Array.from(set).map((m) => ({ value: m, label: m }));
  }, [auditLogs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      if (userFilter !== 'ALL' && log.userId !== userFilter) return false;
      if (moduleFilter !== 'ALL' && log.module !== moduleFilter) return false;
      if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = log.recordRef.toLowerCase().includes(q);
        const matchesUser = log.userName.toLowerCase().includes(q);
        const matchesNewVal = log.newValue.toLowerCase().includes(q);
        const matchesOldVal = log.oldValue?.toLowerCase().includes(q);
        const matchesMod = log.module.toLowerCase().includes(q);
        if (!matchesRef && !matchesUser && !matchesNewVal && !matchesOldVal && !matchesMod) return false;
      }
      return true;
    });
  }, [auditLogs, userFilter, moduleFilter, actionFilter, searchQuery]);

  const auditColumns: ColumnDef<AuditLogEntry>[] = [
    {
      key: 'userName',
      header: 'User & Role',
      sortable: true,
      width: '180px',
      render: (log) => (
        <div className="flex items-center gap-2">
          <Avatar name={log.userName} size="xs" />
          <div className="min-w-0">
            <p className="font-bold text-slate-900 leading-snug truncate">{log.userName}</p>
            <span className="text-[10px] text-slate-400 capitalize block truncate">
              {log.userRole.replace('_', ' ')}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      width: '100px',
      sortable: true,
      render: (log) => {
        const variant =
          log.action === 'APPROVE'
            ? 'success'
            : log.action === 'UPDATE'
            ? 'warning'
            : log.action === 'DELETE'
            ? 'danger'
            : 'info';
        return <StatusBadge variant={variant} label={log.action} size="sm" dot={false} />;
      },
    },
    {
      key: 'module',
      header: 'Module & Entity Ref',
      sortable: true,
      width: '240px',
      render: (log) => (
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 rounded inline-block mb-0.5">
            {log.module}
          </span>
          <p className="font-bold text-slate-900 leading-tight truncate">{log.recordRef}</p>
        </div>
      ),
    },
    {
      key: 'newValue',
      header: 'Change Diff (Old Value → New Value)',
      render: (log) => (
        <div className="space-y-1 max-w-md">
          {log.oldValue && (
            <div className="text-[11px] text-slate-400 line-through truncate">
              <span className="font-mono text-[10px] font-bold text-rose-500 uppercase mr-1">Old:</span>
              {log.oldValue}
            </div>
          )}
          <div className="text-xs text-slate-800 font-medium leading-snug">
            {log.oldValue && (
              <span className="font-mono text-[10px] font-bold text-emerald-600 uppercase mr-1">New:</span>
            )}
            {log.newValue}
          </div>
        </div>
      ),
    },
    {
      key: 'timestamp',
      header: 'Timestamp',
      width: '150px',
      sortable: true,
      render: (log) => (
        <div>
          <span className="font-mono text-xs font-semibold text-slate-800 block">{log.relativeTime}</span>
          <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise System Audit Trail"
        subtitle="Chronological audit log tracking financial revisions, BOQ edits, PO authorizations, safety violations, and security changes."
        breadcrumbs={[{ label: 'Settings', path: '/settings/company' }, { label: 'Audit Trail' }]}
        badge={`${auditLogs.length} Events`}
        actions={
          <button
            onClick={() => alert('Simulated exporting encrypted XLSX Audit Dossier.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs"
          >
            <Download className="h-4 w-4 text-amber-600" />
            <span>Export Audit Log</span>
          </button>
        }
      />

      {/* KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Logged Events"
          value={auditLogs.length}
          subtext="Chronologically sealed"
          trend="up"
          change="+12 today"
          icon={<History className="h-4 w-4 text-amber-600" />}
        />
        <StatCard
          title="Financial / Rate Edits"
          value="9"
          subtext="BOQ, Concrete & POs"
          isPositive={true}
          icon={<FileSpreadsheet className="h-4 w-4 text-blue-600" />}
        />
        <StatCard
          title="Workflow Approvals"
          value="8"
          subtext="POs, RA Bills & Contracts"
          isPositive={true}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
        />
        <StatCard
          title="Security & Roles"
          value="4"
          subtext="Permission toggles logged"
          icon={<Shield className="h-4 w-4 text-slate-700" />}
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Filter by entity, diff text, user, or module..."
        hasActiveFilters={userFilter !== 'ALL' || moduleFilter !== 'ALL' || actionFilter !== 'ALL' || !!searchQuery}
        onResetFilters={() => {
          setUserFilter('ALL');
          setModuleFilter('ALL');
          setActionFilter('ALL');
          setSearchQuery('');
        }}
        filterGroups={[
          {
            id: 'action',
            label: 'Action',
            selectedValue: actionFilter,
            onChange: setActionFilter,
            options: [
              { label: 'All Actions', value: 'ALL' },
              { label: 'APPROVE', value: 'APPROVE' },
              { label: 'UPDATE', value: 'UPDATE' },
              { label: 'CREATE', value: 'CREATE' },
              { label: 'EXPORT', value: 'EXPORT' },
            ],
          },
          {
            id: 'module',
            label: 'Module',
            selectedValue: moduleFilter,
            onChange: setModuleFilter,
            options: [
              { label: 'All Modules', value: 'ALL' },
              ...uniqueModules.map((m) => ({ label: m.label, value: m.value })),
            ],
          },
          {
            id: 'user',
            label: 'User',
            selectedValue: userFilter,
            onChange: setUserFilter,
            options: [
              { label: 'All Staff', value: 'ALL' },
              ...uniqueUsers.map((u) => ({ label: u.label, value: u.value })),
            ],
          },
        ]}
      />

      {/* Audit Log DataTable */}
      <DataTable<AuditLogEntry>
        data={filteredLogs}
        columns={auditColumns}
        pageSize={10}
        searchable={false}
      />
    </div>
  );
};
