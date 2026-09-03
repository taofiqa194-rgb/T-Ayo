import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { GalleryItem } from '../../types';
import { X, ZoomIn, Calendar } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [gallery] = useState<GalleryItem[]>(StorageService.getGallery());
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Campus', 'Sports', 'Science & Arts', 'Cultural Day', 'Graduation'];

  const filteredItems = gallery.filter(item => {
    if (selectedFilter === 'All') return true;
    return item.category.toLowerCase() === selectedFilter.toLowerCase();
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Moments of Triumph & Learning
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            School Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Glimpses into student life, inter-house athletic triumphs, science laboratory discoveries, and annual cultural celebrations at T'AYO School, Ilorin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedFilter === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setActivePhoto(item)}
              className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <span className="p-3 rounded-full bg-white/20 backdrop-blur-xs">
                    <ZoomIn className="w-6 h-6" />
                  </span>
                </div>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              <div className="p-5 space-y-1.5">
                <h3 className="font-bold text-slate-900 text-base font-display">{item.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                <p className="text-[11px] text-slate-400 font-medium pt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {item.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] w-full overflow-hidden flex items-center justify-center bg-black">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[70vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="p-6 text-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activePhoto.category}
                </span>
                <span className="text-xs text-slate-400">• {activePhoto.date}</span>
              </div>
              <h3 className="text-xl font-bold font-display">{activePhoto.title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{activePhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
