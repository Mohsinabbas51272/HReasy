import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  FileText, 
  Upload, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink 
} from 'lucide-react';

const CandidateDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [cvFile, setCvFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/candidates/profile/me');
      setProfile(data);
      setPhone(data.phone || '');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch candidate profile. Contact HR.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUploadLoading(true);
    setSuccessMsg('');
    setError('');

    try {
      let cvUrl = profile.cvUrl;

      if (cvFile) {
        const formData = new FormData();
        formData.append('cv', cvFile);

        const uploadRes = await API.post('/candidates/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        cvUrl = uploadRes.data.cvUrl;
      }

      const { data } = await API.patch('/candidates/profile/me', {
        phone,
        cvUrl
      });

      setProfile(data);
      setCvFile(null);
      setSuccessMsg('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="glass p-8 max-w-lg mx-auto rounded-xl border border-rose-500/20 text-center space-y-4 my-20">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Profile Error</h3>
        <p className="text-zinc-400 text-sm">{error}</p>
      </div>
    );
  }

  const steps = [
    { label: 'Received', key: 'received' },
    { label: 'Screening', key: 'screening' },
    { label: 'Shortlisted', key: 'shortlisted' },
    { label: 'Interview', key: 'interview' }
  ];

  const getStepIndex = (status) => {
    if (status === 'rejected') return -1;
    return steps.findIndex(s => s.key === status);
  };

  const currentStepIndex = getStepIndex(profile.status);
  const application = profile.Applications?.[0] || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header welcome */}
      <div className="glass p-8 rounded-xl border border-border-glass relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white tracking-wide animate-fade-in">Welcome, {profile.name}!</h2>
          <p className="text-zinc-400 text-sm">Track your job application progress for: <strong className="text-indigo-400 font-bold">{application.jobTitle || 'General Position'}</strong></p>
        </div>
      </div>

      {/* Progress pipeline */}
      <div className="glass p-8 rounded-xl border border-border-glass space-y-6">
        <h3 className="text-lg font-bold text-white">Application Status</h3>

        {profile.status === 'rejected' ? (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Thank you for your interest in HReasy. Unfortunately, your application has not been selected for further steps at this time.</span>
          </div>
        ) : (
          <div className="relative flex items-center justify-between py-6">
            <div className="absolute left-0 right-0 h-0.5 bg-zinc-800 top-1/2 -translate-y-1/2 z-0"></div>
            {/* Active connection line */}
            <div 
              className="absolute left-0 h-0.5 bg-indigo-500 top-1/2 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isActive = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-col items-center z-10 space-y-2">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all duration-300
                    ${isCompleted ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}
                    ${isActive ? 'ring-4 ring-indigo-500/20 scale-110' : ''}
                  `}>
                    {idx + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors
                    ${isCompleted ? 'text-indigo-400' : 'text-zinc-500'}
                  `}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Details & CV upload */}
        <div className="glass p-6 rounded-xl border border-border-glass space-y-6 h-fit">
          <h3 className="text-lg font-bold text-white border-b border-border-glass pb-3">My Application Profile</h3>

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg p-3 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold block">Full Name</label>
              <input
                type="text"
                disabled
                value={profile.name}
                className="w-full px-3 py-2 bg-zinc-950/20 border border-border-glass rounded-lg text-zinc-400 text-sm focus:outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold block">Email Address</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3 py-2 bg-zinc-950/20 border border-border-glass rounded-lg text-zinc-400 text-sm focus:outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-zinc-400 font-semibold block">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2 bg-zinc-950 border border-border-glass rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 font-semibold block">CV Attachment (PDF, DOC, DOCX)</label>
              {profile.cvUrl ? (
                <div className="flex items-center justify-between p-3 bg-zinc-950/50 border border-border-glass rounded-lg">
                  <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold">
                    <FileText className="w-4 h-4" />
                    <span>View CV Document</span>
                  </div>
                  <a
                    href={`http://localhost:5000${profile.cvUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-zinc-400 hover:text-white transition-colors flex items-center space-x-1 font-bold cursor-pointer"
                  >
                    <span>Open</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">No CV uploaded yet.</p>
              )}

              {/* Upload area */}
              <div className="border border-dashed border-border-glass hover:border-indigo-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors relative group">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center space-y-1">
                  <Upload className="w-6 h-6 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                  <span className="text-[11px] text-zinc-400 font-medium">
                    {cvFile ? cvFile.name : 'Select new CV file to upload'}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={uploadLoading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs transition-all shadow-md cursor-pointer"
            >
              {uploadLoading ? 'Saving changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Upcoming interviews portal */}
        <div className="glass p-6 rounded-xl border border-border-glass flex flex-col h-full space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-border-glass pb-3">Interview Scheduled</h3>

          {profile.status === 'interview' && application.interviewDate ? (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-xl space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-indigo-400 font-bold flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{application.interviewDate}</span>
                  </span>
                  <span className="text-zinc-300 font-bold flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{application.interviewTime}</span>
                  </span>
                </div>
                
                {application.notes && (
                  <div className="pt-2 border-t border-border-glass space-y-1 text-xs text-zinc-400">
                    <p className="font-semibold text-zinc-300 uppercase tracking-wider text-[9px]">Interview Instructions</p>
                    <p className="whitespace-pre-wrap leading-relaxed">{application.notes}</p>
                  </div>
                )}
              </div>
              <p className="text-xs text-zinc-500 text-center">Please make sure to join the meeting link or be ready 5 minutes early.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-2 text-center text-zinc-500">
              <Calendar className="w-8 h-8 text-zinc-600" />
              <p className="text-sm font-semibold">No interviews scheduled yet</p>
              <p className="text-xs">Once your status changes, scheduling details will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
