import {
  Labour, AttendanceEntry, MonthlyAttendanceSummary,
  Subcontractor, Equipment, MaintenanceSchedule, FuelEntry,
} from '../types';

// ─────────────────────────────────────────────
// LABOUR MASTER (30 workers)
// ─────────────────────────────────────────────
export const labourSeed: Labour[] = [
  { id: 'LAB-001', name: 'Ramesh Yadav', trade: 'Mason', projectId: 'PRJ-001', projectName: 'Lodha Skylines', dailyWage: 850, overtimeRate: 120, idNumber: '3456 7890 1234', mobile: '+91 99200 11001', address: 'Bhiwandi, Thane', joiningDate: '2026-03-01', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, bankAccount: '0041008700341234', ifscCode: 'SBIN0005678', subcontractorId: 'SUB-001', subcontractorName: 'Shree Sai Masonry Works' },
  { id: 'LAB-002', name: 'Anil Paswan', trade: 'Bar Bender', projectId: 'PRJ-001', projectName: 'Lodha Skylines', dailyWage: 780, overtimeRate: 110, idNumber: '4567 8901 2345', mobile: '+91 99200 11002', address: 'Kalyan, Thane', joiningDate: '2026-03-01', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-001', subcontractorName: 'Shree Sai Masonry Works' },
  { id: 'LAB-003', name: 'Santosh Kumar', trade: 'Carpenter', projectId: 'PRJ-001', projectName: 'Lodha Skylines', dailyWage: 900, overtimeRate: 130, idNumber: '5678 9012 3456', mobile: '+91 99200 11003', address: 'Dombivli, Thane', joiningDate: '2026-04-15', skillGrade: 'Highly Skilled', status: 'active', pfEnrolled: true, esiEnrolled: false },
  { id: 'LAB-004', name: 'Mohan Lal', trade: 'Helper', projectId: 'PRJ-001', projectName: 'Lodha Skylines', dailyWage: 600, overtimeRate: 80, idNumber: '6789 0123 4567', mobile: '+91 99200 11004', address: 'Mira Road, Mumbai', joiningDate: '2026-05-01', skillGrade: 'Unskilled', status: 'active', pfEnrolled: false, esiEnrolled: false },
  { id: 'LAB-005', name: 'Suresh Bind', trade: 'Mason', projectId: 'PRJ-001', projectName: 'Lodha Skylines', dailyWage: 820, overtimeRate: 115, idNumber: '7890 1234 5678', mobile: '+91 99200 11005', address: 'Vasai, Palghar', joiningDate: '2026-03-15', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-001', subcontractorName: 'Shree Sai Masonry Works' },
  { id: 'LAB-006', name: 'Vijay Rajbhar', trade: 'Shuttering', projectId: 'PRJ-002', projectName: 'MMRDA Metro Viaduct', dailyWage: 750, overtimeRate: 100, idNumber: '8901 2345 6789', mobile: '+91 99200 11006', address: 'Kurla, Mumbai', joiningDate: '2026-02-01', skillGrade: 'Semi-Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-002', subcontractorName: 'Metro Shuttering Solutions' },
  { id: 'LAB-007', name: 'Deepak Chauhan', trade: 'Shuttering', projectId: 'PRJ-002', projectName: 'MMRDA Metro Viaduct', dailyWage: 740, overtimeRate: 100, idNumber: '9012 3456 7890', mobile: '+91 99200 11007', address: 'Ghatkopar, Mumbai', joiningDate: '2026-02-01', skillGrade: 'Semi-Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-002', subcontractorName: 'Metro Shuttering Solutions' },
  { id: 'LAB-008', name: 'Pankaj Gupta', trade: 'Electrician', projectId: 'PRJ-005', projectName: 'Godrej BKC', dailyWage: 950, overtimeRate: 140, idNumber: '0123 4567 8901', mobile: '+91 99200 11008', address: 'Bandra, Mumbai', joiningDate: '2026-06-01', skillGrade: 'Highly Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-003', subcontractorName: 'Voltage MEP Services' },
  { id: 'LAB-009', name: 'Rakesh Singh', trade: 'Electrician', projectId: 'PRJ-005', projectName: 'Godrej BKC', dailyWage: 920, overtimeRate: 135, idNumber: '1234 5678 9012', mobile: '+91 99200 11009', address: 'Andheri, Mumbai', joiningDate: '2026-06-01', skillGrade: 'Highly Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-003', subcontractorName: 'Voltage MEP Services' },
  { id: 'LAB-010', name: 'Bharat Mishra', trade: 'Plumber', projectId: 'PRJ-005', projectName: 'Godrej BKC', dailyWage: 880, overtimeRate: 125, idNumber: '2345 6789 0123', mobile: '+91 99200 11010', address: 'Jogeshwari, Mumbai', joiningDate: '2026-06-15', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-004', subcontractorName: 'Aqua Plumbing Co.' },
  { id: 'LAB-011', name: 'Arvind Pandey', trade: 'Painter', projectId: 'PRJ-003', projectName: 'Prestige Towers', dailyWage: 720, overtimeRate: 95, idNumber: '3456 7890 1235', mobile: '+91 99200 11011', address: 'Pune Camp, Pune', joiningDate: '2026-07-01', skillGrade: 'Skilled', status: 'active', pfEnrolled: false, esiEnrolled: false, subcontractorId: 'SUB-005', subcontractorName: 'ColorMaster Finishes' },
  { id: 'LAB-012', name: 'Govind Tiwari', trade: 'Painter', projectId: 'PRJ-003', projectName: 'Prestige Towers', dailyWage: 700, overtimeRate: 90, idNumber: '4567 8901 2346', mobile: '+91 99200 11012', address: 'Khadki, Pune', joiningDate: '2026-07-01', skillGrade: 'Semi-Skilled', status: 'active', pfEnrolled: false, esiEnrolled: false, subcontractorId: 'SUB-005', subcontractorName: 'ColorMaster Finishes' },
  { id: 'LAB-013', name: 'Harish Nayak', trade: 'Tiles', projectId: 'PRJ-003', projectName: 'Prestige Towers', dailyWage: 850, overtimeRate: 120, idNumber: '5678 9012 3457', mobile: '+91 99200 11013', address: 'Hadapsar, Pune', joiningDate: '2026-07-15', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-006', subcontractorName: 'Premium Flooring Experts' },
  { id: 'LAB-014', name: 'Lokesh Kumar', trade: 'Tiles', projectId: 'PRJ-003', projectName: 'Prestige Towers', dailyWage: 800, overtimeRate: 110, idNumber: '6789 0123 4568', mobile: '+91 99200 11014', address: 'Wanowrie, Pune', joiningDate: '2026-07-15', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-006', subcontractorName: 'Premium Flooring Experts' },
  { id: 'LAB-015', name: 'Naresh Sharma', trade: 'Welder', projectId: 'PRJ-002', projectName: 'MMRDA Metro Viaduct', dailyWage: 1000, overtimeRate: 150, idNumber: '7890 1234 5679', mobile: '+91 99200 11015', address: 'Chembur, Mumbai', joiningDate: '2026-02-15', skillGrade: 'Highly Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-007', subcontractorName: 'Apex Steel Fabricators' },
  { id: 'LAB-016', name: 'Pramod Rai', trade: 'Welder', projectId: 'PRJ-002', projectName: 'MMRDA Metro Viaduct', dailyWage: 980, overtimeRate: 145, idNumber: '8901 2345 6780', mobile: '+91 99200 11016', address: 'Mankhurd, Mumbai', joiningDate: '2026-02-15', skillGrade: 'Highly Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-007', subcontractorName: 'Apex Steel Fabricators' },
  { id: 'LAB-017', name: 'Sanjay Verma', trade: 'Excavation', projectId: 'PRJ-004', projectName: 'NHAI NH-48', dailyWage: 700, overtimeRate: 90, idNumber: '9012 3456 7891', mobile: '+91 99200 11017', address: 'Surat, Gujarat', joiningDate: '2026-01-10', skillGrade: 'Semi-Skilled', status: 'active', pfEnrolled: true, esiEnrolled: false },
  { id: 'LAB-018', name: 'Mahesh Patel', trade: 'Helper', projectId: 'PRJ-004', projectName: 'NHAI NH-48', dailyWage: 580, overtimeRate: 75, idNumber: '0123 4567 8902', mobile: '+91 99200 11018', address: 'Bardoli, Surat', joiningDate: '2026-01-10', skillGrade: 'Unskilled', status: 'active', pfEnrolled: false, esiEnrolled: false },
  { id: 'LAB-019', name: 'Ankit Jha', trade: 'Safety Marshal', projectId: 'PRJ-001', projectName: 'Lodha Skylines', dailyWage: 800, overtimeRate: 110, idNumber: '1234 5678 9013', mobile: '+91 99200 11019', address: 'Thane, Mumbai', joiningDate: '2026-03-01', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true },
  { id: 'LAB-020', name: 'Durgesh Tiwari', trade: 'Waterproofing', projectId: 'PRJ-001', projectName: 'Lodha Skylines', dailyWage: 820, overtimeRate: 115, idNumber: '2345 6789 0124', mobile: '+91 99200 11020', address: 'Ulhasnagar, Thane', joiningDate: '2026-04-01', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-008', subcontractorName: 'Aqua Shield Waterproofing' },
  { id: 'LAB-021', name: 'Kiran Malhotra', trade: 'Mason', projectId: 'PRJ-003', projectName: 'Prestige Towers', dailyWage: 840, overtimeRate: 118, idNumber: '3456 7890 1236', mobile: '+91 99200 11021', address: 'Pimpri, Pune', joiningDate: '2026-05-15', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-001', subcontractorName: 'Shree Sai Masonry Works' },
  { id: 'LAB-022', name: 'Tarun Dubey', trade: 'Helper', projectId: 'PRJ-003', projectName: 'Prestige Towers', dailyWage: 600, overtimeRate: 78, idNumber: '4567 8901 2347', mobile: '+91 99200 11022', address: 'Chinchwad, Pune', joiningDate: '2026-05-15', skillGrade: 'Unskilled', status: 'active', pfEnrolled: false, esiEnrolled: false },
  { id: 'LAB-023', name: 'Yogesh Bhor', trade: 'Bar Bender', projectId: 'PRJ-002', projectName: 'MMRDA Metro Viaduct', dailyWage: 800, overtimeRate: 112, idNumber: '5678 9012 3458', mobile: '+91 99200 11023', address: 'Mulund, Mumbai', joiningDate: '2026-02-01', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true },
  { id: 'LAB-024', name: 'Nilesh Patil', trade: 'Carpenter', projectId: 'PRJ-005', projectName: 'Godrej BKC', dailyWage: 880, overtimeRate: 125, idNumber: '6789 0123 4569', mobile: '+91 99200 11024', address: 'Dadar, Mumbai', joiningDate: '2026-06-01', skillGrade: 'Highly Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true },
  { id: 'LAB-025', name: 'Ravi Shankar', trade: 'Operator', projectId: 'PRJ-004', projectName: 'NHAI NH-48', dailyWage: 1100, overtimeRate: 160, idNumber: '7890 1234 5680', mobile: '+91 99200 11025', address: 'Vapi, Gujarat', joiningDate: '2026-01-05', skillGrade: 'Highly Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true },
  { id: 'LAB-026', name: 'Devraj Oraon', trade: 'Driver', projectId: 'PRJ-004', projectName: 'NHAI NH-48', dailyWage: 900, overtimeRate: 130, idNumber: '8901 2345 6781', mobile: '+91 99200 11026', address: 'Sachin, Surat', joiningDate: '2026-01-05', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: false },
  { id: 'LAB-027', name: 'Sameer Khan', trade: 'Plumber', projectId: 'PRJ-003', projectName: 'Prestige Towers', dailyWage: 870, overtimeRate: 122, idNumber: '9012 3456 7892', mobile: '+91 99200 11027', address: 'Warje, Pune', joiningDate: '2026-06-15', skillGrade: 'Skilled', status: 'inactive', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-004', subcontractorName: 'Aqua Plumbing Co.' },
  { id: 'LAB-028', name: 'Rajiv Trivedi', trade: 'Safety Marshal', projectId: 'PRJ-002', projectName: 'MMRDA Metro Viaduct', dailyWage: 810, overtimeRate: 112, idNumber: '0123 4567 8903', mobile: '+91 99200 11028', address: 'Vikhroli, Mumbai', joiningDate: '2026-02-10', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true },
  { id: 'LAB-029', name: 'Uttam Ghosh', trade: 'Helper', projectId: 'PRJ-005', projectName: 'Godrej BKC', dailyWage: 620, overtimeRate: 82, idNumber: '1234 5678 9014', mobile: '+91 99200 11029', address: 'Kurla, Mumbai', joiningDate: '2026-07-01', skillGrade: 'Unskilled', status: 'active', pfEnrolled: false, esiEnrolled: false },
  { id: 'LAB-030', name: 'Ganesh Kale', trade: 'Waterproofing', projectId: 'PRJ-001', projectName: 'Lodha Skylines', dailyWage: 810, overtimeRate: 115, idNumber: '2345 6789 0125', mobile: '+91 99200 11030', address: 'Badlapur, Thane', joiningDate: '2026-04-01', skillGrade: 'Skilled', status: 'active', pfEnrolled: true, esiEnrolled: true, subcontractorId: 'SUB-008', subcontractorName: 'Aqua Shield Waterproofing' },
];

// ─────────────────────────────────────────────
// ATTENDANCE ENTRIES (last 7 days, PRJ-001)
// ─────────────────────────────────────────────
const todayStr = '2026-09-22';
const METHODS: AttendanceEntry['captureMethod'][] = ['QR', 'Biometric', 'Mobile', 'GPS Geofence', 'Manual'];
const STATUSES: AttendanceEntry['status'][] = ['present', 'present', 'present', 'present', 'absent', 'half_day', 'overtime'];

export const attendanceSeed: AttendanceEntry[] = labourSeed.slice(0, 20).flatMap((l, li) =>
  [0, 1, 2, 3, 4, 5, 6].map((dOffset): AttendanceEntry => {
    const d = new Date('2026-09-22');
    d.setDate(d.getDate() - dOffset);
    const dateStr = d.toISOString().split('T')[0];
    const status = STATUSES[(li + dOffset) % STATUSES.length];
    const method = METHODS[(li + dOffset) % METHODS.length];
    return {
      id: `ATT-${l.id}-D${dOffset}`,
      labourId: l.id,
      labourName: l.name,
      labourTrade: l.trade,
      projectId: l.projectId,
      projectName: l.projectName,
      date: dateStr,
      status,
      inTime: status !== 'absent' ? '08:00' : undefined,
      outTime: status !== 'absent' ? (status === 'overtime' ? '20:00' : status === 'half_day' ? '13:00' : '17:00') : undefined,
      hoursWorked: status === 'absent' ? 0 : status === 'half_day' ? 5 : status === 'overtime' ? 12 : 9,
      overtimeHours: status === 'overtime' ? 4 : 0,
      captureMethod: method,
      markedBy: 'Arjun Desai (Site Engineer)',
      remarks: status === 'absent' ? 'No information' : undefined,
    };
  })
);

// ─────────────────────────────────────────────
// MONTHLY ATTENDANCE SUMMARY (September 2026)
// ─────────────────────────────────────────────
export const monthlySummarySeed: MonthlyAttendanceSummary[] = labourSeed.slice(0, 15).map((l) => {
  const presentDays = Math.floor(Math.random() * 8) + 20;
  const absentDays = Math.floor(Math.random() * 3);
  const halfDays = 2 - absentDays;
  const totalOTHours = Math.floor(Math.random() * 20);
  const grossWage = presentDays * l.dailyWage + (halfDays * l.dailyWage * 0.5) + (totalOTHours * l.overtimeRate);
  const pfDeduction = l.pfEnrolled ? grossWage * 0.12 : 0;
  const esiDeduction = l.esiEnrolled ? grossWage * 0.0075 : 0;
  return {
    labourId: l.id,
    labourName: l.name,
    labourTrade: l.trade,
    month: '2026-09',
    presentDays,
    absentDays,
    halfDays: Math.max(0, halfDays),
    totalOTHours,
    grossWage: Math.round(grossWage),
    pfDeduction: Math.round(pfDeduction),
    esiDeduction: Math.round(esiDeduction),
    netPayable: Math.round(grossWage - pfDeduction - esiDeduction),
  };
});

// ─────────────────────────────────────────────
// SUBCONTRACTORS (8)
// ─────────────────────────────────────────────
export const subcontractorsSeed: Subcontractor[] = [
  {
    id: 'SUB-001', code: 'SC-001', companyName: 'Shree Sai Masonry Works', contactPerson: 'Balaram Sai', trade: 'Mason',
    phone: '+91 98220 11001', email: 'shreesai@masonry.in', gst: '27AABCS1234A1Z5', pan: 'AABCS1234A',
    address: 'Plot 12, MIDC Bhiwandi', city: 'Bhiwandi', state: 'Maharashtra', status: 'active',
    workOrderNumber: 'WO/2026-27/001', workOrderDate: '2026-03-01', workOrderStatus: 'active',
    projectId: 'PRJ-001', projectName: 'Lodha Skylines',
    contractValue: 4200000, rateBasis: 'per_sqft', mbReference: 'MB-001',
    mobilizationAdvancePct: 10, retentionPct: 5,
    billedAmount: 2800000, paidAmount: 2100000, pendingAmount: 700000,
    qualityRating: 4.2, safetyRating: 3.8, attendanceScore: 88,
    runningBills: [
      { billNo: 'RB/WO001/01', billDate: '2026-04-30', period: 'April 2026', grossAmount: 980000, retentionPct: 5, retentionAmount: 49000, mobilizationAdvance: 420000, advanceRecovery: 98000, otherDeductions: 0, netPayable: 833000, status: 'paid', paidDate: '2026-05-15' },
      { billNo: 'RB/WO001/02', billDate: '2026-06-30', period: 'May–Jun 2026', grossAmount: 1120000, retentionPct: 5, retentionAmount: 56000, mobilizationAdvance: 0, advanceRecovery: 112000, otherDeductions: 15000, netPayable: 937000, status: 'paid', paidDate: '2026-07-10' },
      { billNo: 'RB/WO001/03', billDate: '2026-08-31', period: 'Jul–Aug 2026', grossAmount: 700000, retentionPct: 5, retentionAmount: 35000, mobilizationAdvance: 0, advanceRecovery: 70000, otherDeductions: 0, netPayable: 595000, status: 'approved' },
    ],
  },
  {
    id: 'SUB-002', code: 'SC-002', companyName: 'Metro Shuttering Solutions', contactPerson: 'Prakash Nair', trade: 'Shuttering',
    phone: '+91 98220 11002', email: 'metro.shuttering@gmail.com', gst: '27AABCM5678B2Z3', pan: 'AABCM5678B',
    address: 'Kurla Industrial Area, Mumbai', city: 'Mumbai', state: 'Maharashtra', status: 'active',
    workOrderNumber: 'WO/2026-27/002', workOrderDate: '2026-02-01', workOrderStatus: 'active',
    projectId: 'PRJ-002', projectName: 'MMRDA Metro Viaduct',
    contractValue: 8500000, rateBasis: 'item_rate', mbReference: 'MB-002',
    mobilizationAdvancePct: 15, retentionPct: 7.5,
    billedAmount: 6200000, paidAmount: 5800000, pendingAmount: 400000,
    qualityRating: 4.5, safetyRating: 4.2, attendanceScore: 92,
    runningBills: [
      { billNo: 'RB/WO002/01', billDate: '2026-03-31', period: 'Feb–Mar 2026', grossAmount: 2100000, retentionPct: 7.5, retentionAmount: 157500, mobilizationAdvance: 1275000, advanceRecovery: 315000, otherDeductions: 0, netPayable: 1627500, status: 'paid', paidDate: '2026-04-20' },
      { billNo: 'RB/WO002/02', billDate: '2026-06-30', period: 'Apr–Jun 2026', grossAmount: 2400000, retentionPct: 7.5, retentionAmount: 180000, mobilizationAdvance: 0, advanceRecovery: 360000, otherDeductions: 25000, netPayable: 1835000, status: 'paid', paidDate: '2026-07-25' },
      { billNo: 'RB/WO002/03', billDate: '2026-09-15', period: 'Jul–Sep 2026', grossAmount: 1700000, retentionPct: 7.5, retentionAmount: 127500, mobilizationAdvance: 0, advanceRecovery: 255000, otherDeductions: 0, netPayable: 1317500, status: 'pending' },
    ],
  },
  {
    id: 'SUB-003', code: 'SC-003', companyName: 'Voltage MEP Services', contactPerson: 'Suhas Kulkarni', trade: 'Electrical',
    phone: '+91 98220 11003', email: 'voltage.mep@bmc.in', gst: '27AABCV9012C3Z1', pan: 'AABCV9012C',
    address: 'Andheri East, Mumbai', city: 'Mumbai', state: 'Maharashtra', status: 'active',
    workOrderNumber: 'WO/2026-27/003', workOrderDate: '2026-06-01', workOrderStatus: 'active',
    projectId: 'PRJ-005', projectName: 'Godrej BKC',
    contractValue: 12000000, rateBasis: 'lumpsum', mbReference: 'MB-005',
    mobilizationAdvancePct: 10, retentionPct: 5,
    billedAmount: 4500000, paidAmount: 3200000, pendingAmount: 1300000,
    qualityRating: 4.7, safetyRating: 4.5, attendanceScore: 95,
    runningBills: [
      { billNo: 'RB/WO003/01', billDate: '2026-07-31', period: 'Jun–Jul 2026', grossAmount: 2800000, retentionPct: 5, retentionAmount: 140000, mobilizationAdvance: 1200000, advanceRecovery: 280000, otherDeductions: 0, netPayable: 2380000, status: 'paid', paidDate: '2026-08-15' },
      { billNo: 'RB/WO003/02', billDate: '2026-09-15', period: 'Aug–Sep 2026', grossAmount: 1700000, retentionPct: 5, retentionAmount: 85000, mobilizationAdvance: 0, advanceRecovery: 170000, otherDeductions: 20000, netPayable: 1425000, status: 'pending' },
    ],
  },
  {
    id: 'SUB-004', code: 'SC-004', companyName: 'Aqua Plumbing Co.', contactPerson: 'Rajendra Naik', trade: 'Plumbing',
    phone: '+91 98220 11004', email: 'aquaplumbing@yahoo.com', gst: '27AABCA3456D4Z2', pan: 'AABCA3456D',
    address: 'Jogeshwari West, Mumbai', city: 'Mumbai', state: 'Maharashtra', status: 'active',
    workOrderNumber: 'WO/2026-27/004', workOrderDate: '2026-06-15', workOrderStatus: 'active',
    projectId: 'PRJ-005', projectName: 'Godrej BKC',
    contractValue: 5500000, rateBasis: 'item_rate',
    mobilizationAdvancePct: 10, retentionPct: 5,
    billedAmount: 2200000, paidAmount: 1800000, pendingAmount: 400000,
    qualityRating: 4.0, safetyRating: 4.1, attendanceScore: 90,
    runningBills: [
      { billNo: 'RB/WO004/01', billDate: '2026-08-15', period: 'Jun–Aug 2026', grossAmount: 2200000, retentionPct: 5, retentionAmount: 110000, mobilizationAdvance: 550000, advanceRecovery: 220000, otherDeductions: 0, netPayable: 1870000, status: 'approved' },
    ],
  },
  {
    id: 'SUB-005', code: 'SC-005', companyName: 'ColorMaster Finishes', contactPerson: 'Anupam Bose', trade: 'Painting',
    phone: '+91 98220 11005', email: 'colormaster@finishes.in', gst: '27AABCC7890E5Z4', pan: 'AABCC7890E',
    address: 'Camp, Pune', city: 'Pune', state: 'Maharashtra', status: 'active',
    workOrderNumber: 'WO/2026-27/005', workOrderDate: '2026-07-01', workOrderStatus: 'active',
    projectId: 'PRJ-003', projectName: 'Prestige Towers',
    contractValue: 3200000, rateBasis: 'per_sqft',
    mobilizationAdvancePct: 8, retentionPct: 5,
    billedAmount: 1200000, paidAmount: 900000, pendingAmount: 300000,
    qualityRating: 3.9, safetyRating: 3.5, attendanceScore: 82,
    runningBills: [
      { billNo: 'RB/WO005/01', billDate: '2026-08-31', period: 'Jul–Aug 2026', grossAmount: 1200000, retentionPct: 5, retentionAmount: 60000, mobilizationAdvance: 256000, advanceRecovery: 96000, otherDeductions: 8000, netPayable: 1036000, status: 'paid', paidDate: '2026-09-10' },
    ],
  },
  {
    id: 'SUB-006', code: 'SC-006', companyName: 'Premium Flooring Experts', contactPerson: 'Vivek Joshi', trade: 'Flooring',
    phone: '+91 98220 11006', email: 'premfloor@pune.in', gst: '27AABCP2345F6Z5', pan: 'AABCP2345F',
    address: 'Hadapsar, Pune', city: 'Pune', state: 'Maharashtra', status: 'active',
    workOrderNumber: 'WO/2026-27/006', workOrderDate: '2026-07-15', workOrderStatus: 'active',
    projectId: 'PRJ-003', projectName: 'Prestige Towers',
    contractValue: 4800000, rateBasis: 'per_sqft', mbReference: 'MB-003',
    mobilizationAdvancePct: 10, retentionPct: 5,
    billedAmount: 1800000, paidAmount: 1200000, pendingAmount: 600000,
    qualityRating: 4.4, safetyRating: 4.0, attendanceScore: 88,
    runningBills: [
      { billNo: 'RB/WO006/01', billDate: '2026-09-10', period: 'Aug–Sep 2026', grossAmount: 1800000, retentionPct: 5, retentionAmount: 90000, mobilizationAdvance: 480000, advanceRecovery: 180000, otherDeductions: 0, netPayable: 1530000, status: 'approved' },
    ],
  },
  {
    id: 'SUB-007', code: 'SC-007', companyName: 'Apex Steel Fabricators', contactPerson: 'Hemant Bhatt', trade: 'Fabrication',
    phone: '+91 98220 11007', email: 'apex.steel@fab.in', gst: '27AABCA6789G7Z1', pan: 'AABCA6789G',
    address: 'Chembur, Mumbai', city: 'Mumbai', state: 'Maharashtra', status: 'active',
    workOrderNumber: 'WO/2026-27/007', workOrderDate: '2026-02-15', workOrderStatus: 'active',
    projectId: 'PRJ-002', projectName: 'MMRDA Metro Viaduct',
    contractValue: 22000000, rateBasis: 'item_rate', mbReference: 'MB-002',
    mobilizationAdvancePct: 15, retentionPct: 7.5,
    billedAmount: 14500000, paidAmount: 13000000, pendingAmount: 1500000,
    qualityRating: 4.8, safetyRating: 4.6, attendanceScore: 96,
    runningBills: [
      { billNo: 'RB/WO007/01', billDate: '2026-04-30', period: 'Feb–Apr 2026', grossAmount: 5500000, retentionPct: 7.5, retentionAmount: 412500, mobilizationAdvance: 3300000, advanceRecovery: 825000, otherDeductions: 0, netPayable: 4262500, status: 'paid', paidDate: '2026-05-20' },
      { billNo: 'RB/WO007/02', billDate: '2026-07-31', period: 'May–Jul 2026', grossAmount: 5200000, retentionPct: 7.5, retentionAmount: 390000, mobilizationAdvance: 0, advanceRecovery: 780000, otherDeductions: 35000, netPayable: 3995000, status: 'paid', paidDate: '2026-08-15' },
      { billNo: 'RB/WO007/03', billDate: '2026-09-20', period: 'Aug–Sep 2026', grossAmount: 3800000, retentionPct: 7.5, retentionAmount: 285000, mobilizationAdvance: 0, advanceRecovery: 570000, otherDeductions: 0, netPayable: 2945000, status: 'pending' },
    ],
  },
  {
    id: 'SUB-008', code: 'SC-008', companyName: 'Aqua Shield Waterproofing', contactPerson: 'Girish Palekar', trade: 'Waterproofing',
    phone: '+91 98220 11008', email: 'aquashield@wp.co.in', gst: '27AABCA0123H8Z2', pan: 'AABCA0123H',
    address: 'Ulhasnagar, Thane', city: 'Thane', state: 'Maharashtra', status: 'active',
    workOrderNumber: 'WO/2026-27/008', workOrderDate: '2026-04-01', workOrderStatus: 'active',
    projectId: 'PRJ-001', projectName: 'Lodha Skylines',
    contractValue: 2800000, rateBasis: 'per_sqft',
    mobilizationAdvancePct: 10, retentionPct: 5,
    billedAmount: 1400000, paidAmount: 1200000, pendingAmount: 200000,
    qualityRating: 4.3, safetyRating: 4.0, attendanceScore: 85,
    runningBills: [
      { billNo: 'RB/WO008/01', billDate: '2026-06-30', period: 'Apr–Jun 2026', grossAmount: 950000, retentionPct: 5, retentionAmount: 47500, mobilizationAdvance: 280000, advanceRecovery: 95000, otherDeductions: 0, netPayable: 807500, status: 'paid', paidDate: '2026-07-12' },
      { billNo: 'RB/WO008/02', billDate: '2026-09-05', period: 'Jul–Sep 2026', grossAmount: 450000, retentionPct: 5, retentionAmount: 22500, mobilizationAdvance: 0, advanceRecovery: 45000, otherDeductions: 0, netPayable: 382500, status: 'approved' },
    ],
  },
];

// ─────────────────────────────────────────────
// EQUIPMENT (10 pieces)
// ─────────────────────────────────────────────
export const equipmentSeed: Equipment[] = [
  {
    id: 'EQP-001', code: 'APX-JCB-001', name: 'JCB 3DX Backhoe Loader', equipmentType: 'JCB / Backhoe',
    make: 'JCB', model: '3DX Super', year: 2021, registrationNumber: 'GJ05-AX-1234',
    ownership: 'own', assignedProjectId: 'PRJ-004', assignedProjectName: 'NHAI NH-48',
    operatorName: 'Ravi Shankar', status: 'active',
    totalHoursRun: 4200, targetHoursPerMonth: 200, currentMonthHours: 168, totalFuelConsumed: 12600,
    fuelEntries: [
      { id: 'FE-001-1', equipmentId: 'EQP-001', date: '2026-09-01', litres: 80, ratePerLitre: 96.5, totalCost: 7720, hourMeterReading: 4060, fuelType: 'Diesel', filledBy: 'Devraj Oraon' },
      { id: 'FE-001-2', equipmentId: 'EQP-001', date: '2026-09-08', litres: 75, ratePerLitre: 96.5, totalCost: 7238, hourMeterReading: 4100, fuelType: 'Diesel', filledBy: 'Devraj Oraon' },
      { id: 'FE-001-3', equipmentId: 'EQP-001', date: '2026-09-15', litres: 82, ratePerLitre: 97.0, totalCost: 7954, hourMeterReading: 4145, fuelType: 'Diesel', filledBy: 'Devraj Oraon' },
      { id: 'FE-001-4', equipmentId: 'EQP-001', date: '2026-09-22', litres: 78, ratePerLitre: 97.0, totalCost: 7566, hourMeterReading: 4200, fuelType: 'Diesel', filledBy: 'Devraj Oraon' },
    ],
    maintenanceHistory: [
      { id: 'MH-001-1', type: 'preventive', description: '500hr Service – Oil & Filter Change', performedDate: '2026-07-10', nextDueDate: '2026-10-10', cost: 18500, invoiceNumber: 'SVC-JCB-001', vendor: 'JCB Authorized Service Surat', remarks: 'Engine oil, hydraulic oil, all filters replaced' },
      { id: 'MH-001-2', type: 'breakdown', description: 'Bucket Pin Replacement', performedDate: '2026-08-22', nextDueDate: '', cost: 4200, vendor: 'Local Welding Shop, Surat', remarks: 'Pin worn out, replaced with genuine spare' },
    ],
    documents: [
      { type: 'RC', documentNumber: 'GJ05-AX-1234', issueDate: '2021-06-01', expiryDate: '2031-06-01' },
      { type: 'Insurance', documentNumber: 'HDFCGEN/ENG/2025/88001', issueDate: '2025-11-01', expiryDate: '2026-10-31' },
      { type: 'Fitness', documentNumber: 'RTO-GJ05-FIT-001', issueDate: '2025-06-01', expiryDate: '2026-12-01' },
      { type: 'PUC', documentNumber: 'PUC-GJ05-001', issueDate: '2026-06-01', expiryDate: '2026-12-01' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 195, fuel: 290, cost: 28050 },
      { month: 'May', hours: 210, fuel: 315, cost: 30450 },
      { month: 'Jun', hours: 185, fuel: 278, cost: 26880 },
      { month: 'Jul', hours: 220, fuel: 330, cost: 31920 },
      { month: 'Aug', hours: 200, fuel: 300, cost: 29100 },
      { month: 'Sep', hours: 168, fuel: 315, cost: 30478 },
    ],
  },
  {
    id: 'EQP-002', code: 'APX-EXC-001', name: 'Volvo EC200D Excavator', equipmentType: 'Excavator',
    make: 'Volvo', model: 'EC200D', year: 2020, registrationNumber: 'GJ05-BZ-5678',
    ownership: 'own', assignedProjectId: 'PRJ-004', assignedProjectName: 'NHAI NH-48',
    operatorName: 'Mahesh Thorat', status: 'active',
    totalHoursRun: 5800, targetHoursPerMonth: 220, currentMonthHours: 195, totalFuelConsumed: 20300,
    fuelEntries: [
      { id: 'FE-002-1', equipmentId: 'EQP-002', date: '2026-09-02', litres: 120, ratePerLitre: 96.5, totalCost: 11580, hourMeterReading: 5640, fuelType: 'Diesel', filledBy: 'Sanjay Verma' },
      { id: 'FE-002-2', equipmentId: 'EQP-002', date: '2026-09-10', litres: 115, ratePerLitre: 96.5, totalCost: 11098, hourMeterReading: 5700, fuelType: 'Diesel', filledBy: 'Sanjay Verma' },
      { id: 'FE-002-3', equipmentId: 'EQP-002', date: '2026-09-18', litres: 118, ratePerLitre: 97.0, totalCost: 11446, hourMeterReading: 5760, fuelType: 'Diesel', filledBy: 'Sanjay Verma' },
    ],
    maintenanceHistory: [
      { id: 'MH-002-1', type: 'preventive', description: '1000hr Service – Major Overhaul', performedDate: '2026-06-15', nextDueDate: '2026-12-15', cost: 65000, invoiceNumber: 'SVC-VOLVO-001', vendor: 'Volvo CE Authorized Surat', remarks: 'Full 1000hr service, track adjustment, bucket teeth replaced' },
    ],
    documents: [
      { type: 'RC', documentNumber: 'GJ05-BZ-5678', issueDate: '2020-03-15', expiryDate: '2030-03-15' },
      { type: 'Insurance', documentNumber: 'ICICI/ENG/2025/55123', issueDate: '2025-10-01', expiryDate: '2026-09-30' },
      { type: 'Fitness', documentNumber: 'RTO-GJ05-FIT-002', issueDate: '2025-03-15', expiryDate: '2026-09-30' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 218, fuel: 436, cost: 42100 },
      { month: 'May', hours: 225, fuel: 450, cost: 43500 },
      { month: 'Jun', hours: 200, fuel: 400, cost: 38700 },
      { month: 'Jul', hours: 230, fuel: 460, cost: 44460 },
      { month: 'Aug', hours: 215, fuel: 430, cost: 41590 },
      { month: 'Sep', hours: 195, fuel: 353, cost: 34124 },
    ],
  },
  {
    id: 'EQP-003', code: 'APX-CRN-001', name: 'Tower Crane TC5013', equipmentType: 'Tower Crane',
    make: 'Liebherr', model: 'TC5013', year: 2019, ownership: 'rented',
    rentalVendor: 'Himax Crane Rentals Pvt Ltd', rentalRatePerDay: 22000,
    assignedProjectId: 'PRJ-001', assignedProjectName: 'Lodha Skylines',
    operatorName: 'Saurabh Gaikwad', status: 'active',
    totalHoursRun: 8200, targetHoursPerMonth: 240, currentMonthHours: 220, totalFuelConsumed: 0,
    fuelEntries: [],
    maintenanceHistory: [
      { id: 'MH-003-1', type: 'preventive', description: 'Wire rope inspection & lubrication', performedDate: '2026-08-01', nextDueDate: '2026-11-01', cost: 12000, vendor: 'Liebherr Service Team', remarks: 'All ropes OK, trolley motors lubricated' },
    ],
    documents: [
      { type: 'Insurance', documentNumber: 'BAJAJ/CRANE/2025/33091', issueDate: '2025-12-01', expiryDate: '2026-11-30' },
      { type: 'Permit', documentNumber: 'MCGM/CRANE/2026/PRJ001', issueDate: '2026-03-01', expiryDate: '2027-03-01' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 240, fuel: 0, cost: 660000 },
      { month: 'May', hours: 248, fuel: 0, cost: 682000 },
      { month: 'Jun', hours: 230, fuel: 0, cost: 633000 },
      { month: 'Jul', hours: 252, fuel: 0, cost: 693000 },
      { month: 'Aug', hours: 238, fuel: 0, cost: 654500 },
      { month: 'Sep', hours: 220, fuel: 0, cost: 605000 },
    ],
  },
  {
    id: 'EQP-004', code: 'APX-GEN-001', name: 'Kirloskar 250 kVA Generator', equipmentType: 'Generator',
    make: 'Kirloskar', model: 'KG2-250WS', year: 2022, registrationNumber: 'MH04-DG-0012',
    ownership: 'own', assignedProjectId: 'PRJ-001', assignedProjectName: 'Lodha Skylines',
    operatorName: 'Vijay Kamble', status: 'active',
    totalHoursRun: 3100, targetHoursPerMonth: 150, currentMonthHours: 112, totalFuelConsumed: 9300,
    fuelEntries: [
      { id: 'FE-004-1', equipmentId: 'EQP-004', date: '2026-09-05', litres: 60, ratePerLitre: 96.5, totalCost: 5790, hourMeterReading: 3010, fuelType: 'Diesel', filledBy: 'Aditya Bhushan' },
      { id: 'FE-004-2', equipmentId: 'EQP-004', date: '2026-09-15', litres: 55, ratePerLitre: 97.0, totalCost: 5335, hourMeterReading: 3060, fuelType: 'Diesel', filledBy: 'Aditya Bhushan' },
    ],
    maintenanceHistory: [
      { id: 'MH-004-1', type: 'preventive', description: '250hr Service – Oil Change + Coolant top-up', performedDate: '2026-07-20', nextDueDate: '2026-10-20', cost: 8500, vendor: 'Kirloskar Service Thane', invoiceNumber: 'KS-THN-0421' },
    ],
    documents: [
      { type: 'Insurance', documentNumber: 'NIAC/DG/2025/11442', issueDate: '2025-11-01', expiryDate: '2026-10-31' },
      { type: 'PUC', documentNumber: 'PUC-MH04-012', issueDate: '2026-05-01', expiryDate: '2026-10-31' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 148, fuel: 88, cost: 8492 },
      { month: 'May', hours: 155, fuel: 93, cost: 8980 },
      { month: 'Jun', hours: 140, fuel: 84, cost: 8106 },
      { month: 'Jul', hours: 160, fuel: 96, cost: 9264 },
      { month: 'Aug', hours: 145, fuel: 87, cost: 8395 },
      { month: 'Sep', hours: 112, fuel: 115, cost: 11125 },
    ],
  },
  {
    id: 'EQP-005', code: 'APX-TRK-001', name: 'Tata 2518 Tipper Truck', equipmentType: 'Truck / Tipper',
    make: 'Tata Motors', model: '2518', year: 2022, registrationNumber: 'GJ05-CP-7890',
    ownership: 'own', assignedProjectId: 'PRJ-004', assignedProjectName: 'NHAI NH-48',
    operatorName: 'Devraj Oraon', status: 'active',
    totalHoursRun: 2800, targetHoursPerMonth: 200, currentMonthHours: 180, totalFuelConsumed: 11200,
    fuelEntries: [
      { id: 'FE-005-1', equipmentId: 'EQP-005', date: '2026-09-03', litres: 90, ratePerLitre: 96.5, totalCost: 8685, kmReading: 82400, fuelType: 'Diesel', filledBy: 'Devraj Oraon' },
      { id: 'FE-005-2', equipmentId: 'EQP-005', date: '2026-09-12', litres: 85, ratePerLitre: 96.5, totalCost: 8203, kmReading: 83100, fuelType: 'Diesel', filledBy: 'Devraj Oraon' },
      { id: 'FE-005-3', equipmentId: 'EQP-005', date: '2026-09-20', litres: 88, ratePerLitre: 97.0, totalCost: 8536, kmReading: 83750, fuelType: 'Diesel', filledBy: 'Devraj Oraon' },
    ],
    maintenanceHistory: [
      { id: 'MH-005-1', type: 'preventive', description: '20,000km Service – Engine Oil + Gear Oil', performedDate: '2026-08-10', nextDueDate: '2026-12-10', cost: 14000, vendor: 'Tata Motors Authorized – Surat', invoiceNumber: 'TATA-SU-0088' },
    ],
    documents: [
      { type: 'RC', documentNumber: 'GJ05-CP-7890', issueDate: '2022-03-10', expiryDate: '2032-03-10' },
      { type: 'Insurance', documentNumber: 'UDIC/CMV/2025/77231', issueDate: '2025-12-01', expiryDate: '2026-11-30' },
      { type: 'Fitness', documentNumber: 'RTO-GJ05-FIT-005', issueDate: '2025-09-01', expiryDate: '2026-08-31' },
      { type: 'PUC', documentNumber: 'PUC-GJ05-005', issueDate: '2026-08-01', expiryDate: '2026-10-31' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 198, fuel: 340, cost: 32800 },
      { month: 'May', hours: 205, fuel: 355, cost: 34250 },
      { month: 'Jun', hours: 185, fuel: 320, cost: 30880 },
      { month: 'Jul', hours: 210, fuel: 360, cost: 34740 },
      { month: 'Aug', hours: 195, fuel: 338, cost: 32620 },
      { month: 'Sep', hours: 180, fuel: 263, cost: 25424 },
    ],
  },
  {
    id: 'EQP-006', code: 'APX-MXR-001', name: 'Schwing Stetter Concrete Mixer 8 CUM', equipmentType: 'Concrete Mixer',
    make: 'Schwing Stetter', model: 'AM 8 TM', year: 2023, registrationNumber: 'MH04-EF-3344',
    ownership: 'own', assignedProjectId: 'PRJ-001', assignedProjectName: 'Lodha Skylines',
    operatorName: 'Surendra Mahale', status: 'active',
    totalHoursRun: 1800, targetHoursPerMonth: 180, currentMonthHours: 155, totalFuelConsumed: 5400,
    fuelEntries: [
      { id: 'FE-006-1', equipmentId: 'EQP-006', date: '2026-09-07', litres: 55, ratePerLitre: 96.5, totalCost: 5308, hourMeterReading: 1740, fuelType: 'Diesel', filledBy: 'Aditya Bhushan' },
      { id: 'FE-006-2', equipmentId: 'EQP-006', date: '2026-09-18', litres: 50, ratePerLitre: 97.0, totalCost: 4850, hourMeterReading: 1780, fuelType: 'Diesel', filledBy: 'Aditya Bhushan' },
    ],
    maintenanceHistory: [],
    documents: [
      { type: 'RC', documentNumber: 'MH04-EF-3344', issueDate: '2023-01-15', expiryDate: '2033-01-15' },
      { type: 'Insurance', documentNumber: 'ORICNT/CMV/2025/88432', issueDate: '2026-01-15', expiryDate: '2027-01-14' },
      { type: 'PUC', documentNumber: 'PUC-MH04-3344', issueDate: '2026-07-01', expiryDate: '2026-12-31' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 172, fuel: 95, cost: 9170 },
      { month: 'May', hours: 185, fuel: 102, cost: 9840 },
      { month: 'Jun', hours: 165, fuel: 91, cost: 8780 },
      { month: 'Jul', hours: 190, fuel: 105, cost: 10140 },
      { month: 'Aug', hours: 178, fuel: 98, cost: 9460 },
      { month: 'Sep', hours: 155, fuel: 105, cost: 10158 },
    ],
  },
  {
    id: 'EQP-007', code: 'APX-CMP-001', name: 'Atlas Copco Compressor', equipmentType: 'Compressor',
    make: 'Atlas Copco', model: 'XAS 185', year: 2020, registrationNumber: 'MH04-GH-5566',
    ownership: 'rented', rentalVendor: 'National Compressor Hire', rentalRatePerDay: 3500,
    assignedProjectId: 'PRJ-002', assignedProjectName: 'MMRDA Metro Viaduct',
    operatorName: 'Subramaniam Pillai', status: 'under_maintenance',
    totalHoursRun: 6200, targetHoursPerMonth: 200, currentMonthHours: 88, totalFuelConsumed: 15500,
    fuelEntries: [
      { id: 'FE-007-1', equipmentId: 'EQP-007', date: '2026-09-01', litres: 45, ratePerLitre: 96.5, totalCost: 4343, hourMeterReading: 6155, fuelType: 'Diesel', filledBy: 'Subramaniam Pillai' },
    ],
    maintenanceHistory: [
      { id: 'MH-007-1', type: 'breakdown', description: 'Air valve failure – repair underway', performedDate: '2026-09-12', nextDueDate: '2026-09-28', cost: 28000, vendor: 'Atlas Copco Service Mumbai', remarks: 'Machine down since Sep 12. Parts on order.' },
    ],
    documents: [
      { type: 'Insurance', documentNumber: 'NIAC/COMP/2025/29991', issueDate: '2025-10-01', expiryDate: '2026-09-30' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 205, fuel: 250, cost: 24150 },
      { month: 'May', hours: 200, fuel: 244, cost: 23570 },
      { month: 'Jun', hours: 190, fuel: 232, cost: 22400 },
      { month: 'Jul', hours: 210, fuel: 256, cost: 24730 },
      { month: 'Aug', hours: 198, fuel: 241, cost: 23280 },
      { month: 'Sep', hours: 88, fuel: 45, cost: 4343 },
    ],
  },
  {
    id: 'EQP-008', code: 'APX-BP-001', name: 'Ajax Fiori Batching Plant 30 m3/hr', equipmentType: 'Batching Plant',
    make: 'Ajax Fiori', model: 'Argo 2000', year: 2022, ownership: 'own',
    assignedProjectId: 'PRJ-002', assignedProjectName: 'MMRDA Metro Viaduct',
    operatorName: 'Hemant Shinde', status: 'idle',
    totalHoursRun: 2100, targetHoursPerMonth: 160, currentMonthHours: 0, totalFuelConsumed: 6300,
    fuelEntries: [],
    maintenanceHistory: [
      { id: 'MH-008-1', type: 'preventive', description: 'Belt Tensioning + Conveyor Inspection', performedDate: '2026-09-05', nextDueDate: '2026-12-05', cost: 6500, vendor: 'Ajax Fiori Service Team', invoiceNumber: 'AFS-2026-009' },
    ],
    documents: [
      { type: 'Insurance', documentNumber: 'HDFC/PLANT/2026/00331', issueDate: '2026-04-01', expiryDate: '2027-03-31' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 160, fuel: 190, cost: 18350 },
      { month: 'May', hours: 175, fuel: 208, cost: 20100 },
      { month: 'Jun', hours: 150, fuel: 178, cost: 17200 },
      { month: 'Jul', hours: 180, fuel: 214, cost: 20680 },
      { month: 'Aug', hours: 170, fuel: 202, cost: 19510 },
      { month: 'Sep', hours: 0, fuel: 0, cost: 0 },
    ],
  },
  {
    id: 'EQP-009', code: 'APX-CPM-001', name: 'Schwing Concrete Pump S 36 SX', equipmentType: 'Concrete Pump',
    make: 'Schwing Stetter', model: 'S 36 SX', year: 2021, registrationNumber: 'MH04-KL-7788',
    ownership: 'rented', rentalVendor: 'Himax Crane Rentals Pvt Ltd', rentalRatePerDay: 18000,
    assignedProjectId: 'PRJ-001', assignedProjectName: 'Lodha Skylines',
    operatorName: 'Prashant Kale', status: 'active',
    totalHoursRun: 3600, targetHoursPerMonth: 170, currentMonthHours: 145, totalFuelConsumed: 10800,
    fuelEntries: [
      { id: 'FE-009-1', equipmentId: 'EQP-009', date: '2026-09-06', litres: 65, ratePerLitre: 96.5, totalCost: 6273, hourMeterReading: 3540, fuelType: 'Diesel', filledBy: 'Prashant Kale' },
      { id: 'FE-009-2', equipmentId: 'EQP-009', date: '2026-09-19', litres: 62, ratePerLitre: 97.0, totalCost: 6014, hourMeterReading: 3580, fuelType: 'Diesel', filledBy: 'Prashant Kale' },
    ],
    maintenanceHistory: [],
    documents: [
      { type: 'RC', documentNumber: 'MH04-KL-7788', issueDate: '2021-08-01', expiryDate: '2031-08-01' },
      { type: 'Insurance', documentNumber: 'TATA/AIG/2025/67100', issueDate: '2025-11-01', expiryDate: '2026-10-31' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 165, fuel: 130, cost: 12550 },
      { month: 'May', hours: 172, fuel: 136, cost: 13130 },
      { month: 'Jun', hours: 155, fuel: 122, cost: 11790 },
      { month: 'Jul', hours: 178, fuel: 140, cost: 13520 },
      { month: 'Aug', hours: 168, fuel: 132, cost: 12750 },
      { month: 'Sep', hours: 145, fuel: 127, cost: 12287 },
    ],
  },
  {
    id: 'EQP-010', code: 'APX-VIB-001', name: 'IMER Poker Vibrator 55mm', equipmentType: 'Vibrator',
    make: 'IMER', model: 'VR 55E', year: 2023, ownership: 'own',
    assignedProjectId: 'PRJ-003', assignedProjectName: 'Prestige Towers',
    operatorName: 'Kiran Malhotra', status: 'active',
    totalHoursRun: 900, targetHoursPerMonth: 100, currentMonthHours: 82, totalFuelConsumed: 0,
    fuelEntries: [],
    maintenanceHistory: [],
    documents: [
      { type: 'Insurance', documentNumber: 'NIAC/TOOL/2026/00021', issueDate: '2026-01-01', expiryDate: '2027-12-31' },
    ],
    monthlyUsage: [
      { month: 'Apr', hours: 95, fuel: 0, cost: 0 },
      { month: 'May', hours: 100, fuel: 0, cost: 0 },
      { month: 'Jun', hours: 88, fuel: 0, cost: 0 },
      { month: 'Jul', hours: 102, fuel: 0, cost: 0 },
      { month: 'Aug', hours: 98, fuel: 0, cost: 0 },
      { month: 'Sep', hours: 82, fuel: 0, cost: 0 },
    ],
  },
];

// ─────────────────────────────────────────────
// MAINTENANCE SCHEDULES
// ─────────────────────────────────────────────
export const maintenanceScheduleSeed: MaintenanceSchedule[] = [
  { id: 'MS-001', equipmentId: 'EQP-001', equipmentName: 'JCB 3DX Backhoe Loader', equipmentCode: 'APX-JCB-001', serviceType: '500hr Preventive Service', lastServiceDate: '2026-07-10', lastServiceHours: 3700, nextDueDate: '2026-10-10', nextDueHours: 4200, currentHours: 4200, vendor: 'JCB Authorized Service Surat', estimatedCost: 18500, status: 'due_this_week' },
  { id: 'MS-002', equipmentId: 'EQP-002', equipmentName: 'Volvo EC200D Excavator', equipmentCode: 'APX-EXC-001', serviceType: '1000hr Major Overhaul', lastServiceDate: '2026-06-15', lastServiceHours: 5000, nextDueDate: '2026-12-15', nextDueHours: 6000, currentHours: 5800, vendor: 'Volvo CE Authorized Surat', estimatedCost: 65000, status: 'upcoming' },
  { id: 'MS-003', equipmentId: 'EQP-003', equipmentName: 'Tower Crane TC5013', equipmentCode: 'APX-CRN-001', serviceType: 'Wire Rope & Hook Inspection', lastServiceDate: '2026-08-01', lastServiceHours: 7980, nextDueDate: '2026-11-01', nextDueHours: 9000, currentHours: 8200, vendor: 'Liebherr Service Team', estimatedCost: 12000, status: 'upcoming' },
  { id: 'MS-004', equipmentId: 'EQP-004', equipmentName: 'Kirloskar 250 kVA Generator', equipmentCode: 'APX-GEN-001', serviceType: '250hr Service', lastServiceDate: '2026-07-20', lastServiceHours: 2850, nextDueDate: '2026-10-20', nextDueHours: 3100, currentHours: 3100, vendor: 'Kirloskar Service Thane', estimatedCost: 8500, status: 'due_this_week' },
  { id: 'MS-005', equipmentId: 'EQP-005', equipmentName: 'Tata 2518 Tipper Truck', equipmentCode: 'APX-TRK-001', serviceType: 'Fitness Certificate Renewal', lastServiceDate: '2025-09-01', lastServiceHours: 0, nextDueDate: '2026-08-31', nextDueHours: 0, currentHours: 0, vendor: 'RTO Gujarat + Authorized Workshop', estimatedCost: 4500, status: 'overdue' },
  { id: 'MS-006', equipmentId: 'EQP-006', equipmentName: 'Concrete Mixer 8 CUM', equipmentCode: 'APX-MXR-001', serviceType: 'Drum & Fins Inspection', lastServiceDate: '2026-06-01', lastServiceHours: 1600, nextDueDate: '2026-10-01', nextDueHours: 2000, currentHours: 1800, vendor: 'Schwing Stetter Mumbai', estimatedCost: 7500, status: 'upcoming' },
  { id: 'MS-007', equipmentId: 'EQP-007', equipmentName: 'Atlas Copco Compressor', equipmentCode: 'APX-CMP-001', serviceType: 'Air Valve Repair (Breakdown)', lastServiceDate: '2026-09-12', lastServiceHours: 6180, nextDueDate: '2026-09-28', nextDueHours: 6200, currentHours: 6200, vendor: 'Atlas Copco Service Mumbai', estimatedCost: 28000, status: 'due_this_week' },
  { id: 'MS-008', equipmentId: 'EQP-008', equipmentName: 'Ajax Fiori Batching Plant', equipmentCode: 'APX-BP-001', serviceType: 'Belt & Conveyor Inspection', lastServiceDate: '2026-09-05', lastServiceHours: 2100, nextDueDate: '2026-12-05', nextDueHours: 2400, currentHours: 2100, vendor: 'Ajax Fiori Service Team', estimatedCost: 6500, status: 'upcoming' },
  { id: 'MS-009', equipmentId: 'EQP-002', equipmentName: 'Volvo EC200D Excavator', equipmentCode: 'APX-EXC-001', serviceType: 'Insurance Renewal', lastServiceDate: '2025-10-01', lastServiceHours: 0, nextDueDate: '2026-09-30', nextDueHours: 0, currentHours: 0, vendor: 'ICICI Lombard GIC', estimatedCost: 42000, status: 'due_this_week' },
  { id: 'MS-010', equipmentId: 'EQP-009', equipmentName: 'Schwing Concrete Pump', equipmentCode: 'APX-CPM-001', serviceType: '500hr Boom & Pipes Inspection', lastServiceDate: '2026-05-15', lastServiceHours: 3100, nextDueDate: '2026-11-15', nextDueHours: 3600, currentHours: 3600, vendor: 'Schwing Stetter Mumbai', estimatedCost: 22000, status: 'due_this_week' },
];
