import React, { useState } from 'react';
import { GraduationCap, Lock, KeyRound, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Student, PageId } from '../../types';
import { StorageService } from '../../services/storage';

interface StudentLoginPageProps {
  onLoginSuccess: (student: Student) => void;
  onNavigate: (page: PageId) => void;
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({
  onLoginSuccess,
  onNavigate
}) => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const student = StorageService.authenticateStudent(studentNumber.trim(), password);
    if (!student) {
      setError('Invalid Student Number or Password. Please verify and try again.');
      return;
    }

    if (student.status === 'Suspended') {
      setError('Your student account is currently suspended. Please contact the Principal\'s Office.');
      return;
    }

    onLoginSuccess(student);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#003087] text-white mx-auto flex items-center justify-center shadow-md">
            <GraduationCap className="w-8 h-8" />
          </div>
          <p className="text-xs font-black text-[#008751] uppercase tracking-widest">Portal Authentication</p>
          <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">
            Student Portal Login
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Access your terminal report cards, continuous assessment, school fees, and profile.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
            <div>
              <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1.5">
                Student ID / Number
              </label>
              <input
                required
                type="text"
                value={studentNumber}
                onChange={e => setStudentNumber(e.target.value)}
                placeholder="Enter student ID number"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-[#003087] focus:outline-none uppercase"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider">
                  Password
                </label>
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#003087] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-[#003087] hover:bg-[#002568] text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Login to Student Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-400">
            <span>Forgot credentials? Contact school registry at <strong className="text-slate-600 font-mono">09076930244</strong></span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>
            Are you a Teacher?{' '}
            <button onClick={() => onNavigate('staff-login')} className="text-[#008751] font-black hover:underline cursor-pointer">
              Staff Login
            </button>
          </p>
          <p>
            School Administrator?{' '}
            <button onClick={() => onNavigate('admin-login')} className="text-slate-800 font-black hover:underline cursor-pointer">
              Admin Portal
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
