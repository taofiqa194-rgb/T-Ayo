import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Administrator, PageId } from '../../types';
import { FirebaseAuthService } from '../../firebase/authService';

interface AdminLoginPageProps {
  onLoginSuccess: (admin: Administrator) => void;
  onNavigate: (page: PageId) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
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
      const admin = await FirebaseAuthService.loginAdmin(identifier.trim(), password);
      onLoginSuccess(admin);
    } catch (err: any) {
      setError(err.message || 'Invalid Administrator ID / Email or Password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white mx-auto flex items-center justify-center shadow-md">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
          <p className="text-xs font-black text-purple-700 uppercase tracking-widest">Administrative Console</p>
          <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-slate-500 font-normal">
            Administrative governance, admissions queue, student records, fee verifications, and school operations.
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
                Admin ID or Official Email
              </label>
              <input
                required
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter Administrator ID or Email"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider">
                  Master Password
                </label>
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter administrator password"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-slate-900 hover:bg-black disabled:opacity-60 text-white font-black text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Root Credentials via Firebase...</span>
                </>
              ) : (
                <>
                  <span>Login to Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-400">
            <span>Administrative technical support hotline: <strong className="text-slate-600 font-mono">09076930244</strong></span>
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
            Are you a Teacher?{' '}
            <button onClick={() => onNavigate('staff-login')} className="text-[#008751] font-black hover:underline cursor-pointer">
              Staff Portal
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
