import React, { useState, useMemo } from 'react';
import {
  Users,
  Shield,
  Building,
  CheckCircle2,
  XCircle,
  Clock,
  Phone,
  Mail,
  HardHat,
  Filter,
  Plus,
  LogIn,
  Key,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { Avatar } from '../../components/ui/Avatar';
import { FilterBar } from '../../components/ui/FilterBar';
import { useAppStore } from '../../store/useAppStore';
import { User, UserRole, ColumnDef } from '../../types';
import { updateUser, toggleUserActiveStatus } from '../../services/settingsService';

const ALL_ROLES: { id: UserRole; label: string; badgeColor: string }[] = [
  { id: 'super_admin', label: 'Super Admin', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'management', label: 'Management', badgeColor: 'bg-teal-100 text-teal-900 border-teal-300' },
  { id: 'project_manager', label: 'Project Manager', badgeColor: 'bg-blue-100 text-blue-900 border-blue-300' },
  { id: 'site_engineer', label: 'Site Engineer', badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'civil_engineer', label: 'Civil Engineer', badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
  { id: 'purchase_manager', label: 'Purchase Manager', badgeColor: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'store_manager', label: 'Store Manager', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
  { id: 'accounts', label: 'Accounts', badgeColor: 'bg-sky-100 text-sky-900 border-sky-300' },
  { id: 'hr', label: 'HR & Muster', badgeColor: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'sales', label: 'Sales & CRM', badgeColor: 'bg-purple-100 text-purple-900 border-purple-300' },
  { id: 'estimation_engineer', label: 'Estimation Eng', badgeColor: 'bg-violet-100 text-violet-900 border-violet-300' },
  { id: 'qs', label: 'QS (Quantity Surveyor)', badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { id: 'safety_officer', label: 'Safety Officer', badgeColor: 'bg-rose-100 text-rose-900 border-rose-300' },
  { id: 'client', label: 'Client', badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'subcontractor', label: 'Subcontractor', badgeColor: 'bg-stone-100 text-stone-900 border-stone-300' },
];

export const UsersRolesPage: React.FC = () => {
  const { systemUsers, branches, loginAsUser, openSlideOver, closeSlideOver } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filter users
  const filteredUsers = useMemo(() => {
    return systemUsers.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (branchFilter !== 'ALL' && u.branchId !== branchFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesEmail = u.email.toLowerCase().includes(q);
        const matchesRole = u.roleTitle.toLowerCase().includes(q);
        const matchesProject = u.assignedProjects?.some((p) => p.toLowerCase().includes(q));
        if (!matchesName && !matchesEmail && !matchesRole && !matchesProject) return false;
      }
      return true;
    });
  }, [systemUsers, roleFilter, branchFilter, searchQuery]);

  const handleOpenUserDetail = (user: User) => {
    setSelectedUser(user);

    let editRole = user.role;
    let editStatus = user.status || 'active';
    let editPhone = user.phone;

    openSlideOver(
      'User Account & Access Profile',
      <div className="space-y-5">
        {/* User Card Header */}
        <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <Avatar name={user.name} size="lg" statusIndicator={user.status === 'active' ? 'online' : 'offline'} />
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 leading-none">{user.name}</h3>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                {user.roleTitle}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">ID: {user.id}</span>
            </div>
          </div>
        </div>

        {/* Quick Switch to this User (Storytelling) */}
        <div className="p-3 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-900">Demo Role Storytelling</p>
            <p className="text-[11px] text-slate-600">Switch current session to experience BuildOS as {user.name}.</p>
          </div>
          <button
            onClick={() => {
              loginAsUser(user);
              closeSlideOver();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex-shrink-0"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Login As</span>
          </button>
        </div>

        {/* Edit Form */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700">Assigned System Role</label>
            <select
              defaultValue={user.role}
              onChange={(e) => (editRole = e.target.value as UserRole)}
              className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {ALL_ROLES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Account Status</label>
            <select
              defaultValue={user.status || 'active'}
              onChange={(e) => (editStatus = e.target.value as 'active' | 'inactive')}
              className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="active">Active (Access Granted)</option>
              <option value="inactive">Inactive (Suspended)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">Direct Phone Number</label>
            <input
              type="text"
              defaultValue={user.phone}
              onChange={(e) => (editPhone = e.target.value)}
              className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Assigned Project Scope */}
          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-semibold text-slate-700">Project Scopes & Access</label>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
              <p className="text-[11px] text-slate-500">Currently assigned projects for this user:</p>
              <div className="flex flex-wrap gap-1.5">
                {user.assignedProjects && user.assignedProjects.length > 0 ? (
                  user.assignedProjects.map((proj, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs"
                    >
                      {proj}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">All Enterprise Sites</span>
                )}
              </div>
            </div>
          </div>

          {/* Audit Info */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Last Activity: {user.lastLogin || 'Recent'}</span>
            <span>Hub: {user.branchName}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
          <button onClick={closeSlideOver} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => {
              updateUser(user.id, {
                role: editRole,
                status: editStatus,
                phone: editPhone,
              });
              closeSlideOver();
            }}
            className="px-4 py-2 text-xs bg-amber-600 text-white font-bold rounded-lg shadow-sm hover:bg-amber-700 transition-colors"
          >
            Save User Changes
          </button>
        </div>
      </div>,
      'User Details & Permission Scope'
    );
  };

  // DataTable Column Definitions
  const userColumns: ColumnDef<User>[] = [
    {
      key: 'name',
      header: 'User Name & Contact',
      sortable: true,
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={u.name} size="sm" statusIndicator={u.status === 'active' ? 'online' : 'offline'} />
          <div>
            <p className="font-bold text-slate-900 leading-snug">{u.name}</p>
            <p className="text-[11px] text-slate-500">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Assigned Role',
      sortable: true,
      render: (u) => {
        const rConfig = ALL_ROLES.find((r) => r.id === u.role);
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
              rConfig?.badgeColor || 'bg-slate-100 text-slate-700'
            }`}
          >
            {u.roleTitle || u.role}
          </span>
        );
      },
    },
    {
      key: 'branchName',
      header: 'Operating Branch / Hub',
      sortable: true,
      render: (u) => <span className="text-xs text-slate-700">{u.branchName}</span>,
    },
    {
      key: 'assignedProjects',
      header: 'Project Assignment',
      render: (u) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {u.assignedProjects && u.assignedProjects.length > 0 ? (
            u.assignedProjects.map((p, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 border border-slate-200 text-slate-700 truncate"
              >
                {p}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-slate-400">Universal Scope</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      sortable: true,
      render: (u) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleUserActiveStatus(u.id);
          }}
          className="focus:outline-none"
          title="Click to toggle status"
        >
          <StatusBadge
            status={u.status || 'active'}
            label={u.status === 'inactive' ? 'Inactive' : 'Active'}
            size="sm"
          />
        </button>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      width: '130px',
      sortable: true,
      render: (u) => <span className="text-[11px] text-slate-500 font-mono">{u.lastLogin || 'Recent'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users & Roles Directory"
        subtitle="35+ Seeded Enterprise Personnel across 15 Role Profiles with localized branch and project access."
        breadcrumbs={[{ label: 'Settings', path: '/settings/company' }, { label: 'Users & Roles' }]}
        badge={`${systemUsers.length} Users Seeded`}
        actions={
          <button
            onClick={() => alert('New User Invitation simulated. Select any existing user to inspect details.')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>Invite Team Member</span>
          </button>
        }
      />

      {/* Role Filter Chips & Search Bar */}
      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, email, role, or project..."
        hasActiveFilters={roleFilter !== 'ALL' || branchFilter !== 'ALL' || !!searchQuery}
        onResetFilters={() => {
          setRoleFilter('ALL');
          setBranchFilter('ALL');
          setSearchQuery('');
        }}
        filterGroups={[
          {
            id: 'role',
            label: 'Role',
            selectedValue: roleFilter,
            onChange: setRoleFilter,
            options: [
              { label: 'All Roles (15)', value: 'ALL' },
              ...ALL_ROLES.map((r) => ({ label: r.label, value: r.id })),
            ],
          },
          {
            id: 'branch',
            label: 'Branch',
            selectedValue: branchFilter,
            onChange: setBranchFilter,
            options: [
              { label: 'All Hubs (5)', value: 'ALL' },
              ...branches.map((b) => ({ label: b.name, value: b.id })),
            ],
          },
        ]}
      />

      {/* Users DataTable with Interactive Inspection */}
      <DataTable<User>
        data={filteredUsers}
        columns={userColumns}
        pageSize={8}
        onRowClick={handleOpenUserDetail}
        searchable={false}
      />
    </div>
  );
};
