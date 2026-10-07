import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Users, 
  Search, 
  CheckSquare, 
  Calendar, 
  XCircle, 
  ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await API.get('/candidates');
        setCandidates(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  const getStatsCount = (status) => candidates.filter(c => c.status === status).length;

  const stats = [
    { name: 'Total Sourced', count: candidates.length, icon: Users, color: 'from-blue-600/30 to-indigo-600/10', text: 'text-blue-400' },
    { name: 'In Screening', count: getStatsCount('screening'), icon: Search, color: 'from-amber-600/30 to-yellow-600/10', text: 'text-amber-400' },
    { name: 'Shortlisted', count: getStatsCount('shortlisted'), icon: CheckSquare, color: 'from-emerald-600/30 to-green-600/10', text: 'text-emerald-400' },
    { name: 'Interviews', count: getStatsCount('interview'), icon: Calendar, color: 'from-purple-600/30 to-indigo-600/10', text: 'text-purple-400' },
    { name: 'Rejected', count: getStatsCount('rejected'), icon: XCircle, color: 'from-rose-600/30 to-red-600/10', text: 'text-rose-400' },
  ];

  // Calculate sourcing source distribution
  const sourcesCount = candidates.reduce((acc, curr) => {
    const src = curr.source || 'Email';
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  const sourceList = Object.entries(sourcesCount).map(([name, val]) => ({
    name,
    count: val,
    percentage: candidates.length > 0 ? Math.round((val / candidates.length) * 100) : 0
  })).sort((a,b) => b.count - a.count);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass p-6 rounded-xl relative overflow-hidden flex flex-col justify-between border border-border-glass">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} rounded-bl-full blur-xl opacity-40`}></div>
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-[10px] font-semibold uppercase tracking-wider">{stat.name}</span>
              <stat.icon className={`w-5 h-5 ${stat.text}`} />
            </div>
            <span className="text-3xl font-black text-white mt-4">{stat.count}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Candidates List */}
        <div className="lg:col-span-2 glass p-6 rounded-xl border border-border-glass space-y-4">
          <div className="flex items-center justify-between border-b border-border-glass pb-4">
            <h2 className="text-lg font-bold text-white tracking-wide">Recently Added Candidates</h2>
            <button 
              onClick={() => navigate('/candidates')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span>View all database</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-border-glass">
            {candidates.slice(0, 5).map((candidate) => (
              <div key={candidate.id} className="py-3.5 flex items-center justify-between group">
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">{candidate.name}</h4>
                  <p className="text-xs text-zinc-500">{candidate.email}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-zinc-400">{candidate.source || 'Manual'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-bold tracking-wide
                    ${candidate.status === 'received' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                    ${candidate.status === 'screening' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : ''}
                    ${candidate.status === 'shortlisted' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                    ${candidate.status === 'interview' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : ''}
                    ${candidate.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : ''}
                  `}>
                    {candidate.status}
                  </span>
                </div>
              </div>
            ))}
            {candidates.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm">
                No candidates sourced yet. Add one under Candidates!
              </div>
            )}
          </div>
        </div>

        {/* Sourcing distribution analytics */}
        <div className="glass p-6 rounded-xl border border-border-glass space-y-6">
          <div className="border-b border-border-glass pb-4">
            <h2 className="text-lg font-bold text-white tracking-wide">Sourcing Distribution</h2>
            <p className="text-xs text-zinc-500">Distribution of candidate applications by channel</p>
          </div>

          <div className="space-y-4">
            {sourceList.map((src) => (
              <div key={src.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-300">{src.name}</span>
                  <span className="text-zinc-500 font-bold">{src.count} ({src.percentage}%)</span>
                </div>
                <div className="w-full bg-zinc-800/50 rounded-full h-2 border border-zinc-700/30">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500 shadow-md shadow-indigo-600/30" 
                    style={{ width: `${src.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {sourceList.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm">
                No channel details available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
