export type UserRole =
  | 'super_admin'
  | 'management'
  | 'project_manager'
  | 'site_engineer'
  | 'civil_engineer'
  | 'purchase_manager'
  | 'store_manager'
  | 'accounts'
  | 'hr'
  | 'sales'
  | 'estimation_engineer'
  | 'qs'
  | 'safety_officer'
  | 'client'
  | 'subcontractor'
  | 'admin';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  phone: string;
  avatar?: string;
  branchId: string;
  branchName: string;
  assignedProjects?: string[];
  status?: 'active' | 'inactive';
  lastLogin?: string;
  avatarColor?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string;
  department: string;
  branchId: string;
  branchName: string;
  status: 'active' | 'on_leave' | 'inactive';
  joinedDate: string;
  avatarColor: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  isHQ: boolean;
  activeProjectsCount: number;
  managerName: string;
  phone?: string;
  email?: string;
}

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: 'Current' | 'Overdraft / CC' | 'Escrow' | 'Savings';
  ifscCode: string;
  branchAddress: string;
  isPrimary: boolean;
  balanceFormatted?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  staffCount: number;
  description: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  branchId: string;
  branchName: string;
  annualBudget: number;
  utilizedAmount: number;
  status: 'active' | 'locked';
}

export interface ProjectLocation {
  id: string;
  name: string;
  code: string;
  city: string;
  state: string;
  address: string;
  geoCoordinates?: string;
  activeSiteCount: number;
}

export interface CompanyDocument {
  id: string;
  title: string;
  category: 'Registration' | 'Labor Compliance' | 'Taxation' | 'Safety / Environmental' | 'Certification';
  documentNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  daysToExpiry: number;
  fileSize: string;
  fileType: 'pdf' | 'jpg';
  status: 'valid' | 'expiring_soon' | 'expired';
}

export interface CompanyProfile {
  name: string;
  tradeName: string;
  tagline: string;
  gstin: string;
  pan: string;
  cin: string;
  msmeNumber: string;
  incorporationDate: string;
  registeredAddress: string;
  corporateAddress: string;
  phone: string;
  email: string;
  website: string;
  logoUrl?: string;
  defaultGstRate?: number;
  erpIntegration?: ErpIntegrationSettings;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  status: 'active' | 'prospect' | 'inactive' | 'lead';
  segment: 'Commercial' | 'Residential' | 'Infrastructure' | 'Industrial' | 'Government';
  totalProjects: number;
  totalContractValue: number;
  outstandingBalance: number;
  primaryContactPerson: string;
}

export type PermissionAction =
  | 'create'
  | 'view'
  | 'edit'
  | 'delete'
  | 'approve'
  | 'export'
  | 'download';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userAvatarColor?: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'EXPORT' | 'LOGIN';
  module: string;
  recordRef: string;
  oldValue?: string;
  newValue: string;
  timestamp: string;
  relativeTime: string;
  ipAddress: string;
  badgeVariant: StatusVariant;
}

// ----------------------------------------------------
// PART 2: CRM TYPES
// ----------------------------------------------------

export type LeadStage =
  | 'new_lead'
  | 'contacted'
  | 'requirement_collected'
  | 'site_visit'
  | 'estimation'
  | 'quotation'
  | 'negotiation'
  | 'approved'
  | 'contract'
  | 'won'
  | 'lost';

export type LeadSource =
  | 'Website'
  | 'Google Ads'
  | 'Facebook'
  | 'Instagram'
  | 'Justdial'
  | 'IndiaMART'
  | 'Referral'
  | 'Exhibition'
  | 'Direct Enquiry'
  | 'Existing Client';

export type ProjectType =
  | 'Residential'
  | 'Commercial'
  | 'Industrial'
  | 'Renovation'
  | 'Infrastructure';

export interface LeadActivity {
  id: string;
  type: 'call' | 'note' | 'email' | 'whatsapp' | 'site_visit' | 'status_change';
  title: string;
  notes: string;
  timestamp: string;
  relativeTime: string;
  authorName: string;
  authorRole?: string;
}

export interface Lead {
  id: string;
  customerName: string;
  mobile: string;
  email: string;
  company?: string;
  location: string;
  projectType: ProjectType;
  landArea: string;
  builtUpArea: string;
  budget: number; // in INR
  expectedStartDate: string;
  notes: string;
  source: LeadSource;
  assignedSalesperson: string;
  salespersonId: string;
  stage: LeadStage;
  daysInStage: number;
  createdDate: string;
  lostReason?: 'Budget' | 'Timeline' | 'Competitor' | 'Not Serious' | 'Other';
  lostNotes?: string;
  activities: LeadActivity[];
  siteVisitId?: string;
  nextFollowUpDate?: string;
}

export interface SiteVisit {
  id: string;
  leadId: string;
  leadName: string;
  customerName: string;
  customerPhone: string;
  siteLocation: string;
  city: string;
  geoCoordinates: string;
  landDimensions: string;
  soilType: string;
  roadAccess: boolean;
  electricityAccess: boolean;
  waterSource: 'Municipal' | 'Borewell' | 'Water Tanker' | 'None';
  existingStructureNotes: string;
  siteConstraints: string;
  photos: string[];
  status: 'scheduled' | 'completed' | 'submitted' | 'approved';
  assignedEngineer: string;
  visitDate: string;
  visitTime?: string;
  engineerRemarks?: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  customerName: string;
  customerPhone: string;
  projectTitle: string;
  actionType: 'Call' | 'Meeting' | 'WhatsApp' | 'Email' | 'Site Inspection';
  dueDate: string;
  dueTime: string;
  status: 'pending' | 'completed' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  notes: string;
  assignedTo: string;
}

