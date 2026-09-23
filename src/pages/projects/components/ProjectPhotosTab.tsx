import React, { useState } from 'react';
import { Project, SitePhoto } from '../../../types';
import {
  Camera,
  Calendar,
  Filter,
  Sliders,
  Maximize2,
  Tag,
  Upload,
  Layers,
  MapPin,
} from 'lucide-react';

interface ProjectPhotosTabProps {
  project: Project;
  photos: SitePhoto[];
}

export const ProjectPhotosTab: React.FC<ProjectPhotosTabProps> = ({ project, photos }) => {
  const [selectedTrade, setSelectedTrade] = useState<string>('ALL');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 - 100 %
  const [activeBeforeAfterIndex, setActiveBeforeAfterIndex] = useState<number>(0);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<SitePhoto | null>(null);

  // Photos with before/after comparisons
  const beforeAfterPairs = photos.filter((p) => p.beforeAfterPair);

  const filteredPhotos = photos.filter((p) => {
    if (selectedTrade !== 'ALL' && p.trade !== selectedTrade) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600" />
            Site Photographic Evidence & Before/After Analysis
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Geotagged site captures, milestone inspections, and interactive side-by-side progression
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="ALL">All Categories</option>
            <option value="civil">Civil & Concrete</option>
            <option value="structural">Structural Steel</option>
            <option value="mep">MEP Services</option>
            <option value="safety">Safety Inspections</option>
            <option value="finishing">Finishing & Joinery</option>
          </select>

          <button
            onClick={() => alert('Mock Camera Upload: Simulated capture uploaded with timestamp and GPS coords.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Photo
          </button>
        </div>
      </div>

      {/* 1. INTERACTIVE BEFORE / AFTER SLIDER */}
      {beforeAfterPairs.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-600" />
                Interactive Before vs After Milestone Comparison
              </h4>
              <p className="text-xs text-slate-500">
                Drag the handle horizontally to inspect site physical transformation
              </p>
            </div>

            {beforeAfterPairs.length > 1 && (
              <div className="flex items-center gap-2">
                {beforeAfterPairs.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveBeforeAfterIndex(idx)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                      activeBeforeAfterIndex === idx
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                    }`}
                  >
                    View {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Slider Container */}
          {beforeAfterPairs[activeBeforeAfterIndex] && (
            <div className="space-y-3">
              <div className="relative w-full h-[320px] sm:h-[420px] rounded-xl overflow-hidden select-none border border-slate-200 dark:border-slate-800 bg-slate-950">
                {/* After Image (Background) */}
                <img
                  src={beforeAfterPairs[activeBeforeAfterIndex].url}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold tracking-wider uppercase border border-white/20">
                  After: {beforeAfterPairs[activeBeforeAfterIndex].date}
                </span>

                {/* Before Image (Clipped by slider position) */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <img
                    src={beforeAfterPairs[activeBeforeAfterIndex].beforeAfterPair?.beforeUrl}
                    alt="Before"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%' }}
                  />
                  <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold tracking-wider uppercase border border-white/20">
                    Before: {beforeAfterPairs[activeBeforeAfterIndex].beforeAfterPair?.beforeDate}
                  </span>
                </div>

                {/* Draggable Divider Line */}
                <div
                  className="absolute inset-y-0 z-20 w-1 bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg border border-slate-300 font-bold text-xs">
                    ⇄
                  </div>
                </div>

                {/* Interactive Drag input overlay */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  📍 {beforeAfterPairs[activeBeforeAfterIndex].caption}
                </span>
                <span>Captured by: {beforeAfterPairs[activeBeforeAfterIndex].uploadedBy}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. CHRONOLOGICAL TIMELINE STRIP */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600" />
          Chronological Construction Timeline Strip
        </h4>

        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          {photos.map((p) => (
            <div
              key={p.id}
              onClick={() => setActiveLightboxPhoto(p)}
              className="group shrink-0 cursor-pointer w-44 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition"
            >
              <div className="h-28 overflow-hidden bg-slate-900 relative">
                <img
                  src={p.url}
                  alt={p.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9px] font-mono">
                  {p.date}
                </span>
              </div>
              <div className="p-2 text-[11px] bg-white dark:bg-slate-900">
                <div className="font-medium text-slate-900 dark:text-white truncate">{p.caption}</div>
                <div className="text-slate-400 text-[10px] uppercase mt-0.5">{p.trade}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. MASONRY PHOTO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
          >
            <div
              onClick={() => setActiveLightboxPhoto(photo)}
              className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer"
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition flex items-end p-3">
                <span className="text-white text-xs font-semibold flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" /> Enlarge View
                </span>
              </div>
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 backdrop-blur-xs text-white">
                {photo.trade}
              </span>
            </div>

            <div className="p-3.5 space-y-1.5 text-xs">
              <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                {photo.caption}
              </div>
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {photo.date}
                </span>
                <span>{photo.uploadedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeLightboxPhoto && (
        <div
          onClick={() => setActiveLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="max-h-[70vh] bg-black flex items-center justify-center">
              <img
                src={activeLightboxPhoto.url}
                alt={activeLightboxPhoto.caption}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="p-4 flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  {activeLightboxPhoto.caption}
                </h4>
                <div className="text-slate-500 mt-0.5">
                  Captured on {activeLightboxPhoto.date} by {activeLightboxPhoto.uploadedBy || 'Site Staff'} • Tag: {(activeLightboxPhoto.trade || 'Site').toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => setActiveLightboxPhoto(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
