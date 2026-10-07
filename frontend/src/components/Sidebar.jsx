import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Search, 
  CheckSquare, 
  Calendar, 
  LogOut,
  Briefcase,
  User,
  FileText
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'Recruiter' };
  const isCandidate = user.role === 'candidate';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const hrNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Candidates', path: '/candidates', icon: Users },
    { name: 'Screening', path: '/screening', icon: Search },
    { name: 'Shortlisted', path: '/shortlisted', icon: CheckSquare },
    { name: 'Interviews', path: '/interviews', icon: Calendar },
  ];

  const candidateNavItems = [
    { name: 'My Dashboard', path: '/', icon: LayoutDashboard },
  ];

  const navItems = isCandidate ? candidateNavItems : hrNavItems;

  return (
    <aside className="w-64 glass border-r border-border-glass flex flex-col h-screen fixed left-0 top-0 z-20">
      {/* Brand Logo */}
      <div className="p-6 border-b border-border-glass flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-wider text-white">HReasy</span>
      </div>

      {/* Role badge */}
      <div className="px-4 pt-4">
        <span className={`inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full border w-full justify-center
          ${isCandidate 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
          }`}>
          {isCandidate ? <User className="w-3 h-3" /> : <Briefcase className="w-3 h-3" />}
          <span>{isCandidate ? 'Candidate Portal' : 'HR Recruiter Panel'}</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 border border-transparent'
              }`
            }
          >
            <item.icon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info / Logout */}
      <div className="p-4 border-t border-border-glass space-y-3">
        <div className="flex items-center space-x-3 px-2">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold border
            ${isCandidate 
              ? 'bg-emerald-600/30 text-emerald-400 border-emerald-500/20' 
              : 'bg-indigo-600/30 text-indigo-400 border-indigo-500/20'
            }`}>
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="truncate">
            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email || (isCandidate ? 'Candidate' : 'Recruiter Admin')}</p>
          </div>
        </div>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-all border border-transparent hover:border-rose-950/30 font-medium text-sm text-left cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