export interface NavSubItem {
  id: string;
  label: string;
  path: string;
  count?: number | string;
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  badge?: string | number;
  badgeVariant?: StatusVariant;
  category?: string;
  children?: NavSubItem[];
  roles?: UserRole[];
  priorityForRoles?: UserRole[];
}

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (item: T, index: number) => React.ReactNode;
  mobilePriority?: 'high' | 'medium' | 'low';
}

export interface StatMetric {
  id: string;
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  isPositive?: boolean;
  subtext?: string;
  icon?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'approval' | 'system' | 'milestone';
  link?: string;
}

// ----------------------------------------------------
// PART 3: ESTIMATION, BOQ, QUOTATION, TENDER & CONTRACT TYPES
// ----------------------------------------------------

export interface EstimateLineItem {
  id: string;
  category: 'Material' | 'Labour' | 'Equipment' | 'Transport' | 'Overhead';
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Estimate {
  id: string;
  estimateNumber: string;
  title: string;
  leadId?: string;
  leadName?: string;
  projectName: string;
  projectType: ProjectType;
  builtUpArea: string; // e.g. "4,20,000 sq.ft"
  structureType: 'RCC Framed' | 'Steel PEB' | 'Composite Structural' | 'Modular Prefab';
  notes: string;
  materialCost: number;
  labourCost: number;
  equipmentCost: number;
  transportCost: number;
  overheadCost: number;
  profitMarginPct: number;
  profitAmount: number;
  subtotal: number;
  gstPct: number;
  gstAmount: number;
  totalEstimateValue: number;
  lineItems: EstimateLineItem[];
  status: 'draft' | 'under_review' | 'approved' | 'converted';
  createdDate: string;
  estimatorName: string;
  version: string;
}

export interface BOQItem {
  id: string;
  category: 'Civil Works' | 'Structural & Steel' | 'Electrical' | 'Plumbing & Sanitary' | 'Finishes & Joinery';
  itemCode: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  remarks?: string;
}

export interface BOQ {
  id: string;
  boqNumber: string;
  title: string;
  projectType: ProjectType;
  estimateId?: string;
  leadId?: string;
  items: BOQItem[];
  wastagePct: number;
  contingencyPct: number;
  profitPct: number;
  gstPct: number;
  subtotal: number;
  grandTotal: number;
  templateName?: string;
  status: 'draft' | 'approved' | 'finalized';
  createdDate: string;
}

export interface BOQTemplate {
  id: string;
  name: string;
  description: string;
  projectType: ProjectType;
  items: Omit<BOQItem, 'id' | 'amount'>[];
}

export interface RatePricePoint {
  date: string;
  rate: number;
  changePct: number;
  source: string;
}

export interface RateItem {
  id: string;
  code: string;
  name: string;
  category:
    | 'Cement & Concrete'
    | 'Steel & Metals'
    | 'Aggregates & Masonry'
    | 'Labour & Masons'
    | 'Equipment & Plant'
    | 'Finishes & Woodwork'
    | 'Plumbing & Electrical';
  unit: string;
  currentRate: number;
  lastUpdated: string;
  supplier: string;
  specification: string;
  rateHistory: RatePricePoint[];
}

export interface QuotationVersion {
  versionNumber: string;
  date: string;
  amount: number;
  changesSummary: string;
  author: string;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  leadId?: string;
  estimateId?: string;
  boqId?: string;
  customerName: string;
  companyName?: string;
  projectTitle: string;
  location: string;
  date: string;
  validityDays: number;
  version: string;
  versionsList: QuotationVersion[];
  subtotal: number;
  gstAmount: number;
  grandTotal: number;
  paymentTerms: string[];
  exclusions: string[];
  warranty: string;
  deliveryTimeline: string;
  status: 'draft' | 'sent' | 'negotiation' | 'accepted' | 'rejected' | 'expired';
  signedBy?: string;
  signedAt?: string;
}

export interface TenderChecklistItem {
  id: string;
  criterion: string;
  compliant: boolean;
  remarks: string;
}

export interface TenderDocumentItem {
  id: string;
  document: string;
  uploaded: boolean;
  status: 'verified' | 'pending';
}

export interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  authorityName: string;
  portalUrl?: string;
  deadlineDate: string;
  deadlineTime: string;
  emdAmount: number;
  tenderFee: number;
  estimatedBudget: number;
  bidValue: number;
  status: 'received' | 'evaluating' | 'estimation' | 'management_approval' | 'submitted' | 'won' | 'lost';
  eligibilityChecklist: TenderChecklistItem[];
  technicalChecklist: TenderDocumentItem[];
  documents: { name: string; size: string; type: string }[];
  assignedLeadId?: string;
  wonContractId?: string;
}

export interface PaymentMilestone {
  id: string;
  milestoneName: string;
  percentage: number;
  amount: number;
  dueDate: string;
  status: 'pending' | 'invoiced' | 'paid';
}

export interface Contract {
  id: string;
  contractNumber: string;
  title: string;
  clientName: string;
  clientId?: string;
  leadId?: string;
  tenderId?: string;
  estimateId?: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'under_review' | 'signed' | 'active' | 'closed';
  advancePct: number;
  retentionPct: number;
  penaltyClause: string;
  warrantyPeriodMonths: number;
  scopeSummary: string;
  exclusions: string[];
  paymentMilestones: PaymentMilestone[];
  documents: { name: string; size: string; category: string }[];
  convertedProjectId?: string;
}

// ----------------------------------------------------
// PART 4: CORE PROJECT MANAGEMENT TYPES
// ----------------------------------------------------

export type ProjectHealth = 'on_track' | 'at_risk' | 'delayed';
export type ProjectStatus = 'planning' | 'active' | 'in_progress' | 'on_hold' | 'handover' | 'completed';

