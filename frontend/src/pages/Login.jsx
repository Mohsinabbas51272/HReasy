import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Briefcase, Lock, Mail, User, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'hr',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login';
      const { data } = await API.post(endpoint, formData);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email, id: data.id, role: data.role }));

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-dark-bg">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md glass p-8 rounded-2xl space-y-6 relative border border-border-glass animate-fade-in">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex bg-indigo-600 p-3 rounded-xl justify-center items-center shadow-lg shadow-indigo-600/30">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-wider">HReasy Portal</h2>
          <p className="text-zinc-400 text-sm">
            {isRegistering ? 'Create recruiter account' : 'Sign in to manage recruitment'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg p-3.5 flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div className="space-y-1">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/40 border border-border-glass rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1 py-1">
                <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Register As</label>
                <div className="flex space-x-6 pt-1">
                  <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="hr"
                      checked={formData.role === 'hr'}
                      onChange={() => setFormData({ ...formData, role: 'hr' })}
                      className="accent-indigo-500 h-4 w-4"
                    />
                    <span>HR Recruiter</span>
                  </label>
                  <label className="flex items-center space-x-2 text-sm text-zinc-300 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="candidate"
                      checked={formData.role === 'candidate'}
                      onChange={() => setFormData({ ...formData, role: 'candidate' })}
                      className="accent-indigo-500 h-4 w-4"
                    />
                    <span>Candidate</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="recruiter@hreasy.com"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/40 border border-border-glass rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider block">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/40 border border-border-glass rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : isRegistering ? 'Sign Up' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors cursor-pointer"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account yet? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
