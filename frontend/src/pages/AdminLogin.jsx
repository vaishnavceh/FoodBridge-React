import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, Key, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Access Denied: Admin credentials invalid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#141414]/90 backdrop-blur-2xl border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl relative text-center">
      <div className="inline-flex p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 mb-4 shadow-inner">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Staff Portal</h2>
      <p className="text-slate-400 text-xs sm:text-sm mt-1 mb-6">Restricted Administrative System Control</p>

      {error && (
        <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center justify-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div className="relative">
          <Key className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin ID (e.g. master_admin)"
            className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <div className="relative">
          <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Secure Key"
            className="w-full bg-black/60 border border-slate-700 rounded-xl px-4 py-3.5 pl-11 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={loading}
          className="w-full mt-4"
        >
          AUTHORIZE ACCESS <ArrowRight className="w-4 h-4" />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5">
        <Link
          to="/login"
          className="text-xs text-slate-400 hover:text-slate-300 font-semibold transition-colors"
        >
          &larr; Return to Public Login
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
