import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { Announcement } from '../../types';
import { Bell, Calendar, User, Tag, ChevronRight, X } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [announcements] = useState<Announcement[]>(StorageService.getAnnouncements());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  const categories = ['All', 'General', 'Academic', 'Primary', 'Secondary', 'PTA'];

  const filteredAnnouncements = announcements.filter(ann => {
    if (selectedCategory === 'All') return true;
    return ann.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
            Official Circulars & Press Bulletins
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            News & Announcements
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Stay informed with the latest academic dates, student milestones, PTA conventions, and inter-house events at T'AYO School.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-800 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnnouncements.map(ann => (
            <div
              key={ann.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">
                    {ann.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {ann.publishedDate}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-slate-900 leading-snug font-display">
                  {ann.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {ann.content}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">By {ann.author}</span>
                <button
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  <span>Read Notice</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                {selectedAnnouncement.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                {selectedAnnouncement.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Published: {selectedAnnouncement.publishedDate}</span>
                <span>• Author: {selectedAnnouncement.author}</span>
                <span>• Audience: {selectedAnnouncement.targetAudience}</span>
              </div>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed pt-3 border-t border-slate-100 space-y-3 whitespace-pre-wrap">
              {selectedAnnouncement.content}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
