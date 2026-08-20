import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Lock,
  Phone,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Home,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface LoginPageProps {
  onNavigateHome: () => void;
  onNavigateSignup: () => void;
  onLoginSuccess: (role?: 'admin' | 'client') => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigateHome,
  onNavigateSignup,
  onLoginSuccess
}) => {
  const {
    login,
    loginClientWithPassword,
    loginClientWithOTP,
    requestOTP,
    resetPasswordWithOTP
  } = useAuth();
  const { error, success } = useToast();

  const [authMethod, setAuthMethod] = useState<'password' | 'otp' | 'forgot'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);
  const [timer, setTimer] = useState(300);
  const [resendCooldown, setResendCooldown] = useState(0);

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

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !password) {
      setErrorMessage('Please provide your email address and password.');
      return;
    }

    setIsLoading(true);
    const res = await login(email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      onLoginSuccess(res.role);
    } else {
      setErrorMessage(res.message || 'Invalid email or password.');
    }
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    const res = await requestOTP(email.trim());
    setIsLoading(false);

    if (res.success) {
      setSimulatedCode(res.simulatedOTP || null);
      setOtpSent(true);
      setTimer(300);
      setResendCooldown(30);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!otp || otp.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    const res = await loginClientWithOTP(email.trim(), otp);
    setIsLoading(false);

    if (res.success) {
      onLoginSuccess();
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!otpSent) {
      await handleSendOTP();
      return;
    }
    if (otp.length < 6 || !newPassword || newPassword.length < 6) {
      setErrorMessage('Please enter the OTP and a new password with at least 6 characters.');
      return;
    }

    setIsLoading(true);
    const res = await resetPasswordWithOTP(email.trim(), otp, newPassword);
    setIsLoading(false);

    if (res.success) {
      setAuthMethod('password');
      setOtpSent(false);
      setPassword(newPassword);
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div id="client-login-view" className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden text-slate-100"
      >
        {/* Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center h-12 w-16 rounded-2xl bg-slate-950 border border-slate-800 p-1 mx-auto mb-4 shadow-sm">
            <img
              src="/logo.png"
              alt="SK Yadav"
              className="h-full w-full object-contain dark:invert dark:brightness-200"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
            {authMethod === 'forgot' ? 'Reset Password' : 'Login'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xs mx-auto">
            {authMethod === 'forgot'
              ? 'Enter your email to receive a password reset verification code.'
              : 'Log in to your client portal to track project progress, quotations, and deliverables.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-rose-950/40 border border-rose-800/60 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Method Switcher Tabs */}
        {authMethod !== 'forgot' && (
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setErrorMessage('');
                setOtpSent(false);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authMethod === 'password'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('otp');
                setErrorMessage('');
                setOtpSent(false);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                authMethod === 'otp'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              One-Time OTP
            </button>
          </div>
        )}

        {/* 1. PASSWORD FORM */}
        {authMethod === 'password' && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod('forgot');
                    setErrorMessage('');
                    setOtpSent(false);
                  }}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. OTP FORM */}
        {authMethod === 'otp' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alex@company.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send 6-Digit OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                {simulatedCode && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Preview Code: <strong className="font-mono text-white text-sm">{simulatedCode}</strong>
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
                    Enter Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="123456"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-center font-mono text-lg tracking-widest text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>
                    Expires in: <strong className="text-indigo-400 font-mono">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSendOTP()}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-indigo-400 hover:text-indigo-300 disabled:opacity-40 cursor-pointer"
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Change Email
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    <span>Verify & Sign In</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {authMethod === 'forgot' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
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
                  setAuthMethod('password');
                  setOtpSent(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{otpSent ? 'Update Password' : 'Send Reset Code'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer / Switcher */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            Don't have a client account?{' '}
            <button
              type="button"
              onClick={onNavigateSignup}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2"
            >
              Sign up here
            </button>
          </p>

          <button
            type="button"
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Website</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
