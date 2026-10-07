import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Clock
} from 'lucide-react';

const CandidateCard = ({ candidate, onStatusChange }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'received':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'screening':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'shortlisted':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'interview':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  const getSourceBadgeColor = (source) => {
    switch (source?.toLowerCase()) {
      case 'linkedin':
        return 'text-sky-400 bg-sky-950/20 border-sky-900/30';
      case 'indeed':
        return 'text-blue-400 bg-blue-950/20 border-blue-900/30';
      default:
        return 'text-purple-400 bg-purple-950/20 border-purple-900/30';
    }
  };

  return (
    <div className="glass glass-hover p-6 rounded-xl space-y-4 relative overflow-hidden group animate-fade-in">
      {/* Background card accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300"></div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide group-hover:text-indigo-300 transition-colors">
            {candidate.name}
          </h3>
          <span className={`inline-flex items-center px-2 py-0.5 mt-1.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(candidate.status)}`}>
            {candidate.status}
          </span>
        </div>
        
        {/* Source badge */}
        <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getSourceBadgeColor(candidate.source)}`}>
          {candidate.source || 'Manual'}
        </span>
      </div>

      <div className="space-y-2 text-zinc-400 text-sm">
        <div className="flex items-center space-x-2.5">
          <Mail className="w-4 h-4 text-zinc-500" />
          <a href={`mailto:${candidate.email}`} className="hover:text-indigo-400 transition-colors truncate">{candidate.email}</a>
        </div>
        {candidate.phone && (
          <div className="flex items-center space-x-2.5">
            <Phone className="w-4 h-4 text-zinc-500" />
            <span className="truncate">{candidate.phone}</span>
          </div>
        )}
      </div>

      {/* CV Section */}
      <div className="pt-2 flex items-center justify-between border-t border-border-glass">
        {candidate.cvUrl ? (
          <a
            href={`http://localhost:5000${candidate.cvUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>View CV Document</span>
          </a>
        ) : (
          <span className="text-xs text-zinc-500 italic">No CV Uploaded</span>
        )}

        <div className="text-[10px] text-zinc-500">
          Added {new Date(candidate.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Action buttons */}
      <div className="pt-3 flex space-x-2">
        {candidate.status === 'received' && (
          <button
            onClick={() => onStatusChange(candidate.id, 'screening')}
            className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded bg-amber-600/10 hover:bg-amber-600/20 text-amber-400 border border-amber-500/20 text-xs font-bold transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Move to Screening</span>
          </button>
        )}

        {candidate.status === 'screening' && (
          <>
            <button
              onClick={() => onStatusChange(candidate.id, 'shortlisted')}
              className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Shortlist</span>
            </button>
            <button
              onClick={() => onStatusChange(candidate.id, 'rejected')}
              className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 text-xs font-bold transition-all cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          </>
        )}

        {candidate.status === 'shortlisted' && (
          <button
            onClick={() => navigate(`/interviews?candidateId=${candidate.id}`)}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            <span>Schedule Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        {candidate.status === 'interview' && (
          <div className="w-full text-center py-1.5 bg-purple-500/5 text-purple-400 text-xs font-medium border border-purple-500/10 rounded">
            Interview Scheduled
          </div>
        )}

        {candidate.status === 'rejected' && (
          <button
            onClick={() => onStatusChange(candidate.id, 'screening')}
            className="w-full text-center py-1.5 hover:bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-800 rounded transition-colors cursor-pointer"
          >
            Reconsider Candidate
          </button>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
