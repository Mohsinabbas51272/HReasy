import React, { useState, useEffect } from 'react';
import API from '../services/api';
import CandidateCard from '../components/CandidateCard';
import { Award } from 'lucide-react';

const Shortlist = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/candidates', {
        params: { status: 'shortlisted' }
      });
      setCandidates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.patch(`/candidates/${id}/status`, { status });
      fetchCandidates();
    } catch (err) {
      console.error(err);
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-2 border-b border-border-glass pb-4">
        <Award className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-bold text-white tracking-wide">Shortlisted Candidates</h2>
      </div>

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
            No candidates shortlisted yet. Move candidates here from the Screening Board!
          </div>
        )}
      </div>
    </div>
  );
};

export default Shortlist;