export interface Project {
  id: string;
  name: string;
  code: string;
  clientId?: string;
  clientName: string;
  contractId?: string;
  location: string;
  city?: string;
  projectManager: string;
  siteEngineer: string;
  startDate: string;
  expectedEndDate: string;
  contractValue: number;
  budget: number;
  actualCost: number;
  completionPercentage?: number;
  plannedPercentage?: number;
  completionPct?: number;
  plannedPct?: number;
  health: ProjectHealth;
  delayDays: number;
  status: ProjectStatus;
  projectType?: ProjectType;
  coverImage?: string;
  description?: string;
  currentPhase?: string;
}

export type WBSPhase =
  | 'Foundation & Earthwork'
  | 'Substructure'
  | 'Superstructure'
  | 'Roofing & Facade'
  | 'MEP Services'
  | 'Finishes & Joinery'
  | 'Handover & Testing'
  | string;

export interface WBSTask {
  id: string;
  projectId: string;
  wbsCode?: string;
  name: string;
  phase?: WBSPhase;
  plannedStartDate?: string;
  plannedEndDate?: string;
  plannedStart?: string;
  plannedEnd?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  actualStart?: string;
  actualEnd?: string;
  progress?: number;
  progressPct?: number;
  dependencies: string[];
  status: 'to_do' | 'in_progress' | 'completed' | 'delayed';
  isMilestone?: boolean;
  assignedTo?: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  assignee?: string;
  assignedTo?: string;
  dueDate: string;
  status: 'todo' | 'to_do' | 'in_progress' | 'completed' | 'done' | 'blocked' | 'overdue';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  discipline?: 'civil' | 'mep' | 'qa_qc' | 'safety' | 'structural' | 'finishing' | string;
  category?: string;
  progress?: number;
}

export interface DPRManpower {
  trade: string;
  plannedCount: number;
  actualCount: number;
}

export interface DPRMachinery {
  name?: string;
  equipmentName?: string;
  workingHours?: number;
  hoursOperated?: number;
  breakdownHours?: number;
  idleHours?: number;
  status?: 'operational' | 'breakdown' | 'idle';
}

export interface DPRMaterial {
  material?: string;
  materialName?: string;
  quantity: number;
  unit: string;
  challanNo: string;
  supplier: string;
}

export interface DPRWorkItem {
  activity?: string;
  description?: string;
  location: string;
  plannedQty: number;
  achievedQty: number;
  unit: string;
  achievementPercentage?: number;
  achievementPct?: number;
}

export interface DailyProgressReport {
  id: string;
  dprNumber: string;
  projectId: string;
  projectName: string;
  date: string;
  weather: string;
  shift?: 'day' | 'night' | 'general' | string;
  workingShift?: string;
  preparedBy?: string;
  approvedBy?: string;
  submittedBy?: string;
  engineerDesignation?: string;
  totalManpower?: number;
  manpowerBreakdown?: DPRManpower[];
  manpower?: DPRManpower[];
  machineryUsed?: DPRMachinery[];
  machinery?: DPRMachinery[];
  materialsReceived: DPRMaterial[];
  workDone?: DPRWorkItem[];
  workCompleted?: DPRWorkItem[];
  issues?: string;
  nextDayPlan?: string;
  photos?: string[];
  safetyIncidents?: boolean;
  safetyNotes?: string;
  status?: 'submitted' | 'approved' | 'draft';
}

export interface SitePhoto {
  id: string;
  projectId: string;
  title?: string;
  caption: string;
  url?: string;
  photoUrl?: string;
  date: string;
  trade?: string;
  uploadedBy?: string;
  engineer?: string;
  block?: string;
  floor?: string;
  activity?: string;
  isMilestone?: boolean;
  beforeAfterPair?: {
    beforeUrl: string;
    afterUrl?: string;
    beforeDate?: string;
    title?: string;
    dateRange?: string;
  };
}

export interface MeasurementBookEntry {
  id: string;
  mbNumber: string;
  projectId: string;
  projectName?: string;
  itemCode: string;
  description?: string;
  workDescription?: string;
  location: string;
  unit: string;
  length?: number;
  width?: number;
  height?: number;
  quantity: number;
  rate: number;
  totalAmount?: number;
  amount?: number;
  recordedBy: string;
  recordedDate?: string;
  date?: string;
  verifiedByQS?: boolean;
  contractorSignoff?: boolean;
  status?: 'recorded' | 'verified' | 'billed';
}

export interface RFIItem {
  id: string;
  rfiNumber: string;
  projectId: string;
  projectName?: string;
  subject?: string;
  question: string;
  discipline?: 'structural' | 'architectural' | 'mep' | 'civil' | 'facade' | string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  assignedTo?: string;
  sentTo?: string;
  drawingRef?: string;
  linkedDrawing?: string;
  dateRaised: string;
  raisedBy: string;
  status: 'open' | 'under_review' | 'responded' | 'closed';
  response?: string;
  responseText?: string;
  respondedBy?: string;
  responseDate?: string;
  respondedAt?: string;
  daysOpen: number;
}

export interface VariationOrder {
  id: string;
  variationNumber: string;
  projectId: string;
  projectName?: string;
  title: string;
  description: string;
  type?: 'addition' | 'deletion' | 'scope_change';
  amount?: number;
  timeExtensionDays?: number;
  justification?: string;
  dateProposed?: string;
  date?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  requestedBy: string;
  approverComments?: string;
  approvedBy?: string;
  approvalDate?: string;
  originalBOQValue?: number;
  additionalWorkValue?: number;
  deletedWorkValue?: number;
  revisedContractValue?: number;
}

