import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Save,
  CheckSquare,
  Square,
  AlertCircle,
  Building,
  Layers,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useAppStore } from '../../store/useAppStore';
import { UserRole, PermissionAction } from '../../types';
import { PERMISSION_MODULES, DEFAULT_PERMISSION_MAP } from '../../data/mockSeed';

const ACTIONS: { id: PermissionAction; label: string; description: string }[] = [
  { id: 'view', label: 'View', description: 'Read-only visibility of records' },
  { id: 'create', label: 'Create', description: 'Create new records and entries' },
  { id: 'edit', label: 'Edit', description: 'Modify draft and existing records' },
  { id: 'delete', label: 'Delete', description: 'Archive or purge records' },
  { id: 'approve', label: 'Approve', description: 'Sign-off on financial/safety workflows' },
  { id: 'export', label: 'Export', description: 'Export records to XLSX / CSV' },
  { id: 'download', label: 'Download', description: 'Download drawings and attachments' },
];

const ROLES_LIST: { id: UserRole; label: string; description: string }[] = [
  { id: 'super_admin', label: 'Super Admin', description: 'Complete unrestricted corporate access' },
  { id: 'management', label: 'Management', description: 'Executive oversight, approvals, and high-level reports' },
  { id: 'project_manager', label: 'Project Manager', description: 'Project planning, tasks, approvals, and execution' },
  { id: 'site_engineer', label: 'Site Engineer', description: 'DPR, site tasks, measurements, safety, and muster' },
  { id: 'civil_engineer', label: 'Civil Engineer', description: 'Drawings, structural tasks, and progress' },
  { id: 'purchase_manager', label: 'Purchase Manager', description: 'Vendor empanelment, PR/PO approval, RFQs' },
  { id: 'store_manager', label: 'Store Manager', description: 'GRN, bin cards, stock issues and transfers' },
  { id: 'accounts', label: 'Accounts', description: 'Client billing, contractor payables, expenses, petty cash' },
  { id: 'hr', label: 'HR & Muster', description: 'Labour compliance, personnel records, and payroll' },
  { id: 'sales', label: 'Sales & BD', description: 'Leads, customer CRM, pipeline, and follow-ups' },
  { id: 'estimation_engineer', label: 'Estimation Engineer', description: 'BOQ, rate analysis, tender bids, quotations' },
  { id: 'qs', label: 'Quantity Surveyor (QS)', description: 'Measurement books, RA bills certification, claims' },
  { id: 'safety_officer', label: 'Safety Officer', description: 'HSE audits, incident logs, safety toolbox briefings' },
  { id: 'client', label: 'Client Representative', description: 'Client portal view, approved RA bills, drawings' },
  { id: 'subcontractor', label: 'Subcontractor Lead', description: 'Assigned work orders, daily muster submission' },
];

