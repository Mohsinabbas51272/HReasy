import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { Calendar, User, Clock, Send, CheckCircle, Mail, AlertCircle, ExternalLink } from 'lucide-react';

const Interviews = () => {
  const [searchParams] = useSearchParams();
  const candidateIdParam = searchParams.get('candidateId');

  const [shortlisted, setShortlisted] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const [submitLoading, setSubmitLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      // Get shortlisted candidates for the scheduler
      const shortlistedRes = await API.get('/candidates', { params: { status: 'shortlisted' } });
      setShortlisted(shortlistedRes.data);

      // Get candidates who are in interview stage (to list scheduled interviews)
      const scheduledRes = await API.get('/candidates', { params: { status: 'interview' } });
      setScheduled(scheduledRes.data);

      // Pre-select candidate from param
      if (candidateIdParam) {
        setSelectedCandidateId(candidateIdParam);
      } else if (shortlistedRes.data.length > 0) {
        setSelectedCandidateId(shortlistedRes.data[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [candidateIdParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');
    setSuccessData(null);

    try {
      if (!selectedCandidateId) {
        throw new Error('Please select a candidate');
      }

      const { data } = await API.post('/recruitment/send-email', {
        candidateId: selectedCandidateId,
        date,
        time,
        notes
      });

      setSuccessData(data);
      // Reset form
      setDate('');
      setTime('');
      setNotes('');
      // Refresh Lists
      fetchData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to schedule interview.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Schedule Form */}
      <div className="lg:col-span-1 glass p-6 rounded-xl border border-border-glass h-fit space-y-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Schedule Interview</span>
          </h2>
          <p className="text-xs text-zinc-500">Send direct invitation email via Nodemailer</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg p-3.5 flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successData && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2.5">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-bold">Interview scheduled successfully!</span>
            </div>
            {successData.testEmailUrl && (
              <div className="pt-2">
                <a
                  href={successData.testEmailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>View Test Email Inbox</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold block">Select Candidate</label>
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950 border border-border-glass rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="" disabled>-- Choose Candidate --</option>
              {shortlisted.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
              {/* If pre-selected param is not in active shortlist list, render it */}
              {candidateIdParam && !shortlisted.some(c => c.id === candidateIdParam) && (
                <option value={candidateIdParam}>Pre-selected Candidate</option>
              )}
            </select>
            {shortlisted.length === 0 && !candidateIdParam && (
              <p className="text-[10px] text-amber-400 italic">No shortlisted candidates available.</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold block">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950/40 border border-border-glass rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold block">Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-950/40 border border-border-glass rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold block">Notes for Invitation</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Provide interview details, panel names or Google Meet links..."
              className="w-full px-3 py-2 bg-zinc-950/40 border border-border-glass rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitLoading || (!selectedCandidateId && shortlisted.length === 0)}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitLoading ? 'Sending invite...' : 'Schedule & Invite'}</span>
          </button>
        </form>
      </div>

      {/* Scheduled Interviews list */}
      <div className="lg:col-span-2 glass p-6 rounded-xl border border-border-glass flex flex-col h-full space-y-4">
        <div className="border-b border-border-glass pb-4">
          <h2 className="text-lg font-bold text-white tracking-wide">Upcoming Interviews</h2>
          <p className="text-xs text-zinc-500">List of scheduled recruitment interviews</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 max-h-[calc(100vh-14rem)] pr-1">
          {scheduled.map((c) => {
            const app = c.Applications?.[0] || {};
            return (
              <div key={c.id} className="p-4 bg-zinc-950/30 border border-border-glass rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-indigo-500/20 transition-all">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">{c.name}</h4>
                  <p className="text-xs text-zinc-400 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Role: {app.jobTitle || 'General Position'}</span>
                  </p>
                  <p className="text-xs text-zinc-400">Email: {c.email}</p>
                </div>
                
                <div className="flex flex-col md:items-end gap-1 text-xs">
                  <div className="flex items-center space-x-1.5 text-indigo-400 font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{app.interviewDate || 'TBD'}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-zinc-400 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{app.interviewTime || 'TBD'}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {scheduled.length === 0 && (
            <div className="text-center py-20 text-zinc-500 text-sm">
              No upcoming interviews scheduled yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Interviews;