export interface ProjectHandover {
  projectId: string;
  currentStage?: 'snag_clearing' | 'as_built_submission' | 'statutory_nocs' | 'virtual_completion' | 'final_handover' | string;
  snagsTotal?: number;
  snagsResolved?: number;
  snagListTotal?: number;
  snagListClosed?: number;
  asBuiltDrawingsApproved?: boolean;
  oAndMManualSubmitted?: boolean;
  dlpPeriodMonths?: number;
  statutoryNocReceived?: boolean;
  virtualCompletionCertificateIssued?: boolean;
  retentionMoneyReleased?: boolean;
  clientSignoffDate?: string;
  finalInspectionPassed?: boolean;
  documentsChecklist?: { name: string; verified: boolean }[];
  completionCertificateIssued?: boolean;
  handoverDate?: string;
  status?: string;
}

// ----------------------------------------------------
// PART 5: PROCUREMENT & INVENTORY TYPES
// ----------------------------------------------------

export type MaterialCategory =
  | 'Cement'
  | 'Steel'
  | 'Sand'
  | 'Aggregate'
  | 'Bricks'
  | 'Blocks'
  | 'Tiles'
  | 'Paint'
  | 'Electrical'
  | 'Plumbing'
  | 'Hardware'
  | 'Waterproofing'
  | 'Shuttering'
  | 'Safety';

export interface MaterialRatePoint {
  date: string;
  rate: number;
  supplier: string;
}

export interface Material {
  id: string;
  sku: string;
  name: string;
  category: MaterialCategory;
  hsnCode: string;
  unit: string;
  brand: string;
  specification: string;
  minStockLevel: number;
  reorderLevel: number;
  currentRate: number;
  gstPct: number;
  rateHistory: MaterialRatePoint[];
  avgDailyConsumption: number;
  currentStock: number;
}

export interface VendorBankDetail {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'Current' | 'Savings';
}

export interface VendorPerformance {
  onTimeDeliveryPct: number;
  qualityRating: number;
  priceCompetitivenessScore: number;
  responsivenessScore: number;
  complianceScore: number;
  rejectionRatePct: number;
  totalPurchaseValue: number;
  pendingPaymentAmount: number;
  monthlyPurchaseHistory: { month: string; value: number }[];
}

export interface Vendor {
  id: string;
  code: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  gst: string;
  pan: string;
  categories: MaterialCategory[];
  creditPeriodDays: number;
  bankDetails: VendorBankDetail;
  status: 'active' | 'blacklisted' | 'on_hold';
  registeredDate: string;
  performance: VendorPerformance;
}

export type PRStatus = 'pending' | 'approved' | 'converted_rfq' | 'converted_po' | 'rejected';

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  projectId: string;
  projectName: string;
  materialId: string;
  materialName: string;
  materialUnit: string;
  quantity: number;
  requiredByDate: string;
  purpose: string;
  raisedBy: string;
  raisedByRole: string;
  raisedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  status: PRStatus;
  linkedRFQId?: string;
  linkedPOId?: string;
  priority: 'urgent' | 'high' | 'normal';
}

export interface VendorQuote {
  vendorId: string;
  vendorName: string;
  vendorCity: string;
  rate: number;
  gstPct: number;
  totalAmount: number;
  deliveryDays: number;
  validUntil: string;
  remarks?: string;
  isSelected?: boolean;
}

export type RFQStatus = 'draft' | 'sent' | 'quotes_received' | 'comparison_done' | 'vendor_selected' | 'pending_approval' | 'approved' | 'converted_po';

export interface RFQ {
  id: string;
  rfqNumber: string;
  prId: string;
  projectId: string;
  projectName: string;
  materialId: string;
  materialName: string;
  materialUnit: string;
  quantity: number;
  requiredByDate: string;
  createdDate: string;
  createdBy: string;
  vendorQuotes: VendorQuote[];
  selectedVendorId?: string;
  status: RFQStatus;
  approvedBy?: string;
  approvalDate?: string;
  linkedPOId?: string;
}

export interface POLineItem {
  id: string;
  materialId: string;
  materialName: string;
  sku: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
  gstPct: number;
  gstAmount: number;
  totalAmount: number;
  hsnCode: string;
}

export type POStatus = 'draft' | 'sent' | 'acknowledged' | 'partially_received' | 'fully_received' | 'closed' | 'cancelled';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  rfqId?: string;
  prId?: string;
  vendorId: string;
  vendorName: string;
  vendorGST: string;
  vendorAddress: string;
  projectId: string;
  projectName: string;
  lineItems: POLineItem[];
  subtotal: number;
  totalGST: number;
  grandTotal: number;
  deliveryTerms: string;
  deliveryAddress: string;
  paymentTerms: string;
  expectedDeliveryDate: string;
  poDate: string;
  createdBy: string;
  approvedBy?: string;
  status: POStatus;
  linkedGRNIds: string[];
  remarks?: string;
}

export interface GRNLineItem {
  materialId: string;
  materialName: string;
  sku: string;
  unit: string;
  orderedQty: number;
  receivedQty: number;
  acceptedQty: number;
  rejectedQty: number;
  receiptStatus: 'exact' | 'short' | 'excess';
  qcStatus: 'pass' | 'fail' | 'pending';
  qcRemarks?: string;
  rate: number;
}

export interface GRNEntry {
  id: string;
  grnNumber: string;
  poId: string;
  poNumber: string;
  vendorId: string;
  vendorName: string;
  projectId: string;
  projectName: string;
  siteId: string;
  receivedDate: string;
  receivedBy: string;
  challanNumber?: string;
  vehicleNumber?: string;
  batchNumber?: string;
  lineItems: GRNLineItem[];
  overallQCStatus: 'pass' | 'fail' | 'partial';
  status: 'draft' | 'verified' | 'posted';
  verifiedBy?: string;
  verifiedDate?: string;
  remarks?: string;
}

