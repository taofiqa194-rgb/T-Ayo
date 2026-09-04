import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Award,
  BookOpen,
  Users,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Calendar,
  MapPin,
  Phone,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Baby
} from 'lucide-react';
import { PageId, Announcement, GalleryItem, SchoolConfig } from '../../types';
import { StorageService } from '../../services/storage';
import { FirestoreService } from '../../firebase/firestoreService';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [config, setConfig] = useState<SchoolConfig>(() => StorageService.getConfig());
  const announcements = StorageService.getAnnouncements().slice(0, 3);
  const galleryItems = StorageService.getGallery().slice(0, 4);

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

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. HERO SECTION (Bold Typography Theme) */}
      <section className="bg-slate-50 border-b border-slate-200 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Left text & announcement box */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#008751]/10 text-[#008751] rounded-full text-xs font-bold mb-6 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#008751] animate-pulse"></span>
                  <span>{config.activeSession} Academic Session • {config.activeTerm} {config.admissionsOpen ? '• Admissions Open' : ''}</span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[0.92] tracking-tighter mb-6 font-display uppercase">
                  BUILDING <br />
                  <span className="text-[#003087]">LEADERS</span> FOR <br />
                  TOMORROW.
                </h1>

                <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-lg mb-8 font-normal">
                  T'AYO School provides a nurturing foundation across <strong>Nursery, Primary, and Secondary</strong> education in the heart of Ilorin, Kwara State. Excellence in Character, Discipline, and Learning.
                </p>

                <div className="flex flex-wrap gap-4">
                  <button
                    id="hero-apply-btn"
                    onClick={() => onNavigate('admission')}
                    className="bg-[#003087] text-white px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-lg hover:bg-[#002266] transition-all cursor-pointer"
                  >
                    Apply Now
                  </button>
                  <button
                    id="hero-virtual-tour-btn"
                    onClick={() => onNavigate('about')}
                    className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
                  >
                    Virtual Tour
                  </button>
                </div>
              </div>

              {/* Latest Announcements Mini-Card */}
              <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">
                    Latest Announcements
                  </h3>
                  <button
                    onClick={() => onNavigate('news')}
                    className="text-[10px] font-bold text-[#003087] uppercase hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {announcements.slice(0, 2).map((ann, idx) => (
                    <div
                      key={ann.id}
                      onClick={() => onNavigate('news')}
                      className={`flex gap-4 items-start cursor-pointer group ${
                        idx > 0 ? 'opacity-70 hover:opacity-100 transition-opacity' : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-col items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                        <span className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                          {ann.publishedDate.split('-')[1] === '09' ? 'SEP' : 'OCT'}
                        </span>
                        <span className="text-lg font-black text-slate-800 leading-none mt-0.5">
                          {ann.publishedDate.split('-')[2] || '12'}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-[#003087] transition-colors leading-snug">
                          {ann.title}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {ann.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Portal Login Hub */}
            <div className="lg:col-span-5 bg-white border border-slate-200 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight italic font-display">
                  Portal Login
                </h2>

                <div className="space-y-4 mb-8">
                  {/* Student Portal Card */}
                  <div
                    onClick={() => onNavigate('student-login')}
                    className="group bg-slate-50 border border-slate-200 p-5 sm:p-6 rounded-2xl cursor-pointer hover:border-[#003087] hover:bg-blue-50/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-[#003087] rounded-lg flex items-center justify-center text-white shadow-sm">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Student Portal
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 group-hover:text-[#003087] transition-colors">
                      Access Academic Results
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Check grades, continuous assessment, and terminal report cards.
                    </p>
                  </div>

                  {/* Staff Portal Card */}
                  <div
                    onClick={() => onNavigate('staff-login')}
                    className="group bg-slate-50 border border-slate-200 p-5 sm:p-6 rounded-2xl cursor-pointer hover:border-[#008751] hover:bg-emerald-50/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-[#008751] rounded-lg flex items-center justify-center text-white shadow-sm">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Staff Portal
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 group-hover:text-[#008751] transition-colors">
                      Manage Classroom Data
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload CA & exam scores, grading, and student assessments.
                    </p>
                  </div>

                  {/* Admin Portal Card */}
                  <div
                    onClick={() => onNavigate('admin-login')}
                    className="group bg-slate-50 border border-slate-200 p-5 sm:p-6 rounded-2xl cursor-pointer hover:border-slate-800 hover:bg-slate-100/60 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white shadow-sm">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Administrative
                      </span>
                    </div>
                    <h4 className="text-lg font-black text-slate-800 group-hover:text-slate-900 transition-colors">
                      System Control Center
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Overview of admissions, staff, students, and database tables.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 tracking-[0.2em]">
                  Located In
                </p>
                <p className="text-xs font-bold text-slate-600">
                  Offa Garage / Tanke University Road Area, Ilorin, Kwara State, Nigeria
                </p>
                <p className="text-[10px] text-slate-400 mt-2 italic">
                  © 2024 T'AYO School Management System
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS RIBBON */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003087] font-display">1,200+</span>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Active Students</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#008751] font-display">65+</span>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Qualified Educators</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 font-display">100%</span>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">WAEC & NECO Success</p>
          </div>
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003087] font-display">20+</span>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">Years of Heritage</p>
          </div>
        </div>
      </div>

      {/* 3. PRINCIPAL'S WELCOME ADDRESS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative">
              <div className="w-64 h-80 sm:w-72 sm:h-96 rounded-2xl overflow-hidden shadow-md border-4 border-white bg-slate-200">
                <img
                  src={config.principalPhotoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80"}
                  alt={`${config.principalName || 'Principal'}, Principal T'AYO School`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 right-2 bg-[#003087] text-white px-4 py-2 rounded-xl shadow-md text-xs font-black tracking-wider uppercase">
                {config.principalTitle || "Principal & Director"}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-[#008751] uppercase tracking-widest">
              <span>Principal's Welcome Address</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display tracking-tight leading-tight">
              {config.principalWelcomeQuote || '"We Do Not Just Educate; We Mould Character and Build Destinies."'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {config.principalMessage1 || (
                <>At <strong>T'AYO School</strong> in Ilorin, Kwara State, we consider education a sacred trust. Our holistic educational curriculum integrates national standards with international best practices, giving each pupil and student a solid foundation in numeracy, literacy, critical inquiry, digital fluency, and cultural appreciation.</>
              )}
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              {config.principalMessage2 || (
                <>Whether inside our modern science laboratories, on the athletic field, or in leadership roles, our children are nurtured to excel with humility, empathy, and resilience. We welcome you to experience the T'AYO family.</>
              )}
            </p>
            <div className="pt-2">
              <h4 className="font-black text-slate-900 text-base">{config.principalName || "Dr. (Mrs.) Folashade O. Adeyinka"}</h4>
              <p className="text-xs text-slate-500 font-semibold">
                {config.principalQualifications || "B.Ed, M.Ed (Educational Management, Unilorin), Ph.D, TRCN"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SCHOOL SECTIONS (NURSERY, PRIMARY & SECONDARY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-black text-[#008751] uppercase tracking-widest">Instructional Excellence</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
            Our Academic Divisions
          </h2>
          <p className="text-sm text-slate-500 font-normal">
            Tailored instructional methodologies designed for each phase of child and youth development across Nursery, Primary, and Secondary education.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Nursery & Early Years Section */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="h-52 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80"
                alt="Nursery and Early Years Pupils"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-sm tracking-wider uppercase">
                Nursery & Creche
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  Nursery & Early Childhood
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Creche, Playgroup, KG 1-2, and Nursery classes nurturing early cognitive, emotional, and fine-motor development through structured play.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Jolly Phonics & Early Literacy</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Sensory & Montessori Play Corners</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Hygienic Creche & Daycare Suites</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('primary')}
                  className="w-full py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <span>Explore Early Years</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Primary Section */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="h-52 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80"
                alt="Primary Pupils"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#008751] text-white text-xs font-black shadow-sm tracking-wider uppercase">
                Primary Section (Basic 1 - 6)
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  T'AYO Primary School
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Igniting a love for learning through numeracy, hands-on STEAM exploration, creative arts, and foundational civic virtues.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0" />
                    <span>Verbal & Quantitative Reasoning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0" />
                    <span>Junior Science, Coding & Robotics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#008751] shrink-0" />
                    <span>National Common Entrance Prep</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('primary')}
                  className="w-full py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#008751] font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <span>Explore Primary School</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Secondary Section */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="h-52 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                alt="Secondary Students"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#003087] text-white text-xs font-black shadow-sm tracking-wider uppercase">
                Secondary (JSS 1 - SSS 3)
              </span>
            </div>
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 font-display">
                  T'AYO Secondary School
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Rigorous preparation for WAEC, NECO, and UTME/JAMB exams with specialized streams in Sciences, Arts, and Commercial disciplines.
                </p>
                <ul className="mt-4 space-y-2 text-xs text-slate-700 font-bold">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#003087] shrink-0" />
                    <span>Equipped Chemistry, Physics & Biology Labs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#003087] shrink-0" />
                    <span>CBT Computer Practice Suites</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#003087] shrink-0" />
                    <span>University Placement & Mentorship</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => onNavigate('secondary')}
                  className="w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#003087] font-black text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer uppercase tracking-wider"
                >
                  <span>Explore Secondary School</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST ANNOUNCEMENTS & CIRCULARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black text-[#008751] uppercase tracking-widest">Official Bulletins</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              News & Circulars
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-black text-[#003087] hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <span>View All Announcements</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map(ann => (
            <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-black tracking-wider uppercase bg-blue-50 text-[#003087]">
                    {ann.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {ann.publishedDate}
                  </span>
                </div>
                <h3 className="font-black text-base text-slate-900 mt-2.5">{ann.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
                  {ann.content}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="font-bold">By {ann.author}</span>
                <span className="text-[#008751] font-black cursor-pointer hover:underline" onClick={() => onNavigate('news')}>
                  Read Full Notice &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CAMPUS GALLERY PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black text-[#008751] uppercase tracking-widest">Visual Tour</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              Campus Life & Facilities
            </h2>
          </div>
          <button
            onClick={() => onNavigate('gallery')}
            className="text-xs font-black text-[#008751] hover:underline flex items-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <span>Browse Full Gallery</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {galleryItems.map(item => (
            <div
              key={item.id}
              onClick={() => onNavigate('gallery')}
              className="group relative rounded-2xl overflow-hidden h-64 border border-slate-200 cursor-pointer shadow-sm"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase font-black text-emerald-300 tracking-wider">{item.category}</span>
                <h4 className="font-black text-sm leading-snug">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. ADMISSIONS CTA STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#003087] rounded-3xl text-white p-8 sm:p-12 shadow-md flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <span className="px-3.5 py-1 rounded-full bg-white/20 text-emerald-300 text-xs font-black uppercase tracking-widest">
              Enrolment Open
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight">
              Begin Your Child's Journey of Excellence
            </h2>
            <p className="text-sm text-blue-100 max-w-xl font-normal">
              Online applications for Nursery, Primary 1 - 6, JSS 1 - 3, and SSS 1 - 2 are ongoing. Seamlessly submit your details and passport photo online today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('admission')}
              className="px-8 py-4 rounded-xl bg-[#008751] hover:bg-[#007043] text-white font-black text-sm shadow-md transition-all cursor-pointer text-center"
            >
              Fill Online Admission Form
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all cursor-pointer text-center"
            >
              Contact Admissions Desk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
