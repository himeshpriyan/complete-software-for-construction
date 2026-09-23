import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { GlobalSearchModal } from './GlobalSearchModal';
import { SlideOverPanel } from '../ui/SlideOverPanel';
import { useAppStore } from '../../store/useAppStore';

export const AppShell: React.FC = () => {
  const { activeSlideOver, closeSlideOver } = useAppStore();
  const location = useLocation();
  const isHomeHub = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col antialiased">
      <div className="flex flex-1 w-full relative">
        {/* On home hub (/), hide sidebar to give 100% full-width to the modern app launcher; when inside any module, show scoped sidebar */}
        {!isHomeHub && <Sidebar />}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Sticky Header */}
          <Header />

          {/* Main Outlet Scroll Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Mobile Native Bottom Navigation & Full Drawer */}
      <MobileNav />

      {/* Omnisearch Modal */}
      <GlobalSearchModal />

      {/* Global SlideOver / BottomSheet Modal */}
      <SlideOverPanel
        isOpen={activeSlideOver.isOpen}
        onClose={closeSlideOver}
        title={activeSlideOver.title}
        description={activeSlideOver.description}
      >
        {activeSlideOver.content}
      </SlideOverPanel>
    </div>
  );
};