export interface StockLedgerEntry {
  id: string;
  materialId: string;
  materialName: string;
  materialUnit: string;
  siteId: string;
  siteName: string;
  period: string;
  openingStock: number;
  purchaseReceipt: number;
  transferIn: number;
  siteIssue: number;
  consumption: number;
  transferOut: number;
  adjustment: number;
  closingStock: number;
  closingValue: number;
  stockStatus: 'ok' | 'low' | 'critical' | 'excess';
}

export type StockTransactionType = 'inward' | 'issue' | 'transfer_in' | 'transfer_out' | 'adjustment';

export interface StockTransaction {
  id: string;
  type: StockTransactionType;
  materialId: string;
  materialName: string;
  materialUnit: string;
  siteId: string;
  siteName: string;
  quantity: number;
  rate: number;
  value: number;
  date: string;
  referenceId?: string;
  referenceType?: 'GRN' | 'PO' | 'ISSUE' | 'TRANSFER' | 'ADJUSTMENT';
  issuedTo?: string;
  transferToSiteId?: string;
  transferToSiteName?: string;
  reason?: string;
  performedBy: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// PART 6 — LABOUR, SUBCONTRACTOR & EQUIPMENT
// ─────────────────────────────────────────────────────────────────────────────

export type LabourTrade =
  | 'Mason' | 'Bar Bender' | 'Carpenter' | 'Electrician' | 'Plumber'
  | 'Painter' | 'Welder' | 'Helper' | 'Waterproofing' | 'Tiles'
  | 'Shuttering' | 'Excavation' | 'Safety Marshal' | 'Operator' | 'Driver';

export type AttendanceCaptureMethod = 'Mobile' | 'QR' | 'Biometric' | 'GPS Geofence' | 'Manual';
export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'overtime' | 'holiday' | 'leave';

export interface Labour {
  id: string;
  name: string;
  trade: LabourTrade;
  subcontractorId?: string;
  subcontractorName?: string;
  projectId: string;
  projectName: string;
  dailyWage: number;
  overtimeRate: number;
  idNumber: string;
  mobile: string;
  address: string;
  joiningDate: string;
  skillGrade: 'Unskilled' | 'Semi-Skilled' | 'Skilled' | 'Highly Skilled';
  status: 'active' | 'inactive';
  pfEnrolled: boolean;
  esiEnrolled: boolean;
  bankAccount?: string;
  ifscCode?: string;
}

export interface AttendanceEntry {
  id: string;
  labourId: string;
  labourName: string;
  labourTrade: LabourTrade;
  projectId: string;
  projectName: string;
  date: string;
  status: AttendanceStatus;
  inTime?: string;
  outTime?: string;
  hoursWorked?: number;
  overtimeHours?: number;
  captureMethod: AttendanceCaptureMethod;
  markedBy: string;
  remarks?: string;
}

export interface MonthlyAttendanceSummary {
  labourId: string;
  labourName: string;
  labourTrade: LabourTrade;
  month: string;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  totalOTHours: number;
  grossWage: number;
  pfDeduction: number;
  esiDeduction: number;
  netPayable: number;
}

export type SubcontractorTrade =
  | 'Mason' | 'Electrical' | 'Plumbing' | 'Fabrication'
  | 'Painting' | 'Flooring' | 'HVAC' | 'Roofing' | 'Waterproofing'
  | 'Shuttering' | 'Landscaping' | 'Labour Supply';

export type WorkOrderStatus = 'draft' | 'active' | 'completed' | 'terminated' | 'on_hold';

export interface RunningBill {
  billNo: string;
  billDate: string;
  period: string;
  grossAmount: number;
  retentionPct: number;
  retentionAmount: number;
  mobilizationAdvance: number;
  advanceRecovery: number;
  otherDeductions: number;
  netPayable: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  paidDate?: string;
}

export interface Subcontractor {
  id: string;
  code: string;
  companyName: string;
  contactPerson: string;
  trade: SubcontractorTrade;
  phone: string;
  email: string;
  gst: string;
  pan: string;
  address: string;
  city: string;
  state: string;
  status: 'active' | 'blacklisted' | 'inactive';
  workOrderNumber: string;
  workOrderDate: string;
  workOrderStatus: WorkOrderStatus;
  projectId: string;
  projectName: string;
  contractValue: number;
  rateBasis: 'lumpsum' | 'per_sqft' | 'per_unit' | 'item_rate';
  mbReference?: string;
  mobilizationAdvancePct: number;
  retentionPct: number;
  billedAmount: number;
  paidAmount: number;
  pendingAmount: number;
  runningBills: RunningBill[];
  qualityRating: number;
  safetyRating: number;
  attendanceScore: number;
}

export type EquipmentType =
  | 'JCB / Backhoe' | 'Excavator' | 'Tower Crane' | 'Mobile Crane'
  | 'Concrete Mixer' | 'Batching Plant' | 'Generator' | 'Truck / Tipper'
  | 'Compressor' | 'Concrete Pump' | 'Transit Mixer' | 'Vibrator'
  | 'Roller / Compactor' | 'Boom Lift' | 'Fork Lift';

export type EquipmentOwnership = 'own' | 'rented' | 'leased';

export interface MaintenanceRecord {
  id: string;
  type: 'preventive' | 'breakdown' | 'scheduled';
  description: string;
  performedDate: string;
  nextDueDate: string;
  cost: number;
  invoiceNumber?: string;
  vendor: string;
  remarks?: string;
}

export interface FuelEntry {
  id: string;
  equipmentId: string;
  date: string;
  litres: number;
  ratePerLitre: number;
  totalCost: number;
  kmReading?: number;
  hourMeterReading?: number;
  fuelType: 'Diesel' | 'Petrol' | 'CNG';
  filledBy: string;
}

export interface EquipmentDocument {
  type: 'RC' | 'Insurance' | 'Fitness' | 'PUC' | 'Permit';
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
}

export interface Equipment {
  id: string;
  code: string;
  name: string;
  equipmentType: EquipmentType;
  make: string;
  model: string;
  year: number;
  registrationNumber?: string;
  ownership: EquipmentOwnership;
  rentalVendor?: string;
  rentalRatePerDay?: number;
  assignedProjectId: string;
  assignedProjectName: string;
  operatorName: string;
  operatorId?: string;
  status: 'active' | 'idle' | 'under_maintenance' | 'breakdown' | 'returned';
  totalHoursRun: number;
  targetHoursPerMonth: number;
  currentMonthHours: number;
  totalFuelConsumed: number;
  fuelEntries: FuelEntry[];
  maintenanceHistory: MaintenanceRecord[];
  documents: EquipmentDocument[];
  monthlyUsage: { month: string; hours: number; fuel: number; cost: number }[];
}

export interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentCode: string;
  serviceType: string;
  lastServiceDate: string;
  lastServiceHours: number;
  nextDueDate: string;
  nextDueHours: number;
  currentHours: number;
  vendor: string;
  estimatedCost: number;
  status: 'overdue' | 'due_this_week' | 'upcoming' | 'completed';
  completedDate?: string;
  invoiceNumber?: string;
  actualCost?: number;
}

