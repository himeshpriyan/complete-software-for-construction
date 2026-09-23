import React from 'react';
import { Project } from '../../../types';
import {
  Users,
  Phone,
  Mail,
  ShieldCheck,
  HardHat,
  UserCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';

interface ProjectTeamTabProps {
  project: Project;
}

export const ProjectTeamTab: React.FC<ProjectTeamTabProps> = ({ project }) => {
  const teamMembers = [
    {
      id: 'tm-1',
      name: project.projectManager,
      role: 'Project Manager (PM)',
      organization: 'Apex Buildtech Ltd.',
      phone: '+91 98201 44521',
      email: 'pm.lodha@apexbuild.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'On-Site Today',
      responsibilities: 'Budget oversight, contractual milestones, client liaison, site safety compliance',
    },
    {
      id: 'tm-2',
      name: project.siteEngineer,
      role: 'Senior Site Engineer',
      organization: 'Apex Buildtech Ltd.',
      phone: '+91 98452 33119',
      email: 'site.eng@apexbuild.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      status: 'On-Site Today',
      responsibilities: 'Daily DPR preparation, shuttering inspection, reinforcement checking, pour supervision',
    },
    {
      id: 'tm-3',
      name: 'Rohan Deshmukh',
      role: 'Senior Quantity Surveyor (QS)',
      organization: 'Apex Commercial Bureau',
      phone: '+91 98223 99182',
      email: 'rohan.qs@apexbuild.com',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
      status: 'Site Office',
      responsibilities: 'Measurement Book certification, subcontractor RA bills, variation costing, material reconciliations',
    },
    {
      id: 'tm-4',
      name: 'Pooja Hegde',
      role: 'QA / QC Materials Lead',
      organization: 'Apex Buildtech Ltd.',
      phone: '+91 98112 77410',
      email: 'pooja.qa@apexbuild.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      status: 'On-Site Today',
      responsibilities: 'Concrete cube crushing tests, batch plant calibration, non-conformance reports (NCR), mix design',
    },
    {
      id: 'tm-5',
      name: 'Sunil Kumar',
      role: 'Health, Safety & Environment (HSE) Officer',
      organization: 'Apex Safety Directorate',
      phone: '+91 98334 11290',
      email: 'sunil.safety@apexbuild.com',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      status: 'On-Site Today',
      responsibilities: 'Toolbox talks, fall protection compliance, crane safety inspection, permit-to-work audits',
    },
    {
      id: 'tm-6',
      name: 'Ar. Gautam Mehta',
      role: 'Principal Architectural Consultant',
      organization: 'Mehta & Associates',
      phone: '+91 98210 55670',
      email: 'gautam@mehta-architects.in',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      status: 'Weekly Site Visit',
      responsibilities: 'GFC design releases, aesthetic approvals, facade detailing, finish sign-offs',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            Project Organization & Site Supervisory Roster
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Key personnel, engineering consultants, QA/QC inspectors, and safety officers
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
          6 Key Supervisory Officers Assigned
        </span>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/40 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                  {member.name}
                </h4>
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  {member.role}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {member.organization}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
              <div className="text-slate-600 dark:text-slate-400">
                <strong className="text-slate-800 dark:text-slate-200">Responsibilities: </strong>
                {member.responsibilities}
              </div>

              <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-1 hover:text-amber-600 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-600" /> {member.phone}
                </a>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {member.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
