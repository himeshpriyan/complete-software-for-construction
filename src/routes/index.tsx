import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ClientPortalPage } from '../pages/portal/ClientPortalPage';
import { CompanyMasterPage } from '../pages/settings/CompanyMasterPage';
import { UsersRolesPage } from '../pages/settings/UsersRolesPage';
import { PermissionsPage } from '../pages/settings/PermissionsPage';
import { AuditLogPage } from '../pages/settings/AuditLogPage';
import { LeadsPipelinePage } from '../pages/crm/LeadsPipelinePage';
import { SiteVisitsPage } from '../pages/crm/SiteVisitsPage';
import { FollowUpsPage } from '../pages/crm/FollowUpsPage';
import { CrmDashboardPage } from '../pages/crm/CrmDashboardPage';
import { CustomersPage } from '../pages/crm/CustomersPage';
import { EstimatesListPage } from '../pages/estimation/EstimatesListPage';
import { BOQBuilderPage } from '../pages/estimation/BOQBuilderPage';
import { RateAnalysisPage } from '../pages/estimation/RateAnalysisPage';
import { QuotationsPage } from '../pages/estimation/QuotationsPage';
import { TendersPage } from '../pages/tenders/TendersPage';
import { ContractsPage } from '../pages/contracts/ContractsPage';
import { ProjectsDirectoryPage } from '../pages/projects/ProjectsDirectoryPage';
import { ProjectDetailPage } from '../pages/projects/ProjectDetailPage';
import { CrossProjectTasksPage } from '../pages/projects/CrossProjectTasksPage';
import { CrossProjectDPRPage } from '../pages/projects/CrossProjectDPRPage';
// Part 5 — Procurement & Inventory
import { VendorsPage } from '../pages/vendors/VendorsPage';
import { MaterialsPage } from '../pages/inventory/MaterialsPage';
import { StockDashboardPage } from '../pages/inventory/StockDashboardPage';
import { StockIssuePage } from '../pages/inventory/StockIssuePage';
import { StockTransferPage } from '../pages/inventory/StockTransferPage';
import { StockAdjustmentPage } from '../pages/inventory/StockAdjustmentPage';
import { MaterialForecastingPage } from '../pages/inventory/MaterialForecastingPage';
import { PurchaseRequestsPage } from '../pages/procurement/PurchaseRequestsPage';
import { RFQPage } from '../pages/procurement/RFQPage';
import { PurchaseOrdersPage } from '../pages/procurement/PurchaseOrdersPage';
import { GRNPage } from '../pages/procurement/GRNPage';
// Part 6 — Labour, Subcontractors & Equipment
import { LabourPage } from '../pages/labour/LabourPage';
import { SubcontractorsPage } from '../pages/subcontractors/SubcontractorsPage';
import { EquipmentPage } from '../pages/equipment/EquipmentPage';
import { FuelManagementPage } from '../pages/equipment/FuelManagementPage';

// Part 7 — Billing, Accounts, Costing & Finance
import { RABillsPage } from '../pages/billing/RABillsPage';
import { ClientBillingPage } from '../pages/billing/ClientBillingPage';
import { CustomerReceivablesPage } from '../pages/accounts/CustomerReceivablesPage';
import { VendorPayablesPage } from '../pages/accounts/VendorPayablesPage';
import { ExpensesPage } from '../pages/accounts/ExpensesPage';
import { PettyCashPage } from '../pages/accounts/PettyCashPage';
import { BankAccountsPage } from '../pages/accounts/BankAccountsPage';
import { TransactionsLogPage } from '../pages/accounts/TransactionsLogPage';
import { JournalPage } from '../pages/accounts/JournalPage';
import { BudgetVsActualPage } from '../pages/reports/BudgetVsActualPage';

// Part 8 — Operations, Quality, Documents, HR & Compliance
import { SafetyPage } from '../pages/safety/SafetyPage';
import { QualityPage } from '../pages/quality/QualityPage';
import { DocumentsPage } from '../pages/documents/DocumentsPage';
import { EmployeesPage } from '../pages/hr/EmployeesPage';
import { EmployeeProfilePage } from '../pages/hr/EmployeeProfilePage';
import { AttendancePage } from '../pages/hr/AttendancePage';
import { LeavePage } from '../pages/hr/LeavePage';
import { PayrollPage } from '../pages/hr/PayrollPage';