// ----------------------------------------------------
// PART 7: FINANCIAL CORE & BILLING TYPES
// ----------------------------------------------------

export type RABillStatus =
  | 'draft'
  | 'engineer_verified'
  | 'qs_verified'
  | 'manager_approved'
  | 'client_submitted'
  | 'approved'
  | 'paid';

export interface RABillItem {
  id: string;
  mbEntryId?: string;
  itemCode: string;
  description: string;
  unit: string;
  rate: number;
  previousQty: number;
  previousAmount: number;
  currentQty: number;
  currentAmount: number;
  cumulativeQty: number;
  cumulativeAmount: number;
}

export interface RABillDeduction {
  description: string;
  amount: number;
}

export interface EInvoiceDetails {
  irn: string;
  ackNo: string;
  ackDate: string;
  qrCodeMock: string;
  status: 'generated' | 'cancelled';
}

export interface RABill {
  id: string;
  billNumber: string;
  raSequence: number;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  contractId?: string;
  contractValue: number;
  billDate: string;
  periodFrom: string;
  periodTo: string;
  status: RABillStatus;
  statusHistory: {
    status: RABillStatus;
    date: string;
    updatedBy: string;
    remarks?: string;
  }[];
  items: RABillItem[];
  previousBillGross: number;
  currentBillGross: number;
  cumulativeGross: number;
  retentionPct: number;
  retentionDeductionCurrent: number;
  retentionCumulative: number;
  advanceRecoveryPct: number;
  advanceRecoveryCurrent: number;
  advanceRecoveryCumulative: number;
  otherDeductions: RABillDeduction[];
  totalOtherDeductionsCurrent: number;
  totalOtherDeductionsCumulative: number;
  gstRatePct: number;
  gstAmountCurrent: number;
  gstAmountCumulative: number;
  netPayableCurrent: number;
  netPayableCumulative: number;
  amountReceived: number;
  outstandingAmount: number;
  dueDate: string;
  paymentDate?: string;
  eInvoice?: EInvoiceDetails;
  verifiedByEngineer?: string;
  verifiedByQS?: string;
  approvedByManager?: string;
  clientApprovalDate?: string;
  mbEntryIds: string[];
}

export interface ProjectCostCategory {
  id: string;
  category: 'Material' | 'Labour' | 'Subcontract' | 'Equipment' | 'Transport' | 'Misc' | 'Overhead';
  budget: number;
  actual: number;
  variance: number;
  variancePct: number;
  committedCost?: number;
}

export interface ProjectCosting {
  projectId: string;
  projectName: string;
  contractValue: number;
  budgetTotal: number;
  actualCostTotal: number;
  projectMarginAmount: number;
  projectMarginPct: number;
  budgetMarginAmount: number;
  budgetMarginPct: number;
  categories: ProjectCostCategory[];
  monthlyCostTrend: {
    month: string;
    material: number;
    labour: number;
    subcontract: number;
    equipment: number;
    transport: number;
    misc: number;
    overhead: number;
    total: number;
  }[];
}

export interface ReceivableItem {
  id: string;
  clientId: string;
  clientName: string;
  projectId: string;
  projectName: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  daysOverdue: number;
  agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  status: 'current' | 'overdue' | 'paid' | 'disputed';
}

export interface PayableItem {
  id: string;
  partyType: 'vendor' | 'subcontractor';
  partyId: string;
  partyName: string;
  projectId: string;
  projectName: string;
  billOrPONumber: string;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  daysOverdue: number;
  agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  status: 'upcoming' | 'due' | 'overdue' | 'paid';
}

export type ExpenseCategory =
  | 'Site Overhead'
  | 'Fuel & Transport'
  | 'Office Rent & Admin'
  | 'Safety Equipment'
  | 'Legal & Statutory Fees'
  | 'Testing & Inspections'
  | 'Utilities'
  | 'Machinery Hire'
  | 'Misc';

