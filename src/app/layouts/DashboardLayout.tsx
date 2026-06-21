import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  Home, MessageCircle, Heart, Settings, LogOut, Menu, X, History, Crown, Camera
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../components/Logo';
import { useAuth } from '@/context/AuthContext';
import { useStyleSync } from '@/context/StyleSyncContext';

export function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/app/dashboard' },
    { icon: Camera, label: 'Live Mirror', path: '/app/mirror', highlight: true },
    { icon: MessageCircle, label: 'AI Stylist', path: '/app/stylist' },
    { icon: History, label: 'History', path: '/app/history' },
    { icon: Heart, label: 'Saved Looks', path: '/app/saved' },
    { icon: Settings, label: 'Settings', path: '/app/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const NavButtons = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      <button
        onClick={() => {
          navigate('/app/mirror');
          onNavigate?.();
        }}
        className="w-full mb-6 px-4 py-4 rounded-2xl bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white shadow-[0_10px_20px_-10px_rgba(124,108,255,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(124,108,255,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        <Camera className="w-5 h-5" />
        <span className="font-semibold">Live Mirror</span>
      </button>
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => {
            navigate(item.path);
            onNavigate?.();
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            isActive(item.path)
              ? 'bg-gray-100 text-black font-medium'
              : item.highlight
              ? 'text-blue-600 bg-blue-50/50 hover:bg-blue-50'
              : 'text-gray-500 hover:bg-gray-50 hover:text-black'
          }`}
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-sm">{item.label}</span>
        </button>
      ))}
    </>
  );

  const UserSection = () => (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 mb-2">
        <div
          className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-lg font-bold"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {user?.name?.charAt(0) || 'S'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate" style={{ fontFamily: 'var(--font-inter)' }}>
            {user?.name || 'Stylist'}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500" style={{ fontFamily: 'var(--font-inter)' }}>
            <Crown className="w-3 h-3 text-yellow-500" />
            OUTFYT Pro
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          logout();
          navigate('/');
        }}
        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
        style={{ fontFamily: 'var(--font-inter)' }}
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="h-screen flex bg-white font-sans text-gray-900">
      <aside className="hidden md:flex flex-col w-72 border-r border-gray-100 bg-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">OUTFYT</h1>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavButtons />
        </nav>
        <UserSection />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-white flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">OUTFYT</h1>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                <NavButtons onNavigate={() => setSidebarOpen(false)} />
              </nav>
              <UserSection />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="md:hidden p-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-gray-100">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex flex-col items-center">
             <span className="text-lg font-bold tracking-tight">OUTFYT</span>
          </div>
          <button
            onClick={() => navigate('/app/mirror')}
            className="p-2.5 rounded-full bg-gradient-to-r from-[#7C6CFF] to-[#FF6B81] text-white shadow-md flex-shrink-0"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
        
        <main className="flex-1 overflow-auto bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
