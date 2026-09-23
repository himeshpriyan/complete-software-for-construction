import React, { useState } from 'react';
import {
  Building2,
  Landmark,
  FileText,
  MapPin,
  Users,
  PieChart,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit2,
  Upload,
  ExternalLink,
  Download,
  Trash2,
  Save,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { FileUploadDropzone } from '../../components/ui/FileUploadDropzone';
import { useAppStore } from '../../store/useAppStore';
import { updateCompanyProfile } from '../../services/settingsService';
import {
  Branch,
  BankAccount,
  Department,
  CostCenter,
  CompanyDocument,
  ColumnDef,
} from '../../types';
import { cn, formatCurrency } from '../../utils/cn';

type ActiveTab = 'general' | 'branches' | 'banks' | 'departments' | 'cost_centers' | 'documents' | 'tax_erp' | 'demo_data';

export const CompanyMasterPage: React.FC = () => {
  const {
    companyProfile,
    branches,
    bankAccounts,
    departments,
    costCenters,
    companyDocuments,
    erpSettings,
    resetDemoData,
    setCompanyGstRate,
    updateErpSettings,
    setPrimaryBankAccount,
    addBankAccount,
    addDepartment,
    addCostCenter,
    openSlideOver,
    closeSlideOver,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>('general');
  const [generalForm, setGeneralForm] = useState({ ...companyProfile });
  const [isSavedBanner, setIsSavedBanner] = useState(false);
  const [isResetBanner, setIsResetBanner] = useState(false);

  const handleResetDemoData = () => {
    if (window.confirm('Reset all demo data across CRM, Estimation, Projects, Procurement, Finance, HR & Safety back to their initial showcase state?')) {
      resetDemoData();
      setIsResetBanner(true);
      setTimeout(() => setIsResetBanner(false), 4000);
    }
  };

  // General tab save handler
  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyProfile(generalForm);
    setIsSavedBanner(true);
    setTimeout(() => setIsSavedBanner(false), 3000);
  };

  // 1. Branches Columns
  const branchColumns: ColumnDef<Branch>[] = [
    {
      key: 'code',
      header: 'Code',
      width: '100px',
      sortable: true,
      render: (b) => (
        <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
          {b.code}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Operating Division / Hub',
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
      header: 'City & State',
      sortable: true,
      render: (b) => <span className="text-slate-700">{b.city}, {b.state}</span>,
    },
    {
      key: 'managerName',
      header: 'Regional In-Charge',
      sortable: true,
      render: (b) => <span className="font-semibold text-slate-800">{b.managerName}</span>,
    },
    {
      key: 'activeProjectsCount',
      header: 'Active Sites',
      align: 'center',
      width: '110px',
      render: (b) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
          {b.activeProjectsCount} Sites
        </span>
      ),
    },
    {
      key: 'isHQ',
      header: 'Classification',
      width: '110px',
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

  // 2. Bank Accounts Columns
  const bankColumns: ColumnDef<BankAccount>[] = [
    {
      key: 'bankName',
      header: 'Bank & Branch',
      sortable: true,
      render: (b) => (
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-slate-900">{b.bankName}</p>
            {b.isPrimary && (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                Primary
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500">{b.branchAddress}</p>
        </div>
      ),
    },
    {
      key: 'accountNumber',
      header: 'Account Number',
      render: (b) => <span className="font-mono text-xs font-semibold text-slate-800">{b.accountNumber}</span>,
    },
    {
      key: 'ifscCode',
      header: 'IFSC Code',
      width: '130px',
      render: (b) => <span className="font-mono text-xs text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{b.ifscCode}</span>,
    },
    {
      key: 'accountType',
      header: 'Type',
      width: '130px',
      render: (b) => <StatusBadge variant="info" label={b.accountType} size="sm" dot={false} />,
    },
    {
      key: 'balanceFormatted',
      header: 'Available Balance',
      align: 'right',
      render: (b) => <span className="font-mono font-bold text-slate-900">{b.balanceFormatted}</span>,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      width: '110px',
      render: (b) => (
        !b.isPrimary ? (
          <button
            onClick={() => setPrimaryBankAccount(b.id)}
            className="text-[11px] text-amber-700 font-bold hover:underline"
          >
            Make Primary
          </button>
        ) : (
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
            <CheckCircle2 className="h-3 w-3" /> Active Default
          </span>
        )
      ),
    },
  ];

  // 3. Departments Columns
  const deptColumns: ColumnDef<Department>[] = [
    {
      key: 'code',
      header: 'Code',
      width: '110px',
      render: (d) => <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{d.code}</span>,
    },
    {
      key: 'name',
      header: 'Department Name',
      sortable: true,
      render: (d) => (
        <div>
          <p className="font-bold text-slate-900">{d.name}</p>
          <p className="text-[11px] text-slate-500 max-w-sm leading-tight">{d.description}</p>
        </div>
      ),
    },
    {
      key: 'headName',
      header: 'Department Head',
      render: (d) => <span className="font-semibold text-slate-800">{d.headName}</span>,
    },
    {
      key: 'staffCount',
      header: 'Staff Count',
      align: 'center',
      width: '110px',
      render: (d) => <span className="font-bold text-slate-800">{d.staffCount} Team Members</span>,
    },
  ];

  // 4. Cost Centers Columns
  const costCenterColumns: ColumnDef<CostCenter>[] = [
    {
      key: 'code',
      header: 'Code',
      width: '130px',
      render: (cc) => <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">{cc.code}</span>,
    },
    {
      key: 'name',
      header: 'Cost Center & Allocated Site',
      sortable: true,
      render: (cc) => (
        <div>
          <p className="font-bold text-slate-900">{cc.name}</p>
          <p className="text-[11px] text-slate-500">{cc.branchName}</p>
        </div>
      ),
    },
    {
      key: 'annualBudget',
      header: 'Sanctioned Budget',
      align: 'right',
      render: (cc) => <span className="font-mono font-bold text-slate-900">{formatCurrency(cc.annualBudget)}</span>,
    },
    {
      key: 'utilizedAmount',
      header: 'Current Utilization',
      align: 'right',
      render: (cc) => {
        const pct = Math.round((cc.utilizedAmount / cc.annualBudget) * 100);
        return (
          <div className="text-right space-y-1">
            <span className="font-mono font-semibold text-slate-700">{formatCurrency(cc.utilizedAmount)} ({pct}%)</span>
            <div className="h-1.5 w-24 ml-auto bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${pct > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (cc) => <StatusBadge status={cc.status} size="sm" />,
    },
  ];

  // 5. Documents Columns
  const documentColumns: ColumnDef<CompanyDocument>[] = [
    {
      key: 'title',
      header: 'Statutory Document Title',
      sortable: true,
      render: (doc) => (
        <div>
          <p className="font-bold text-slate-900 leading-tight">{doc.title}</p>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
            <span className="font-mono">Doc #{doc.documentNumber}</span>
            <span>•</span>
            <span>{doc.issuingAuthority}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '150px',
      render: (doc) => <span className="text-xs text-slate-600 font-medium">{doc.category}</span>,
    },
    {
      key: 'issueDate',
      header: 'Issue Date',
      width: '110px',
      render: (doc) => <span className="text-slate-600 text-xs">{doc.issueDate}</span>,
    },
    {
      key: 'expiryDate',
      header: 'Expiry & Validity',
      width: '180px',
      render: (doc) => {
        if (doc.status === 'expiring_soon') {
          return (
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-800 block">{doc.expiryDate}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                <AlertTriangle className="h-3 w-3" /> Expiring in {doc.daysToExpiry} days
              </span>
            </div>
          );
        }
        if (doc.status === 'expired') {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
              Expired
            </span>
          );
        }
        return (
          <div>
            <span className="text-xs text-slate-700 block">{doc.expiryDate === '2099-12-31' ? 'Perpetual' : doc.expiryDate}</span>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
              <CheckCircle2 className="h-3 w-3" /> Valid
            </span>
          </div>
        );
      },
    },
    {
      key: 'fileSize',
      header: 'Attachment',
      width: '120px',
      render: (doc) => (
        <button
          onClick={() => alert(`Simulated downloading: ${doc.title} (${doc.fileSize})`)}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-amber-600" />
          <span>{doc.fileSize}</span>
        </button>
      ),
    },
  ];

  // Helper to open Add Bank Account SlideOver
  const handleOpenAddBank = () => {
    let newBank = {
      bankName: '',
      accountNumber: '',
      accountType: 'Current' as BankAccount['accountType'],
      ifscCode: '',
      branchAddress: '',
      isPrimary: false,
      balanceFormatted: '₹ 0.00',
    };

    openSlideOver(
      'Add Corporate Bank Account',
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Bank Name</label>
          <input
            type="text"
            placeholder="e.g. Kotak Mahindra Bank"
            onChange={(e) => (newBank.bankName = e.target.value)}
            className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Account Number</label>
          <input
            type="text"
            placeholder="e.g. 78201944512"
            onChange={(e) => (newBank.accountNumber = e.target.value)}
            className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700">IFSC Code</label>
            <input
              type="text"
              placeholder="KKBK0000123"
              onChange={(e) => (newBank.ifscCode = e.target.value)}
              className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700">Account Type</label>
            <select
              onChange={(e) => (newBank.accountType = e.target.value as BankAccount['accountType'])}
              className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="Current">Current</option>
              <option value="Overdraft / CC">Overdraft / CC</option>
              <option value="Escrow">Escrow</option>
              <option value="Savings">Savings</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Branch Address</label>
          <input
            type="text"
            placeholder="Branch location and city"
            onChange={(e) => (newBank.branchAddress = e.target.value)}
            className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
        <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
          <button onClick={closeSlideOver} className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg">
            Cancel
          </button>
          <button
            onClick={() => {
              if (newBank.bankName && newBank.accountNumber) {
                addBankAccount(newBank);
                closeSlideOver();
              }
            }}
            className="px-4 py-2 text-xs bg-amber-600 text-white font-bold rounded-lg shadow-sm hover:bg-amber-700"
          >
            Save Bank Account
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Master Configuration"
        subtitle="Manage corporate statutory identity, branches, banking, departments, cost centers, and compliance documents."
        breadcrumbs={[{ label: 'Settings', path: '/settings/company' }, { label: 'Company Master' }]}
        badge="Enterprise Entity"
        actions={
          <button
            onClick={handleResetDemoData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg shadow-2xs transition-colors"
            title="Reseed all stores back to initial demo data"
          >
            <RotateCcw className="h-3.5 w-3.5 text-amber-700" />
            <span>Reset Demo Data</span>
          </button>
        }
      />

      {/* Reset Confirmation Banner */}
      {isResetBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          <span>Demo Data Successfully Reseeded! All CRM, Project, Finance, Procurement, and Ops mock collections have been restored to initial state.</span>
        </div>
      )}

      {/* Expiry Alert Warning Callout if any documents expire within 30 days */}
      {companyDocuments.some((d) => d.status === 'expiring_soon') && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-subtle">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Action Required: Statutory Documents Expiring Within 30 Days
            </h4>
            <p className="text-xs text-amber-800 leading-snug">
              Labor Contract License (#ALC/MUM/CLA/2025/8921) and Pollution Board CTO (#MPCB/RO-THANE) require statutory renewal before Oct 2026 to prevent site work stoppages.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('documents')}
            className="px-3 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex-shrink-0"
          >
            View Documents
          </button>
        </div>
      )}

      {/* Tab Navigation: Horizontal chip scroll on mobile, dense tabs on desktop */}
      <div className="border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max pb-2">
          {[
            { id: 'general', label: 'General Profile', icon: Building2 },
            { id: 'branches', label: 'Branches & Hubs', icon: MapPin, count: branches.length },
            { id: 'banks', label: 'Bank Accounts', icon: Landmark, count: bankAccounts.length },
            { id: 'departments', label: 'Departments', icon: Users, count: departments.length },
            { id: 'cost_centers', label: 'Cost Centers', icon: PieChart, count: costCenters.length },
            {
              id: 'documents',
              label: 'Compliance Documents',
              icon: FileText,
              count: companyDocuments.length,
              hasWarning: companyDocuments.some((d) => d.status === 'expiring_soon'),
            },
            {
              id: 'tax_erp',
              label: 'Tax (GST) & ERP Sync',
              icon: ShieldCheck,
            },
            {
              id: 'demo_data',
              label: 'Showcase Demo Data',
              icon: Sparkles,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all select-none',
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-white' : 'text-slate-500')} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'px-1.5 py-0.2 rounded-full text-[10px] font-mono',
                      isActive ? 'bg-amber-700/60 text-white' : 'bg-slate-100 text-slate-600'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
                {tab.hasWarning && (
                  <span className="h-2 w-2 rounded-full bg-amber-400 ring-2 ring-white animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: General Profile */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="bg-white rounded-xl border border-slate-200 shadow-card p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Corporate & Statutory Identity</h3>
              <p className="text-xs text-slate-500">Legal registration numbers, PAN, GSTIN, and corporate communication addresses.</p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>

          {isSavedBanner && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Company profile updated and logged to audit trail!
            </div>
          )}

          {/* Logo & Basic Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">Company Logo</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-amber-500 transition-colors">
                <div className="h-16 w-16 rounded-xl bg-slate-900 text-amber-500 flex items-center justify-center mb-2 shadow-sm font-black text-xl">
                  <Building2 className="h-8 w-8" />
                </div>
                <p className="text-xs font-semibold text-slate-800">Apex Buildcon Group</p>
                <p className="text-[10px] text-slate-400 mt-1">PNG, SVG or JPG up to 2MB</p>
                <button
                  type="button"
                  onClick={() => alert('Logo mock upload triggered. Saved.')}
                  className="mt-3 px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 font-medium text-slate-700"
                >
                  Change Logo
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Full Legal Entity Name</label>
                  <input
                    type="text"
                    value={generalForm.name}
                    onChange={(e) => setGeneralForm({ ...generalForm, name: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Trade / Brand Name</label>
                  <input
                    type="text"
                    value={generalForm.tradeName}
                    onChange={(e) => setGeneralForm({ ...generalForm, tradeName: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">Corporate Motto / Tagline</label>
                <input
                  type="text"
                  value={generalForm.tagline}
                  onChange={(e) => setGeneralForm({ ...generalForm, tagline: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Official Contact Phone</label>
                  <input
                    type="text"
                    value={generalForm.phone}
                    onChange={(e) => setGeneralForm({ ...generalForm, phone: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Corporate Email</label>
                  <input
                    type="email"
                    value={generalForm.email}
                    onChange={(e) => setGeneralForm({ ...generalForm, email: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Website URL</label>
                  <input
                    type="text"
                    value={generalForm.website}
                    onChange={(e) => setGeneralForm({ ...generalForm, website: e.target.value })}
                    className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Registration Matrix */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Statutory Tax & Company Registrations</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">GSTIN Number</label>
                <input
                  type="text"
                  value={generalForm.gstin}
                  onChange={(e) => setGeneralForm({ ...generalForm, gstin: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">Company PAN</label>
                <input
                  type="text"
                  value={generalForm.pan}
                  onChange={(e) => setGeneralForm({ ...generalForm, pan: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">CIN (Corporate Identity No)</label>
                <input
                  type="text"
                  value={generalForm.cin}
                  onChange={(e) => setGeneralForm({ ...generalForm, cin: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700">MSME Udyam Registration</label>
                <input
                  type="text"
                  value={generalForm.msmeNumber}
                  onChange={(e) => setGeneralForm({ ...generalForm, msmeNumber: e.target.value })}
                  className="mt-1 w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Registered vs Corporate Address */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Registered Office Address (ROC)</label>
              <textarea
                rows={3}
                value={generalForm.registeredAddress}
                onChange={(e) => setGeneralForm({ ...generalForm, registeredAddress: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">Corporate Head Office Address</label>
              <textarea
                rows={3}
                value={generalForm.corporateAddress}
                onChange={(e) => setGeneralForm({ ...generalForm, corporateAddress: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Branches */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Regional Operating Hubs & Branch Network</h3>
              <p className="text-xs text-slate-500">Each branch manages localized site logistics, cost centers, and client relationships.</p>
            </div>
            <button
              onClick={() => alert('Add branch dialog: 5 regional hubs already seeded.')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Operating Branch</span>
            </button>
          </div>
          <DataTable<Branch> data={branches} columns={branchColumns} pageSize={5} searchable={false} />
        </div>
      )}

      {/* Tab 3: Bank Accounts */}
      {activeTab === 'banks' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Corporate & Escrow Bank Accounts</h3>
              <p className="text-xs text-slate-500">Connected bank accounts for client billing receipts, vendor payments, and overdraft limits.</p>
            </div>
            <button
              onClick={handleOpenAddBank}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Bank Account</span>
            </button>
          </div>
          <DataTable<BankAccount> data={bankAccounts} columns={bankColumns} pageSize={5} searchable={false} />
        </div>
      )}

      {/* Tab 4: Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Functional Departments & Heads</h3>
              <p className="text-xs text-slate-500">Organizational hierarchy for task assignments, approval matrices, and muster rolls.</p>
            </div>
            <button
              onClick={() => alert('Add Department: 8 functional departments are currently active.')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Department</span>
            </button>
          </div>
          <DataTable<Department> data={departments} columns={deptColumns} pageSize={8} />
        </div>
      )}

      {/* Tab 5: Cost Centers */}
      {activeTab === 'cost_centers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Cost Centers & Budget Allocation</h3>
              <p className="text-xs text-slate-500">Project-wise and corporate overhead accounts for financial tracking and variance control.</p>
            </div>
            <button
              onClick={() => alert('Add Cost Center dialog: 7 cost centers currently tracked.')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Create Cost Center</span>
            </button>
          </div>
          <DataTable<CostCenter> data={costCenters} columns={costCenterColumns} pageSize={7} />
        </div>
      )}

      {/* Tab 6: Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">Statutory Registrations & Compliance Vault</h3>
              <p className="text-xs text-slate-500">Regulatory certificates, labor licenses, ISO accreditations, and expiry alerts.</p>
            </div>
            <button
              onClick={() =>
                openSlideOver(
                  'Upload Compliance Document',
                  <div className="space-y-4">
                    <FileUploadDropzone
                      label="Document Certificate Upload"
                      description="Drag and drop signed PDF copy"
                      maxFiles={1}
                    />
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">Document Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Factory Inspectorate License"
                        className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">Document Number</label>
                        <input
                          type="text"
                          placeholder="LIC-2026-09"
                          className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700">Expiry Date</label>
                        <input
                          type="date"
                          className="mt-1 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="pt-3 flex justify-end">
                      <button
                        onClick={closeSlideOver}
                        className="px-4 py-2 text-xs bg-amber-600 text-white font-bold rounded-lg"
                      >
                        Save to Vault
                      </button>
                    </div>
                  </div>
                )
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Certificate</span>
            </button>
          </div>
          <DataTable<CompanyDocument> data={companyDocuments} columns={documentColumns} pageSize={6} />
        </div>
      )}

      {/* Tab 7: Tax (GST) & ERP Integration */}
      {activeTab === 'tax_erp' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Tax Settings (GST) & Enterprise ERP Sync</h3>
              <p className="text-xs text-slate-500">
                Single master tax-rate applied uniformly across Quotations, Purchase Orders, and Running Account (RA) Bills.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Active Sync: {erpSettings.activeErp.toUpperCase()}
            </span>
          </div>

          {/* Master GST Configuration */}
          <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
            <h4 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
              Works Contract Master GST Rate
            </h4>
            <p className="text-xs text-slate-600">
              Configure the primary applicable Goods and Services Tax (GST) percentage. Changing this updates calculation models across all financial billing modules.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2">
                {[18, 12, 5, 28].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setCompanyGstRate(rate)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      (erpSettings.companyGstRate || 18) === rate
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                        : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {rate}% GST {rate === 18 ? '(Standard Works Contract)' : ''}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500">
                Current: <strong className="text-slate-900 font-mono">{erpSettings.companyGstRate}%</strong> (9% CGST + 9% SGST / 18% IGST)
              </div>
            </div>
          </div>

          {/* ERP Integration Toggles: Tally, Zoho Books, SAP */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Enterprise Accounting & ERP Connectors (Mock Integration)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Tally Prime */}
              <div
                className={`p-5 rounded-2xl border transition cursor-pointer ${
                  erpSettings.activeErp === 'tally'
                    ? 'bg-amber-50/60 border-amber-500 shadow-md ring-1 ring-amber-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => updateErpSettings({ activeErp: 'tally', tallyEnabled: true })}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-sm">Tally Prime</h5>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      erpSettings.activeErp === 'tally'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {erpSettings.activeErp === 'tally' ? 'Connected' : 'Available'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  ODBC / XML Server protocol sync for vouchers, vendor ledgers, and inventory.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                  <span>Port: 9000</span>
                  <span>Sync: Auto Every 2h</span>
                </div>
              </div>

              {/* Zoho Books */}
              <div
                className={`p-5 rounded-2xl border transition cursor-pointer ${
                  erpSettings.activeErp === 'zoho'
                    ? 'bg-amber-50/60 border-amber-500 shadow-md ring-1 ring-amber-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => updateErpSettings({ activeErp: 'zoho', zohoEnabled: true })}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-sm">Zoho Books</h5>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      erpSettings.activeErp === 'zoho'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {erpSettings.activeErp === 'zoho' ? 'Connected' : 'Available'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  REST OAuth2 API sync for Customer Invoices, Bills, Chart of Accounts.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                  <span>Org ID: 81920194</span>
                  <span>Sync: Realtime Webhooks</span>
                </div>
              </div>

              {/* SAP S/4HANA */}
              <div
                className={`p-5 rounded-2xl border transition cursor-pointer ${
                  erpSettings.activeErp === 'sap'
                    ? 'bg-amber-50/60 border-amber-500 shadow-md ring-1 ring-amber-400'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => updateErpSettings({ activeErp: 'sap', sapEnabled: true })}
              >
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 text-sm">SAP S/4HANA</h5>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      erpSettings.activeErp === 'sap'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {erpSettings.activeErp === 'sap' ? 'Connected' : 'Available'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  SAP NetWeaver RFC Gateway and BAPI connectors for Enterprise EPC accounts.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between">
                  <span>Client: 100</span>
                  <span>Sync: Scheduled Batch</span>
                </div>
              </div>
            </div>

            {/* Sync Status Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-700">
                  Last successful sync with <strong>{erpSettings.activeErp.toUpperCase()}</strong>: {erpSettings.lastSyncTime}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateErpSettings({ lastSyncTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
                  alert('Sync triggered: 14 vouchers and 3 bills transmitted.');
                }}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-lg transition"
              >
                Sync Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 8: Showcase Demo Data Controls */}
      {activeTab === 'demo_data' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-card p-5 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                Showcase Environment & Mock Data State
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                BuildOS is running in interactive evaluation mode with full enterprise seed data across ~55 screens.
              </p>
            </div>
            <button
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset All Demo Stores</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900">CRM & Pre-Con</span>
              <p className="text-slate-600">8 Leads across 6 stages, GPS site inspections, BOQ assemblies & quotations.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900">Projects & Execution</span>
              <p className="text-slate-600">6 Projects, WBS hierarchies, daily progress logs, 4-tier photo galleries & RFIs.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900">Procurement & Inventory</span>
              <p className="text-slate-600">30 Materials with QR tags, 12 Vendors, PRs, RFQ comparisons, POs & GRN.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900">Finance & Billing</span>
              <p className="text-slate-600">RA Bill generator, 4-bucket aging receivables & payables, expenses & petty cash.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900">Safety, QA & Docs</span>
              <p className="text-slate-600">Incident trackers, PPE compliance, QA/QC tests, NCR lifecycles & drawing revisions.</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-bold text-slate-900">Site Engineer & VIP Portal</span>
              <p className="text-slate-600">Mobile quick-action terminal with offline mode & client transparent progress portal.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Need a Clean Slate?</h4>
                <p className="text-xs text-slate-600">Resets all additions, updates, or status changes back to the initial seeded state.</p>
              </div>
            </div>
            <button
              onClick={handleResetDemoData}
              className="px-4 py-2 text-xs font-bold text-amber-900 bg-amber-200/80 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
            >
              Reset Demo Data Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
