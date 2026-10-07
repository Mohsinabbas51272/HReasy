import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Calendar } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isCandidate = user.role === 'candidate';

  const getPageTitle = () => {
    if (isCandidate) {
      return 'Candidate Dashboard';
    }
    switch (location.pathname) {
      case '/':
        return 'Recruitment Dashboard';
      case '/candidates':
        return 'Candidate Database';
      case '/screening':
        return 'Screening Pipeline';
      case '/shortlisted':
        return 'Shortlisted Candidates';
      case '/interviews':
        return 'Interview Scheduler';
      case '/settings':
        return 'Settings';
      default:
        return 'HReasy';
    }
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="glass border-b border-border-glass h-16 flex items-center justify-between px-8 sticky top-0 z-10 w-full">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-bold text-white tracking-wide">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center space-x-6">
        {/* Date display */}
        <div className="hidden md:flex items-center space-x-2 text-zinc-400 text-sm border-r border-border-glass pr-6">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Notifications mock */}
        <button className="relative p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
