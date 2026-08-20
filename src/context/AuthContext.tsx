import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { DatabaseStore } from '../services/dbStore';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: 'admin' | 'client'; message: string; user?: User }>;
  loginClientWithPassword: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  loginClientWithOTP: (email: string, otp: string, name?: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  signupClient: (data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    whatsapp?: string;
    company?: string;
    jobTitle?: string;
    location?: string;
    avatar?: string;
  }) => Promise<{ success: boolean; message: string }>;
  adminLogin: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  adminLoginWithPassword: (password: string) => Promise<{ success: boolean; message: string }>;
  requestOTP: (target: string) => Promise<{ success: boolean; message: string; simulatedOTP?: string }>;
  resetPasswordWithOTP: (email: string, otp: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (data: Partial<User>) => void;
  deleteAccount: () => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const { success, error, info } = useToast();

  useEffect(() => {
    // 1. Check if admin session exists
    const adminSession = DatabaseStore.getAdminSession();
    if (adminSession.isAuthenticated && adminSession.user) {
      setCurrentUser(adminSession.user);
      return;
    }

    // 2. Check client user
    const user = DatabaseStore.getCurrentUser();
    if (user && user.status !== 'deleted') {
      setCurrentUser(user);
    }
  }, []);

  // Unified Login Method (Calls backend, handles both Single Admin and Client authentication)
  const login = async (
    emailOrIdentifier: string,
    password: string
  ): Promise<{ success: boolean; role?: 'admin' | 'client'; message: string; user?: User }> => {
    const cleanId = (emailOrIdentifier || '').trim();
    if (!cleanId || !password) {
      const msg = 'Please enter your email and password.';
      error(msg, 'Validation Error');
      return { success: false, message: msg };
    }

    try {
      // 1. Call Backend Unified Endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanId, password: password.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (data.role === 'admin') {
          const adminUser: User = data.user || {
            id: 'admin-sk-01',
            name: 'SK Yadav',
            email: 'skyadav02837@gmail.com',
            role: 'admin',
            phone: '+91 9354152837',
            company: 'SK Yadav Freelancing',
            avatar: '/logo.png',
          };
          const session = {
            isAuthenticated: true,
            token: data.token,
            user: adminUser,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000,
          };
          DatabaseStore.saveAdminSession(session);
          DatabaseStore.setCurrentUser(adminUser);
          setCurrentUser(adminUser);
          setIsAuthModalOpen(false);
          success('Welcome back, SK Yadav! Administrator access authorized.', 'Admin Authenticated');
          return { success: true, role: 'admin', message: 'Administrator authorized.', user: adminUser };
        } else {
          const clientUser: User = data.user;
          DatabaseStore.setCurrentUser(clientUser);
          setCurrentUser(clientUser);
          setIsAuthModalOpen(false);
          success(`Welcome back, ${clientUser.name}!`, 'Login Successful');
          return { success: true, role: 'client', message: 'Login successful.', user: clientUser };
        }
      }

      // If backend explicitly returned an error message or rate limit
      const failMsg = data.error || 'Invalid email or password.';
      error(failMsg, 'Authentication Failed');
      return { success: false, message: failMsg };
    } catch {
      // Offline fallback: Check local DatabaseStore
      const adminCheck = await DatabaseStore.verifyAdminLogin(cleanId, password);
      if (adminCheck.success && adminCheck.user) {
        setCurrentUser(adminCheck.user);
        setIsAuthModalOpen(false);
        success('Welcome back, SK Yadav! Administrator access authorized.', 'Admin Authenticated');
        return { success: true, role: 'admin', message: 'Administrator authorized.', user: adminCheck.user };
      }

      const clientCheck = await DatabaseStore.loginClientWithPassword(cleanId, password);
      if (clientCheck.success && clientCheck.user) {
        setCurrentUser(clientCheck.user);
        setIsAuthModalOpen(false);
        success(`Welcome back, ${clientCheck.user.name}!`, 'Login Successful');
        return { success: true, role: 'client', message: 'Login successful.', user: clientCheck.user };
      }

      const msg = 'Invalid email or password.';
      error(msg, 'Authentication Failed');
      return { success: false, message: msg };
    }
  };

  const adminLogin = async (identifier: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await DatabaseStore.verifyAdminLogin(identifier, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        success('Welcome back, SK Yadav! Administrator access authorized.', 'Admin Authenticated');
        return { success: true, message: res.message };
      } else {
        error(res.message, 'Admin Authentication Failed');
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      const msg = err.message || 'Authentication error occurred.';
      error(msg, 'Server Error');
      return { success: false, message: msg };
    }
  };

  const adminLoginWithPassword = async (password: string): Promise<{ success: boolean; message: string }> => {
    return adminLogin('skyadav06', password);
  };

  const loginClientWithPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await DatabaseStore.loginClientWithPassword(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        success(`Welcome back, ${res.user.name}!`, 'Login Successful');
        return { success: true, message: res.message };
      } else {
        error(res.message, 'Login Failed');
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      const msg = err.message || 'Login failed.';
      error(msg, 'Error');
      return { success: false, message: msg };
    }
  };

  const loginClientWithOTP = async (
    email: string,
    otp: string,
    name?: string,
    phone?: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await DatabaseStore.loginClientWithOTP(email, otp, name, phone);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        success(`Welcome, ${res.user.name}! Authenticated via OTP.`, 'Login Successful');
        return { success: true, message: res.message };
      } else {
        error(res.message, 'Verification Failed');
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      const msg = err.message || 'OTP verification error.';
      error(msg, 'Error');
      return { success: false, message: msg };
    }
  };

  const signupClient = async (data: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    whatsapp?: string;
    company?: string;
    jobTitle?: string;
    location?: string;
    avatar?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await DatabaseStore.registerClient(data);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsAuthModalOpen(false);
        success(`Account created successfully! Welcome to your Client Portal, ${res.user.name}.`, 'Registration Complete');
        return { success: true, message: res.message };
      } else {
        error(res.message, 'Registration Failed');
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      const msg = err.message || 'Registration error.';
      error(msg, 'Error');
      return { success: false, message: msg };
    }
  };

  const requestOTP = async (target: string): Promise<{ success: boolean; message: string; simulatedOTP?: string }> => {
    if (!target || (!target.includes('@') && target.length < 8)) {
      return { success: false, message: 'Please enter a valid email address or phone number.' };
    }
    const { otp } = DatabaseStore.generateOTP(target);
    info(`Verification code sent to ${target}. (Demo OTP: ${otp})`, 'OTP Dispatched');
    return {
      success: true,
      message: `A 6-digit code was sent to ${target}.`,
      simulatedOTP: otp,
    };
  };

  const resetPasswordWithOTP = async (
    email: string,
    otp: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await DatabaseStore.resetPasswordWithOTP(email, otp, newPass);
    if (res.success) {
      success(res.message, 'Password Reset');
    } else {
      error(res.message, 'Reset Failed');
    }
    return res;
  };

  const changePassword = async (
    currentPass: string,
    newPass: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'User not logged in.' };
    const res = await DatabaseStore.changeUserPassword(currentUser.id, currentPass, newPass);
    if (res.success) {
      success(res.message, 'Password Updated');
    } else {
      error(res.message, 'Update Failed');
    }
    return res;
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = DatabaseStore.updateUserProfile(currentUser.id, data);
    if (updated) {
      setCurrentUser(updated);
      success('Profile details updated successfully.', 'Profile Saved');
    }
  };

  const deleteAccount = async (): Promise<{ success: boolean; message: string }> => {
    if (!currentUser) return { success: false, message: 'User not logged in.' };
    const res = DatabaseStore.deleteUserAccount(currentUser.id);
    if (res.success) {
      setCurrentUser(null);
      info('Your account has been deleted. Financial records remain securely archived.', 'Account Deleted');
    } else {
      error(res.message, 'Delete Failed');
    }
    return res;
  };

  const logout = () => {
    DatabaseStore.logoutAdminSession();
    DatabaseStore.setCurrentUser(null);
    setCurrentUser(null);
    info('You have been logged out securely.', 'Session Ended');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = !!currentUser && currentUser.status !== 'deleted';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoggedIn,
        login,
        loginClientWithPassword,
        loginClientWithOTP,
        signupClient,
        adminLogin,
        adminLoginWithPassword,
        requestOTP,
        resetPasswordWithOTP,
        changePassword,
        updateProfile,
        deleteAccount,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
