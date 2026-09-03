import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import { PageId } from '../../types';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#003087] rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-sm">
                T
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none font-display">
                  T'AYO SCHOOL
                </span>
                <span className="text-[10px] font-bold text-[#008751] tracking-[0.2em] uppercase mt-0.5">
                  Excellence & Character • Ilorin
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-normal">
              A premier institution dedicated to academic distinction, moral rectitude, and holistic talent development from Early Years through Senior Secondary WAEC and NECO.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-[#008751]" />
                WAEC / NECO Accredited
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                Kwara State Approved
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-black text-xs tracking-widest uppercase mb-4 font-display">
              School Sections
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('primary')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Primary School (Creche to Primary 6)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('secondary')}
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer"
                >
                  Junior Secondary (JSS 1 - 3)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('secondary')}
                  className="hover:text-blue-400 transition-colors text-left cursor-pointer"
                >
                  Senior Secondary (Science, Arts, Comm.)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admission')}
                  className="hover:text-emerald-400 transition-colors text-left cursor-pointer"
                >
                  Online Admission Form & Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-slate-100 transition-colors text-left cursor-pointer"
                >
                  School Campus & Laboratory Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portal Access */}
          <div>
            <h4 className="text-white font-black text-xs tracking-widest uppercase mb-4 font-display">
              Management Portals
            </h4>
            <ul className="space-y-2.5 text-sm font-bold">
              <li>
                <button
                  onClick={() => onNavigate('student-login')}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <span>&rarr;</span> Student Result & Profile Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('staff-login')}
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  <span>&rarr;</span> Staff Assessment & Grading Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-login')}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                >
                  <span>&rarr;</span> Administrator Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('news')}
                  className="hover:text-slate-100 text-slate-400 transition-colors text-left cursor-pointer font-semibold"
                >
                  Academic Calendar & Term Dates
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact in Ilorin */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-xs tracking-widest uppercase mb-4 font-display">
              Campus Location
            </h4>
            <p className="flex items-start gap-2.5 text-sm text-slate-400">
              <MapPin className="w-5 h-5 text-[#008751] shrink-0 mt-0.5" />
              <span>Plot 12, Off Fate/University Road, Tanke GRA, Ilorin, Kwara State, Nigeria</span>
            </p>
            <p className="flex items-center gap-2.5 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>09076930244</span>
            </p>
            <p className="flex items-center gap-2.5 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>admissions@tayoschool.edu.ng</span>
            </p>
            <p className="flex items-center gap-2.5 text-sm text-slate-400">
              <Clock className="w-4 h-4 text-[#008751] shrink-0" />
              <span>Monday – Friday: 7:30 AM – 4:30 PM</span>
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} T'AYO School, Ilorin, Kwara State. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Approved by Kwara State Ministry of Education & Human Capital Development
          </p>
        </div>
      </div>
    </footer>
  );
};
