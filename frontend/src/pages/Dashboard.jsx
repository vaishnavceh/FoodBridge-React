import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Radio,
  PlusCircle,
  Eye,
  Megaphone,
  CheckSquare,
  History,
  Power,
  PhoneCall,
  Package,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, getDashboardAlerts } from '../services/dashboardService';
import Card from '../components/ui/Card';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({ active_donations: 0, open_requests: 0 });
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = user?.role || 'donor';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, alertsRes] = await Promise.all([
          getDashboardStats(),
          getDashboardAlerts()
        ]);
        setStats(statsRes.data);
        setAlerts(alertsRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getThemeColor = () => {
    if (role === 'donor') return 'text-sky-400 border-sky-500/30';
    if (role === 'ngo') return 'text-emerald-400 border-emerald-500/30';
    return 'text-amber-400 border-amber-500/30';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* NGO Alert Banner */}
      {role === 'ngo' && alerts.length > 0 && (
        <div className="space-y-3 mb-8">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-3 animate-pulse"
            >
              <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm">
                <strong>INCOMING:</strong>{' '}
                <span className="font-semibold text-white">{alert.username}</span> is fulfilling{' '}
                <strong className="underline decoration-emerald-500/40">{alert.item_needed}</strong>.
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/5 pb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-2">
            System <span className={getThemeColor().split(' ')[0]}>Access</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            Role: <strong className={`uppercase ${getThemeColor().split(' ')[0]}`}>{role}</strong> | User:{' '}
            <strong className="text-white">{user?.username}</strong> | Location:{' '}
            <strong className="text-slate-300">{user?.location}</strong>
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-right">
            <span className="text-xs text-slate-400 block font-semibold uppercase">Active Donations</span>
            <span className="text-xl font-black text-sky-400">{stats.active_donations}</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-right">
            <span className="text-xs text-slate-400 block font-semibold uppercase">Open NGO Signals</span>
            <span className="text-xl font-black text-amber-400">{stats.open_requests}</span>
          </div>
        </div>
      </header>

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* DONOR TILES */}
        {role === 'donor' && (
          <>
            <Link to="/donate" className="group">
              <Card className="h-full border-sky-500/20 hover:border-sky-400 flex flex-col justify-between p-8">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Broadcast Food</h3>
                  <p className="text-slate-400 text-sm">
                    Signal surplus food availability to the community network with instant GPS coordinates.
                  </p>
                </div>
                <div className="mt-6 text-sky-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  Create Broadcast &rarr;
                </div>
              </Card>
            </Link>

            <Link to="/view-requests" className="group">
              <Card className="h-full border-sky-500/20 hover:border-sky-400 flex flex-col justify-between p-8">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Megaphone className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">NGO Needs</h3>
                  <p className="text-slate-400 text-sm">
                    Intercept and directly fulfill urgent NGO resource signals and food requests.
                  </p>
                </div>
                <div className="mt-6 text-sky-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  View Requests &rarr;
                </div>
              </Card>
            </Link>

            <Link to="/my-donations" className="group">
              <Card className="h-full border-sky-500/20 hover:border-sky-400 flex flex-col justify-between p-8">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Layers className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">My Donations</h3>
                  <p className="text-slate-400 text-sm">
                    Review your donation history and reprint digital donation certificates.
                  </p>
                </div>
                <div className="mt-6 text-sky-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  Donation Archive &rarr;
                </div>
              </Card>
            </Link>
          </>
        )}

        {/* NGO TILES */}
        {role === 'ngo' && (
          <>
            <Link to="/browse" className="group">
              <Card className="h-full border-emerald-500/20 hover:border-emerald-400 flex flex-col justify-between p-8">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Radio className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Satellite Feed</h3>
                  <p className="text-slate-400 text-sm">
                    View live food donations available in real time and reserve for your community.
                  </p>
                </div>
                <div className="mt-6 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  Access Live Feed &rarr;
                </div>
              </Card>
            </Link>

            <Link to="/my-requests" className="group">
              <Card className="h-full border-emerald-500/20 hover:border-emerald-400 flex flex-col justify-between p-8">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <PlusCircle className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Broadcast Need</h3>
                  <p className="text-slate-400 text-sm">
                    Create GPS-tagged supply requests for urgent food items required by your shelter.
                  </p>
                </div>
                <div className="mt-6 text-emerald-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  Manage Requests &rarr;
                </div>
              </Card>
            </Link>
          </>
        )}

        {/* VOLUNTEER TILES */}
        {role === 'volunteer' && (
          <>
            <Link to="/volunteer-tasks" className="group">
              <Card className="h-full border-amber-500/20 hover:border-amber-400 flex flex-col justify-between p-8">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <CheckSquare className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Mission Board</h3>
                  <p className="text-slate-400 text-sm">
                    View available delivery missions, claim transport tasks, and execute drop-offs.
                  </p>
                </div>
                <div className="mt-6 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  Open Mission Board &rarr;
                </div>
              </Card>
            </Link>

            <Link to="/my-history" className="group">
              <Card className="h-full border-amber-500/20 hover:border-amber-400 flex flex-col justify-between p-8">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <History className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Service History</h3>
                  <p className="text-slate-400 text-sm">
                    Review your completed deliveries, community contribution, and impact history.
                  </p>
                </div>
                <div className="mt-6 text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  View Log &rarr;
                </div>
              </Card>
            </Link>
          </>
        )}

        {/* TERMINATE (LOGOUT) CARD */}
        <button onClick={handleLogout} className="group text-left cursor-pointer">
          <Card className="h-full border-rose-500/20 hover:border-rose-400 flex flex-col justify-between p-8">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Power className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Terminate</h3>
              <p className="text-slate-400 text-sm">
                Securely exit the system and invalidate your active authentication session.
              </p>
            </div>
            <div className="mt-6 text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              Sign Out &rarr;
            </div>
          </Card>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
