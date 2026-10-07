import React, { useState, useEffect } from 'react';
import API from '../services/api';
import CandidateCard from '../components/CandidateCard';
import { Plus, Search, Upload, X, AlertCircle } from 'lucide-react';

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('LinkedIn');
  const [jobTitle, setJobTitle] = useState('Software Engineer');
  const [cvFile, setCvFile] = useState(null);
  
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/candidates', {
        params: { search }
      });
      setCandidates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCandidates();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/candidates/${id}/status`, { status });
      fetchCandidates();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      let cvUrl = '';

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

      await API.post('/candidates', {
        name,
        email,
        phone,
        source,
        jobTitle,
        cvUrl
      });

      // Clear states & close modal
      setName('');
      setEmail('');
      setPhone('');
      setSource('LinkedIn');
      setJobTitle('Software Engineer');
      setCvFile(null);
      setShowAddModal(false);
      
      // Refresh candidates list
      fetchCandidates();
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to add candidate. Please verify fields.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-border-glass rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-all animate-fade-in"
          />
        </div>

        {/* Add Candidate Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Candidates Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onStatusChange={handleStatusChange}
            />
          ))}
          {candidates.length === 0 && (
            <div className="col-span-full text-center py-20 text-zinc-500">
              No candidates found matching your criteria.
            </div>
          )}
        </div>
      )}

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="w-full max-w-lg glass rounded-xl border border-border-glass p-6 space-y-6 max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xl font-bold text-white">Add New Candidate</h2>
              <p className="text-xs text-zinc-400">Fill in details and upload candidate CV document</p>
            </div>

            {formError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg p-3 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3 py-2 bg-zinc-950/40 border border-border-glass rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3 py-2 bg-zinc-950/40 border border-border-glass rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold block">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2834"
                    className="w-full px-3 py-2 bg-zinc-950/40 border border-border-glass rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-400 font-semibold block">Sourcing Channel</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-border-glass rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Email">Email</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold block">Applying Position / Job Title</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Software Engineer"
                  className="w-full px-3 py-2 bg-zinc-950/40 border border-border-glass rounded-lg text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* File Upload Area */}
              <div className="space-y-1.5">
                <label className="text-xs text-zinc-400 font-semibold block">CV File (PDF, DOC, DOCX)</label>
                <div className="border border-dashed border-border-glass hover:border-indigo-500/50 rounded-xl p-6 text-center cursor-pointer transition-colors relative group">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-8 h-8 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                    {cvFile ? (
                      <span className="text-xs text-indigo-400 font-bold">{cvFile.name}</span>
                    ) : (
                      <>
                        <span className="text-xs text-zinc-300 font-medium">Click to upload CV file</span>
                        <span className="text-[10px] text-zinc-500">Max size: 5MB</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 hover:bg-zinc-800 text-zinc-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  {formLoading ? 'Adding...' : 'Add Candidate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
