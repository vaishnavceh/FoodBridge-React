import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      const destination = location.state?.from?.pathname || '/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#1e1e1e]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
      <div className="text-center mb-8">
        <div className="inline-flex p-3.5 bg-sky-500/10 border border-sky-500/20 rounded-2xl text-sky-400 mb-4 shadow-inner">
          <KeyRound className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">System Login</h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">NGO | Donor | Volunteer Access</p>
      </div>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="relative">
          <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>

        <Button
          type="submit"
          variant="blue"
          size="lg"
          isLoading={loading}
          className="w-full mt-4"
        >
          Authorize <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center space-y-3">
        <p className="text-slate-400 text-xs sm:text-sm">
          Need an account?{' '}
          <Link to="/register" className="text-sky-400 hover:text-sky-300 font-bold transition-colors">
            Register Here
          </Link>
        </p>
        <Link
          to="/admin-login"
          className="block text-[11px] text-slate-500 hover:text-slate-400 uppercase tracking-wider font-semibold transition-colors"
        >
          Administrative Portal
        </Link>
      </div>
    </div>
  );
};

export default Login;