export interface ExpenseEntry {
  id: string;
  expenseNumber: string;
  date: string;
  category: ExpenseCategory;
  projectId?: string;
  projectName?: string;
  amount: number;
  paidThrough: 'Bank Transfer' | 'Petty Cash' | 'Cheque' | 'Credit Card';
  bankAccountId?: string;
  payee: string;
  gstAmount: number;
  receiptUrl?: string;
  approvedBy: string;
  status: 'approved' | 'pending' | 'rejected';
  notes?: string;
}

export interface PettyCashEntry {
  id: string;
  voucherNo: string;
  date: string;
  siteId: string;
  siteName: string;
  type: 'in' | 'out';
  category: string;
  description: string;
  amount: number;
  runningBalance: number;
  personName: string;
  approvedBy: string;
  receiptAvailable: boolean;
}

export interface PettyCashLedger {
  siteId: string;
  siteName: string;
  custodianName: string;
  imprestLimit: number;
  currentBalance: number;
  lastReplenishmentDate: string;
  entries: PettyCashEntry[];
}

export interface FinancialTransaction {
  id: string;
  txNumber: string;
  date: string;
  type: 'receipt' | 'payment';
  partyName: string;
  partyType: 'client' | 'vendor' | 'subcontractor' | 'internal';
  projectId?: string;
  projectName?: string;
  amount: number;
  paymentMode: 'NEFT/RTGS' | 'Cheque' | 'UPI' | 'Direct Debit' | 'Cash';
  referenceNumber: string;
  bankAccountName: string;
  description: string;
  status: 'completed' | 'processing' | 'bounced' | 'failed';
}

export interface JournalEntryLine {
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  voucherNo: string;
  date: string;
  narration: string;
  projectId?: string;
  lines: JournalEntryLine[];
  totalAmount: number;
}

export interface ErpIntegrationSettings {
  tallyEnabled: boolean;
  zohoEnabled: boolean;
  sapEnabled: boolean;
  activeErp: 'none' | 'tally' | 'zoho' | 'sap';
  lastSyncTime: string;
  syncStatus: 'synced' | 'pending' | 'error';
  companyGstRate: number;
}

// ----------------------------------------------------
// PART 8: SAFETY, QUALITY, DOCS, FIELD OPS, HR & COMPLIANCE
// ----------------------------------------------------

// 1. SAFETY TYPES
export type IncidentSeverity = 'critical' | 'major' | 'minor' | 'near_miss';
export type IncidentStage =
  | 'incident'
  | 'report'
  | 'investigation'
  | 'root_cause'
  | 'corrective_action'
  | 'closed';

export interface SafetyIncident {
  id: string;
  code: string;
  projectId: string;
  projectName: string;
  date: string;
  title: string;
  severity: IncidentSeverity;
  location: string;
  reportedBy: string;
  injuredPerson?: string;
  stage: IncidentStage;
  description: string;
  investigationDetails?: string;
  rootCause?: string;
  correctiveAction?: string;
  closedDate?: string;
  witnesses?: string[];
  daysOpen: number;
}

export interface PPECheckItem {
  name: string;
  required: boolean;
  compliant: boolean;
  workersCount: number;
}

export interface PPEComplianceRecord {
  id: string;
  projectId: string;
  projectName: string;
  date: string;
  inspector: string;
  shift: 'Morning' | 'Night' | 'General';
  items: PPECheckItem[];
  compliancePercentage: number;
  remarks: string;
}

export interface SafetyInspectionItem {
  check: string;
  status: 'pass' | 'fail' | 'na';
  comments?: string;
}

export interface SafetyInspectionRecord {
  id: string;
  inspectionNumber: string;
  projectId: string;
  projectName: string;
  date: string;
  type: 'daily_walkthrough' | 'scaffolding' | 'electrical' | 'hot_work' | 'crane_lifting' | 'fire_safety';
  inspector: string;
  items: SafetyInspectionItem[];
  score: number;
  status: 'compliant' | 'remedial_required' | 'halt_work';
}

export interface NearMissLog {
  id: string;
  code: string;
  projectId: string;
  projectName: string;
  date: string;
  description: string;
  potentialHazard: string;
  reportedBy: string;
  preventiveAction: string;
  status: 'open' | 'mitigated';
}

export interface ToolboxMeeting {
  id: string;
  code: string;
  date: string;
  projectId: string;
  projectName: string;
  conductedBy: string;
  topic: string;
  attendeeCount: number;
  tradesInvolved: string[];
}

export interface SafetyTrainingRecord {
  id: string;
  title: string;
  date: string;
  projectId?: string;
  trainer: string;
  participantCount: number;
  validityMonths: number;
  certificateIssued: boolean;
}

export interface SiteAuditRecord {
  id: string;
  auditNumber: string;
  projectId: string;
  projectName: string;
  auditorName: string;
  agency: string;
  date: string;
  score: number;
  keyFindings: string[];
  status: 'passed' | 'conditional' | 'failed';
}

// 2. QUALITY (QA/QC) TYPES
export type InspectionType =
  | 'Material'
  | 'Work'
  | 'Concrete'
  | 'Steel'
  | 'Welding'
  | 'Waterproofing'
  | 'Flooring';

export interface InspectionCheckPoint {
  parameter: string;
  specified: string;
  observed: string;
  pass: boolean;
}

export interface QAQCInspection {
  id: string;
  reportNumber: string;
  projectId: string;
  projectName: string;
  date: string;
  inspectionType: InspectionType;
  location: string;
  inspector: string;
  contractorRep: string;
  status: 'pass' | 'fail' | 'conditional';
  checkPoints: InspectionCheckPoint[];
  photoEvidence: string[];
  remarks: string;
}

export type NCRStage =
  | 'issue'
  | 'reason'
  | 'responsible_person'
  | 'corrective_action'
  | 'verification'
  | 'closed';

