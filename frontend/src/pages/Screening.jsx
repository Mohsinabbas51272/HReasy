import React, { useState, useEffect } from 'react';
import API from '../services/api';
import CandidateCard from '../components/CandidateCard';
import { Layers } from 'lucide-react';

const Screening = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/candidates');
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

  const receivedCandidates = candidates.filter(c => c.status === 'received');
  const screeningCandidates = candidates.filter(c => c.status === 'screening');

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
        <Layers className="w-5 h-5 text-indigo-400" />
        <h2 className="text-lg font-bold text-white tracking-wide">Screening Board</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-14rem)] overflow-hidden">
        {/* Received Column */}
        <div className="glass rounded-xl p-5 border border-border-glass flex flex-col h-full bg-zinc-950/20">
          <div className="flex justify-between items-center pb-4 border-b border-border-glass">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wide flex items-center space-x-2">
              <span>Received Applications</span>
              <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full text-xs font-bold">
                {receivedCandidates.length}
              </span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1">
            {receivedCandidates.map(c => (
              <CandidateCard key={c.id} candidate={c} onStatusChange={handleStatusChange} />
            ))}
            {receivedCandidates.length === 0 && (
              <div className="text-center py-16 text-zinc-600 text-xs italic">
                No new applications received.
              </div>
            )}
          </div>
        </div>

        {/* Screening Column */}
        <div className="glass rounded-xl p-5 border border-border-glass flex flex-col h-full bg-zinc-950/20">
          <div className="flex justify-between items-center pb-4 border-b border-border-glass">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-wide flex items-center space-x-2">
              <span>Under Review / Screening</span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-full text-xs font-bold">
                {screeningCandidates.length}
              </span>
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1">
            {screeningCandidates.map(c => (
              <CandidateCard key={c.id} candidate={c} onStatusChange={handleStatusChange} />
            ))}
            {screeningCandidates.length === 0 && (
              <div className="text-center py-16 text-zinc-600 text-xs italic">
                No candidates currently being screened.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screening;
