import { create } from 'zustand';
import {
  User,
  UserRole,
  Employee,
  Branch,
  Client,
  NotificationItem,
  CompanyProfile,
  BankAccount,
  Department,
  CostCenter,
  ProjectLocation,
  CompanyDocument,
  AuditLogEntry,
  PermissionAction,
  Lead,
  LeadStage,
  LeadActivity,
  SiteVisit,
  FollowUp,
  Estimate,
  BOQ,
  BOQTemplate,
  RateItem,
  Quotation,
  Tender,
  Contract,
  Project,
  WBSTask,
  ProjectTask,
  DailyProgressReport,
  SitePhoto,
  MeasurementBookEntry,
  RFIItem,
  VariationOrder,
  ProjectHandover,
  Material,
  Vendor,
  PurchaseRequisition,
  RFQ,
  PurchaseOrder,
  GRNEntry,
  StockLedgerEntry,
  StockTransaction,
  RABill,
  RABillStatus,
  ProjectCosting,
  ReceivableItem,
  PayableItem,
  ExpenseEntry,
  PettyCashLedger,
  PettyCashEntry,
  FinancialTransaction,
  JournalEntry,
  ErpIntegrationSettings,
  SafetyIncident,
  IncidentStage,
  PPEComplianceRecord,
  SafetyInspectionRecord,
  NearMissLog,
  ToolboxMeeting,
  SafetyTrainingRecord,
  SiteAuditRecord,
  QAQCInspection,
  NonConformanceReport,
  NCRStage,
  RepoDocument,
  DrawingRegisterItem,
  DrawingVersion,
  SiteInstruction,
  MeetingRecord,
  SnagItem,
  SnagStatus,
  SalariedEmployee,
  StaffAttendanceDay,
  LeaveRequest,
  LeaveStatus,
  LeaveBalance,
  MonthlyPayslip,
  LegalComplianceItem,
} from '../types';
import {
  SEED_EMPLOYEES,
  SEED_BRANCHES,
  SEED_CLIENTS,
  DEMO_USERS,
  SEED_NOTIFICATIONS,
  SEED_COMPANY_PROFILE,
  SEED_BANK_ACCOUNTS,
  SEED_DEPARTMENTS,
  SEED_COST_CENTERS,
  SEED_PROJECT_LOCATIONS,
  SEED_COMPANY_DOCUMENTS,
  SEED_SYSTEM_USERS,
  DEFAULT_PERMISSION_MAP,
  SEED_AUDIT_LOGS,
} from '../data/mockSeed';
import {
  SEED_LEADS,
  SEED_SITE_VISITS,
  SEED_FOLLOW_UPS,
} from '../data/crmSeed';
import {
  SEED_BOQ_TEMPLATES,
  SEED_RATE_MASTER,
  SEED_ESTIMATES,
  SEED_BOQS,
  SEED_QUOTATIONS,
  SEED_TENDERS,
  SEED_CONTRACTS,
} from '../data/estimationSeed';
import {
  SEED_PROJECTS,
  SEED_WBS_TASKS,
  SEED_TASKS,
  SEED_DPRS,
  SEED_SITE_PHOTOS,
  SEED_MB_ENTRIES,
  SEED_RFIS,
  SEED_VARIATIONS,
  SEED_HANDOVERS,
} from '../data/projectSeed';
import {
  materialsSeed,
  vendorsSeed,
  purchaseRequisitionsSeed,
  rfqsSeed,
  purchaseOrdersSeed,
  grnEntriesSeed,
  stockLedgerSeed,
  stockTransactionsSeed,
} from '../data/procurementSeed';
import {
  SEED_RA_BILLS,
  SEED_PROJECT_COSTINGS,
  SEED_CUSTOMER_RECEIVABLES,
  SEED_VENDOR_PAYABLES,
  SEED_EXPENSES,
  SEED_PETTY_CASH_LEDGERS,
  SEED_PAYMENTS_RECEIPTS,
  SEED_JOURNAL_ENTRIES,
  SEED_ERP_INTEGRATION_SETTINGS,
} from '../data/financeSeed';
import {
  SEED_SAFETY_INCIDENTS,
  SEED_PPE_CHECKS,
  SEED_SAFETY_INSPECTIONS,
  SEED_NEAR_MISS_LOGS,
  SEED_TOOLBOX_MEETINGS,
  SEED_SAFETY_TRAININGS,
  SEED_SITE_AUDITS,
  SEED_QAQC_INSPECTIONS,
  SEED_NCRS,
  SEED_DOCUMENTS_REPO,
  SEED_DRAWING_REGISTER,
  SEED_SITE_INSTRUCTIONS,
  SEED_MEETING_RECORDS,
  SEED_SNAG_ITEMS,
  SEED_SALARIED_EMPLOYEES,
  SEED_STAFF_ATTENDANCE,
  SEED_LEAVE_REQUESTS,
  SEED_LEAVE_BALANCES,
  SEED_PAYSLIPS,
  SEED_LEGAL_COMPLIANCE,
} from '../data/opsSeed';

interface AppState {
  // Auth & Active User
  currentUser: User | null;
  isAuthenticated: boolean;
  selectedBranchId: string;

  // In-Memory Collections
  employees: Employee[];
  branches: Branch[];
  clients: Client[];
  notifications: NotificationItem[];

  // Part 1 Company Master Entities
  companyProfile: CompanyProfile;
  bankAccounts: BankAccount[];
  departments: Department[];
  costCenters: CostCenter[];
  projectLocations: ProjectLocation[];
  companyDocuments: CompanyDocument[];

  // Part 1 Users, Permissions & Audit Trail
  systemUsers: User[];
  permissionMatrix: Record<UserRole, Record<string, Record<PermissionAction, boolean>>>;
  auditLogs: AuditLogEntry[];

  // Part 2 CRM Entities
  leads: Lead[];
  siteVisits: SiteVisit[];
  followUps: FollowUp[];

  // Shell Layout State
  isSidebarCollapsed: boolean;
  isMobileDrawerOpen: boolean;
  isSearchOpen: boolean;
  activeSlideOver: {
    isOpen: boolean;
    title: string;
    description?: string;
    content: React.ReactNode | null;
  };

  // Auth Actions
  login: (roleOrEmail: UserRole | string, role?: UserRole) => void;
  loginAsUser: (user: User) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;

  // Branch Selector
  setSelectedBranchId: (branchId: string) => void;

  // Shell Layout Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  openSlideOver: (title: string, content: React.ReactNode, description?: string) => void;
  closeSlideOver: () => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Clients
  addClient: (client: Omit<Client, 'id'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  // Company Master Actions
  updateCompanyProfile: (updates: Partial<CompanyProfile>) => void;
  addBankAccount: (account: Omit<BankAccount, 'id'>) => BankAccount;
  updateBankAccount: (id: string, updates: Partial<BankAccount>) => void;
  setPrimaryBankAccount: (id: string) => void;
  deleteBankAccount: (id: string) => void;
  addDepartment: (dept: Omit<Department, 'id'>) => Department;
  updateDepartment: (id: string, updates: Partial<Department>) => void;
  addCostCenter: (cc: Omit<CostCenter, 'id'>) => CostCenter;
  updateCostCenter: (id: string, updates: Partial<CostCenter>) => void;
  addCompanyDocument: (doc: Omit<CompanyDocument, 'id'>) => CompanyDocument;

  // System Users Actions
  updateSystemUser: (id: string, updates: Partial<User>) => void;
  toggleUserStatus: (id: string) => void;

  // Permissions Actions
  updatePermission: (role: UserRole, moduleId: string, action: PermissionAction, value: boolean) => void;
  setRoleAllPermissions: (role: UserRole, value: boolean) => void;
  resetRolePermissions: (role: UserRole) => void;

  // Audit Log Actions
  addAuditLogEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'relativeTime'>) => void;

  // Part 2 CRM Actions
  createLead: (leadData: Omit<Lead, 'id' | 'daysInStage' | 'createdDate' | 'activities'>) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  updateLeadStage: (id: string, newStage: LeadStage, lostReason?: Lead['lostReason'], lostNotes?: string) => void;
  addLeadActivity: (leadId: string, activity: Omit<LeadActivity, 'id' | 'timestamp' | 'relativeTime'>) => void;
  createSiteVisit: (visitData: Omit<SiteVisit, 'id'>) => SiteVisit;
  updateSiteVisitStatus: (id: string, status: SiteVisit['status'], remarks?: string) => void;
  createFollowUp: (fuData: Omit<FollowUp, 'id'>) => FollowUp;
  completeFollowUp: (id: string) => void;
  rescheduleFollowUp: (id: string, newDate: string, newTime: string) => void;

  // Part 3 Pre-Construction & Commercial Entities
  estimates: Estimate[];
  boqs: BOQ[];
  boqTemplates: BOQTemplate[];
  rateMaster: RateItem[];
  quotations: Quotation[];
  tenders: Tender[];
  contracts: Contract[];

  // Part 3 Actions
  createEstimate: (data: Omit<Estimate, 'id' | 'estimateNumber' | 'createdDate'>) => Estimate;
  updateEstimate: (id: string, updates: Partial<Estimate>) => void;
  deleteEstimate: (id: string) => void;
  createBOQ: (data: Omit<BOQ, 'id' | 'boqNumber' | 'createdDate'>) => BOQ;
  updateBOQ: (id: string, updates: Partial<BOQ>) => void;
  saveAsBOQTemplate: (template: Omit<BOQTemplate, 'id'>) => BOQTemplate;
  createQuotation: (data: Omit<Quotation, 'id' | 'quoteNumber'>) => Quotation;
  updateQuotationStatus: (id: string, status: Quotation['status'], signedBy?: string) => void;
  createTender: (data: Omit<Tender, 'id' | 'tenderNumber'>) => Tender;
  updateTenderStatus: (id: string, status: Tender['status']) => void;
  createContract: (data: Omit<Contract, 'id' | 'contractNumber'>) => Contract;
  updateContractStatus: (id: string, status: Contract['status']) => void;
  convertContractToProject: (contractId: string) => { projectId: string; projectName: string };