export interface NonConformanceReport {
  id: string;
  ncrNumber: string;
  projectId: string;
  projectName: string;
  issueDate: string;
  location: string;
  trade: string;
  severity: 'critical' | 'major' | 'minor';
  issueDescription: string;
  responsiblePerson: string;
  stage: NCRStage;
  reasonAnalysis?: string;
  correctiveActionPlan?: string;
  verifiedBy?: string;
  verifiedDate?: string;
  photoBefore?: string;
  photoAfter?: string;
  status: 'open' | 'closed';
}

// 3. DOCUMENT REPOSITORY & DRAWING REGISTER
export type DocumentRepoCategory =
  | 'Drawings'
  | 'Contracts'
  | 'PO'
  | 'Invoices'
  | 'Bills'
  | 'Certificates'
  | 'Test Reports'
  | 'Approvals'
  | 'Photos'
  | 'Agreements';

export interface RepoDocument {
  id: string;
  docNumber: string;
  title: string;
  category: DocumentRepoCategory;
  projectId: string;
  projectName: string;
  uploadedBy: string;
  uploadedDate: string;
  fileSize: string;
  fileType: string;
  tags: string[];
  fileUrl?: string;
}

export type DrawingDiscipline =
  | 'Architectural'
  | 'Structural'
  | 'Electrical'
  | 'Plumbing'
  | 'HVAC'
  | 'Fire'
  | 'MEP';

export interface DrawingVersion {
  version: string;
  uploadedDate: string;
  uploadedBy: string;
  changesSummary: string;
  status: 'approved' | 'superseded' | 'under_review';
  approvedDate?: string;
  approvedBy?: string;
  fileUrl?: string;
}

export interface DrawingRegisterItem {
  id: string;
  drawingNumber: string;
  title: string;
  discipline: DrawingDiscipline;
  projectId: string;
  projectName: string;
  currentRevision: string;
  uploadedDate: string;
  approvedDate?: string;
  status: 'approved' | 'under_review' | 'superseded';
  versions: DrawingVersion[];
}

// 4. SITE INSTRUCTION
export interface SiteInstruction {
  id: string;
  instructionNumber: string;
  projectId: string;
  projectName: string;
  date: string;
  issuedBy: string;
  responsiblePerson: string;
  text: string;
  priority: 'urgent' | 'high' | 'medium';
  dueDate: string;
  status: 'open' | 'in_progress' | 'complied' | 'cancelled';
  photoAttachment?: string;
}

// 5. MEETING MANAGEMENT (MOM)
export type MeetingType = 'Client' | 'Site' | 'Contractor' | 'Internal';

export interface MeetingMinuteItem {
  id: string;
  discussion: string;
  decision: string;
  action: string;
  responsible: string;
  dueDate: string;
  status: 'open' | 'in_progress' | 'closed';
}

export interface MeetingRecord {
  id: string;
  meetingNumber: string;
  title: string;
  type: MeetingType;
  projectId: string;
  projectName: string;
  date: string;
  time: string;
  location: string;
  chairPerson: string;
  attendees: string[];
  minutes: MeetingMinuteItem[];
}

// 6. SNAGGING / PUNCH LIST
export type SnagStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'verified';

export interface SnagItem {
  id: string;
  snagNumber: string;
  projectId: string;
  projectName: string;
  issue: string;
  location: string;
  assignedTo: string;
  priority: 'critical' | 'major' | 'minor';
  reportedDate: string;
  dueDate: string;
  photoEvidence?: string;
  status: SnagStatus;
  resolutionNotes?: string;
  verifiedBy?: string;
  verifiedDate?: string;
}

// 7. HR & PAYROLL MODULE
export interface SalariedEmployee {
  id: string;
  empCode: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  employmentType: 'salaried_fulltime' | 'salaried_contract';
  baseSalary: number;
  bankName: string;
  bankAccount: string;
  pan: string;
  pfNumber: string;
  avatarColor: string;
  status: 'active' | 'on_leave' | 'resigned';
}

export interface StaffAttendanceDay {
  id: string;
  empId: string;
  empName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'present' | 'absent' | 'half_day' | 'on_leave';
  otHours: number;
  location: string;
}

export type LeaveType = 'Casual' | 'Sick' | 'Permission';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  empId: string;
  empName: string;
  department: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason: string;
  appliedOn: string;
  status: LeaveStatus;
  approvedBy?: string;
  approverRemarks?: string;
}

export interface LeaveBalance {
  empId: string;
  casualTotal: number;
  casualUsed: number;
  sickTotal: number;
  sickUsed: number;
  permissionTotal: number;
  permissionUsed: number;
}

export interface MonthlyPayslip {
  id: string;
  payslipNumber: string;
  empId: string;
  empName: string;
  designation: string;
  department: string;
  month: string;
  bankAccount: string;
  pan: string;
  presentDays: number;
  payableDays: number;
  otHours: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  otPay: number;
  incentives: number;
  grossSalary: number;
  pfDeduction: number;
  ptDeduction: number;
  tdsDeduction: number;
  advances: number;
  totalDeductions: number;
  netSalary: number;
  status: 'draft' | 'approved' | 'disbursed';
  disbursedDate?: string;
}

// 8. LEGAL & COMPLIANCE TRACKER
export interface LegalComplianceItem {
  id: string;
  item: string;
  category: 'GST filing' | 'Labour license' | 'Insurance' | 'Contract' | 'License' | 'Certificate' | 'Vendor document';
  authority: string;
  projectId?: string;
  projectName?: string;
  documentNumber: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired';
  daysToExpiry: number;
  responsibleOfficer: string;
}
