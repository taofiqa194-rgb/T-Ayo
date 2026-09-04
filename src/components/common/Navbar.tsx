import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  User,
  Shield,
  BookOpen,
  LogOut,
  LayoutDashboard,
  Calendar
} from 'lucide-react';
import { PageId, UserRole, SchoolConfig } from '../../types';
import { StorageService } from '../../services/storage';
import { FirestoreService } from '../../firebase/firestoreService';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  currentUser?: {
    role: UserRole;
    name: string;
    identifier?: string;
  } | null;
  loggedInUser?: {
    role: UserRole;
    name: string;
    dashboardPage?: PageId;
    identifier?: string;
  } | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentUser: propCurrentUser,
  loggedInUser,
  onLogout
}) => {
  const currentUser = loggedInUser || propCurrentUser || null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [portalDropdownOpen, setPortalDropdownOpen] = useState(false);
  const [config, setConfig] = useState<SchoolConfig>(() => StorageService.getConfig());

  useEffect(() => {
    const unsub = FirestoreService.subscribeToConfig((updated) => {
      if (updated) {
        setConfig(prev => ({ ...prev, ...updated }));
      }
    });
    return () => {
      if (unsub) unsub();
    };
  }, []);

  const navItems: { label: string; page: PageId }[] = [
    { label: 'Home', page: 'home' },
    { label: 'About Us', page: 'about' },
    { label: 'Primary', page: 'primary' },
    { label: 'Secondary', page: 'secondary' },
    { label: 'Admissions', page: 'admission' },
    { label: 'News & Events', page: 'news' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'Contact', page: 'contact' }
  ];

  const handleNav = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setPortalDropdownOpen(false);
  };

  const getDashboardPage = (): PageId => {
    if (!currentUser) return 'home';
    if (currentUser.role === 'student') return 'student-dashboard';
    if (currentUser.role === 'staff') return 'staff-dashboard';
    return 'admin-dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm transition-all">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-slate-300">
            <span className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {config.location || "Tanke / GRA, Ilorin, Kwara State"}
            </span>
            <a href={`tel:${config.phone1 || '09076930244'}`} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              {config.phone1 || '09076930244'}
            </a>
            <a href={`mailto:${config.email || 'info@tayoschool.edu.ng'}`} className="hidden md:flex items-center gap-1.5 hover:text-blue-300 transition-colors">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              {config.email || 'info@tayoschool.edu.ng'}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60">
              <Calendar className="w-3 h-3 text-blue-400" />
              <span>{config.activeSession} Session • {config.activeTerm}</span>
            </div>
            {config.admissionsOpen && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                Admissions Open
              </span>
            )}
            {currentUser && (
              <span className="text-slate-300 hidden sm:inline">
                Logged in as <strong className="text-white capitalize">{currentUser.role}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & School Name */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 bg-[#003087] rounded-lg flex items-center justify-center text-white font-black text-2xl shadow-sm group-hover:scale-105 transition-transform">
              T
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#003087] leading-none font-display">
                T'AYO SCHOOL
              </span>
              <span className="text-[10px] font-bold text-[#008751] tracking-[0.2em] uppercase mt-0.5">
                Excellence & Character
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6 text-sm font-bold text-slate-600">
            {navItems.map(item => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  id={`nav-link-${item.page}`}
                  onClick={() => handleNav(item.page)}
                  className={`transition-colors cursor-pointer py-1 ${
                    isActive
                      ? 'text-[#003087] border-b-2 border-[#003087] font-black'
                      : 'hover:text-[#003087]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User Status / Portals CTA */}
          <div className="hidden lg:flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <button
                  id="nav-user-dashboard-btn"
                  onClick={() => handleNav(getDashboardPage())}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#003087] text-white hover:bg-[#002266] text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{currentUser.name.split(' ')[0]}'s Portal</span>
                </button>
                <button
                  id="nav-logout-btn"
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  id="nav-portal-dropdown-btn"
                  onClick={() => setPortalDropdownOpen(!portalDropdownOpen)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#003087] hover:bg-[#002568] text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  <span>School Portals</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {portalDropdownOpen && (
                  <div
                    id="nav-portal-menu"
                    className="absolute right-0 mt-2 w-60 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Select Portal
                      </p>
                    </div>
                    <button
                      id="menu-student-login"
                      onClick={() => handleNav('student-login')}
                      className="w-full px-4 py-3 text-left text-sm text-slate-800 hover:bg-blue-50/70 flex items-center gap-3 cursor-pointer transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#003087] text-white flex items-center justify-center shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 group-hover:text-[#003087] leading-tight text-xs">
                          Student Portal
                        </p>
                        <p className="text-[11px] text-slate-500">Results, Profile & Classes</p>
                      </div>
                    </button>
                    <button
                      id="menu-staff-login"
                      onClick={() => handleNav('staff-login')}
                      className="w-full px-4 py-3 text-left text-sm text-slate-800 hover:bg-emerald-50/70 flex items-center gap-3 cursor-pointer transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#008751] text-white flex items-center justify-center shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 group-hover:text-[#008751] leading-tight text-xs">
                          Staff Portal
                        </p>
                        <p className="text-[11px] text-slate-500">Upload Scores & Grading</p>
                      </div>
                    </button>
                    <button
                      id="menu-admin-login"
                      onClick={() => handleNav('admin-login')}
                      className="w-full px-4 py-3 text-left text-sm text-slate-800 hover:bg-slate-100 flex items-center gap-3 cursor-pointer transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-black text-slate-800 group-hover:text-slate-900 leading-tight text-xs">
                          Admin Portal
                        </p>
                        <p className="text-[11px] text-slate-500">School Administration</p>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg max-h-[80vh] overflow-y-auto">
          {currentUser && (
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-bold uppercase">{currentUser.role} Account</p>
                <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
              </div>
              <div className="flex gap-2">
                <button
                  id="mobile-dashboard-btn"
                  onClick={() => handleNav(getDashboardPage())}
                  className="px-3 py-1.5 bg-blue-700 text-white rounded-lg text-xs font-semibold"
                >
                  Dashboard
                </button>
                <button
                  id="mobile-logout-btn"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-1">
            {navItems.map(item => (
              <button
                key={item.page}
                id={`mobile-link-${item.page}`}
                onClick={() => handleNav(item.page)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-between cursor-pointer ${
                  currentPage === item.page
                    ? 'bg-[#003087] text-white font-black'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#003087]'
                }`}
              >
                <span>{item.label}</span>
                {currentPage === item.page && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </button>
            ))}
          </div>

          {!currentUser && (
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Access Portals</p>
              <button
                id="mobile-student-login-btn"
                onClick={() => handleNav('student-login')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-blue-50/80 text-[#003087] border border-blue-200 font-bold text-sm cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#003087] text-white flex items-center justify-center text-xs">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-black text-xs">Student Portal</span>
                </span>
                <span className="text-xs text-[#003087] font-black">Sign In &rarr;</span>
              </button>
              <button
                id="mobile-staff-login-btn"
                onClick={() => handleNav('staff-login')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50/80 text-[#008751] border border-emerald-200 font-bold text-sm cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#008751] text-white flex items-center justify-center text-xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <span className="font-black text-xs">Staff Portal</span>
                </span>
                <span className="text-xs text-[#008751] font-black">Sign In &rarr;</span>
              </button>
              <button
                id="mobile-admin-login-btn"
                onClick={() => handleNav('admin-login')}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-100 text-slate-900 border border-slate-300 font-bold text-sm cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center text-xs">
                    <Shield className="w-4 h-4" />
                  </div>
                  <span className="font-black text-xs">Admin Portal</span>
                </span>
                <span className="text-xs text-slate-800 font-black">Sign In &rarr;</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
