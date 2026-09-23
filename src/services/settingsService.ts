import { useAppStore } from '../store/useAppStore';
import {
  CompanyProfile,
  BankAccount,
  Department,
  CostCenter,
  CompanyDocument,
  User,
  UserRole,
  AuditLogEntry,
  PermissionAction,
} from '../types';

export const getCompanyProfile = async (): Promise<CompanyProfile> => {
  return useAppStore.getState().companyProfile;
};

export const updateCompanyProfile = async (updates: Partial<CompanyProfile>): Promise<void> => {
  useAppStore.getState().updateCompanyProfile(updates);
  useAppStore.getState().addAuditLogEntry({
    userId: useAppStore.getState().currentUser?.id || 'SYS',
    userName: useAppStore.getState().currentUser?.name || 'System Admin',
    userRole: useAppStore.getState().currentUser?.role || 'super_admin',
    action: 'UPDATE',
    module: 'Settings > Company',
    recordRef: 'Company General Profile',
    newValue: `Updated: ${Object.keys(updates).join(', ')}`,
    ipAddress: '192.168.1.2',
    badgeVariant: 'warning',
  });
};

export const getBankAccounts = async (): Promise<BankAccount[]> => {
  return useAppStore.getState().bankAccounts;
};

export const createBankAccount = async (account: Omit<BankAccount, 'id'>): Promise<BankAccount> => {
  const created = useAppStore.getState().addBankAccount(account);
  useAppStore.getState().addAuditLogEntry({
    userId: useAppStore.getState().currentUser?.id || 'SYS',
    userName: useAppStore.getState().currentUser?.name || 'System Admin',
    userRole: useAppStore.getState().currentUser?.role || 'super_admin',
    action: 'CREATE',
    module: 'Settings > Company',
    recordRef: `Bank Account: ${account.bankName} (${account.accountNumber.slice(-4)})`,
    newValue: `Account Type: ${account.accountType}`,
    ipAddress: '192.168.1.2',
    badgeVariant: 'info',
  });
  return created;
};

export const getDepartments = async (): Promise<Department[]> => {
  return useAppStore.getState().departments;
};

export const getCostCenters = async (): Promise<CostCenter[]> => {
  return useAppStore.getState().costCenters;
};

export const getCompanyDocuments = async (): Promise<CompanyDocument[]> => {
  return useAppStore.getState().companyDocuments;
};

export const getAllUsers = async (roleFilter?: string, branchFilter?: string, query?: string): Promise<User[]> => {
  let users = useAppStore.getState().systemUsers;

  if (roleFilter && roleFilter !== 'ALL') {
    users = users.filter((u) => u.role === roleFilter);
  }

  if (branchFilter && branchFilter !== 'ALL') {
    users = users.filter((u) => u.branchId === branchFilter);
  }

  if (query && query.trim()) {
    const q = query.toLowerCase();
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.roleTitle.toLowerCase().includes(q) ||
        (u.assignedProjects && u.assignedProjects.some((p) => p.toLowerCase().includes(q)))
    );
  }

  return users;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
  useAppStore.getState().updateSystemUser(id, updates);
  useAppStore.getState().addAuditLogEntry({
    userId: useAppStore.getState().currentUser?.id || 'SYS',
    userName: useAppStore.getState().currentUser?.name || 'System Admin',
    userRole: useAppStore.getState().currentUser?.role || 'super_admin',
    action: 'UPDATE',
    module: 'Settings > Users & Roles',
    recordRef: `User: ${updates.name || id}`,
    newValue: `Status/Details modified: ${Object.keys(updates).join(', ')}`,
    ipAddress: '192.168.1.2',
    badgeVariant: 'warning',
  });
};

export const toggleUserActiveStatus = async (id: string): Promise<void> => {
  const user = useAppStore.getState().systemUsers.find((u) => u.id === id);
  useAppStore.getState().toggleUserStatus(id);
  useAppStore.getState().addAuditLogEntry({
    userId: useAppStore.getState().currentUser?.id || 'SYS',
    userName: useAppStore.getState().currentUser?.name || 'System Admin',
    userRole: useAppStore.getState().currentUser?.role || 'super_admin',
    action: 'UPDATE',
    module: 'Settings > Users & Roles',
    recordRef: `User: ${user?.name || id}`,
    oldValue: `Status: ${user?.status}`,
    newValue: `Status: ${user?.status === 'active' ? 'inactive' : 'active'}`,
    ipAddress: '192.168.1.2',
    badgeVariant: 'warning',
  });
};

export const getAuditLogs = async (userFilter?: string, moduleFilter?: string, query?: string): Promise<AuditLogEntry[]> => {
  let logs = useAppStore.getState().auditLogs;

  if (userFilter && userFilter !== 'ALL') {
    logs = logs.filter((l) => l.userId === userFilter || l.userName === userFilter);
  }

  if (moduleFilter && moduleFilter !== 'ALL') {
    logs = logs.filter((l) => l.module.toLowerCase().includes(moduleFilter.toLowerCase()));
  }

  if (query && query.trim()) {
    const q = query.toLowerCase();
    logs = logs.filter(
      (l) =>
        l.recordRef.toLowerCase().includes(q) ||
        l.newValue.toLowerCase().includes(q) ||
        (l.oldValue && l.oldValue.toLowerCase().includes(q)) ||
        l.userName.toLowerCase().includes(q)
    );
  }

  return logs;
};
