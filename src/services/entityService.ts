import { useAppStore } from '../store/useAppStore';
import { Employee, Branch, Client, StatMetric } from '../types';

/**
 * Service Layer: entityService
 * Decouples UI components from the underlying state store or future API endpoints.
 */

export const getEmployees = async (branchId?: string): Promise<Employee[]> => {
  const employees = useAppStore.getState().employees;
  if (!branchId || branchId === 'ALL') return employees;
  return employees.filter((e) => e.branchId === branchId);
};

export const getEmployeeById = async (id: string): Promise<Employee | undefined> => {
  return useAppStore.getState().employees.find((e) => e.id === id);
};

export const getBranches = async (): Promise<Branch[]> => {
  return useAppStore.getState().branches;
};

export const getBranchById = async (id: string): Promise<Branch | undefined> => {
  return useAppStore.getState().branches.find((b) => b.id === id);
};

export const getClients = async (query?: string, status?: string): Promise<Client[]> => {
  let clients = useAppStore.getState().clients;
  if (query) {
    const q = query.toLowerCase();
    clients = clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.companyName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    );
  }
  if (status && status !== 'ALL') {
    clients = clients.filter((c) => c.status === status);
  }
  return clients;
};

export const getClientById = async (id: string): Promise<Client | undefined> => {
  return useAppStore.getState().clients.find((c) => c.id === id);
};

export const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
  return useAppStore.getState().addClient(clientData);
};

export const updateClient = async (id: string, updates: Partial<Client>): Promise<void> => {
  useAppStore.getState().updateClient(id, updates);
};

export const deleteClient = async (id: string): Promise<void> => {
  useAppStore.getState().deleteClient(id);
};

export const getSummaryStats = async (): Promise<StatMetric[]> => {
  const clients = useAppStore.getState().clients;
  const branches = useAppStore.getState().branches;
  const employees = useAppStore.getState().employees;

  const totalContractVal = clients.reduce((acc, c) => acc + c.totalContractValue, 0);
  const totalOutstanding = clients.reduce((acc, c) => acc + c.outstandingBalance, 0);
  const totalActiveProjects = branches.reduce((acc, b) => acc + b.activeProjectsCount, 0);

  return [
    {
      id: 'active_projects',
      title: 'Active Projects',
      value: `${totalActiveProjects}`,
      change: '+2 this month',
      trend: 'up',
      isPositive: true,
      subtext: 'Across 5 regional hubs',
      icon: 'Building2',
    },
    {
      id: 'total_portfolio',
      title: 'Order Book (Total Portfolio)',
      value: `₹ ${(totalContractVal / 10000000).toFixed(1)} Cr`,
      change: '+14.2% YoY',
      trend: 'up',
      isPositive: true,
      subtext: '15 Active enterprise contracts',
      icon: 'Briefcase',
    },
    {
      id: 'outstanding_billing',
      title: 'Outstanding RA Bills',
      value: `₹ ${(totalOutstanding / 10000000).toFixed(1)} Cr`,
      change: '₹ 1.4 Cr overdue',
      trend: 'down',
      isPositive: false,
      subtext: 'Weighted avg 42 days',
      icon: 'Receipt',
    },
    {
      id: 'active_workforce',
      title: 'Field Workforce & Staff',
      value: `${employees.length * 165}`,
      change: '98.4% On-Duty',
      trend: 'up',
      isPositive: true,
      subtext: '8 Key engineers & 1,320 labor',
      icon: 'Users',
    },
  ];
};
