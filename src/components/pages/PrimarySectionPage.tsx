import React from 'react';
import {
  BookOpen,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { PageId } from '../../types';

interface PrimarySectionPageProps {
  onNavigate: (page: PageId) => void;
}

export const PrimarySectionPage: React.FC<PrimarySectionPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-blue-950 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Early Years & Grades 1 – 6
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight">
            T'AYO Primary School
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Cultivating joyful learners, inquisitive problem solvers, and respectful young citizens through an enriching foundation in Ilorin, Kwara State.
          </p>
        </div>
      </div>

      {/* Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Nurturing Early Curiosity
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Where Every Child Discovers Their Unique Potential
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At T'AYO Primary School, we combine the approved Nigerian Universal Basic Education (UBEC) curriculum with progressive international primary teaching strategies. Our classrooms are spacious, well-ventilated, multimedia-equipped spaces where children feel safe, appreciated, and inspired.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              With a strict teacher-to-pupil ratio of 1:20 and assistant teachers in our lower classes, every learner receives individualized instructional scaffolding in phonics, mental numeracy, cursive handwriting, and public speaking.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('admission')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                <span>Enroll in Primary Section</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80"
                alt="Primary pupils learning"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum & Key Learning Areas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">
            Primary Curriculum & Core Subjects
          </h2>
          <p className="text-sm text-slate-500">
            A balanced curriculum delivering cognitive mastery, moral grounding, and creative confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
          {[
            {
              title: 'Literacy & Phonics',
              desc: 'Jolly Phonics, spelling drills, reading comprehension, creative writing, and public speaking.',
              icon: BookOpen
            },
            {
              title: 'Numeracy & Quantitative',
              desc: 'Mental arithmetic, problem solving, geometry, data representation, and quantitative reasoning.',
              icon: Award
            },
            {
              title: 'Basic Science & Tech',
              desc: 'Hands-on simple experiments, living things, ecology, weather, and introductory robotics.',
              icon: Sparkles
            },
            {
              title: 'Digital Literacy & Coding',
              desc: 'Scratch programming, typing mastery, computer hardware identification, and internet safety.',
              icon: Award
            },
            {
              title: 'Civic & Social Studies',
              desc: 'Nigerian heritage, culture, ethics, honesty, road safety, and community leadership.',
              icon: ShieldCheck
            },
            {
              title: 'Creative Arts & Music',
              desc: 'Drawing, painting, crafts, recorder playing, Nigerian folkloric music, and drama.',
              icon: Smile
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Routine */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">A Structured Day</span>
            <h3 className="text-2xl font-bold text-slate-900 font-display">Daily Primary School Schedule</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            {[
              { time: '7:30 AM – 7:50 AM', event: 'Arrival, Devotion & Class Registration' },
              { time: '7:50 AM – 8:15 AM', event: 'Morning Assembly, National Anthem & Moral Talk' },
              { time: '8:15 AM – 10:15 AM', event: 'Core Academic Lessons (Literacy & Numeracy)' },
              { time: '10:15 AM – 10:45 AM', event: 'Fruit, Snack & Supervised Outdoor Play' },
              { time: '10:45 AM – 1:00 PM', event: 'Science Practicals, Social Studies & French/ICT' },
              { time: '1:00 PM – 1:45 PM', event: 'Warm Nutritious Lunch & Relaxation' },
              { time: '1:45 PM – 2:30 PM', event: 'Creative Arts, Handwriting Clinic & Daily Reflection' },
              { time: '2:30 PM – 3:30 PM', event: 'Co-curricular Clubs (Debate, Scrabble, Jet Club, Taekwondo)' }
            ].map((slot, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-emerald-800 font-mono flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  {slot.time}
                </span>
                <span className="font-medium text-slate-800 text-right">{slot.event}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
