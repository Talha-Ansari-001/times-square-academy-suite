import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Bell, 
  CreditCard, 
  LogOut, 
  Menu, 
  X,
  GraduationCap,
  Calendar,
  Settings,
  UserCircle
} from 'lucide-react';
import { blink } from '../../lib/blink';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'admin' | 'teacher' | 'student';
}

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await blink.auth.signOut();
    navigate('/');
  };

  const menuItems = {
    admin: [
      { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
      { icon: <Users size={20} />, label: 'Manage Staff', path: '/admin/teachers' },
      { icon: <GraduationCap size={20} />, label: 'Manage Students', path: '/admin/students' },
      { icon: <BookOpen size={20} />, label: 'Classes', path: '/admin/classes' },
      { icon: <CreditCard size={20} />, label: 'Financials', path: '/admin/fees' },
      { icon: <Bell size={20} />, label: 'Announcements', path: '/admin/announcements' },
    ],
    teacher: [
      { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/teacher' },
      { icon: <Calendar size={20} />, label: 'Attendance', path: '/teacher/attendance' },
      { icon: <BookOpen size={20} />, label: 'My Classes', path: '/teacher/classes' },
      { icon: <CreditCard size={20} />, label: 'Fee Records', path: '/teacher/fees' },
      { icon: <Bell size={20} />, label: 'Bulletins', path: '/teacher/announcements' },
    ],
    student: [
      { icon: <LayoutDashboard size={20} />, label: 'Profile', path: '/student' },
      { icon: <Calendar size={20} />, label: 'My Attendance', path: '/student/attendance' },
      { icon: <CreditCard size={20} />, label: 'Tuition & Fees', path: '/student/fees' },
      { icon: <Bell size={20} />, label: 'Bulletins', path: '/student/announcements' },
    ]
  };

  const currentMenuItems = menuItems[role];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-primary text-white border-r border-white/10 shadow-xl">
        <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3">
          <GraduationCap className="text-secondary w-8 h-8" />
          <span className="font-serif font-bold text-sm tracking-widest uppercase">Times Square Academy</span>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                location.pathname === item.path 
                  ? "bg-secondary text-primary shadow-lg" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <span className={cn(
                "transition-transform group-hover:scale-110",
                location.pathname === item.path ? "text-primary" : "text-secondary"
              )}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all group"
          >
            <LogOut size={20} className="text-secondary group-hover:translate-x-1 transition-transform" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <aside className={cn(
        "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-primary text-white transition-transform duration-300 transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-secondary w-6 h-6" />
            <span className="font-serif font-bold text-xs tracking-widest uppercase">TS Academy</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {currentMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                location.pathname === item.path 
                  ? "bg-secondary text-primary" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <span className={location.pathname === item.path ? "text-primary" : "text-secondary"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 lg:h-20 bg-white border-b border-border flex items-center justify-between px-6 z-30">
          <button 
            className="lg:hidden p-2 text-primary hover:bg-muted rounded-md transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="hidden lg:block">
            <h1 className="text-xl font-serif text-primary flex items-center gap-2 lowercase italic opacity-60">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-sm font-bold text-primary">{user?.name}</span>
              <span className="text-[10px] uppercase tracking-widest text-secondary font-bold">{user?.role} portal</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/10 shadow-sm overflow-hidden">
              <UserCircle size={28} className="text-primary" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#fcfcfd]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