import { useAppStore } from '../store/useAppStore';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAppStore();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Standalone Client Portal Flow */}
      <Route
        path="/client-portal"
        element={
          <ProtectedRoute>
            <ClientPortalPage />
          </ProtectedRoute>
        }
      />

      {/* Main Internal App Shell Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        {/* 1. Dashboard */}
        <Route index element={<DashboardPage />} />

        {/* 2. CRM (Part 2 Fully Implemented) */}
        <Route path="crm">
          <Route index element={<Navigate to="/crm/leads" replace />} />
          <Route path="analytics" element={<CrmDashboardPage />} />
          <Route path="leads" element={<LeadsPipelinePage />} />
          <Route path="pipeline" element={<LeadsPipelinePage />} />
          <Route path="opportunities" element={<LeadsPipelinePage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="follow-ups" element={<FollowUpsPage />} />
          <Route path="site-visits" element={<SiteVisitsPage />} />
        </Route>

        {/* 3. Estimation (Part 3 Fully Implemented) */}
        <Route path="estimation">
          <Route index element={<Navigate to="/estimation/estimates" replace />} />
          <Route path="estimates" element={<EstimatesListPage />} />
          <Route path="boq" element={<BOQBuilderPage />} />
          <Route path="rate-analysis" element={<RateAnalysisPage />} />
          <Route path="quotations" element={<QuotationsPage />} />
        </Route>

        {/* 4. Tenders (Part 3 Fully Implemented) */}
        <Route path="tenders" element={<TendersPage />} />

        {/* 5. Contracts (Part 3 Fully Implemented) */}
        <Route path="contracts" element={<ContractsPage />} />

        {/* 6. Projects (Part 4 Core Project Management Fully Implemented) */}
        <Route path="projects">
          <Route index element={<ProjectsDirectoryPage />} />
          <Route path="tasks" element={<CrossProjectTasksPage />} />
          <Route path="dpr" element={<CrossProjectDPRPage />} />
          <Route path="planning" element={<Navigate to="/projects/PRJ-001" replace />} />
          <Route path="progress" element={<Navigate to="/projects/PRJ-001" replace />} />
          <Route path="measurements" element={<Navigate to="/projects/PRJ-001" replace />} />
          <Route path="rfi" element={<Navigate to="/projects/PRJ-001" replace />} />
          <Route path="variations" element={<Navigate to="/projects/PRJ-001" replace />} />
          <Route path="handover" element={<Navigate to="/projects/PRJ-001" replace />} />
          <Route path=":id" element={<ProjectDetailPage />} />
        </Route>

        {/* 7. Procurement (Part 5 Fully Implemented) */}
        <Route path="procurement">
          <Route index element={<Navigate to="/procurement/purchase-requests" replace />} />
          <Route path="purchase-requests" element={<PurchaseRequestsPage />} />
          <Route path="rfq" element={<RFQPage />} />
          <Route path="vendor-comparison" element={<RFQPage />} />
          <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
          <Route path="grn" element={<GRNPage />} />
        </Route>

        {/* 8. Inventory (Part 5 Fully Implemented) */}
        <Route path="inventory">
          <Route index element={<Navigate to="/inventory/materials" replace />} />
          <Route path="materials" element={<MaterialsPage />} />
          <Route path="stock" element={<StockDashboardPage />} />
          <Route path="stock-issue" element={<StockIssuePage />} />
          <Route path="stock-transfer" element={<StockTransferPage />} />
          <Route path="stock-adjustment" element={<StockAdjustmentPage />} />
          <Route path="forecasting" element={<MaterialForecastingPage />} />
        </Route>

        {/* 9. Vendors (Part 5 Fully Implemented) */}
        <Route path="vendors" element={<VendorsPage />} />

        {/* 10. Subcontractors (Part 6 Fully Implemented) */}
        <Route path="subcontractors" element={<SubcontractorsPage />} />

        {/* 11. Labour (Part 6 Fully Implemented) */}
        <Route path="labour" element={<LabourPage />} />

        {/* 12. Equipment (Part 6 Fully Implemented) */}
        <Route path="equipment">
          <Route index element={<EquipmentPage />} />
          <Route path="fleet" element={<EquipmentPage />} />
          <Route path="fuel" element={<FuelManagementPage />} />
          <Route path="maintenance" element={<EquipmentPage />} />
        </Route>

        {/* 13. Safety (Part 8 Fully Implemented) */}
        <Route path="safety" element={<SafetyPage />} />

        {/* 14. Quality (Part 8 Fully Implemented) */}
        <Route path="quality" element={<QualityPage />} />

        {/* 15. Documents & Drawings (Part 8 Fully Implemented) */}
        <Route path="documents" element={<DocumentsPage />} />

        {/* 16. Billing (Part 7 Implemented) */}
        <Route path="billing">
          <Route index element={<Navigate to="/billing/ra-bills" replace />} />
          <Route path="ra-bills" element={<RABillsPage />} />
          <Route path="client-billing" element={<ClientBillingPage />} />
        </Route>

        {/* 17. Accounts & Finance (Part 7 Implemented) */}
        <Route path="accounts">
          <Route index element={<Navigate to="/accounts/receivables" replace />} />
          <Route path="receivables" element={<CustomerReceivablesPage />} />
          <Route path="payables" element={<VendorPayablesPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="petty-cash" element={<PettyCashPage />} />
          <Route path="bank" element={<BankAccountsPage />} />
          <Route path="transactions" element={<TransactionsLogPage />} />
          <Route path="journal" element={<JournalPage />} />
        </Route>

        {/* 18. HR (Part 8 Fully Implemented) */}
        <Route path="hr">
          <Route index element={<Navigate to="/hr/employees" replace />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="employees/:id" element={<EmployeeProfilePage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="leave" element={<LeavePage />} />
          <Route path="payroll" element={<PayrollPage />} />
        </Route>

        {/* 19. Reports & Analytics (Budget vs Actual Part 7 Implemented) */}
        <Route path="reports">
          <Route index element={<BudgetVsActualPage />} />
          <Route path="budget-vs-actual" element={<BudgetVsActualPage />} />
        </Route>

        {/* 20. Settings (Part 1 Fully Implemented) */}
        <Route path="settings">
          <Route index element={<Navigate to="/settings/company" replace />} />
          <Route path="company" element={<CompanyMasterPage />} />
          <Route path="users" element={<UsersRolesPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="audit-log" element={<AuditLogPage />} />
        </Route>

        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
