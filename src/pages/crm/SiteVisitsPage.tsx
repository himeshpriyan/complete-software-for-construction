import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
  Zap,
  Droplet,
  Truck,
  Plus,
  Copy,
  Check,
  Eye,
  ShieldCheck,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { DataTable } from '../../components/ui/DataTable';
import { useAppStore } from '../../store/useAppStore';
import { SiteVisit, ColumnDef } from '../../types';
import { updateSiteVisitStatus, createSiteVisit } from '../../services/crmService';
import { cn } from '../../utils/cn';

export const SiteVisitsPage: React.FC = () => {
  const navigate = useNavigate();
  const { siteVisits, openSlideOver, closeSlideOver, currentUser } = useAppStore();

  const [statusFilter, setStatusFilter] = useState<'ALL' | SiteVisit['status']>('ALL');
  const [copiedGps, setCopiedGps] = useState<string | null>(null);

  const filteredVisits = statusFilter === 'ALL'
    ? siteVisits
    : siteVisits.filter((v) => v.status === statusFilter);

  // Copy GPS helper
  const handleCopyGps = (coords: string) => {
    navigator.clipboard.writeText(coords);
    setCopiedGps(coords);
    setTimeout(() => setCopiedGps(null), 2000);
  };

  // Inspect Site Visit Details
  const handleInspectVisit = (visit: SiteVisit) => {
    openSlideOver(
      `Site Inspection Report: ${visit.leadName}`,
      <div className="space-y-6 text-slate-800">
        {/* Header Summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              {visit.id}
            </span>
            <StatusBadge status={visit.status} label={visit.status.replace('_', ' ').toUpperCase()} size="sm" />
          </div>
          <h3 className="text-lg font-black text-slate-900">{visit.customerName}</h3>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-amber-600" />
            {visit.siteLocation} ({visit.city})
          </p>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Engineer: <strong>{visit.assignedEngineer}</strong></span>
            <span>Date: {visit.visitDate} {visit.visitTime ? `• ${visit.visitTime}` : ''}</span>
          </div>
        </div>

        {/* Static Map Visualizer Placeholder with GPS coordinate overlay */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Geographical Coordinates & Satellite Map
            </span>
            <button
              onClick={() => handleCopyGps(visit.geoCoordinates)}
              className="inline-flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800 font-semibold"
            >
              {copiedGps === visit.geoCoordinates ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              <span>{copiedGps === visit.geoCoordinates ? 'Copied' : 'Copy GPS'}</span>
            </button>
          </div>

          <div className="relative h-44 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 flex items-center justify-center shadow-inner group">
            {/* Simulated Satellite Map Background */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

            {/* Map Pin Marker */}
            <div className="relative z-10 flex flex-col items-center animate-bounce">
              <div className="h-8 w-8 rounded-full bg-amber-600 text-slate-950 flex items-center justify-center shadow-lg font-bold">
                <MapPin className="h-5 w-5 text-slate-950" />
              </div>
              <div className="h-2 w-2 rounded-full bg-amber-500 mt-1 shadow-sm" />
            </div>

            {/* Bottom GPS badge */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-white text-xs font-mono">
              <span>GPS: {visit.geoCoordinates}</span>
              <span className="text-[10px] text-emerald-400 font-sans font-bold">High Precision ±2m</span>
            </div>
          </div>
        </div>

        {/* Infrastructure & Utilities Yes/No Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Site Infrastructure & Utility Feasibility
          </span>
          <div className="grid grid-cols-3 gap-2">
            {/* Road */}
            <div className={cn('p-3 rounded-lg border flex flex-col items-center justify-center gap-1 text-center', visit.roadAccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800')}>
              <Truck className="h-4 w-4" />
              <span className="text-[11px] font-bold">Road Access</span>
              <span className="text-[10px] uppercase font-bold">{visit.roadAccess ? 'Available' : 'No Access'}</span>
            </div>

            {/* Power */}
            <div className={cn('p-3 rounded-lg border flex flex-col items-center justify-center gap-1 text-center', visit.electricityAccess ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800')}>
              <Zap className="h-4 w-4" />
              <span className="text-[11px] font-bold">3-Phase Power</span>
              <span className="text-[10px] uppercase font-bold">{visit.electricityAccess ? 'Connected' : 'Pending Line'}</span>
            </div>

            {/* Water */}
            <div className="p-3 rounded-lg border bg-sky-50 border-sky-200 text-sky-800 flex flex-col items-center justify-center gap-1 text-center">
              <Droplet className="h-4 w-4" />
              <span className="text-[11px] font-bold">Water Supply</span>
              <span className="text-[10px] uppercase font-bold">{visit.waterSource}</span>
            </div>
          </div>
        </div>

        {/* Site Dimensions, Soil & Topography */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-2xs text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Plot Dimensions & Shape</span>
            <p className="font-bold text-slate-800 mt-0.5">{visit.landDimensions}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Geotechnical / Soil Observations</span>
            <p className="font-semibold text-slate-700 mt-0.5 leading-relaxed">{visit.soilType}</p>
          </div>
          {visit.existingStructureNotes && (
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Existing Structures & Demolition</span>
              <p className="text-slate-600 mt-0.5 leading-relaxed">{visit.existingStructureNotes}</p>
            </div>
          )}
          {visit.siteConstraints && (
            <div>
              <span className="text-[10px] uppercase font-bold text-rose-500 block">Site Constraints & Risks</span>
              <p className="text-rose-700 font-medium mt-0.5 leading-relaxed">{visit.siteConstraints}</p>
            </div>
          )}
          {visit.engineerRemarks && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Engineer Recommendation</span>
              <p className="text-slate-800 italic mt-0.5">"{visit.engineerRemarks}"</p>
            </div>
          )}
        </div>

        {/* Site Photos Gallery */}
        {visit.photos && visit.photos.length > 0 && (
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Site Photographs ({visit.photos.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {visit.photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                  <img src={photo} alt={`Site photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] bg-slate-950/70 text-white font-mono">
                    Photo #{idx + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Flow Progression Action */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-600">Approval Flow:</span>
          <div className="flex items-center gap-2">
            {visit.status === 'scheduled' && (
              <button
                onClick={() => {
                  updateSiteVisitStatus(visit.id, 'completed', 'Inspection finished on-site.');
                  closeSlideOver();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm"
              >
                Mark Completed
              </button>
            )}
            {visit.status === 'completed' && (
              <button
                onClick={() => {
                  updateSiteVisitStatus(visit.id, 'submitted', 'Report compiled and submitted for PM review.');
                  closeSlideOver();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
              >
                Submit for PM Review
              </button>
            )}
            {visit.status === 'submitted' && (
              <button
                onClick={() => {
                  updateSiteVisitStatus(visit.id, 'approved', 'Manager approved for BOQ and estimation.');
                  closeSlideOver();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
              >
                Manager Approve (BOQ Ready)
              </button>
            )}
            {visit.status === 'approved' && (
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Fully Certified
                </span>
                <button
                  onClick={() => {
                    closeSlideOver();
                    navigate('/estimation/estimates');
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1 transition-colors"
                >
                  <span>Create BOQ</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>,
      'Site Inspection Dossier'
    );
  };

  // Mobile Data Entry Form (Simulating phone screen entry for Site Engineer)
  const handleOpenMobileReportForm = () => {
    let report = {
      leadId: 'LEAD-001',
      leadName: 'New Inspection Lead',
      customerName: '',
      customerPhone: '',
      siteLocation: '',
      city: 'Mumbai',
      geoCoordinates: '19.0176° N, 72.8561° E',
      landDimensions: '100m × 80m',
      soilType: 'Clayey Soil',
      roadAccess: true,
      electricityAccess: true,
      waterSource: 'Borewell' as const,
      existingStructureNotes: '',
      siteConstraints: '',
      photos: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=400&q=80',
      ],
      status: 'submitted' as const,
      assignedEngineer: currentUser?.name || 'Amit Patel',
      visitDate: '2026-09-22',
      visitTime: 'Today',
      engineerRemarks: '',
    };

    openSlideOver(
      'Site Visit Report (Mobile Field Form)',
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!report.customerName || !report.siteLocation) return;
          createSiteVisit(report);
          closeSlideOver();
        }}
        className="space-y-4"
      >
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-medium">
          <Compass className="h-4 w-4 text-amber-600 flex-shrink-0" />
          <span>Mobile-optimized for site engineers: big touch targets (min 48px) and quick toggles.</span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">Client / Site Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Shapoorji Palava Extension"
            onChange={(e) => {
              report.customerName = e.target.value;
              report.leadName = e.target.value;
            }}
            className="mt-1 w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl min-h-[48px] focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">Site Location Address *</label>
          <input
            type="text"
            required
            placeholder="Plot / Survey No, Landmark, City"
            onChange={(e) => (report.siteLocation = e.target.value)}
            className="mt-1 w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl min-h-[48px] focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* GPS Capture Mock Button */}
        <div className="p-3 rounded-xl border border-dashed border-amber-500 bg-amber-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-slate-900 block">GPS Coordinates</span>
            <span className="text-[11px] font-mono text-slate-600">19.0176° N, 72.8561° E (Simulated)</span>
          </div>
          <button
            type="button"
            onClick={() => alert('📍 Geolocation captured: 19.0760° N, 72.8777° E (±1.5m accuracy)')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs min-h-[44px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <MapPin className="h-4 w-4 text-amber-500" />
            <span>Capture Live Geolocation</span>
          </button>
        </div>

        {/* Camera Upload Mock Button */}
        <div className="p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-800 block">Site Photographs</span>
            <span className="text-[11px] text-slate-500">1 Photo captured from camera</span>
          </div>
          <button
            type="button"
            onClick={() => alert('📸 Camera triggered: Site photo attached with watermark.')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs min-h-[44px] flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Camera className="h-4 w-4" />
            <span>Snap Camera Photo</span>
          </button>
        </div>

        {/* Soil & Foundation */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">Soil & Strata Type</label>
          <input
            type="text"
            placeholder="e.g. Hard Murrum / Basalt Rock at 2m"
            onChange={(e) => (report.soilType = e.target.value)}
            className="mt-1 w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl min-h-[48px]"
          />
        </div>

        {/* Engineer Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide">Site Constraints / Engineer Notes</label>
          <textarea
            rows={3}
            placeholder="Note high-tension lines, slope, drainage, or access road width..."
            onChange={(e) => (report.engineerRemarks = e.target.value)}
            className="mt-1 w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl"
          />
        </div>

        {/* Bottom submit */}
        <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <button type="button" onClick={closeSlideOver} className="px-4 py-3 text-xs font-bold text-slate-600 min-h-[48px]">
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm min-h-[48px] shadow-md shadow-amber-600/20"
          >
            Submit Field Inspection Report
          </button>
        </div>
      </form>,
      'Mobile Data Entry Form for Site Engineers'
    );
  };

  const visitColumns: ColumnDef<SiteVisit>[] = [
    {
      key: 'id',
      header: 'ID',
      width: '90px',
      sortable: true,
      render: (v) => <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">{v.id}</span>,
    },
    {
      key: 'customerName',
      header: 'Customer & Project',
      sortable: true,
      render: (v) => (
        <div>
          <p className="font-bold text-slate-900 leading-snug">{v.customerName}</p>
          <p className="text-[11px] text-slate-500">{v.leadName}</p>
        </div>
      ),
    },
    {
      key: 'siteLocation',
      header: 'Site Location',
      sortable: true,
      render: (v) => (
        <div>
          <p className="text-slate-800 font-medium text-xs">{v.siteLocation}</p>
          <span className="text-[10px] font-mono text-amber-700">{v.geoCoordinates}</span>
        </div>
      ),
    },
    {
      key: 'assignedEngineer',
      header: 'Assigned Engineer',
      sortable: true,
      width: '150px',
      render: (v) => (
        <div className="flex items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-indigo-600" />
          <span className="text-xs font-medium text-slate-800">{v.assignedEngineer}</span>
        </div>
      ),
    },
    {
      key: 'visitDate',
      header: 'Inspection Date',
      sortable: true,
      width: '130px',
      render: (v) => <span className="text-xs font-mono text-slate-700">{v.visitDate}</span>,
    },
    {
      key: 'status',
      header: 'Inspection Status',
      sortable: true,
      width: '140px',
      render: (v) => <StatusBadge status={v.status} label={v.status.replace('_', ' ').toUpperCase()} size="sm" />,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Site Visit & Feasibility Inspections"
        subtitle="Manage on-site land surveys, GPS telemetry, soil conditions, and infrastructure utility checks."
        breadcrumbs={[{ label: 'CRM', path: '/crm/leads' }, { label: 'Site Visits' }]}
        badge={`${siteVisits.length} Site Surveys`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenMobileReportForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Camera className="h-4 w-4" />
              <span>Fill Field Inspection Report</span>
            </button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex rounded-lg bg-white p-1 border border-slate-200 overflow-x-auto">
        {(['ALL', 'scheduled', 'completed', 'submitted', 'approved'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={cn(
              'px-3 py-1.5 text-xs font-bold rounded-md transition-all capitalize whitespace-nowrap',
              statusFilter === st
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            )}
          >
            {st === 'ALL' ? 'All Inspections' : st}
          </button>
        ))}
      </div>

      {/* Visits Table */}
      <DataTable<SiteVisit>
        data={filteredVisits}
        columns={visitColumns}
        pageSize={8}
        onRowClick={handleInspectVisit}
        searchPlaceholder="Search by site location, customer, or engineer..."
      />
    </div>
  );
};
