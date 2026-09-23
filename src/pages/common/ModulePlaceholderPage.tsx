import React from 'react';
import { useLocation } from 'react-router-dom';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAppStore } from '../../store/useAppStore';
import { ColumnDef, Employee, Branch } from '../../types';
import { HardHat, Plus, Filter, FileSpreadsheet, ArrowUpRight } from 'lucide-react';

interface ModulePlaceholderProps {
  moduleName?: string;
  subModuleName?: string;
  description?: string;
  comingInPart?: string;
}

export const ModulePlaceholderPage: React.FC<ModulePlaceholderProps> = ({
  moduleName,
  subModuleName,
  description,
  comingInPart,
}) => {
  const location = useLocation();
  const { employees, branches, clients, openSlideOver, closeSlideOver } = useAppStore();

  // Derive titles from location if not passed explicitly
  const pathParts = location.pathname.split('/').filter(Boolean);
  const primarySection = moduleName || (pathParts[0] ? pathParts[0].toUpperCase() : 'MODULE');
  const secondarySection = subModuleName || (pathParts[1] ? pathParts[1].replace('-', ' ').replace(/^./, (s) => s.toUpperCase()) : '');

  const displayTitle = secondarySection ? `${primarySection} • ${secondarySection}` : primarySection;

  // Breadcrumbs
  const breadcrumbs = [
    { label: primarySection, path: `/${pathParts[0]}` },
    ...(secondarySection ? [{ label: secondarySection }] : []),
  ];

  // Specific high-value module views using our seeded data:
  // 1. HR Employees
  if (location.pathname === '/hr/employees' || location.pathname === '/hr') {
    const employeeColumns: ColumnDef<Employee>[] = [
      {
        key: 'id',
        header: 'Staff ID',
        width: '95px',
        sortable: true,
        render: (e) => (
          <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
            {e.id}
          </span>
        ),
      },
      {
        key: 'name',
        header: 'Employee Name & Role',
        sortable: true,
        render: (e) => (
          <div>
            <p className="font-bold text-slate-900">{e.name}</p>
            <p className="text-[11px] text-slate-500">{e.designation}</p>
          </div>
        ),
      },
      {
        key: 'department',
        header: 'Department',
        sortable: true,
        render: (e) => <span className="text-slate-600 font-medium">{e.department}</span>,
      },
      {
        key: 'branchName',
        header: 'Assigned Hub / Branch',
        sortable: true,
        render: (e) => <span className="text-slate-500 text-xs">{e.branchName}</span>,
      },
      {
        key: 'status',
        header: 'Status',
        width: '100px',
        sortable: true,
        render: (e) => <StatusBadge status={e.status} size="sm" />,
      },
      {
        key: 'phone',
        header: 'Contact',
        render: (e) => (
          <div className="text-xs">
            <p className="text-slate-700">{e.phone}</p>
            <p className="text-[10px] text-slate-400">{e.email}</p>
          </div>
        ),
      },
    ];

    return (
      <div className="space-y-6">
        <PageHeader
          title="HR • Key Employees & Engineers"
          subtitle="8 Seeded Key Personnel with role-based access definitions"
          breadcrumbs={breadcrumbs}
          badge={`${employees.length} Engineers`}
          actions={
            <button
              onClick={() =>
                openSlideOver(
                  'Add New Employee / Engineer',
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                      Register a civil engineer, project manager, or staff member into the system.
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Arvind Mehta"
                        className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Designation</label>
                      <input
                        type="text"
                        placeholder="e.g. Planning Engineer"
                        className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="pt-3 flex justify-end">
                      <button
                        onClick={closeSlideOver}
                        className="px-4 py-2 text-xs bg-amber-600 text-white font-bold rounded-lg"
                      >
                        Add to In-Memory Roster
                      </button>
                    </div>
                  </div>
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Staff</span>
            </button>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Staff" value="8" subtext="Leadership & Key Engineers" trend="up" change="+2 Q3" />
          <StatCard title="Active On-Site" value="7" subtext="1 On Scheduled Leave" isPositive={true} />
          <StatCard title="Field Workforce" value="1,320" subtext="Contractual Labour Force" trend="up" change="+85 this week" />
        </div>

        <DataTable<Employee>
          data={employees}
          columns={employeeColumns}
          pageSize={8}
          searchPlaceholder="Search engineer name, department, or branch..."
        />
      </div>
    );
  }

  // 2. Settings Company / Branches
  if (location.pathname === '/settings/company' || location.pathname === '/settings') {
    const branchColumns: ColumnDef<Branch>[] = [
      {
        key: 'code',
        header: 'Branch Code',
        width: '110px',
        sortable: true,
        render: (b) => (
          <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            {b.code}
          </span>
        ),
      },
      {
        key: 'name',
        header: 'Operating Division & Entity',
        sortable: true,
        render: (b) => (
          <div>
            <p className="font-bold text-slate-900">{b.name}</p>
            <p className="text-[11px] text-slate-500">{b.address}</p>
          </div>
        ),
      },
      {
        key: 'city',
        header: 'City / State',
        sortable: true,
        render: (b) => (
          <span className="text-slate-700 font-medium text-xs">
            {b.city}, {b.state}
          </span>
        ),
      },
      {
        key: 'managerName',
        header: 'Regional Head',
        sortable: true,
        render: (b) => <span className="text-slate-800 font-semibold">{b.managerName}</span>,
      },
      {
        key: 'activeProjectsCount',
        header: 'Active Projects',
        sortable: true,
        align: 'center',
        width: '120px',
        render: (b) => (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
            {b.activeProjectsCount} Live
          </span>
        ),
      },
      {
        key: 'isHQ',
        header: 'Role',
        sortable: true,
        width: '100px',
        render: (b) => (
          <StatusBadge
            variant={b.isHQ ? 'success' : 'neutral'}
            label={b.isHQ ? 'Corporate HQ' : 'Regional Hub'}
            dot={b.isHQ}
            size="sm"
          />
        ),
      },
    ];

    return (
      <div className="space-y-6">
        <PageHeader
          title="Company Structure & Branches"
          subtitle="5 Seeded Regional Operating Hubs sharing consistent corporate entities"
          breadcrumbs={breadcrumbs}
          badge={`${branches.length} Operating Hubs`}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Operating Hubs" value="5" subtext="Mumbai, Bengaluru, Ahmedabad, NCR, Chennai" />
          <StatCard title="Corporate Headquarters" value="Mumbai" subtext="Peninsula Business Park, Lower Parel" />
          <StatCard title="Total Active Sites" value="20" subtext="Across All 5 Divisions" trend="up" change="+3 YoY" />
        </div>

        <DataTable<Branch>
          data={branches}
          columns={branchColumns}
          pageSize={5}
          searchPlaceholder="Search branch code, city, or manager..."
        />
      </div>
    );
  }

  // Generic Sub-module Placeholder with Shell Component Integration
  return (
    <div className="space-y-6">
      <PageHeader
        title={displayTitle}
        subtitle={
          description ||
          `Enterprise module container ready for detailed views and workflow automation.`
        }
        breadcrumbs={breadcrumbs}
        badge="Active Shell Module"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                openSlideOver(
                  `Create Record in ${displayTitle}`,
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">
                      Standardized slide-over form container connected to {displayTitle}.
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Record Title / Identifier</label>
                      <input
                        type="text"
                        placeholder="e.g. PR-2026-092 / Site Inspection Record"
                        className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Detailed Scope / Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Enter item details, material specs, or observations..."
                        className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="pt-3 flex justify-end">
                      <button
                        onClick={closeSlideOver}
                        className="px-4 py-2 text-xs bg-amber-600 text-white font-bold rounded-lg"
                      >
                        Submit Record (In-Memory)
                      </button>
                    </div>
                  </div>
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>New Entry</span>
            </button>
          </div>
        }
      />

      {/* KPI Tiles for this module */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Module Status"
          value="Operational"
          subtext="Responsive routing verified"
          icon={<HardHat className="h-4 w-4 text-amber-600" />}
        />
        <StatCard
          title="Cross-Entity Data"
          value="Connected"
          subtext="8 Employees, 5 Hubs, 15 Clients"
          isPositive={true}
          trend="up"
          change="Synced"
        />
        <StatCard
          title="Implementation Scope"
          value={comingInPart ? `Part ${comingInPart}` : 'Next Milestone'}
          subtext="Full domain logic in subsequent prompt"
          isPositive={true}
        />
      </div>

      {/* Module Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-900">{displayTitle} Work Area</span>
            <StatusBadge status="on-track" label="Shell Ready" size="sm" />
          </div>
          <span className="text-xs text-slate-400 font-mono">{location.pathname}</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          This subsystem is mapped to the BuildOS in-memory state engine and supports mobile-first responsive layout, desktop slide-over panels, mobile bottom-sheets, and shared cross-module entities.
        </p>

        <EmptyState
          title={`${displayTitle} Ready for Domain Content`}
          description={`The shell, breadcrumb trail, responsive navigation, and data store connectivity are active. Full forms and workflow actions will be implemented in subsequent phases.`}
          actionLabel="Test Action SlideOver"
          onAction={() =>
            openSlideOver(
              `Quick Entry: ${displayTitle}`,
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Slide-over drawer responsive on desktop and mobile bottom sheet.
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium">
                  Connected to in-memory state store with cross-referenced client and employee entities.
                </div>
                <button
                  onClick={closeSlideOver}
                  className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-lg"
                >
                  Close Test Form
                </button>
              </div>
            )
          }
        />
      </div>
    </div>
  );
};
