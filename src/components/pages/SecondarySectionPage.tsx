import React from 'react';
import {
  GraduationCap,
  Atom,
  Building,
  Scale,
  Award,
  CheckCircle2,
  Cpu,
  ArrowRight
} from 'lucide-react';
import { PageId } from '../../types';

interface SecondarySectionPageProps {
  onNavigate: (page: PageId) => void;
}

export const SecondarySectionPage: React.FC<SecondarySectionPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
            JSS 1 – SSS 3 (Junior & Senior High)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            T'AYO Secondary School
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Fostering intellectual rigor, scientific mastery, leadership, and outstanding performance in WAEC, NECO, and university matriculation examinations in Ilorin.
          </p>
        </div>
      </div>

      {/* Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              Secondary Academic Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Preparing Scholars for Premier Universities & Global Careers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              T'AYO Secondary School operates an intensive, results-oriented curriculum structured into Junior Secondary (JSS 1–3) concluding in the Basic Education Certificate Examination (BECE), and Senior Secondary (SSS 1–3) culminating in WAEC, NECO, and JAMB/UTME.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Our faculty comprises seasoned teachers holding subject degrees from top Nigerian universities, recognized for exceptional mentoring and academic coaching that consistently yields A1 and B2 distinctions.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('admission')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                <span>Apply for Secondary Admission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80"
                alt="Secondary school scholars"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Senior Secondary Specialization Streams */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">
            Senior Secondary Specialized Streams
          </h2>
          <p className="text-sm text-slate-500">
            Pathways tailored to students' career aspirations and aptitude.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Science & Technology */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Atom className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Pure & Applied Science</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For aspiring doctors, engineers, pharmacists, data scientists, and agricultural innovators.
              </p>
              <div className="pt-2">
                <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">Key Subjects:</p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Mathematics & Further Maths</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Physics & Chemistry</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Biology & Agricultural Science</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Computer Studies & Technical Drawing</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-blue-700 font-semibold">
              Includes full laboratory practical sessions weekly.
            </div>
          </div>

          {/* Humanities & Arts */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Humanities & Social Arts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For future advocates, diplomats, journalists, public administrators, and writers.
              </p>
              <div className="pt-2">
                <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Key Subjects:</p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Literature in English</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Government & Nigerian History</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Christian / Islamic Religious Studies</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Civic Education & Indigenous Language</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-emerald-700 font-semibold">
              Includes moot court, public debates & essay symposia.
            </div>
          </div>

          {/* Commercial & Business */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Building className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display">Commercial & Business Studies</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For future financial leaders, chartered accountants, economists, and corporate founders.
              </p>
              <div className="pt-2">
                <p className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-2">Key Subjects:</p>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Financial Accounting & Bookkeeping</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Economics & Commerce</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Marketing & Salesmanship</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Business Mathematics & ICT</li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-purple-700 font-semibold">
              Includes student enterprise club and stock exchange visits.
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory & ICT Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              World-Class Infrastructure
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-display">
              Advanced Science Laboratories & Computer-Based Testing (CBT) Hub
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              WAEC and NECO science examinations require impeccable practical competence. Our independent Physics, Chemistry, and Biology laboratories are fully stocked with reagents, digital balances, optics apparatus, microscopes, and safety showers.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Our 80-seat air-conditioned Computer Laboratory is connected to high-speed fiber internet and hosts weekly timed CBT mock tests simulating the exact JAMB/UTME interface to give our candidates supreme exam confidence.
            </p>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="rounded-2xl overflow-hidden border-2 border-slate-700 shadow-xl w-full">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&auto=format&fit=crop&q=80"
                alt="Science Lab"
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
