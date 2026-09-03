import React from 'react';
import {
  GraduationCap,
  Target,
  Eye,
  Award,
  ShieldCheck,
  Heart,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { PageId } from '../../types';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-emerald-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Our Heritage & Values
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            About T'AYO School, Ilorin
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Established in the heart of Ilorin, Kwara State, T'AYO School has nurtured thousands of young minds into accomplished scholars, professionals, and nation builders.
          </p>
        </div>
      </div>

      {/* History & Foundation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Our Journey of Distinction
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Two Decades of Building Tomorrow's Champions
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Founded in 2005 along the educational corridor of Tanke and Fate Road in Ilorin, T'AYO School was born out of a profound passion to bridge the gap between rigorous academic achievement and genuine moral values.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Beginning with a pioneer group of 45 pupils, our school has expanded steadily into a modern campus equipped with high-tech science laboratories, an ultra-modern ICT suite, a multimedia library, and sprawling sports facilities. Today, our alumni are excelling in medicine, engineering, law, computer science, and entrepreneurship across premier universities in Nigeria and abroad.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Fully Approved by Kwara State Govt.</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>Accredited WAEC & NECO Examination Center</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80"
                alt="T'AYO School Campus"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-blue-900 text-white shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display">Our Vision</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              To be a foremost Nigerian educational institution recognized globally for academic excellence, moral integrity, innovative mindset, and developing self-reliant leaders equipped to solve local and global challenges.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-emerald-800 text-white shadow-md space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-200">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold font-display">Our Mission</h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              To provide child-centered, tech-enabled, and morally upright instruction through passionate teachers, fostering intellectual curiosity, athletic vigor, and cultural pride in an inclusive, inspiring learning environment.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">
            Our Core Values
          </h2>
          <p className="text-sm text-slate-500">
            The foundational pillars that guide our students, educators, and administrators every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Integrity & Character',
              desc: 'Upholding honesty, moral discipline, and accountability in all academic and personal pursuits.',
              icon: ShieldCheck,
              color: 'text-blue-700 bg-blue-50'
            },
            {
              title: 'Academic Distinction',
              desc: 'Continuous pursuit of mastery, critical problem-solving, and deep cognitive curiosity.',
              icon: Award,
              color: 'text-emerald-700 bg-emerald-50'
            },
            {
              title: 'Creativity & Innovation',
              desc: 'Encouraging hands-on scientific design, coding, artistic expression, and entrepreneurial thinking.',
              icon: Lightbulb,
              color: 'text-amber-700 bg-amber-50'
            },
            {
              title: 'Empathy & Community',
              desc: 'Instilling respect for diverse cultures, active community volunteerism, and mutual respect.',
              icon: Heart,
              color: 'text-rose-700 bg-rose-50'
            }
          ].map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${val.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">{val.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* School Anthem & Pledge */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg border border-slate-800 text-center space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            School Anthem & Creed
          </span>
          <h3 className="text-2xl font-bold font-display text-white">
            "Arise, O T'AYO Champions of Kwara"
          </h3>
          <div className="space-y-3 text-sm text-slate-300 italic max-w-xl mx-auto leading-relaxed">
            <p>
              Hail to T'AYO, beacon of the golden light,<br />
              In Kwara's pride, we stand for truth and right.<br />
              With books in hand and virtues in our heart,<br />
              We pledge to play an honorable part.
            </p>
            <p>
              Excellence in learning, character refined,<br />
              Tomorrow's leaders, sharp of soul and mind.<br />
              T'AYO School, our alma mater dear,<br />
              We shall uplift your banner year by year!
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-800 text-emerald-300 text-xs font-bold">
              Motto: Excellence in Character & Learning
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
