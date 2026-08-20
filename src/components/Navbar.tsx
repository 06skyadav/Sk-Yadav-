import React, { useState, useEffect, useRef } from 'react';
import {
  Code2,
  Moon,
  Sun,
  Search,
  Bell,
  User,
  Shield,
  LogOut,
  FolderHeart,
  Menu,
  X,
  FileText,
  Sparkles,
  ArrowRight,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { DatabaseStore } from '../services/dbStore';
import { AppNotification, SiteSettings } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string, param?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenSearch }) => {
  const { currentUser, isAdmin, isLoggedIn, logout, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { info } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DatabaseStore.getSettings());
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      setNotifications(DatabaseStore.getNotifications(currentUser?.id));
      setSettings(DatabaseStore.getSettings());
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNavClick = (tab: string) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-200 bg-slate-950/85 border-slate-800/80 text-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
        >
          <div className="relative flex items-center justify-center h-10 w-14 sm:w-16 rounded-xl bg-slate-900/90 dark:bg-slate-900/60 border border-slate-800/80 p-1.5 shadow-md shadow-indigo-500/10 group-hover:border-indigo-500/50 group-hover:scale-105 transition-all duration-200 shrink-0">
            <img
              src="/logo.png"
              alt="SK Yadav Official Logo"
              className="h-full w-full object-contain dark:invert dark:brightness-200 transition-all duration-200"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-1.5 font-display">
              {settings.logoText || 'SK YADAV'}
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Available for freelance" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-indigo-400 tracking-wide uppercase">
              Full Stack Web Dev
            </p>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav id="desktop-navigation" className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/60">
          {navLinks.map(link => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Search */}
          <button
            id="nav-search-button"
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-slate-700"
            title="Search projects, services & skills"
            aria-label="Search"
          >
            <Search className="w-4.5 h-4.5" />
          </button>

          {/* Theme Toggle */}
          <button
            id="nav-theme-toggle"
            type="button"
            onClick={() => {
              toggleTheme();
              const nextMode = theme === 'dark' ? 'Light' : 'Dark';
              info(`Switched to ${nextMode} Mode`, 'Theme Updated');
            }}
            className={`p-2 rounded-xl transition-all duration-200 cursor-pointer active:scale-90 hover:scale-105 ${
              theme === 'dark'
                ? 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/80 bg-slate-900/60 border border-slate-800'
                : 'text-indigo-600 hover:text-indigo-500 hover:bg-slate-100 bg-slate-100/80 border border-slate-200 shadow-sm'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4.5 h-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4.5 h-4.5 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {/* Notification Center */}
          <div className="relative" ref={notifRef}>
            <button
              id="nav-notifications-toggle"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-950 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div
                id="notification-dropdown"
                className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-400" />
                    <h4 className="font-semibold text-sm text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[11px] bg-indigo-500/20 text-indigo-300 rounded-full font-medium">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => DatabaseStore.markAllNotificationsRead(currentUser?.id)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/50 py-1">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-slate-500 py-6">No notifications yet</p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          DatabaseStore.markNotificationRead(notif.id);
                          if (notif.link) handleNavClick(notif.link.replace('/', ''));
                          setNotifDropdownOpen(false);
                        }}
                        className={`p-3 rounded-xl cursor-pointer transition-colors ${
                          notif.isRead ? 'hover:bg-slate-800/50 opacity-70' : 'bg-indigo-950/30 hover:bg-indigo-950/50 border border-indigo-500/20'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="text-xs font-semibold text-white">{notif.title}</h5>
                          <span className="text-[10px] text-slate-500 shrink-0">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Auth Dropdown */}
          <div className="relative" ref={userRef}>
            {isLoggedIn ? (
              <button
                id="nav-user-profile-button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer text-slate-200"
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {currentUser?.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium max-w-[100px] truncate hidden sm:inline">
                  {currentUser?.name.split(' ')[0]}
                </span>
                {isAdmin && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-300 font-semibold rounded">
                    Admin
                  </span>
                )}
              </button>
            ) : (
              <button
                id="nav-login-button"
                onClick={openAuthModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:text-white transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Login / Sign Up
              </button>
            )}

            {userDropdownOpen && isLoggedIn && (
              <div
                id="user-account-dropdown"
                className="absolute right-0 mt-3 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      handleNavClick('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    Client Dashboard
                  </button>

                  <button
                    onClick={() => {
                      handleNavClick('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <FolderHeart className="w-4 h-4 text-rose-400" />
                    Saved Projects
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        handleNavClick('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-purple-300 hover:text-purple-100 hover:bg-purple-950/40 rounded-xl transition-colors text-left cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-purple-400" />
                      Admin Control Center
                    </button>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      logout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA: Start a Project */}
          <button
            id="nav-cta-hire-button"
            onClick={() => handleNavClick('dashboard')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start a Project</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 py-6 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`flex items-center justify-between p-3 rounded-xl text-sm font-medium text-left ${
                  currentTab === link.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => handleNavClick('dashboard')}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25"
            >
              <Sparkles className="w-4 h-4" />
              Start a Project / Request Quote
            </button>

            {!isLoggedIn ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    openAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white text-center cursor-pointer"
                >
                  Login / Sign Up
                </button>
                <button
                  onClick={() => {
                    handleNavClick('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs font-semibold text-indigo-300 text-center cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
                >
                  Dashboard
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="flex-1 py-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs font-semibold text-purple-300"
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-2.5 rounded-xl bg-rose-950/40 text-rose-400"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={() => {
                toggleTheme();
                const nextMode = theme === 'dark' ? 'Light' : 'Dark';
                info(`Switched to ${nextMode} Mode`, 'Theme Updated');
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
              <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
