import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  Phone,
  User,
  Building,
  KeyRound,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface AuthModalProps {
  onNavigateToSignup?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onNavigateToSignup }) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    loginClientWithPassword,
    loginClientWithOTP,
    signupClient,
    requestOTP,
    resetPasswordWithOTP,
  } = useAuth();
  const { error, success } = useToast();

  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);
  const [timer, setTimer] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Reset state on open/close
  useEffect(() => {
    if (!isAuthModalOpen) {
      setOtpSent(false);
      setOtp('');
      setSimulatedCode(null);
      setLoading(false);
    }
  }, [isAuthModalOpen]);

  // Timers
  useEffect(() => {
    let interval: any;
    if (otpSent && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  useEffect(() => {
    let interval: any;
    if (resendCooldown > 0) {
      interval = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  // 1. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      error('Please provide your email and password.');
      return;
    }
    setLoading(true);
    await login(email.trim(), password);
    setLoading(false);
  };

  // 2. Request OTP
  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      error('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    const res = await requestOTP(email.trim());
    setLoading(false);
    if (res.success) {
      setSimulatedCode(res.simulatedOTP || null);
      setOtpSent(true);
      setTimer(300);
      setResendCooldown(30);
    }
  };

  // 3. Verify OTP Login
  const handleVerifyOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      error('Please enter the 6-digit OTP code.');
      return;
    }
    setLoading(true);
    await loginClientWithOTP(email.trim(), otp, name.trim(), phone.trim());
    setLoading(false);
  };

  // 4. Sign Up
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      error('Name and Email are required.');
      return;
    }
    if (password && password.length < 6) {
      error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    await signupClient({
      name: name.trim(),
      email: email.trim(),
      password: password || undefined,
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
    });
    setLoading(false);
  };

  // 5. Reset Password with OTP
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      await handleSendOTP();
      return;
    }
    if (otp.length < 6 || !newPassword || newPassword.length < 6) {
      error('Please enter the OTP and a new password of at least 6 characters.');
      return;
    }
    setLoading(true);
    const res = await resetPasswordWithOTP(email.trim(), otp, newPassword);
    setLoading(false);
    if (res.success) {
      setMode('login');
      setAuthMethod('password');
      setOtpSent(false);
      setPassword(newPassword);
    }
  };

  return (
    <div
      id="client-auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="client-auth-modal-card"
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center justify-center h-10 w-14 rounded-xl bg-slate-950 border border-slate-800 p-1 shadow-sm">
              <img
                src="/logo.png"
                alt="SK Yadav"
                className="h-full w-full object-contain dark:invert dark:brightness-200"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Client Portal
            </span>
          </div>

          <h3 className="text-2xl font-bold text-white font-display">
            {mode === 'login' && 'Login'}
            {mode === 'signup' && 'Create Client Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Log in to your client portal to track project progress, quotations, and deliverables.'}
            {mode === 'signup' && 'Sign up to request quotes, view project milestones, and communicate with SK Yadav.'}
            {mode === 'forgot' && 'Enter your email to receive a password reset verification code.'}
          </p>
        </div>

        {/* 1. PASSWORD LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot');
                    setOtpSent(false);
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 3. SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignup} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone / WhatsApp</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 555-019"
                    className="w-full pl-8 pr-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Brand</label>
                <div className="relative">
                  <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Nexus Inc"
                    className="w-full pl-8 pr-2 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* 4. FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {otpSent && (
              <>
                {simulatedCode && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Code: <strong className="font-mono text-sm text-white">{simulatedCode}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtp(simulatedCode)}
                      className="px-2 py-0.5 bg-emerald-600/30 hover:bg-emerald-600/50 rounded text-[11px]"
                    >
                      Auto-Fill
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Verification OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center font-mono text-base tracking-widest text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    New Password (Min 6 chars)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setOtpSent(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{otpSent ? 'Update Password' : 'Send Reset Code'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Modal Footer / Switcher */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          {mode === 'login' ? (
            <p className="text-xs text-slate-400">
              Don't have a client account?{' '}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateToSignup) {
                    closeAuthModal();
                    onNavigateToSignup();
                  } else {
                    setMode('signup');
                  }
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2"
              >
                Sign up here
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setOtpSent(false);
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
