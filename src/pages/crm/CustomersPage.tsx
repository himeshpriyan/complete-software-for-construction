import React, { useState, useMemo } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Client, ColumnDef } from '../../types';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import {
  Users,
  Building,
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  ExternalLink,
  DollarSign,
  Briefcase,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const CustomersPage: React.FC = () => {
  const { clients, addClient } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [segment, setSegment] = useState<Client['segment']>('Commercial');
  const [contractValue, setContractValue] = useState('15000000');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Metrics
  const totalContractVal = useMemo(
    () => clients.reduce((sum, c) => sum + (c.totalContractValue || 0), 0),
    [clients]
  );
  const totalOutstanding = useMemo(
    () => clients.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0),
    [clients]
  );
  const activeCount = useMemo(() => clients.filter((c) => c.status === 'active').length, [clients]);

  // Filtered clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCompany = (c.companyName || '').toLowerCase().includes(q);
        const matchesCity = c.city.toLowerCase().includes(q);
        const matchesContact = (c.primaryContactPerson || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCompany && !matchesCity && !matchesContact) return false;
      }
      return true;
    });
  }, [clients, statusFilter, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newClient = addClient({
      name,
      companyName: companyName || name,
      email,
      phone,
      city,
      state,
      status: 'active',
      segment,
      totalProjects: 1,
      totalContractValue: Number(contractValue) || 0,
      outstandingBalance: 0,
      primaryContactPerson: name,
    });

    showToast(`Customer ${newClient.name} added successfully`);
    setIsAddModalOpen(false);
    setName('');
    setCompanyName('');
    setEmail('');
  };

  const columns: ColumnDef<Client>[] = [
    {
      key: 'id',
      header: 'Client ID',
      width: '100px',
      render: (c: Client) => <span className="font-mono text-xs font-semibold text-slate-500">{c.id}</span>,
    },
    {
      key: 'name',
      header: 'Customer / Company',
      render: (c: Client) => (
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.name}</h4>
          {c.companyName && <p className="text-[11px] text-slate-500">{c.companyName}</p>}
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact Info',
      render: (c: Client) => (
        <div className="text-xs space-y-0.5">
          <p className="text-slate-800 dark:text-slate-200">{c.phone}</p>
          <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{c.email}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      render: (c: Client) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">
          {c.city}, {c.state}
        </span>
      ),
    },
    {
      key: 'projects',
      header: 'Projects',
      render: (c: Client) => (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          <Briefcase className="w-3 h-3 text-amber-600" />
          <span>{c.totalProjects} Active</span>
        </span>
      ),
    },
    {
      key: 'totalContractValue',
      header: 'Contract Value',
      align: 'right',
      render: (c: Client) => (
        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
          ₹ {((c.totalContractValue || 0) / 10000000).toFixed(2)} Cr
        </span>
      ),
    },
    {
      key: 'outstandingBalance',
      header: 'Outstanding',
      align: 'right',
      render: (c: Client) => (
        <span
          className={`text-xs font-semibold ${
            (c.outstandingBalance || 0) > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'
          }`}
        >
          ₹ {((c.outstandingBalance || 0) / 100000).toFixed(1)} L
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (c: Client) => (
        <StatusBadge
          variant={c.status === 'active' ? 'success' : 'neutral'}
          label={c.status === 'active' ? 'Active Account' : 'Archived'}
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (c: Client) => (
        <button
          onClick={() => setSelectedClient(c)}
          className="px-2.5 py-1 text-xs font-medium text-amber-600 hover:text-amber-700 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 rounded transition-colors"
        >
          View 360°
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 border border-amber-500/40 text-white px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Customer Directory & Accounts"
        subtitle="Master directory of contracted clients, corporate accounts, project history, and receivable ledgers"
        badge={`${clients.length} Accounts`}
        actions={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={clients.length.toString()}
          subtext={`${activeCount} active contracted`}
          icon="Users"
          trend="up"
        />
        <StatCard
          title="Active Contract Value"
          value={`₹ ${(totalContractVal / 10000000).toFixed(1)} Cr`}
          subtext="Cumulative portfolio billing"
          icon="DollarSign"
          trend="up"
        />
        <StatCard
          title="Outstanding Receivables"
          value={`₹ ${(totalOutstanding / 10000000).toFixed(2)} Cr`}
          subtext="Across pending milestone invoices"
          icon="Briefcase"
          trend="neutral"
        />
        <StatCard
          title="Avg Contract Size"
          value={`₹ ${((totalContractVal / (clients.length || 1)) / 10000000).toFixed(2)} Cr`}
          subtext="Per corporate client"
          icon="Building"
          trend="up"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer, company, city, contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 whitespace-nowrap">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Accounts ({clients.length})</option>
            <option value="active">Active ({clients.filter((c) => c.status === 'active').length})</option>
            <option value="inactive">Inactive ({clients.filter((c) => c.status === 'inactive').length})</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <DataTable
          data={filteredClients}
          columns={columns}
        />
      </div>

      {/* Client 360 Slide-over Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-end animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 h-full max-w-lg w-full border-l border-slate-200 dark:border-slate-800 p-6 overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="font-mono text-xs text-amber-600 dark:text-amber-400 font-bold">
                  {selectedClient.id}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{selectedClient.name}</h3>
                <p className="text-xs text-slate-500">{selectedClient.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedClient(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-base font-semibold"
              >
                ✕
              </button>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 font-medium">Contract Value</p>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  ₹ {((selectedClient.totalContractValue || 0) / 10000000).toFixed(2)} Cr
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-500 font-medium">Outstanding Due</p>
                <p className="text-base font-bold text-amber-600 dark:text-amber-400 mt-1">
                  ₹ {((selectedClient.outstandingBalance || 0) / 100000).toFixed(2)} L
                </p>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Details</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Contact Person</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedClient.primaryContactPerson || selectedClient.name}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Phone Number</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{selectedClient.phone}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Email Address</span>
                  <span className="text-slate-800 dark:text-slate-200">{selectedClient.email}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Segment</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedClient.segment}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Location</span>
                  <span className="text-right text-slate-800 dark:text-slate-200">
                    {selectedClient.city}, {selectedClient.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Projects */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Projects ({selectedClient.totalProjects})
              </h4>
              <div className="p-3 bg-amber-50/40 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 dark:border-amber-900/40 space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>Apex Towers Phase 2</span>
                  <StatusBadge variant="success" label="In Progress" size="sm" />
                </div>
                <p className="text-[11px] text-slate-500">Commercial High-rise • 42,000 sq.ft • {selectedClient.city}</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '48%' }} />
                </div>
                <p className="text-[10px] text-right text-slate-400 pt-1">Milestone 4 of 8 Complete (48%)</p>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedClient(null)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Add New Customer</h3>
                  <p className="text-xs text-slate-500">Create client profile & billing account</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Mehta"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Mehta Logistics Ltd"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98200 12345"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@example.com"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Segment
                  </label>
                  <select
                    value={segment}
                    onChange={(e) => setSegment(e.target.value as Client['segment'])}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  >
                    <option value="Commercial">Commercial</option>
                    <option value="Residential">Residential</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Government">Government</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Contract Value (INR)
                  </label>
                  <input
                    type="number"
                    value={contractValue}
                    onChange={(e) => setContractValue(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