  // Part 4 Core Project Management Entities
  projects: Project[];
  wbsTasks: WBSTask[];
  projectTasks: ProjectTask[];
  dprs: DailyProgressReport[];
  sitePhotos: SitePhoto[];
  mbEntries: MeasurementBookEntry[];
  rfis: RFIItem[];
  variations: VariationOrder[];
  handovers: Record<string, ProjectHandover>;

  // Part 4 Actions
  createProject: (data: Omit<Project, 'id'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  createDPR: (data: Omit<DailyProgressReport, 'id' | 'dprNumber'>) => DailyProgressReport;
  createMBEntry: (data: Omit<MeasurementBookEntry, 'id' | 'mbNumber'>) => MeasurementBookEntry;
  createRFI: (data: Omit<RFIItem, 'id' | 'rfiNumber' | 'daysOpen'>) => RFIItem;
  updateRFIStatus: (id: string, status: RFIItem['status'], responseText?: string, respondedBy?: string) => void;
  createVariation: (data: Omit<VariationOrder, 'id' | 'variationNumber'>) => VariationOrder;
  updateVariationStatus: (id: string, status: VariationOrder['status'], approverComments?: string) => void;
  updateTaskStatus: (id: string, status: ProjectTask['status']) => void;
  addProjectTask: (data: Omit<ProjectTask, 'id'>) => ProjectTask;
  updateHandover: (projectId: string, updates: Partial<ProjectHandover>) => void;

  // Part 5 Procurement & Inventory Entities
  materials: Material[];
  vendors: Vendor[];
  purchaseRequisitions: PurchaseRequisition[];
  rfqs: RFQ[];
  purchaseOrders: PurchaseOrder[];
  grnEntries: GRNEntry[];
  stockLedger: StockLedgerEntry[];
  stockTransactions: StockTransaction[];

  // Part 5 Actions
  createPR: (data: Omit<PurchaseRequisition, 'id' | 'prNumber' | 'raisedDate' | 'status'>) => PurchaseRequisition;
  updatePRStatus: (id: string, status: PurchaseRequisition['status'], approvedBy?: string, rejectionReason?: string) => void;
  createRFQ: (data: Omit<RFQ, 'id' | 'rfqNumber' | 'createdDate' | 'vendorQuotes' | 'status'>) => RFQ;
  addVendorQuoteToRFQ: (rfqId: string, quote: RFQ['vendorQuotes'][0]) => void;
  selectVendorForRFQ: (rfqId: string, vendorId: string) => void;
  approveRFQ: (rfqId: string, approvedBy: string) => void;
  createPO: (data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'linkedGRNIds'>) => PurchaseOrder;
  updatePOStatus: (id: string, status: PurchaseOrder['status']) => void;
  createGRN: (data: Omit<GRNEntry, 'id' | 'grnNumber'>) => GRNEntry;
  updateMaterialStock: (materialId: string, delta: number) => void;
  addStockTransaction: (data: Omit<StockTransaction, 'id'>) => void;
  updateStockLedger: (siteId: string, materialId: string, updates: Partial<StockLedgerEntry>) => void;

  // Part 7 Finance & Billing Entities
  raBills: RABill[];
  projectCostings: Record<string, ProjectCosting>;
  customerReceivables: ReceivableItem[];
  vendorPayables: PayableItem[];
  expenses: ExpenseEntry[];
  pettyCashLedgers: Record<string, PettyCashLedger>;
  financialTransactions: FinancialTransaction[];
  journalEntries: JournalEntry[];
  erpSettings: ErpIntegrationSettings;

  // Part 7 Finance & Billing Actions
  createRABill: (data: Partial<RABill>) => RABill;
  updateRABillStatus: (id: string, status: RABillStatus, remarks?: string, verifiedByName?: string) => void;
  addExpense: (data: Omit<ExpenseEntry, 'id' | 'expenseNumber'>) => ExpenseEntry;
  addPettyCashEntry: (siteId: string, entry: Omit<PettyCashEntry, 'id' | 'voucherNo' | 'runningBalance'>) => PettyCashEntry;
  recordPaymentReceipt: (data: Omit<FinancialTransaction, 'id' | 'txNumber'>) => FinancialTransaction;
  updateErpSettings: (updates: Partial<ErpIntegrationSettings>) => void;
  setCompanyGstRate: (rate: number) => void;

  // Part 8 Ops & HR Collections
  safetyIncidents: SafetyIncident[];
  ppeChecks: PPEComplianceRecord[];
  safetyInspections: SafetyInspectionRecord[];
  nearMissLogs: NearMissLog[];
  toolboxMeetings: ToolboxMeeting[];
  safetyTrainings: SafetyTrainingRecord[];
  siteAudits: SiteAuditRecord[];
  qaqcInspections: QAQCInspection[];
  ncrs: NonConformanceReport[];
  repoDocuments: RepoDocument[];
  drawingRegister: DrawingRegisterItem[];
  siteInstructions: SiteInstruction[];
  meetingRecords: MeetingRecord[];
  snagItems: SnagItem[];
  salariedEmployees: SalariedEmployee[];
  staffAttendance: StaffAttendanceDay[];
  leaveRequests: LeaveRequest[];
  leaveBalances: Record<string, LeaveBalance>;
  payslips: MonthlyPayslip[];
  legalComplianceItems: LegalComplianceItem[];

  // Part 8 Ops & HR Actions
  createSafetyIncident: (data: Omit<SafetyIncident, 'id' | 'code' | 'daysOpen'>) => SafetyIncident;
  updateIncidentStage: (id: string, stage: IncidentStage, details?: { investigationDetails?: string; rootCause?: string; correctiveAction?: string }) => void;
  addPPECheck: (data: Omit<PPEComplianceRecord, 'id'>) => PPEComplianceRecord;
  addNearMissLog: (data: Omit<NearMissLog, 'id' | 'code'>) => NearMissLog;
  addToolboxMeeting: (data: Omit<ToolboxMeeting, 'id' | 'code'>) => ToolboxMeeting;
  createQAQCInspection: (data: Omit<QAQCInspection, 'id' | 'reportNumber'>) => QAQCInspection;
  createNCR: (data: Omit<NonConformanceReport, 'id' | 'ncrNumber'>) => NonConformanceReport;
  updateNCRStage: (id: string, stage: NCRStage, details?: { reasonAnalysis?: string; correctiveActionPlan?: string; verifiedBy?: string }) => void;
  addRepoDocument: (data: Omit<RepoDocument, 'id' | 'docNumber' | 'uploadedDate'>) => RepoDocument;
  addDrawingRevision: (drawingId: string, version: DrawingVersion) => void;
  createSiteInstruction: (data: Omit<SiteInstruction, 'id' | 'instructionNumber'>) => SiteInstruction;
  updateSiteInstructionStatus: (id: string, status: SiteInstruction['status']) => void;
  createMeetingRecord: (data: Omit<MeetingRecord, 'id' | 'meetingNumber'>) => MeetingRecord;
  updateMinuteStatus: (meetingId: string, minuteId: string, status: 'open' | 'in_progress' | 'closed') => void;
  createSnagItem: (data: Omit<SnagItem, 'id' | 'snagNumber' | 'reportedDate'>) => SnagItem;
  updateSnagStatus: (id: string, status: SnagStatus, notes?: string, verifiedBy?: string) => void;
  markStaffAttendance: (empId: string, status: StaffAttendanceDay['status'], checkIn?: string, checkOut?: string) => void;
  applyLeaveRequest: (data: Omit<LeaveRequest, 'id' | 'appliedOn' | 'status'>) => LeaveRequest;
  updateLeaveStatus: (id: string, status: LeaveStatus, approverRemarks?: string) => void;
  generateMonthlyPayslip: (empId: string, month: string) => MonthlyPayslip;
  updateComplianceItem: (id: string, updates: Partial<LegalComplianceItem>) => void;
  resetDemoData: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Default to Super Admin (Rajesh Sharma)
  currentUser: DEMO_USERS.super_admin,
  isAuthenticated: true,
  selectedBranchId: 'ALL',

  employees: [...SEED_EMPLOYEES],
  branches: [...SEED_BRANCHES],
  clients: [...SEED_CLIENTS],
  notifications: [...SEED_NOTIFICATIONS],

  companyProfile: { ...SEED_COMPANY_PROFILE },
  bankAccounts: [...SEED_BANK_ACCOUNTS],
  departments: [...SEED_DEPARTMENTS],
  costCenters: [...SEED_COST_CENTERS],
  projectLocations: [...SEED_PROJECT_LOCATIONS],
  companyDocuments: [...SEED_COMPANY_DOCUMENTS],

  systemUsers: [...SEED_SYSTEM_USERS],
  permissionMatrix: JSON.parse(JSON.stringify(DEFAULT_PERMISSION_MAP)),
  auditLogs: [...SEED_AUDIT_LOGS],

  // CRM Seeded collections
  leads: [...SEED_LEADS],
  siteVisits: [...SEED_SITE_VISITS],
  followUps: [...SEED_FOLLOW_UPS],

  // Part 3 Pre-Construction & Commercial collections
  estimates: [...SEED_ESTIMATES],
  boqs: [...SEED_BOQS],
  boqTemplates: [...SEED_BOQ_TEMPLATES],
  rateMaster: [...SEED_RATE_MASTER],
  quotations: [...SEED_QUOTATIONS],
  tenders: [...SEED_TENDERS],
  contracts: [...SEED_CONTRACTS],

  // Part 4 Core Project Management collections
  projects: [...SEED_PROJECTS],
  wbsTasks: [...SEED_WBS_TASKS],
  projectTasks: [...SEED_TASKS],
  dprs: [...SEED_DPRS],
  sitePhotos: [...SEED_SITE_PHOTOS],
  mbEntries: [...SEED_MB_ENTRIES],
  rfis: [...SEED_RFIS],
  variations: [...SEED_VARIATIONS],
  handovers: { ...SEED_HANDOVERS },

  // Part 5 Procurement & Inventory collections
  materials: [...materialsSeed],
  vendors: [...vendorsSeed],
  purchaseRequisitions: [...purchaseRequisitionsSeed],
  rfqs: [...rfqsSeed],
  purchaseOrders: [...purchaseOrdersSeed],
  grnEntries: [...grnEntriesSeed],
  stockLedger: [...stockLedgerSeed],
  stockTransactions: [...stockTransactionsSeed],

  // Part 7 Finance initial state
  raBills: [...SEED_RA_BILLS],
  projectCostings: { ...SEED_PROJECT_COSTINGS },
  customerReceivables: [...SEED_CUSTOMER_RECEIVABLES],
  vendorPayables: [...SEED_VENDOR_PAYABLES],
  expenses: [...SEED_EXPENSES],
  pettyCashLedgers: { ...SEED_PETTY_CASH_LEDGERS },
  financialTransactions: [...SEED_PAYMENTS_RECEIPTS],
  journalEntries: [...SEED_JOURNAL_ENTRIES],
  erpSettings: { ...SEED_ERP_INTEGRATION_SETTINGS },

  // Part 8 Ops & HR Initial State
  safetyIncidents: [...SEED_SAFETY_INCIDENTS],
  ppeChecks: [...SEED_PPE_CHECKS],
  safetyInspections: [...SEED_SAFETY_INSPECTIONS],
  nearMissLogs: [...SEED_NEAR_MISS_LOGS],
  toolboxMeetings: [...SEED_TOOLBOX_MEETINGS],
  safetyTrainings: [...SEED_SAFETY_TRAININGS],
  siteAudits: [...SEED_SITE_AUDITS],
  qaqcInspections: [...SEED_QAQC_INSPECTIONS],
  ncrs: [...SEED_NCRS],
  repoDocuments: [...SEED_DOCUMENTS_REPO],
  drawingRegister: [...SEED_DRAWING_REGISTER],
  siteInstructions: [...SEED_SITE_INSTRUCTIONS],
  meetingRecords: [...SEED_MEETING_RECORDS],
  snagItems: [...SEED_SNAG_ITEMS],
  salariedEmployees: [...SEED_SALARIED_EMPLOYEES],
  staffAttendance: [...SEED_STAFF_ATTENDANCE],
  leaveRequests: [...SEED_LEAVE_REQUESTS],
  leaveBalances: { ...SEED_LEAVE_BALANCES },
  payslips: [...SEED_PAYSLIPS],
  legalComplianceItems: [...SEED_LEGAL_COMPLIANCE],

  isSidebarCollapsed: false,
  isMobileDrawerOpen: false,
  isSearchOpen: false,
  activeSlideOver: {
    isOpen: false,
    title: '',
    description: '',
    content: null,
  },

  login: (roleOrEmail, specifiedRole) => {
    if (roleOrEmail in DEMO_USERS) {
      set({
        currentUser: DEMO_USERS[roleOrEmail],
        isAuthenticated: true,
      });
      return;
    }

    const foundUser = get().systemUsers.find(
      (u) => u.email.toLowerCase() === roleOrEmail.toLowerCase() || u.id === roleOrEmail
    );
    if (foundUser) {
      set({
        currentUser: foundUser,
        isAuthenticated: true,
      });
      return;
    }

    const role = specifiedRole || 'project_manager';
    const fallbackUser: User = {
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: roleOrEmail.split('@')[0].replace('.', ' ').replace(/^./, (s) => s.toUpperCase()),
      email: roleOrEmail.includes('@') ? roleOrEmail : `${roleOrEmail}@apexbuildos.com`,
      role,
      roleTitle: role === 'super_admin' ? 'Super Administrator' : 'Executive User',
      phone: '+91 98200 99881',
      branchId: 'BR-001',
      branchName: 'Apex Buildcon HQ (Mumbai Metro)',
      status: 'active',
      lastLogin: 'Just now',
      assignedProjects: ['Lodha Skylines'],
      avatarColor: '#d97706',
    };

    set({
      currentUser: fallbackUser,
      isAuthenticated: true,
    });
  },

  loginAsUser: (user) => {
    set({
      currentUser: user,
      isAuthenticated: true,
    });
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
    });
  },

  switchRole: (role) => {
    if (DEMO_USERS[role]) {
      set({
        currentUser: DEMO_USERS[role],
      });
    } else {
      const userWithRole = get().systemUsers.find((u) => u.role === role);
      if (userWithRole) {
        set({ currentUser: userWithRole });
      }
    }
  },

  setSelectedBranchId: (branchId) => {
    set({ selectedBranchId: branchId });
  },

  toggleSidebar: () => {
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ isSidebarCollapsed: collapsed });
  },

  setMobileDrawerOpen: (open) => {
    set({ isMobileDrawerOpen: open });
  },

  setSearchOpen: (open) => {
    set({ isSearchOpen: open });
  },

  openSlideOver: (title, content, description) => {
    set({
      activeSlideOver: {
        isOpen: true,
        title,
        description,
        content,
      },
    });
  },

  closeSlideOver: () => {
    set((state) => ({
      activeSlideOver: {
        ...state.activeSlideOver,
        isOpen: false,
      },
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllNotificationsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  addClient: (clientData) => {
    const newId = `CLI-0${get().clients.length + 1}`.padStart(7, 'CLI-0');
    const newClient: Client = {
      id: newId,
      ...clientData,
    };
    set((state) => ({
      clients: [newClient, ...state.clients],
    }));
    return newClient;
  },

  updateClient: (id, updates) => {
    set((state) => ({
      clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== id),
    }));
  },

  updateCompanyProfile: (updates) => {
    set((state) => ({
      companyProfile: { ...state.companyProfile, ...updates },
    }));
  },

  addBankAccount: (accountData) => {
    const newId = `BANK-0${get().bankAccounts.length + 1}`;
    const newAcc: BankAccount = { id: newId, ...accountData };
    set((state) => ({
      bankAccounts: [...state.bankAccounts, newAcc],
    }));
    return newAcc;
  },

  updateBankAccount: (id, updates) => {
    set((state) => ({
      bankAccounts: state.bankAccounts.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  },

  setPrimaryBankAccount: (id) => {
    set((state) => ({
      bankAccounts: state.bankAccounts.map((b) => ({
        ...b,
        isPrimary: b.id === id,
      })),
    }));
  },

  deleteBankAccount: (id) => {
    set((state) => ({
      bankAccounts: state.bankAccounts.filter((b) => b.id !== id),
    }));
  },

  addDepartment: (deptData) => {
    const newId = `DEPT-0${get().departments.length + 1}`;
    const newDept: Department = { id: newId, ...deptData };
    set((state) => ({
      departments: [...state.departments, newDept],
    }));
    return newDept;
  },

  updateDepartment: (id, updates) => {
    set((state) => ({
      departments: state.departments.map((d) => (d.id === id ? { ...d, ...updates } : d)),
    }));
  },

  addCostCenter: (ccData) => {
    const newId = `CC-0${get().costCenters.length + 1}`;
    const newCc: CostCenter = { id: newId, ...ccData };
    set((state) => ({
      costCenters: [...state.costCenters, newCc],
    }));
    return newCc;
  },

  updateCostCenter: (id, updates) => {
    set((state) => ({
      costCenters: state.costCenters.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  },

  addCompanyDocument: (docData) => {
    const newId = `DOC-0${get().companyDocuments.length + 1}`;
    const newDoc: CompanyDocument = { id: newId, ...docData };
    set((state) => ({
      companyDocuments: [newDoc, ...state.companyDocuments],
    }));
    return newDoc;
  },

  updateSystemUser: (id, updates) => {
    set((state) => ({
      systemUsers: state.systemUsers.map((u) => (u.id === id ? { ...u, ...updates } : u)),
    }));
  },

  toggleUserStatus: (id) => {
    set((state) => ({
      systemUsers: state.systemUsers.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
          : u
      ),
    }));
  },

  updatePermission: (role, moduleId, action, value) => {
    set((state) => {
      const copy = JSON.parse(JSON.stringify(state.permissionMatrix));
      if (!copy[role]) copy[role] = {};
      if (!copy[role][moduleId]) copy[role][moduleId] = { create: false, view: false, edit: false, delete: false, approve: false, export: false, download: false };
      copy[role][moduleId][action] = value;
      return { permissionMatrix: copy };
    });
  },

  setRoleAllPermissions: (role, value) => {
    set((state) => {
      const copy = JSON.parse(JSON.stringify(state.permissionMatrix));
      if (!copy[role]) copy[role] = {};
      Object.keys(copy[role]).forEach((mod) => {
        copy[role][mod] = {
          create: value,
          view: value,
          edit: value,
          delete: value,
          approve: value,
          export: value,
          download: value,
        };
      });
      return { permissionMatrix: copy };
    });
  },

  resetRolePermissions: (role) => {
    set((state) => {
      const copy = JSON.parse(JSON.stringify(state.permissionMatrix));
      copy[role] = JSON.parse(JSON.stringify(DEFAULT_PERMISSION_MAP[role] || {}));
      return { permissionMatrix: copy };
    });
  },

  addAuditLogEntry: (entry) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: AuditLogEntry = {
      id: `AUDIT-${get().auditLogs.length + 1}`,
      timestamp: formatted,
      relativeTime: 'Just now',
      ...entry,
    };
    set((state) => ({
      auditLogs: [newLog, ...state.auditLogs],
    }));
  },

  // --------------------------------------------------------------------------
  // PART 2: CRM STORE ACTIONS
  // --------------------------------------------------------------------------

  createLead: (leadData) => {
    const newId = `LEAD-0${get().leads.length + 1}`.padStart(8, 'LEAD-0');
    const now = new Date();
    const createdDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newLead: Lead = {
      id: newId,
      daysInStage: 0,
      createdDate,
      activities: [
        {
          id: `ACT-${Date.now().toString().slice(-4)}`,
          type: 'note',
          title: 'Lead Created in BuildOS CRM',
          notes: `Created via ${leadData.source}. Assigned to ${leadData.assignedSalesperson}.`,
          timestamp: 'Just now',
          relativeTime: 'Just now',
          authorName: get().currentUser?.name || 'System User',
        },
      ],
      ...leadData,
    };

    set((state) => ({
      leads: [newLead, ...state.leads],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'System Admin',
      userRole: get().currentUser?.role || 'super_admin',
      action: 'CREATE',
      module: 'CRM > Leads',
      recordRef: `Lead: ${newLead.customerName} (${newLead.id})`,
      newValue: `Budget: ₹ ${(newLead.budget / 10000000).toFixed(2)} Cr • Stage: ${newLead.stage}`,
      ipAddress: '192.168.1.25',
      badgeVariant: 'info',
    });

    return newLead;
  },

  updateLead: (id, updates) => {
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    }));
  },

  updateLeadStage: (id, newStage, lostReason, lostNotes) => {
    const lead = get().leads.find((l) => l.id === id);
    if (!lead) return;

    const oldStage = lead.stage;
    const activityTitle = newStage === 'lost' ? `Lead Marked as Lost (${lostReason})` : `Moved to Stage: ${newStage.replace('_', ' ').toUpperCase()}`;
    const activityNotes = newStage === 'lost' ? (lostNotes || 'No notes provided') : `Pipeline stage transitioned from ${oldStage} to ${newStage}`;

    const newActivity: LeadActivity = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      type: 'status_change',
      title: activityTitle,
      notes: activityNotes,
      timestamp: 'Just now',
      relativeTime: 'Just now',
      authorName: get().currentUser?.name || 'Sales User',
    };

    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id
          ? {
              ...l,
              stage: newStage,
              daysInStage: 0,
              lostReason: newStage === 'lost' ? lostReason : undefined,
              lostNotes: newStage === 'lost' ? lostNotes : undefined,
              activities: [newActivity, ...l.activities],
            }
          : l
      ),
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Sales User',
      userRole: get().currentUser?.role || 'sales',
      action: 'UPDATE',
      module: 'CRM > Pipeline',
      recordRef: `Lead ${lead.customerName} (${id})`,
      oldValue: `Stage: ${oldStage}`,
      newValue: `Stage: ${newStage}${lostReason ? ` (${lostReason})` : ''}`,
      ipAddress: '192.168.1.25',
      badgeVariant: newStage === 'lost' ? 'danger' : 'success',
    });
  },

  addLeadActivity: (leadId, activity) => {
    const now = new Date();
    const formatted = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newAct: LeadActivity = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      timestamp: `Today, ${formatted}`,
      relativeTime: 'Just now',
      ...activity,
    };

    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === leadId
          ? {
              ...l,
              activities: [newAct, ...l.activities],
            }
          : l
      ),
    }));
  },

  createSiteVisit: (visitData) => {
    const newId = `VISIT-0${get().siteVisits.length + 1}`;
    const newVisit: SiteVisit = { id: newId, ...visitData };

    set((state) => ({
      siteVisits: [newVisit, ...state.siteVisits],
      leads: state.leads.map((l) =>
        l.id === visitData.leadId
          ? {
              ...l,
              stage: 'site_visit',
              siteVisitId: newId,
              activities: [
                {
                  id: `ACT-${Date.now().toString().slice(-4)}`,
                  type: 'site_visit',
                  title: `Site Inspection Scheduled (${visitData.visitDate})`,
                  notes: `Assigned Engineer: ${visitData.assignedEngineer} • Location: ${visitData.siteLocation}`,
                  timestamp: 'Just now',
                  relativeTime: 'Just now',
                  authorName: get().currentUser?.name || 'System',
                },
                ...l.activities,
              ],
            }
          : l
      ),
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Site Engineer',
      userRole: get().currentUser?.role || 'site_engineer',
      action: 'CREATE',
      module: 'CRM > Site Visits',
      recordRef: `Site Visit: ${visitData.customerName} (${newId})`,
      newValue: `Scheduled for ${visitData.visitDate} • Engineer: ${visitData.assignedEngineer}`,
      ipAddress: '10.240.8.12',
      badgeVariant: 'info',
    });

    return newVisit;
  },

  updateSiteVisitStatus: (id, status, remarks) => {
    const visit = get().siteVisits.find((v) => v.id === id);
    set((state) => ({
      siteVisits: state.siteVisits.map((v) =>
        v.id === id
          ? { ...v, status, engineerRemarks: remarks || v.engineerRemarks }
          : v
      ),
    }));

    if (visit) {
      get().addAuditLogEntry({
        userId: get().currentUser?.id || 'SYS',
        userName: get().currentUser?.name || 'Engineer',
        userRole: get().currentUser?.role || 'site_engineer',
        action: 'UPDATE',
        module: 'CRM > Site Visits',
        recordRef: `Site Visit ${visit.customerName} (${id})`,
        oldValue: `Status: ${visit.status}`,
        newValue: `Status: ${status}${remarks ? ` • Notes: ${remarks}` : ''}`,
        ipAddress: '10.240.8.12',
        badgeVariant: status === 'approved' ? 'success' : 'warning',
      });
    }
  },

  createFollowUp: (fuData) => {
    const newId = `FU-0${get().followUps.length + 1}`;
    const newFu: FollowUp = { id: newId, ...fuData };
    set((state) => ({
      followUps: [newFu, ...state.followUps],
    }));
    return newFu;
  },

  completeFollowUp: (id) => {
    set((state) => ({
      followUps: state.followUps.map((f) =>
        f.id === id ? { ...f, status: 'completed' } : f
      ),
    }));
  },

  rescheduleFollowUp: (id, newDate, newTime) => {
    set((state) => ({
      followUps: state.followUps.map((f) =>
        f.id === id
          ? { ...f, dueDate: newDate, dueTime: newTime, status: 'pending' }
          : f
      ),
    }));
  },

  // --------------------------------------------------------------------------
  // PART 3: PRE-CONSTRUCTION & COMMERCIAL STORE ACTIONS
  // --------------------------------------------------------------------------

  createEstimate: (data) => {
    const num = `EST-2026-${String(get().estimates.length + 1).padStart(3, '0')}`;
    const newEstimate: Estimate = {
      id: num,
      estimateNumber: num,
      createdDate: new Date().toISOString().split('T')[0],
      ...data,
    };
    set((state) => ({
      estimates: [newEstimate, ...state.estimates],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Estimator',
      userRole: get().currentUser?.role || 'estimation_engineer',
      action: 'CREATE',
      module: 'Estimation > Cost Estimates',
      recordRef: `Estimate: ${newEstimate.estimateNumber} (${newEstimate.projectName})`,
      newValue: `Total: ₹ ${(newEstimate.totalEstimateValue / 10000000).toFixed(2)} Cr`,
      ipAddress: '192.168.1.42',
      badgeVariant: 'info',
    });

    return newEstimate;
  },

  updateEstimate: (id, updates) => {
    set((state) => ({
      estimates: state.estimates.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  },

  deleteEstimate: (id) => {
    set((state) => ({
      estimates: state.estimates.filter((e) => e.id !== id),
    }));
  },

  createBOQ: (data) => {
    const num = `BOQ-2026-${String(get().boqs.length + 1).padStart(3, '0')}`;
    const newBoq: BOQ = {
      id: num,
      boqNumber: num,
      createdDate: new Date().toISOString().split('T')[0],
      ...data,
    };
    set((state) => ({
      boqs: [newBoq, ...state.boqs],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'QS Engineer',
      userRole: get().currentUser?.role || 'qs',
      action: 'CREATE',
      module: 'Estimation > BOQ',
      recordRef: `BOQ: ${newBoq.boqNumber} (${newBoq.title})`,
      newValue: `Value: ₹ ${(newBoq.grandTotal / 10000000).toFixed(2)} Cr • Items: ${newBoq.items.length}`,
      ipAddress: '192.168.1.42',
      badgeVariant: 'info',
    });

    return newBoq;
  },

  updateBOQ: (id, updates) => {
    set((state) => ({
      boqs: state.boqs.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    }));
  },

  saveAsBOQTemplate: (templateData) => {
    const newId = `TPL-0${get().boqTemplates.length + 1}`;
    const newTemplate: BOQTemplate = {
      id: newId,
      ...templateData,
    };
    set((state) => ({
      boqTemplates: [...state.boqTemplates, newTemplate],
    }));
    return newTemplate;
  },

  createQuotation: (data) => {
    const num = `QT-2026-${String(get().quotations.length + 1).padStart(3, '0')}`;
    const newQuote: Quotation = {
      id: num,
      quoteNumber: num,
      ...data,
    };
    set((state) => ({
      quotations: [newQuote, ...state.quotations],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Sales Head',
      userRole: get().currentUser?.role || 'sales',
      action: 'CREATE',
      module: 'Commercial > Quotations',
      recordRef: `Quotation: ${newQuote.quoteNumber} (${newQuote.customerName})`,
      newValue: `Total: ₹ ${(newQuote.grandTotal / 10000000).toFixed(2)} Cr • ${newQuote.version}`,
      ipAddress: '192.168.1.25',
      badgeVariant: 'warning',
    });

    return newQuote;
  },

  updateQuotationStatus: (id, status, signedBy) => {
    const quote = get().quotations.find((q) => q.id === id);
    const now = new Date();
    const signedAt = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    set((state) => ({
      quotations: state.quotations.map((q) =>
        q.id === id
          ? {
              ...q,
              status,
              signedBy: signedBy || q.signedBy,
              signedAt: status === 'accepted' ? (q.signedAt || signedAt) : q.signedAt,
            }
          : q
      ),
    }));

    if (quote) {
      get().addAuditLogEntry({
        userId: get().currentUser?.id || 'SYS',
        userName: get().currentUser?.name || 'Sales User',
        userRole: get().currentUser?.role || 'sales',
        action: 'APPROVE',
        module: 'Commercial > Quotations',
        recordRef: `Quotation ${quote.quoteNumber}`,
        oldValue: `Status: ${quote.status}`,
        newValue: `Status: ${status}${signedBy ? ` • Signed by: ${signedBy}` : ''}`,
        ipAddress: '192.168.1.25',
        badgeVariant: status === 'accepted' ? 'success' : 'info',
      });
    }
  },

  createTender: (data) => {
    const num = `TND-2026-${String(get().tenders.length + 10).padStart(3, '0')}`;
    const newTender: Tender = {
      id: num,
      tenderNumber: `AUTH/TND/2026/${String(get().tenders.length + 10).padStart(3, '0')}`,
      ...data,
    };
    set((state) => ({
      tenders: [newTender, ...state.tenders],
    }));
    return newTender;
  },

  updateTenderStatus: (id, status) => {
    const tender = get().tenders.find((t) => t.id === id);
    set((state) => ({
      tenders: state.tenders.map((t) => (t.id === id ? { ...t, status } : t)),
    }));

    if (tender) {
      get().addAuditLogEntry({
        userId: get().currentUser?.id || 'SYS',
        userName: get().currentUser?.name || 'Tender Lead',
        userRole: get().currentUser?.role || 'estimation_engineer',
        action: 'UPDATE',
        module: 'Commercial > Tenders',
        recordRef: `Tender ${tender.tenderNumber}`,
        oldValue: `Status: ${tender.status}`,
        newValue: `Status: ${status}`,
        ipAddress: '192.168.1.42',
        badgeVariant: status === 'won' ? 'success' : 'warning',
      });
    }
  },

  createContract: (data) => {
    const num = `CNT-2026-${String(get().contracts.length + 1).padStart(3, '0')}`;
    const newContract: Contract = {
      id: num,
      contractNumber: `APEX-CNT-2026-${String(get().contracts.length + 1).padStart(3, '0')}`,
      ...data,
    };
    set((state) => ({
      contracts: [newContract, ...state.contracts],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Legal & Contracts Head',
      userRole: get().currentUser?.role || 'super_admin',
      action: 'CREATE',
      module: 'Commercial > Contracts',
      recordRef: `Contract: ${newContract.contractNumber} (${newContract.clientName})`,
      newValue: `Value: ₹ ${(newContract.contractValue / 10000000).toFixed(2)} Cr`,
      ipAddress: '192.168.1.10',
      badgeVariant: 'success',
    });

    return newContract;
  },

  updateContractStatus: (id, status) => {
    set((state) => ({
      contracts: state.contracts.map((c) => (c.id === id ? { ...c, status } : c)),
    }));
  },

  convertContractToProject: (contractId) => {
    const contract = get().contracts.find((c) => c.id === contractId);
    const projectId = `PRJ-${contractId.replace('CNT-', '').padStart(3, '0')}`;
    const projectName = contract ? contract.title : `Project ${contractId}`;

    set((state) => ({
      contracts: state.contracts.map((c) =>
        c.id === contractId ? { ...c, convertedProjectId: projectId, status: 'active' } : c
      ),
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Project Director',
      userRole: get().currentUser?.role || 'project_manager',
      action: 'APPROVE',
      module: 'Commercial > Contracts',
      recordRef: `Contract ${contractId} Converted to Project`,
      newValue: `Project ID: ${projectId} • Name: ${projectName}`,
      ipAddress: '192.168.1.10',
      badgeVariant: 'success',
    });

    return { projectId, projectName };
  },

  createProject: (data) => {
    const nextNum = get().projects.length + 1;
    const newProject: Project = {
      ...data,
      id: `PRJ-${String(nextNum).padStart(3, '0')}`,
    };

    set((state) => ({
      projects: [newProject, ...state.projects],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Project Director',
      userRole: get().currentUser?.role || 'super_admin',
      action: 'CREATE',
      module: 'Projects > Directory',
      recordRef: `Project: ${newProject.code} - ${newProject.name}`,
      newValue: `Budget: ₹ ${(newProject.budget / 10000000).toFixed(2)} Cr • PM: ${newProject.projectManager}`,
      ipAddress: '192.168.1.10',
      badgeVariant: 'success',
    });

    return newProject;
  },

  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Site Ops Head',
      userRole: get().currentUser?.role || 'project_manager',
      action: 'UPDATE',
      module: 'Projects > Detail',
      recordRef: `Project: ${id}`,
      newValue: `Updated fields: ${Object.keys(updates).join(', ')}`,
      ipAddress: '192.168.1.10',
      badgeVariant: 'warning',
    });
  },

  createDPR: (data) => {
    const nextNum = get().dprs.length + 1;
    const newDPR: DailyProgressReport = {
      ...data,
      id: `dpr-${Date.now()}`,
      dprNumber: `DPR-${data.projectId.replace('PRJ-', '')}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(nextNum).padStart(2, '0')}`,
    };

    set((state) => ({
      dprs: [newDPR, ...state.dprs],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Site Engineer',
      userRole: get().currentUser?.role || 'site_engineer',
      action: 'CREATE',
      module: 'Projects > DPR',
      recordRef: `DPR: ${newDPR.dprNumber} (${newDPR.projectName})`,
      newValue: `Date: ${newDPR.date} • Total Manpower: ${newDPR.totalManpower} • Shift: ${newDPR.shift}`,
      ipAddress: '192.168.1.10',
      badgeVariant: 'success',
    });

    return newDPR;
  },

  createMBEntry: (data) => {
    const nextNum = get().mbEntries.length + 1;
    const newMB: MeasurementBookEntry = {
      ...data,
      id: `mb-${Date.now()}`,
      mbNumber: `MB-${data.projectId.replace('PRJ-', '')}-${String(nextNum).padStart(3, '0')}`,
    };

    set((state) => ({
      mbEntries: [newMB, ...state.mbEntries],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Quantity Surveyor',
      userRole: get().currentUser?.role || 'qs',
      action: 'CREATE',
      module: 'Projects > Measurement Book',
      recordRef: `MB Record: ${newMB.mbNumber} (${newMB.description || newMB.workDescription || 'Measurement'})`,
      newValue: `Total Qty: ${newMB.quantity} ${newMB.unit} • Amount: ₹ ${((newMB.totalAmount || newMB.amount || 0) / 100000).toFixed(2)} L`,
      ipAddress: '192.168.1.10',
      badgeVariant: 'success',
    });

    return newMB;
  },

  createRFI: (data) => {
    const nextNum = get().rfis.length + 1;
    const newRFI: RFIItem = {
      ...data,
      id: `rfi-${Date.now()}`,
      rfiNumber: `RFI-${data.projectId.replace('PRJ-', '')}-${String(nextNum).padStart(3, '0')}`,
      daysOpen: 0,
    };

    set((state) => ({
      rfis: [newRFI, ...state.rfis],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Civil Engineer',
      userRole: get().currentUser?.role || 'civil_engineer',
      action: 'CREATE',
      module: 'Projects > RFI Tracker',
      recordRef: `RFI: ${newRFI.rfiNumber} - ${newRFI.subject || newRFI.question.slice(0, 30)}`,
      newValue: `Priority: ${newRFI.priority || 'medium'} • Discipline: ${newRFI.discipline || 'civil'}`,
      ipAddress: '192.168.1.10',
      badgeVariant: 'info',
    });

    return newRFI;
  },

  updateRFIStatus: (id, status, responseText, respondedBy) => {
    set((state) => ({
      rfis: state.rfis.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              ...(responseText ? { response: responseText, responseDate: new Date().toISOString().slice(0, 10), respondedBy: respondedBy || 'Architect Consultant' } : {}),
            }
          : r
      ),
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Consultant / Lead QS',
      userRole: get().currentUser?.role || 'super_admin',
      action: 'UPDATE',
      module: 'Projects > RFI Tracker',
      recordRef: `RFI ${id} Status: ${status}`,
      newValue: responseText ? `Resolution provided: ${responseText.slice(0, 50)}...` : `Status marked as ${status}`,
      ipAddress: '192.168.1.10',
      badgeVariant: status === 'closed' ? 'success' : 'warning',
    });
  },

  createVariation: (data) => {
    const nextNum = get().variations.length + 1;
    const newVO: VariationOrder = {
      ...data,
      id: `vo-${Date.now()}`,
      variationNumber: `VO-${data.projectId.replace('PRJ-', '')}-${String(nextNum).padStart(3, '0')}`,
    };

    set((state) => ({
      variations: [newVO, ...state.variations],
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Project Manager',
      userRole: get().currentUser?.role || 'project_manager',
      action: 'CREATE',
      module: 'Projects > Variations & Change Orders',
      recordRef: `VO: ${newVO.variationNumber} - ${newVO.title}`,
      newValue: `Impact: ${newVO.type === 'addition' ? '+' : '−'}₹ ${((newVO.amount || 0) / 100000).toFixed(2)} L • Schedule: +${newVO.timeExtensionDays || 0} days`,
      ipAddress: '192.168.1.10',
      badgeVariant: 'warning',
    });

    return newVO;
  },

  updateVariationStatus: (id, status, approverComments) => {
    set((state) => ({
      variations: state.variations.map((v) =>
        v.id === id
          ? {
              ...v,
              status,
              ...(approverComments ? { approverComments } : {}),
              approvalDate: status === 'approved' ? new Date().toISOString().slice(0, 10) : v.approvalDate,
            }
          : v
      ),
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Client Representative',
      userRole: get().currentUser?.role || 'management',
      action: status === 'approved' ? 'APPROVE' : 'UPDATE',
      module: 'Projects > Variations',
      recordRef: `Variation Order ${id}`,
      newValue: `Status changed to ${status}. Notes: ${approverComments || 'No notes'}`,
      ipAddress: '192.168.1.10',
      badgeVariant: status === 'approved' ? 'success' : 'danger',
    });
  },

  updateTaskStatus: (id, status) => {
    set((state) => ({
      projectTasks: state.projectTasks.map((t) =>
        t.id === id ? { ...t, status, progress: status === 'completed' ? 100 : t.progress } : t
      ),
    }));
  },

  addProjectTask: (data) => {
    const newTask: ProjectTask = {
      ...data,
      id: `TSK-${Date.now().toString().slice(-6)}`,
    };

    set((state) => ({
      projectTasks: [newTask, ...state.projectTasks],
    }));

    return newTask;
  },

  updateHandover: (projectId, updates) => {
    set((state) => ({
      handovers: {
        ...state.handovers,
        [projectId]: {
          ...(state.handovers[projectId] || {
            projectId,
            currentStage: 'snag_clearing',
            snagsTotal: 0,
            snagsResolved: 0,
            asBuiltDrawingsApproved: false,
            oAndMManualSubmitted: false,
            dlpPeriodMonths: 12,
            statutoryNocReceived: false,
            virtualCompletionCertificateIssued: false,
            retentionMoneyReleased: false,
            clientSignoffDate: '',
          }),
          ...updates,
        },
      },
    }));

    get().addAuditLogEntry({
      userId: get().currentUser?.id || 'SYS',
      userName: get().currentUser?.name || 'Contracts & Handover Team',
      userRole: get().currentUser?.role || 'project_manager',
      action: 'UPDATE',
      module: 'Projects > Handover & Snagging',
      recordRef: `Project Handover: ${projectId}`,
      newValue: `Updated milestone state: ${Object.keys(updates).join(', ')}`,
      ipAddress: '192.168.1.10',
      badgeVariant: 'info',
    });
  },

  // ─── Part 5 Actions ───────────────────────────────────────────────────────

  createPR: (data) => {
    const count = get().purchaseRequisitions.length + 1;
    const pr: PurchaseRequisition = {
      ...data,
      id: `PR-${String(count + 100).padStart(3, '0')}`,
      prNumber: `PR/2026-27/${String(count + 10).padStart(3, '0')}`,
      raisedDate: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    set((state) => ({ purchaseRequisitions: [pr, ...state.purchaseRequisitions] }));
    return pr;
  },

  updatePRStatus: (id, status, approvedBy, rejectionReason) => {
    set((state) => ({
      purchaseRequisitions: state.purchaseRequisitions.map((pr) =>
        pr.id === id
          ? {
              ...pr,
              status,
              ...(approvedBy ? { approvedBy, approvedDate: new Date().toISOString().split('T')[0] } : {}),
              ...(rejectionReason ? { rejectionReason } : {}),
            }
          : pr
      ),
    }));
  },

  createRFQ: (data) => {
    const count = get().rfqs.length + 1;
    const rfq: RFQ = {
      ...data,
      id: `RFQ-${String(count + 100).padStart(3, '0')}`,
      rfqNumber: `RFQ/2026-27/${String(count + 8).padStart(3, '0')}`,
      createdDate: new Date().toISOString().split('T')[0],
      vendorQuotes: [],
      status: 'sent',
    };
    set((state) => ({ rfqs: [rfq, ...state.rfqs] }));
    // Mark linked PR as converted
    get().updatePRStatus(data.prId, 'converted_rfq');
    return rfq;
  },

  addVendorQuoteToRFQ: (rfqId, quote) => {
    set((state) => ({
      rfqs: state.rfqs.map((r) =>
        r.id === rfqId
          ? { ...r, vendorQuotes: [...r.vendorQuotes, quote], status: 'quotes_received' as const }
          : r
      ),
    }));
  },

  selectVendorForRFQ: (rfqId, vendorId) => {
    set((state) => ({
      rfqs: state.rfqs.map((r) =>
        r.id === rfqId
          ? {
              ...r,
              selectedVendorId: vendorId,
              status: 'pending_approval' as const,
              vendorQuotes: r.vendorQuotes.map((q) => ({ ...q, isSelected: q.vendorId === vendorId })),
            }
          : r
      ),
    }));
  },

  approveRFQ: (rfqId, approvedBy) => {
    set((state) => ({
      rfqs: state.rfqs.map((r) =>
        r.id === rfqId
          ? { ...r, status: 'approved' as const, approvedBy, approvalDate: new Date().toISOString().split('T')[0] }
          : r
      ),
    }));
  },

  createPO: (data) => {
    const count = get().purchaseOrders.length + 1;
    const po: PurchaseOrder = {
      ...data,
      id: `PO-${String(count + 100).padStart(3, '0')}`,
      poNumber: `PO/2026-27/${String(count + 10).padStart(3, '0')}`,
      linkedGRNIds: [],
    };
    set((state) => ({ purchaseOrders: [po, ...state.purchaseOrders] }));
    // Mark linked RFQ as converted
    if (data.rfqId) {
      set((state) => ({
        rfqs: state.rfqs.map((r) =>
          r.id === data.rfqId ? { ...r, status: 'converted_po' as const, linkedPOId: po.id } : r
        ),
      }));
    }
    return po;
  },

  updatePOStatus: (id, status) => {
    set((state) => ({
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === id ? { ...po, status } : po
      ),
    }));
  },

  createGRN: (data) => {
    const count = get().grnEntries.length + 1;
    const grn: GRNEntry = {
      ...data,
      id: `GRN-${String(count + 100).padStart(3, '0')}`,
      grnNumber: `GRN/2026-27/${String(count + 5).padStart(3, '0')}`,
    };
    set((state) => ({
      grnEntries: [grn, ...state.grnEntries],
      // Link GRN to PO
      purchaseOrders: state.purchaseOrders.map((po) =>
        po.id === data.poId
          ? { ...po, linkedGRNIds: [...po.linkedGRNIds, grn.id], status: 'partially_received' as const }
          : po
      ),
    }));
    // Auto-update material stock for each accepted line item
    grn.lineItems.forEach((item) => {
      get().updateMaterialStock(item.materialId, item.acceptedQty);
    });
    return grn;
  },

  updateMaterialStock: (materialId, delta) => {
    set((state) => ({
      materials: state.materials.map((m) =>
        m.id === materialId ? { ...m, currentStock: Math.max(0, m.currentStock + delta) } : m
      ),
    }));
  },

  addStockTransaction: (data) => {
    const tx: StockTransaction = {
      ...data,
      id: `ST-${Date.now().toString().slice(-6)}`,
    };
    set((state) => ({ stockTransactions: [tx, ...state.stockTransactions] }));
    // Reflect in material stock
    const delta = data.type === 'inward' || data.type === 'transfer_in' ? data.quantity : -data.quantity;
    get().updateMaterialStock(data.materialId, delta);
  },

  updateStockLedger: (siteId, materialId, updates) => {
    set((state) => ({
      stockLedger: state.stockLedger.map((sl) =>
        sl.siteId === siteId && sl.materialId === materialId ? { ...sl, ...updates } : sl
      ),
    }));
  },

  // Part 7 Finance Actions
  createRABill: (data) => {
    const count = get().raBills.length + 1;
    const project = get().projects.find((p) => p.id === data.projectId);
    const newBill: RABill = {
      id: `RA-${Date.now().toString().slice(-6)}`,
      billNumber: data.billNumber || `RA-0${count}/${project?.code || 'PRJ'}/2026-27`,
      raSequence: data.raSequence || count,
      projectId: data.projectId || 'PRJ-001',
      projectName: project?.name || 'Project Superstructure',
      clientId: project?.clientId || 'CLI-001',
      clientName: project?.clientName || 'Client Ltd',
      contractValue: project?.contractValue || 100000000,
      billDate: data.billDate || new Date().toISOString().split('T')[0],
      periodFrom: data.periodFrom || '2026-09-01',
      periodTo: data.periodTo || '2026-09-20',
      status: 'draft',
      statusHistory: [
        {
          status: 'draft',
          date: new Date().toLocaleString(),
          updatedBy: 'Amit Patel (Site Engineer)',
          remarks: 'Draft RA bill generated from verified Measurement Book',
        },
      ],
      items: data.items || [],
      previousBillGross: data.previousBillGross || 0,
      currentBillGross: data.currentBillGross || 0,
      cumulativeGross: (data.previousBillGross || 0) + (data.currentBillGross || 0),
      retentionPct: data.retentionPct ?? 5,
      retentionDeductionCurrent: data.retentionDeductionCurrent || 0,
      retentionCumulative: data.retentionCumulative || 0,
      advanceRecoveryPct: data.advanceRecoveryPct ?? 10,
      advanceRecoveryCurrent: data.advanceRecoveryCurrent || 0,
      advanceRecoveryCumulative: data.advanceRecoveryCumulative || 0,
      otherDeductions: data.otherDeductions || [],
      totalOtherDeductionsCurrent: data.totalOtherDeductionsCurrent || 0,
      totalOtherDeductionsCumulative: data.totalOtherDeductionsCumulative || 0,
      gstRatePct: data.gstRatePct || get().erpSettings.companyGstRate || 18,
      gstAmountCurrent: data.gstAmountCurrent || 0,
      gstAmountCumulative: data.gstAmountCumulative || 0,
      netPayableCurrent: data.netPayableCurrent || 0,
      netPayableCumulative: data.netPayableCumulative || 0,
      amountReceived: 0,
      outstandingAmount: data.netPayableCurrent || 0,
      dueDate: data.dueDate || '2026-10-25',
      mbEntryIds: data.mbEntryIds || [],
    };
    set((state) => ({ raBills: [newBill, ...state.raBills] }));
    return newBill;
  },

  updateRABillStatus: (id, status, remarks, verifiedByName) => {
    set((state) => ({
      raBills: state.raBills.map((b) => {
        if (b.id !== id) return b;
        const now = new Date().toLocaleString();
        const user = verifiedByName || state.currentUser?.name || 'Authorized Officer';
        const newHistory = [
          ...b.statusHistory,
          { status, date: now, updatedBy: user, remarks: remarks || `Status transitioned to ${status}` },
        ];
        const updates: Partial<RABill> = { status, statusHistory: newHistory };
        if (status === 'engineer_verified') updates.verifiedByEngineer = user;
        if (status === 'qs_verified') updates.verifiedByQS = user;
        if (status === 'manager_approved') updates.approvedByManager = user;
        if (status === 'approved' || status === 'paid') {
          updates.clientApprovalDate = new Date().toISOString().split('T')[0];
          if (!b.eInvoice) {
            updates.eInvoice = {
              irn: `einv_${Date.now().toString(16)}89104820194820194820194820`,
              ackNo: `1426${Date.now().toString().slice(-7)}`,
              ackDate: `${new Date().toISOString().split('T')[0]} 12:00:00`,
              qrCodeMock: `BUILDOS-EINV-${b.billNumber}`,
              status: 'generated',
            };
          }
        }
        if (status === 'paid') {
          updates.amountReceived = b.netPayableCurrent;
          updates.outstandingAmount = 0;
          updates.paymentDate = new Date().toISOString().split('T')[0];
        }
        return { ...b, ...updates };
      }),
    }));
  },

  addExpense: (data) => {
    const count = get().expenses.length + 1;
    const newExp: ExpenseEntry = {
      ...data,
      id: `EXP-${Date.now().toString().slice(-6)}`,
      expenseNumber: `EXP/26/${String(count + 90).padStart(3, '0')}`,
    };
    set((state) => ({ expenses: [newExp, ...state.expenses] }));
    return newExp;
  },

  addPettyCashEntry: (siteId, entry) => {
    const ledger = get().pettyCashLedgers[siteId] || {
      siteId,
      siteName: `${siteId} Imprest`,
      custodianName: 'Site Supervisor',
      imprestLimit: 100000,
      currentBalance: 50000,
      lastReplenishmentDate: new Date().toISOString().split('T')[0],
      entries: [],
    };
    const count = ledger.entries.length + 1;
    const newBal = entry.type === 'in' ? ledger.currentBalance + entry.amount : ledger.currentBalance - entry.amount;
    const newEntry: PettyCashEntry = {
      ...entry,
      id: `PC-${Date.now().toString().slice(-6)}`,
      voucherNo: `PC/${siteId.replace('PRJ-', '')}/${String(count + 80).padStart(3, '0')}`,
      siteId,
      siteName: ledger.siteName,
      runningBalance: newBal,
    };
    set((state) => ({
      pettyCashLedgers: {
        ...state.pettyCashLedgers,
        [siteId]: {
          ...ledger,
          currentBalance: newBal,
          lastReplenishmentDate: entry.type === 'in' ? entry.date : ledger.lastReplenishmentDate,
          entries: [newEntry, ...ledger.entries],
        },
      },
    }));
    return newEntry;
  },

  recordPaymentReceipt: (data) => {
    const count = get().financialTransactions.length + 1;
    const prefix = data.type === 'receipt' ? 'REC' : 'PAY';
    const tx: FinancialTransaction = {
      ...data,
      id: `TXN-${Date.now().toString().slice(-6)}`,
      txNumber: `${prefix}/26/${String(count + 180).padStart(3, '0')}`,
    };
    set((state) => ({ financialTransactions: [tx, ...state.financialTransactions] }));
    return tx;
  },

  updateErpSettings: (updates) => {
    set((state) => ({
      erpSettings: { ...state.erpSettings, ...updates },
    }));
  },

  setCompanyGstRate: (rate) => {
    set((state) => ({
      erpSettings: { ...state.erpSettings, companyGstRate: rate },
      companyProfile: { ...state.companyProfile, defaultGstRate: rate },
    }));
  },

  // Part 8 Actions
  createSafetyIncident: (data) => {
    const count = get().safetyIncidents.length + 1;
    const item: SafetyIncident = {
      ...data,
      id: `INC-${Date.now().toString().slice(-6)}`,
      code: `INC-2026-${String(count + 10).padStart(3, '0')}`,
      daysOpen: 0,
    };
    set((state) => ({ safetyIncidents: [item, ...state.safetyIncidents] }));
    return item;
  },

  updateIncidentStage: (id, stage, details) => {
    set((state) => ({
      safetyIncidents: state.safetyIncidents.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              stage,
              ...details,
              closedDate: stage === 'closed' ? new Date().toISOString().split('T')[0] : inc.closedDate,
            }
          : inc
      ),
    }));
  },

  addPPECheck: (data) => {
    const item: PPEComplianceRecord = {
      ...data,
      id: `PPE-${Date.now().toString().slice(-6)}`,
    };
    set((state) => ({ ppeChecks: [item, ...state.ppeChecks] }));
    return item;
  },

  addNearMissLog: (data) => {
    const count = get().nearMissLogs.length + 1;
    const item: NearMissLog = {
      ...data,
      id: `NM-${Date.now().toString().slice(-6)}`,
      code: `NM-2026-${String(count + 15).padStart(3, '0')}`,
    };
    set((state) => ({ nearMissLogs: [item, ...state.nearMissLogs] }));
    return item;
  },

  addToolboxMeeting: (data) => {
    const count = get().toolboxMeetings.length + 1;
    const item: ToolboxMeeting = {
      ...data,
      id: `TBM-${Date.now().toString().slice(-6)}`,
      code: `TBM-2026-${String(count + 90).padStart(3, '0')}`,
    };
    set((state) => ({ toolboxMeetings: [item, ...state.toolboxMeetings] }));
    return item;
  },

  createQAQCInspection: (data) => {
    const count = get().qaqcInspections.length + 1;
    const item: QAQCInspection = {
      ...data,
      id: `QAQC-${Date.now().toString().slice(-6)}`,
      reportNumber: `QA/${data.inspectionType.toUpperCase()}/2026-${String(count + 120).padStart(3, '0')}`,
    };
    set((state) => ({ qaqcInspections: [item, ...state.qaqcInspections] }));
    return item;
  },

  createNCR: (data) => {
    const count = get().ncrs.length + 1;
    const item: NonConformanceReport = {
      ...data,
      id: `NCR-${Date.now().toString().slice(-6)}`,
      ncrNumber: `NCR/${data.trade.toUpperCase().slice(0, 3)}/2026-${String(count + 20).padStart(3, '0')}`,
    };
    set((state) => ({ ncrs: [item, ...state.ncrs] }));
    return item;
  },

  updateNCRStage: (id, stage, details) => {
    set((state) => ({
      ncrs: state.ncrs.map((ncr) =>
        ncr.id === id
          ? {
              ...ncr,
              stage,
              ...details,
              status: stage === 'closed' ? 'closed' : 'open',
            }
          : ncr
      ),
    }));
  },

  addRepoDocument: (data) => {
    const count = get().repoDocuments.length + 1;
    const item: RepoDocument = {
      ...data,
      id: `DOC-${Date.now().toString().slice(-6)}`,
      docNumber: `DOC/2026/${String(count + 10).padStart(3, '0')}`,
      uploadedDate: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ repoDocuments: [item, ...state.repoDocuments] }));
    return item;
  },

  addDrawingRevision: (drawingId, version) => {
    set((state) => ({
      drawingRegister: state.drawingRegister.map((drg) => {
        if (drg.id !== drawingId) return drg;
        const updatedVersions = [
          version,
          ...drg.versions.map((v) => ({ ...v, status: 'superseded' as const })),
        ];
        return {
          ...drg,
          currentRevision: version.version,
          uploadedDate: version.uploadedDate,
          status: version.status,
          approvedDate: version.approvedDate,
          versions: updatedVersions,
        };
      }),
    }));
  },

  createSiteInstruction: (data) => {
    const count = get().siteInstructions.length + 1;
    const item: SiteInstruction = {
      ...data,
      id: `SI-${Date.now().toString().slice(-6)}`,
      instructionNumber: `SI/2026/${String(count + 50).padStart(3, '0')}`,
    };
    set((state) => ({ siteInstructions: [item, ...state.siteInstructions] }));
    return item;
  },

  updateSiteInstructionStatus: (id, status) => {
    set((state) => ({
      siteInstructions: state.siteInstructions.map((si) =>
        si.id === id ? { ...si, status } : si
      ),
    }));
  },

  createMeetingRecord: (data) => {
    const count = get().meetingRecords.length + 1;
    const item: MeetingRecord = {
      ...data,
      id: `MOM-${Date.now().toString().slice(-6)}`,
      meetingNumber: `MOM/${data.type.toUpperCase()}/2026-${String(count + 40).padStart(3, '0')}`,
    };
    set((state) => ({ meetingRecords: [item, ...state.meetingRecords] }));
    return item;
  },

  updateMinuteStatus: (meetingId, minuteId, status) => {
    set((state) => ({
      meetingRecords: state.meetingRecords.map((m) =>
        m.id === meetingId
          ? {
              ...m,
              minutes: m.minutes.map((min) =>
                min.id === minuteId ? { ...min, status } : min
              ),
            }
          : m
      ),
    }));
  },

  createSnagItem: (data) => {
    const count = get().snagItems.length + 1;
    const item: SnagItem = {
      ...data,
      id: `SNG-${Date.now().toString().slice(-6)}`,
      snagNumber: `SNG/${String(count + 3600)}`,
      reportedDate: new Date().toISOString().split('T')[0],
    };
    set((state) => ({ snagItems: [item, ...state.snagItems] }));
    return item;
  },

  updateSnagStatus: (id, status, notes, verifiedBy) => {
    set((state) => ({
      snagItems: state.snagItems.map((s) =>
        s.id === id
          ? {
              ...s,
              status,
              resolutionNotes: notes || s.resolutionNotes,
              verifiedBy: verifiedBy || s.verifiedBy,
              verifiedDate: status === 'verified' ? new Date().toISOString().split('T')[0] : s.verifiedDate,
            }
          : s
      ),
    }));
  },

  markStaffAttendance: (empId, status, checkIn, checkOut) => {
    const emp = get().salariedEmployees.find((e) => e.id === empId);
    const today = new Date().toISOString().split('T')[0];
    const existing = get().staffAttendance.find((a) => a.empId === empId && a.date === today);
    if (existing) {
      set((state) => ({
        staffAttendance: state.staffAttendance.map((a) =>
          a.id === existing.id ? { ...a, status, checkIn: checkIn || a.checkIn, checkOut: checkOut || a.checkOut } : a
        ),
      }));
    } else {
      const record: StaffAttendanceDay = {
        id: `ATT-${Date.now().toString().slice(-6)}`,
        empId,
        empName: emp?.name || 'Staff Member',
        date: today,
        checkIn: checkIn || '09:00 AM',
        checkOut: checkOut || '06:00 PM',
        status,
        otHours: 0,
        location: 'Site / Head Office',
      };
      set((state) => ({ staffAttendance: [record, ...state.staffAttendance] }));
    }
  },

  applyLeaveRequest: (data) => {
    const item: LeaveRequest = {
      ...data,
      id: `LR-${Date.now().toString().slice(-6)}`,
      appliedOn: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    set((state) => ({ leaveRequests: [item, ...state.leaveRequests] }));
    return item;
  },

  updateLeaveStatus: (id, status, approverRemarks) => {
    set((state) => ({
      leaveRequests: state.leaveRequests.map((lr) =>
        lr.id === id
          ? {
              ...lr,
              status,
              approverRemarks,
              approvedBy: state.currentUser?.name || 'HR Manager',
            }
          : lr
      ),
    }));
  },

  generateMonthlyPayslip: (empId, month) => {
    const emp = get().salariedEmployees.find((e) => e.id === empId);
    const base = emp?.baseSalary || 100000;
    const basic = Math.round(base * 0.5);
    const hra = Math.round(base * 0.25);
    const allowances = Math.round(base * 0.25);
    const pf = Math.round(basic * 0.12);
    const pt = 200;
    const tds = Math.round(base * 0.1);
    const totalDed = pf + pt + tds;
    const net = base - totalDed;
    const count = get().payslips.length + 1;

    const payslip: MonthlyPayslip = {
      id: `PS-${Date.now().toString().slice(-6)}`,
      payslipNumber: `PAY/2026/${String(count + 10).padStart(3, '0')}`,
      empId,
      empName: emp?.name || 'Staff',
      designation: emp?.designation || 'Engineer',
      department: emp?.department || 'Operations',
      month,
      bankAccount: emp?.bankAccount || '•••• 1234',
      pan: emp?.pan || 'AAAAA0000A',
      presentDays: 26,
      payableDays: 30,
      otHours: 0,
      basicSalary: basic,
      hra,
      allowances,
      otPay: 0,
      incentives: 0,
      grossSalary: base,
      pfDeduction: pf,
      ptDeduction: pt,
      tdsDeduction: tds,
      advances: 0,
      totalDeductions: totalDed,
      netSalary: net,
      status: 'approved',
      disbursedDate: new Date().toISOString().split('T')[0],
    };

    set((state) => ({ payslips: [payslip, ...state.payslips] }));
    return payslip;
  },

  updateComplianceItem: (id, updates) => {
    set((state) => ({
      legalComplianceItems: state.legalComplianceItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  },

  resetDemoData: () => {
    set({
      employees: [...SEED_EMPLOYEES],
      branches: [...SEED_BRANCHES],
      clients: [...SEED_CLIENTS],
      notifications: [...SEED_NOTIFICATIONS],
      companyProfile: { ...SEED_COMPANY_PROFILE },
      bankAccounts: [...SEED_BANK_ACCOUNTS],
      departments: [...SEED_DEPARTMENTS],
      costCenters: [...SEED_COST_CENTERS],
      projectLocations: [...SEED_PROJECT_LOCATIONS],
      companyDocuments: [...SEED_COMPANY_DOCUMENTS],
      systemUsers: [...SEED_SYSTEM_USERS],
      permissionMatrix: JSON.parse(JSON.stringify(DEFAULT_PERMISSION_MAP)),
      auditLogs: [...SEED_AUDIT_LOGS],
      leads: [...SEED_LEADS],
      siteVisits: [...SEED_SITE_VISITS],
      followUps: [...SEED_FOLLOW_UPS],
      estimates: [...SEED_ESTIMATES],
      boqs: [...SEED_BOQS],
      boqTemplates: [...SEED_BOQ_TEMPLATES],
      rateMaster: [...SEED_RATE_MASTER],
      quotations: [...SEED_QUOTATIONS],
      tenders: [...SEED_TENDERS],
      contracts: [...SEED_CONTRACTS],
      projects: [...SEED_PROJECTS],
      wbsTasks: [...SEED_WBS_TASKS],
      projectTasks: [...SEED_TASKS],
      dprs: [...SEED_DPRS],
      sitePhotos: [...SEED_SITE_PHOTOS],
      mbEntries: [...SEED_MB_ENTRIES],
      rfis: [...SEED_RFIS],
      variations: [...SEED_VARIATIONS],
      handovers: { ...SEED_HANDOVERS },
      materials: [...materialsSeed],
      vendors: [...vendorsSeed],
      purchaseRequisitions: [...purchaseRequisitionsSeed],
      rfqs: [...rfqsSeed],
      purchaseOrders: [...purchaseOrdersSeed],
      grnEntries: [...grnEntriesSeed],
      stockLedger: [...stockLedgerSeed],
      stockTransactions: [...stockTransactionsSeed],
      raBills: [...SEED_RA_BILLS],
      projectCostings: { ...SEED_PROJECT_COSTINGS },
      customerReceivables: [...SEED_CUSTOMER_RECEIVABLES],
      vendorPayables: [...SEED_VENDOR_PAYABLES],
      expenses: [...SEED_EXPENSES],
      pettyCashLedgers: { ...SEED_PETTY_CASH_LEDGERS },
      financialTransactions: [...SEED_PAYMENTS_RECEIPTS],
      journalEntries: [...SEED_JOURNAL_ENTRIES],
      erpSettings: { ...SEED_ERP_INTEGRATION_SETTINGS },
      safetyIncidents: [...SEED_SAFETY_INCIDENTS],
      ppeChecks: [...SEED_PPE_CHECKS],
      safetyInspections: [...SEED_SAFETY_INSPECTIONS],
      nearMissLogs: [...SEED_NEAR_MISS_LOGS],
      toolboxMeetings: [...SEED_TOOLBOX_MEETINGS],
      safetyTrainings: [...SEED_SAFETY_TRAININGS],
      siteAudits: [...SEED_SITE_AUDITS],
      qaqcInspections: [...SEED_QAQC_INSPECTIONS],
      ncrs: [...SEED_NCRS],
      repoDocuments: [...SEED_DOCUMENTS_REPO],
      drawingRegister: [...SEED_DRAWING_REGISTER],
      siteInstructions: [...SEED_SITE_INSTRUCTIONS],
      meetingRecords: [...SEED_MEETING_RECORDS],
      snagItems: [...SEED_SNAG_ITEMS],
      salariedEmployees: [...SEED_SALARIED_EMPLOYEES],
      staffAttendance: [...SEED_STAFF_ATTENDANCE],
      leaveRequests: [...SEED_LEAVE_REQUESTS],
      leaveBalances: { ...SEED_LEAVE_BALANCES },
      payslips: [...SEED_PAYSLIPS],
      legalComplianceItems: [...SEED_LEGAL_COMPLIANCE],
    });
  },
}));