export const PermissionsPage: React.FC = () => {
  const { permissionMatrix, updatePermission, setRoleAllPermissions, resetRolePermissions, addAuditLogEntry, currentUser } = useAppStore();

  const [selectedRole, setSelectedRole] = useState<UserRole>('site_engineer');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const rolePermissions = permissionMatrix[selectedRole] || {};

  // Count active permissions for summary
  const permissionStats = useMemo(() => {
    let totalGranted = 0;
    const totalPossible = PERMISSION_MODULES.length * ACTIONS.length;
    let fullAccessCount = 0;

    PERMISSION_MODULES.forEach((mod) => {
      const perms = rolePermissions[mod.id] || {};
      const grantedCount = ACTIONS.filter((a) => perms[a.id]).length;
      totalGranted += grantedCount;
      if (grantedCount === ACTIONS.length) fullAccessCount++;
    });

    return { totalGranted, totalPossible, fullAccessCount };
  }, [rolePermissions]);

  const handleToggle = (moduleId: string, action: PermissionAction, currentValue: boolean) => {
    updatePermission(selectedRole, moduleId, action, !currentValue);
    setHasUnsavedChanges(true);
  };

  const handleToggleRow = (moduleId: string) => {
    const perms = rolePermissions[moduleId] || {};
    const allChecked = ACTIONS.every((a) => perms[a.id]);
    ACTIONS.forEach((a) => {
      updatePermission(selectedRole, moduleId, a.id, !allChecked);
    });
    setHasUnsavedChanges(true);
  };

  const handleToggleAllForRole = (value: boolean) => {
    setRoleAllPermissions(selectedRole, value);
    setHasUnsavedChanges(true);
  };

  const handleResetToDefault = () => {
    resetRolePermissions(selectedRole);
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    setHasUnsavedChanges(false);
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);

    addAuditLogEntry({
      userId: currentUser?.id || 'USR-001',
      userName: currentUser?.name || 'Admin',
      userRole: currentUser?.role || 'super_admin',
      action: 'UPDATE',
      module: 'Settings > Permissions',
      recordRef: `Role Permissions: ${selectedRole.replace('_', ' ').toUpperCase()}`,
      newValue: `Updated permissions matrix (${permissionStats.totalGranted} actions authorized)`,
      ipAddress: '192.168.1.2',
      badgeVariant: 'warning',
    });
  };

  return (
    <div className="space-y-6 pb-20">
      <PageHeader
        title="Role Permissions Matrix & Scope Control"
        subtitle="Configure granular action-level access and site/branch visibility rules across all 21 subsystems."
        breadcrumbs={[{ label: 'Settings', path: '/settings/company' }, { label: 'Permissions' }]}
        badge="RBAC Matrix"
      />

      {/* Role Selector Header Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 rounded-lg text-amber-700 border border-amber-200 flex-shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Select Role to Configure
            </label>
            <select
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value as UserRole);
                setHasUnsavedChanges(false);
              }}
              className="mt-0.5 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              {ROLES_LIST.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label} — {r.description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Level Summary Tile */}
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
              Authorization Level
            </span>
            <span className="font-bold text-slate-800 font-mono">
              {permissionStats.totalGranted} of {permissionStats.totalPossible} Actions ({Math.round((permissionStats.totalGranted / permissionStats.totalPossible) * 100)}%)
            </span>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <button
              onClick={() => handleToggleAllForRole(true)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
            >
              Grant All
            </button>
            <button
              onClick={() => handleToggleAllForRole(false)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors"
            >
              Revoke All
            </button>
            <button
              onClick={handleResetToDefault}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
              title="Reset to default baseline for this role"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" />
          Permissions for {selectedRole.replace('_', ' ').toUpperCase()} successfully updated and logged to audit trail!
        </div>
      )}

      {/* Main Module x Action Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-card overflow-hidden">
        <div className="p-3.5 bg-slate-50/70 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Module Permissions Matrix ({PERMISSION_MODULES.length} Functional Areas)
          </span>
          <span className="text-[11px] text-slate-400">Click any checkbox or row header to toggle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <th className="py-2.5 px-4 min-w-[200px]">Subsystem / Module</th>
                {ACTIONS.map((action) => (
                  <th key={action.id} className="py-2.5 px-3 text-center min-w-[80px]" title={action.description}>
                    {action.label}
                  </th>
                ))}
                <th className="py-2.5 px-3 text-center min-w-[70px]">Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {PERMISSION_MODULES.map((mod) => {
                const modPerms = rolePermissions[mod.id] || {
                  create: false,
                  view: false,
                  edit: false,
                  delete: false,
                  approve: false,
                  export: false,
                  download: false,
                };
                const rowAllChecked = ACTIONS.every((a) => modPerms[a.id]);

                return (
                  <tr key={mod.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 leading-snug">{mod.name}</p>
                      <span className="text-[10px] text-slate-400 font-mono">key: {mod.id}</span>
                    </td>

                    {ACTIONS.map((action) => {
                      const isChecked = !!modPerms[action.id];
                      return (
                        <td key={action.id} className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggle(mod.id, action.id, isChecked)}
                            className={`p-1.5 rounded transition-colors inline-flex items-center justify-center min-h-[32px] min-w-[32px] ${
                              isChecked
                                ? 'bg-amber-500 text-slate-950 hover:bg-amber-600'
                                : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                            }`}
                            aria-label={`Toggle ${action.label} on ${mod.name}`}
                          >
                            {isChecked ? (
                              <CheckSquare className="h-4 w-4 text-slate-950" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleRow(mod.id)}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                          rowAllChecked
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {rowAllChecked ? 'Revoke' : 'All'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Secondary Tables: Project-wise & Branch-wise Scope Access */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Branch Scope Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building className="h-4 w-4 text-amber-600" />
            <h4 className="font-bold text-sm text-slate-900">Branch-wise Visibility Rules</h4>
          </div>
          <p className="text-xs text-slate-500">Defines whether this role sees data across all regional divisions or only their home branch.</p>

          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="branchScope"
                defaultChecked={selectedRole === 'super_admin' || selectedRole === 'management'}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-800 block">Universal Enterprise Scope (All 5 Hubs)</span>
                <span className="text-[11px] text-slate-400">Can view and filter across Mumbai HQ, Bengaluru, Ahmedabad, NCR & Chennai.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="branchScope"
                defaultChecked={selectedRole !== 'super_admin' && selectedRole !== 'management'}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-800 block">Home Branch Only (Restricted Scope)</span>
                <span className="text-[11px] text-slate-400">User is locked to their designated branch hub and its subsidiary site yards.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Project Scope Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Layers className="h-4 w-4 text-blue-600" />
            <h4 className="font-bold text-sm text-slate-900">Project-wise Assignment Constraint</h4>
          </div>
          <p className="text-xs text-slate-500">Restricts records (DPRs, POs, Drawings, Tasks) strictly to projects explicitly assigned to the user.</p>

          <div className="space-y-2 pt-1 text-xs">
            <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="projectScope"
                defaultChecked={selectedRole === 'super_admin' || selectedRole === 'management'}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-800 block">All Active Projects in Division</span>
                <span className="text-[11px] text-slate-400">Can access all ongoing tenders and construction packages within the hub.</span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="projectScope"
                defaultChecked={selectedRole !== 'super_admin' && selectedRole !== 'management'}
                className="mt-0.5 text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="font-bold text-slate-800 block">Strictly Assigned Projects Only</span>
                <span className="text-[11px] text-slate-400">Site engineers, subcontractors, and clients see only their assigned projects.</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Save Changes Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-8 sm:max-w-md z-50 bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-white">Unsaved Permissions</p>
              <p className="text-[11px] text-slate-300">Pending changes for {selectedRole.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                resetRolePermissions(selectedRole);
                setHasUnsavedChanges(false);
              }}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white font-medium"
            >
              Discard
            </button>
            <button
              onClick={handleSaveChanges}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
