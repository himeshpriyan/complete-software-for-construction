import React, { useState } from 'react';
import { Project } from '../../../types';
import {
  FileText,
  Download,
  FolderOpen,
  Search,
  Upload,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface ProjectDocumentsTabProps {
  project: Project;
}

export const ProjectDocumentsTab: React.FC<ProjectDocumentsTabProps> = ({ project }) => {
  const [activeFolder, setActiveFolder] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const documents = [
    {
      id: 'doc-1',
      title: 'Good-For-Construction (GFC) - Structural Slabs & Columns Set R3',
      category: 'gfc_drawings',
      fileType: 'PDF / CAD',
      size: '42.8 MB',
      version: 'Rev 3.2',
      updatedDate: '2026-03-12',
      status: 'approved',
      author: 'Design Cell',
    },
    {
      id: 'doc-2',
      title: 'Geotechnical & Soil Investigation Borehole Stratification Report',
      category: 'investigation',
      fileType: 'PDF',
      size: '18.4 MB',
      version: 'Final',
      updatedDate: '2025-11-20',
      status: 'approved',
      author: 'IIT Bombay Geo Lab',
    },
    {
      id: 'doc-3',
      title: 'Site Safety Environmental Management Plan (HSE-SMP-2026)',
      category: 'safety',
      fileType: 'PDF',
      size: '6.2 MB',
      version: 'Rev 1.0',
      updatedDate: '2026-01-15',
      status: 'approved',
      author: 'Safety Directorate',
    },
    {
      id: 'doc-4',
      title: 'MEP Electrical Single Line Diagram (SLD) & DG Load Analysis',
      category: 'mep_drawings',
      fileType: 'PDF / DWG',
      size: '28.1 MB',
      version: 'Rev 2.0',
      updatedDate: '2026-02-28',
      status: 'approved',
      author: 'Sterling MEP Consultants',
    },
    {
      id: 'doc-5',
      title: 'Quality Assurance Plan & Mix Design Approval (M30/M40 RMC)',
      category: 'qa_qc',
      fileType: 'PDF',
      size: '9.5 MB',
      version: 'Rev 1.1',
      updatedDate: '2026-01-20',
      status: 'approved',
      author: 'QA/QC Lead',
    },
    {
      id: 'doc-6',
      title: 'Municipal Commencement Certificate (CC) & Fire NOC',
      category: 'statutory',
      fileType: 'PDF',
      size: '12.0 MB',
      version: 'Sanctioned',
      updatedDate: '2025-10-05',
      status: 'approved',
      author: 'Liaison Architect',
    },
  ];

  const filteredDocs = documents.filter((d) => {
    if (activeFolder !== 'ALL' && d.category !== activeFolder) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return d.title.toLowerCase().includes(q) || d.version.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-amber-600" />
            Project Drawing Registers & Controlled Documents
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Good-For-Construction (GFC) releases, statutory clearances, and QA manuals
          </p>
        </div>

        <button
          onClick={() => alert('Mock Document Upload: New revision dispatched with auto-version increment.')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition"
        >
          <Upload className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents, revisions, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>

        <select
          value={activeFolder}
          onChange={(e) => setActiveFolder(e.target.value)}
          className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
        >
          <option value="ALL">All Categories</option>
          <option value="gfc_drawings">GFC Drawings</option>
          <option value="mep_drawings">MEP Services</option>
          <option value="investigation">Soil & Geo Survey</option>
          <option value="safety">HSE & Safety</option>
          <option value="qa_qc">QA / QC Plans</option>
          <option value="statutory">Statutory & Sanctions</option>
        </select>
      </div>

      {/* Documents Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {doc.title}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">{doc.version}</span>
                  <span>•</span>
                  <span>{doc.fileType}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Updated: {doc.updatedDate} by {doc.author}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Simulated Download: ${doc.title} (${doc.size})`)}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-amber-600 hover:border-amber-500 transition shrink-0"
              title="Download File"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
