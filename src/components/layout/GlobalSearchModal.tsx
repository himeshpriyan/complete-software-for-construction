import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, HardHat, Users, Building, FileText } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { NAVIGATION_ITEMS } from '../../config/navigation';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, clients, employees, branches } = useAppStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setSearchOpen]);

  if (!isSearchOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter navigation items
  const matchedNavItems = NAVIGATION_ITEMS.flatMap((item) => {
    const matches = [];
    if (item.label.toLowerCase().includes(q)) {
      matches.push({ title: item.label, path: item.path, category: 'Module Navigation', type: 'nav' });
    }
    if (item.children) {
      for (const child of item.children) {
        if (child.label.toLowerCase().includes(q) || item.label.toLowerCase().includes(q)) {
          matches.push({
            title: `${item.label} → ${child.label}`,
            path: child.path,
            category: 'Module Sub-route',
            type: 'nav',
          });
        }
      }
    }
    return matches;
  }).slice(0, 5);

  // Filter clients
  const matchedClients = clients
    .filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.companyName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
    )
    .slice(0, 4);

  // Filter staff
  const matchedStaff = employees
    .filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    )
    .slice(0, 4);

  // Filter branches
  const matchedBranches = branches
    .filter((b) => b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q))
    .slice(0, 3);

  const handleSelect = (path: string) => {
    setSearchOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 pt-16 pb-6 text-center flex justify-center">
        {/* Backdrop */}
        <div
          onClick={() => setSearchOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Content */}
        <div className="inline-block w-full max-w-xl text-left align-top transition-all transform bg-white shadow-2xl rounded-xl border border-slate-200 overflow-hidden relative z-10">
          {/* Search Input Bar */}
          <div className="p-3.5 border-b border-slate-100 flex items-center gap-3 bg-white">
            <Search className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything in BuildOS... (e.g. Lodha, Rajesh, DPR, RFQ)"
              className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-800 placeholder:text-slate-400 font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-3">
            {/* Quick Navigation Matches */}
            {matchedNavItems.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Navigation & Tools
                </span>
                {matchedNavItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(item.path)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-amber-50/70 text-xs flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2 text-slate-700">
                      <FileText className="h-4 w-4 text-amber-600" />
                      <span className="font-semibold text-slate-900">{item.title}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            )}

            {/* Client Matches */}
            {matchedClients.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Clients & Developers
                </span>
                {matchedClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleSelect('/crm/customers')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-slate-100 text-slate-600">
                        <Building className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{client.companyName}</p>
                        <p className="text-[11px] text-slate-500">{client.primaryContactPerson} • {client.city}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      {client.id}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Staff / Personnel Matches */}
            {matchedStaff.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Team Members & Engineers
                </span>
                {matchedStaff.map((staff) => (
                  <button
                    key={staff.id}
                    onClick={() => handleSelect('/hr/employees')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1 rounded bg-slate-100 text-slate-600">
                        <Users className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{staff.name}</p>
                        <p className="text-[11px] text-slate-500">{staff.designation} • {staff.department}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 capitalize">{staff.role.replace('_', ' ')}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Branches */}
            {matchedBranches.length > 0 && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Operating Hubs & Branches
                </span>
                {matchedBranches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelect('/settings/company')}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-xs flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <HardHat className="h-4 w-4 text-amber-600" />
                      <span className="font-medium text-slate-800">{b.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{b.city}</span>
                  </button>
                ))}
              </div>
            )}

            {matchedNavItems.length === 0 && matchedClients.length === 0 && matchedStaff.length === 0 && (
              <div className="p-8 text-center text-slate-400">
                <p className="text-xs font-semibold text-slate-600">No results found for "{query}"</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Try searching for "Lodha", "Rajesh", "Contracts", "Safety", or "Tenders"
                </p>
              </div>
            )}
          </div>

          {/* Footer Navigation Hints */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Enter</kbd> to jump</span>
              <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Esc</kbd> to dismiss</span>
            </div>
            <span className="font-semibold text-amber-600">BuildOS Omnisearch</span>
          </div>
        </div>
      </div>
    </div>
  );
};
