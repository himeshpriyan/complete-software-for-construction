export interface ModuleSubItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  count?: number | string;
  badge?: string;
  badgeVariant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}

export interface SystemModule {
  id: string;
  label: string;
  shortLabel: string;
  path: string;
  pathPrefix: string;
  icon: string;
  category:
    | 'Sales & Pre-Construction'
    | 'Site & Project Execution'
    | 'Supply Chain & Inventory'
    | 'Resources & Plant'
    | 'Compliance & Quality'
    | 'Finance & Accounts'
    | 'Organization & Admin';
  iconBg: string;
  iconColor: string;
  description: string;
  badge?: string;
  badgeVariant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  subItems: ModuleSubItem[];
}

export const SYSTEM_MODULES: SystemModule[] = [
  // 1. CRM
  {
    id: 'crm',
    label: 'CRM & Sales Pipeline',
    shortLabel: 'CRM',
    path: '/crm/leads',
    pathPrefix: '/crm',
    icon: 'Users2',
    category: 'Sales & Pre-Construction',
    iconBg: 'bg-pink-50 text-pink-600 border-pink-200/80',
    iconColor: 'text-pink-600',
    description: 'Leads, site visits, customer database and sales cockpit',
    badge: '12 Active',
    badgeVariant: 'warning',
    subItems: [
      { id: 'crm-cockpit', label: 'CRM Cockpit', path: '/crm/analytics', icon: 'BarChart2' },
      { id: 'crm-leads', label: 'Leads Pipeline', path: '/crm/leads', icon: 'Users2', count: 25 },
      { id: 'crm-followups', label: 'Follow-ups Log', path: '/crm/follow-ups', icon: 'Clock', count: 6 },
      { id: 'crm-visits', label: 'Site Inspection Visits', path: '/crm/site-visits', icon: 'MapPin', count: 8 },
      { id: 'crm-customers', label: 'Customer Directory', path: '/crm/customers', icon: 'Building', count: 15 },
    ],
  },

  // 2. Estimation
  {
    id: 'estimation',
    label: 'Estimation & BOQ',
    shortLabel: 'Estimation',
    path: '/estimation/estimates',
    pathPrefix: '/estimation',
    icon: 'Calculator',
    category: 'Sales & Pre-Construction',
    iconBg: 'bg-violet-50 text-violet-600 border-violet-200/80',
    iconColor: 'text-violet-600',
    description: 'Bill of quantities, rate analysis, cost models and quotations',
    badge: '8 BOQs',
    badgeVariant: 'info',
    subItems: [
      { id: 'est-list', label: 'Estimates Master', path: '/estimation/estimates', icon: 'Layers' },
      { id: 'est-boq', label: 'Interactive BOQ Builder', path: '/estimation/boq', icon: 'Calculator' },
      { id: 'est-rate', label: 'Standard Rate Analysis', path: '/estimation/rate-analysis', icon: 'Activity' },
      { id: 'est-quote', label: 'Client Quotations', path: '/estimation/quotations', icon: 'FileText' },
    ],
  },

  // 3. Tenders
  {
    id: 'tenders',
    label: 'Tenders & Bidding',
    shortLabel: 'Tenders',
    path: '/tenders',
    pathPrefix: '/tenders',
    icon: 'ScrollText',
    category: 'Sales & Pre-Construction',
    iconBg: 'bg-sky-50 text-sky-600 border-sky-200/80',
    iconColor: 'text-sky-600',
    description: 'Tender tracking, EMD status, eligibility and technical bids',
    badge: '3 Open',
    badgeVariant: 'info',
    subItems: [
      { id: 'tenders-list', label: 'Tenders Pipeline', path: '/tenders', icon: 'ScrollText' },
    ],
  },

  // 4. Contracts
  {
    id: 'contracts',
    label: 'Contracts & Agreements',
    shortLabel: 'Contracts',
    path: '/contracts',
    pathPrefix: '/contracts',
    icon: 'FileCheck',
    category: 'Sales & Pre-Construction',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
    iconColor: 'text-indigo-600',
    description: 'Client agreements, retention terms, milestones and penalty clauses',
    badge: '6 Signed',
    badgeVariant: 'success',
    subItems: [
      { id: 'contracts-list', label: 'Contract Documents', path: '/contracts', icon: 'FileCheck' },
    ],
  },

  // 5. Projects
  {
    id: 'projects',
    label: 'Project Execution',
    shortLabel: 'Projects',
    path: '/projects',
    pathPrefix: '/projects',
    icon: 'HardHat',
    category: 'Site & Project Execution',
    iconBg: 'bg-amber-50 text-amber-600 border-amber-200/80',
    iconColor: 'text-amber-600',
    description: 'Physical progress, Gantt milestones, tasks, DPRs and handover',
    badge: '6 Active',
    badgeVariant: 'success',
    subItems: [
      { id: 'prj-all', label: 'Projects Directory', path: '/projects', icon: 'Building2' },
      { id: 'prj-tasks', label: 'Site Tasks & Workfronts', path: '/projects/tasks', icon: 'CheckCircle2', count: 18 },
      { id: 'prj-dpr', label: 'Daily Progress Reports (DPR)', path: '/projects/dpr', icon: 'Calendar', count: 'Due' },
      { id: 'prj-planning', label: 'Baseline Planning', path: '/projects/PRJ-001?tab=planning', icon: 'TrendingUp' },
      { id: 'prj-mb', label: 'Measurement Book (MB)', path: '/projects/PRJ-001?tab=measurements', icon: 'Ruler' },
      { id: 'prj-rfi', label: 'Technical RFI Register', path: '/projects/PRJ-001?tab=rfi', icon: 'HelpCircle' },
      { id: 'prj-variations', label: 'Variations & Change Orders', path: '/projects/PRJ-001?tab=variations', icon: 'GitPullRequest' },
      { id: 'prj-handover', label: 'Snag List & Handover', path: '/projects/PRJ-001?tab=handover', icon: 'CheckSquare' },
    ],
  },

  // 6. Procurement
  {
    id: 'procurement',
    label: 'Procurement & Purchasing',
    shortLabel: 'Procurement',
    path: '/procurement/purchase-requests',
    pathPrefix: '/procurement',
    icon: 'ShoppingBag',
    category: 'Supply Chain & Inventory',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    iconColor: 'text-emerald-600',
    description: 'Purchase requests (PR), RFQ floating, vendor quotes, PO and GRN',
    badge: '5 POs',
    badgeVariant: 'warning',
    subItems: [
      { id: 'proc-pr', label: 'Purchase Requests (PR)', path: '/procurement/purchase-requests', icon: 'FilePlus', count: 8 },
      { id: 'proc-rfq', label: 'RFQ & Quotations', path: '/procurement/rfq', icon: 'Send', count: 4 },
      { id: 'proc-compare', label: 'Vendor Rate Comparison', path: '/procurement/vendor-comparison', icon: 'Sliders' },
      { id: 'proc-po', label: 'Purchase Orders (PO)', path: '/procurement/purchase-orders', icon: 'FileText', count: 12 },
      { id: 'proc-grn', label: 'Goods Receipt Notes (GRN)', path: '/procurement/grn', icon: 'PackageCheck', count: 9 },
    ],
  },

  // 7. Inventory
  {
    id: 'inventory',
    label: 'Inventory & Materials',
    shortLabel: 'Inventory',
    path: '/inventory/materials',
    pathPrefix: '/inventory',
    icon: 'Boxes',
    category: 'Supply Chain & Inventory',
    iconBg: 'bg-teal-50 text-teal-600 border-teal-200/80',
    iconColor: 'text-teal-600',
    description: 'Stock masters, yard ledgers, site issue, transfer and AI forecasting',
    badge: '20 SKUs',
    badgeVariant: 'neutral',
    subItems: [
      { id: 'inv-materials', label: 'Stock Master Catalog', path: '/inventory/materials', icon: 'Boxes' },
      { id: 'inv-dashboard', label: 'Stock Dashboard & Balances', path: '/inventory/stock', icon: 'PieChart' },
      { id: 'inv-issue', label: 'Site Material Issue', path: '/inventory/stock-issue', icon: 'ArrowUpRight' },
      { id: 'inv-transfer', label: 'Inter-Site Transfer', path: '/inventory/stock-transfer', icon: 'RefreshCw' },
      { id: 'inv-adjustment', label: 'Stock Audit & Adjustments', path: '/inventory/stock-adjustment', icon: 'CheckSquare' },
      { id: 'inv-forecasting', label: '🧠 AI Material Forecasting', path: '/inventory/forecasting', icon: 'Brain' },
    ],
  },

  // 8. Vendors
  {
    id: 'vendors',
    label: 'Vendor Management',
    shortLabel: 'Vendors',
    path: '/vendors',
    pathPrefix: '/vendors',
    icon: 'Truck',
    category: 'Supply Chain & Inventory',
    iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200/80',
    iconColor: 'text-cyan-600',
    description: 'Approved vendor directory, GSTIN, credit limits and ratings',
    badge: '15 Active',
    badgeVariant: 'neutral',
    subItems: [
      { id: 'ven-directory', label: 'Vendors Directory', path: '/vendors', icon: 'Truck' },
    ],
  },

  // 9. Subcontractors
  {
    id: 'subcontractors',
    label: 'Subcontractors',
    shortLabel: 'Subcontractors',
    path: '/subcontractors',
    pathPrefix: '/subcontractors',
    icon: 'Building',
    category: 'Resources & Plant',
    iconBg: 'bg-orange-50 text-orange-600 border-orange-200/80',
    iconColor: 'text-orange-600',
    description: 'Work order contracts, RA bills, retention and trade compliance',
    badge: '8 Active',
    badgeVariant: 'neutral',
    subItems: [
      { id: 'sub-list', label: 'Subcontractors Master', path: '/subcontractors', icon: 'Building' },
    ],
  },

  // 10. Labour
  {
    id: 'labour',
    label: 'Labour & Attendance',
    shortLabel: 'Labour',
    path: '/labour',
    pathPrefix: '/labour',
    icon: 'Users',
    category: 'Resources & Plant',
    iconBg: 'bg-rose-50 text-rose-600 border-rose-200/80',
    iconColor: 'text-rose-600',
    description: 'Biometric daily muster, contractor gang strengths and OT logs',
    badge: '142 Today',
    badgeVariant: 'success',
    subItems: [
      { id: 'labour-muster', label: 'Site Biometric Muster', path: '/labour', icon: 'Users' },
    ],
  },

  // 11. Equipment
  {
    id: 'equipment',
    label: 'Equipment & Plant Fleet',
    shortLabel: 'Equipment',
    path: '/equipment/fleet',
    pathPrefix: '/equipment',
    icon: 'Wrench',
    category: 'Resources & Plant',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    iconColor: 'text-amber-700',
    description: 'Heavy machinery, telemetry QR, diesel fuel logs and maintenance',
    badge: '12 Plant',
    badgeVariant: 'neutral',
    subItems: [
      { id: 'eq-fleet', label: 'Equipment Fleet & Telemetry', path: '/equipment/fleet', icon: 'Wrench' },
      { id: 'eq-fuel', label: 'Diesel & Fuel Management', path: '/equipment/fuel', icon: 'Fuel' },
      { id: 'eq-maint', label: 'Preventive Maintenance', path: '/equipment/maintenance', icon: 'Settings' },
    ],
  },

  // 12. Safety (HSE)
  {
    id: 'safety',
    label: 'Safety Management (HSE)',
    shortLabel: 'Safety',
    path: '/safety',
    pathPrefix: '/safety',
    icon: 'ShieldAlert',
    category: 'Compliance & Quality',
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
    iconColor: 'text-emerald-600',
    description: 'Zero-LTI tracking, inspections, PPE compliance, incident workflows',
    badge: '0 Incidents',
    badgeVariant: 'success',
    subItems: [
      { id: 'hse-dashboard', label: 'Safety Dashboard', path: '/safety', icon: 'ShieldAlert' },
    ],
  },

  // 13. Quality (QA/QC)
  {
    id: 'quality',
    label: 'Quality Management (QA/QC)',
    shortLabel: 'Quality',
    path: '/quality',
    pathPrefix: '/quality',
    icon: 'CheckCircle2',
    category: 'Compliance & Quality',
    iconBg: 'bg-blue-50 text-blue-600 border-blue-200/80',
    iconColor: 'text-blue-600',
    description: 'Concrete pour cards, lab test records, non-conformance reports (NCR)',
    badge: '14 Insp',
    badgeVariant: 'neutral',
    subItems: [
      { id: 'qa-inspections', label: 'Inspections & Pour Cards', path: '/quality', icon: 'CheckCircle2' },
    ],
  },

  // 14. Documents
  {
    id: 'documents',
    label: 'Document & Drawing Vault',
    shortLabel: 'Documents',
    path: '/documents',
    pathPrefix: '/documents',
    icon: 'FolderKanban',
    category: 'Compliance & Quality',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200/80',
    iconColor: 'text-purple-600',
    description: 'Structural drawings, revision controls, permits, CAR insurance',
    badge: '32 Files',
    badgeVariant: 'neutral',
    subItems: [
      { id: 'doc-vault', label: 'Drawings & Document Vault', path: '/documents', icon: 'FolderKanban' },
    ],
  },

  // 15. Billing
  {
    id: 'billing',
    label: 'Client Billing & RA Bills',
    shortLabel: 'Billing',
    path: '/billing/ra-bills',
    pathPrefix: '/billing',
    icon: 'Receipt',
    category: 'Finance & Accounts',
    iconBg: 'bg-lime-50 text-lime-700 border-lime-200/80',
    iconColor: 'text-lime-700',
    description: 'Running account bills, joint measurement verification, certified invoices',
    badge: '4 RA Bills',
    badgeVariant: 'info',
    subItems: [
      { id: 'bill-ra', label: 'RA Bills Ledger', path: '/billing/ra-bills', icon: 'Receipt' },
      { id: 'bill-client', label: 'Client Billing Overview', path: '/billing/client-billing', icon: 'FileText' },
    ],
  },

  // 16. Accounts
  {
    id: 'accounts',
    label: 'Finance & Accounts',
    shortLabel: 'Accounts',
    path: '/accounts/receivables',
    pathPrefix: '/accounts',
    icon: 'Coins',
    category: 'Finance & Accounts',
    iconBg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    iconColor: 'text-amber-700',
    description: 'Customer receivables, vendor payables, site expenses, petty cash, banks',
    badge: '₹ 1.48 Cr',
    badgeVariant: 'warning',
    subItems: [
      { id: 'acc-rec', label: 'Customer Receivables', path: '/accounts/receivables', icon: 'ArrowDownLeft' },
      { id: 'acc-pay', label: 'Vendor Payables', path: '/accounts/payables', icon: 'ArrowUpRight' },
      { id: 'acc-exp', label: 'Site Expenses', path: '/accounts/expenses', icon: 'CreditCard' },
      { id: 'acc-petty', label: 'Petty Cash Log', path: '/accounts/petty-cash', icon: 'Wallet' },
      { id: 'acc-bank', label: 'Bank & Escrow Accounts', path: '/accounts/bank', icon: 'Building' },
      { id: 'acc-tx', label: 'Receipts & Payments Log', path: '/accounts/transactions', icon: 'ArrowLeftRight' },
      { id: 'acc-journal', label: 'General Journal', path: '/accounts/journal', icon: 'BookOpen' },
    ],
  },

  // 17. HRMS
  {
    id: 'hr',
    label: 'HRMS & Payroll',
    shortLabel: 'HR & Payroll',
    path: '/hr/employees',
    pathPrefix: '/hr',
    icon: 'UserCheck',
    category: 'Organization & Admin',
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
    iconColor: 'text-indigo-600',
    description: 'Staff profiles, biometric attendance muster, leave balance and payslips',
    badge: '48 Staff',
    badgeVariant: 'neutral',
    subItems: [
      { id: 'hr-emp', label: 'Employee Directory', path: '/hr/employees', icon: 'Users' },
      { id: 'hr-att', label: 'Biometric Attendance', path: '/hr/attendance', icon: 'Calendar' },
      { id: 'hr-leave', label: 'Leave Applications', path: '/hr/leave', icon: 'Clock' },
      { id: 'hr-pay', label: 'Monthly Payroll & Payslips', path: '/hr/payroll', icon: 'CreditCard' },
    ],
  },

  // 18. Reports
  {
    id: 'reports',
    label: 'Executive Reports & BI',
    shortLabel: 'Reports',
    path: '/reports/budget-vs-actual',
    pathPrefix: '/reports',
    icon: 'BarChart3',
    category: 'Organization & Admin',
    iconBg: 'bg-purple-50 text-purple-600 border-purple-200/80',
    iconColor: 'text-purple-600',
    description: 'Budget vs actual analysis, variance curves, profit margin summaries',
    subItems: [
      { id: 'rep-bva', label: 'Budget vs Actual Report', path: '/reports/budget-vs-actual', icon: 'BarChart3' },
    ],
  },

  // 19. Settings
  {
    id: 'settings',
    label: 'Company Settings & Security',
    shortLabel: 'Settings',
    path: '/settings/company',
    pathPrefix: '/settings',
    icon: 'Settings',
    category: 'Organization & Admin',
    iconBg: 'bg-slate-100 text-slate-700 border-slate-200',
    iconColor: 'text-slate-700',
    description: 'Company master profile, user roles, permission matrix, demo reset',
    subItems: [
      { id: 'set-company', label: 'Company Master & Demo Data', path: '/settings/company', icon: 'Building' },
      { id: 'set-users', label: 'Users & Role Assignments', path: '/settings/users', icon: 'Users' },
      { id: 'set-perm', label: 'RBAC Permissions Matrix', path: '/settings/permissions', icon: 'Lock' },
      { id: 'set-audit', label: 'System Audit Log', path: '/settings/audit-log', icon: 'ShieldCheck' },
    ],
  },
];

/**
 * Helper to determine which module is currently active based on path
 */
export function getActiveModule(pathname: string): SystemModule | null {
  for (const mod of SYSTEM_MODULES) {
    if (pathname === mod.pathPrefix || pathname.startsWith(mod.pathPrefix + '/')) {
      return mod;
    }
  }
  return null;
}
