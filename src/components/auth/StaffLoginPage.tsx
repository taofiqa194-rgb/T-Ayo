import React, { useState } from 'react';
import { Users, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Staff, PageId } from '../../types';
import { FirebaseAuthService } from '../../firebase/authService';

interface StaffLoginPageProps {
  onLoginSuccess: (staff: Staff) => void;
  onNavigate: (page: PageId) => void;
}

export const StaffLoginPage: React.FC<StaffLoginPageProps> = ({
  onLoginSuccess,
  onNavigate
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const staff = await FirebaseAuthService.loginStaff(identifier.trim(), password);
      onLoginSuccess(staff);
    } catch (err: any) {
      setError(err.message || 'Invalid Staff ID / Email or Password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-[#008751] text-white mx-auto flex items-center justify-center shadow-md">
            <Users className="w-8 h-8" />
          </div>
          <p className="text-xs font-black text-[#003087] uppercase tracking-widest">Faculty Authentication</p>
          <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">
            Staff & Faculty Portal
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Upload continuous assessment, record examination scores, manage your profile, and classes.
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
                Staff ID or Email Address
              </label>
              <input
                required
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter your Staff ID or official email"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-[#008751] focus:outline-none"
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
                placeholder="Enter your faculty password"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#008751] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-[#008751] hover:bg-[#007043] disabled:opacity-60 text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials via Firebase...</span>
                </>
              ) : (
                <>
                  <span>Login to Staff Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-400">
            <span>Faculty assistance or password reset? Contact administration at <strong className="text-slate-600 font-mono">09076930244</strong></span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="text-center text-xs text-slate-500 space-y-1">
          <p>
            Are you a Student?{' '}
            <button onClick={() => onNavigate('student-login')} className="text-[#003087] font-black hover:underline cursor-pointer">
              Student Login
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
