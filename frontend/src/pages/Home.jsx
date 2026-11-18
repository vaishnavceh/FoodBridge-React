import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Handshake, Truck, ArrowRight, Sparkles } from 'lucide-react';
import { getPublicStats } from '../services/statsService';
import Card from '../components/ui/Card';

export const Home = () => {
  const [stats, setStats] = useState({
    total_delivered: 0,
    total_ngos: 0,
    total_volunteers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getPublicStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          SDG 2 Zero Hunger &amp; SDG 12 Responsible Consumption
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
          Bridging Waste and <span className="text-amber-400">Want.</span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Real-time surplus food redistribution tracking. Connecting generous donors, compassionate NGOs, and rapid-response volunteers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-base transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            Start Donating Now
          </Link>
          <Link
            to="/learn-more"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:border-amber-500/50 hover:bg-white/5 text-white font-bold text-base transition-all active:scale-95"
          >
            Learn How it Works
          </Link>
        </div>

        {/* Real-Time Platform Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 pt-16 border-t border-white/5">
          <div className="text-center">
            <h2 className="text-5xl font-black text-amber-400 mb-2">
              {loading ? '...' : stats.total_delivered.toLocaleString()}
            </h2>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Meals Delivered
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-5xl font-black text-amber-400 mb-2">
              {loading ? '...' : stats.total_ngos.toLocaleString()}
            </h2>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Partner NGOs
            </p>
          </div>
          <div className="text-center">
            <h2 className="text-5xl font-black text-amber-400 mb-2">
              {loading ? '...' : stats.total_volunteers.toLocaleString()}
            </h2>
            <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Volunteers
            </p>
          </div>
        </div>
      </section>

      {/* Role Architecture Section */}
      <section className="py-24 bg-[#070b14]/70 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
              The Triad Ecosystem
            </h2>
            <p className="mt-4 text-slate-400">
              Three synchronized actors working together to eliminate local food waste in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Donors Card */}
            <Card className="p-8 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
                  <Utensils className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Donors</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Restaurants, caterers, banquet halls, and households list surplus food in seconds with live GPS mapping and freshness metrics.
                </p>
              </div>
              <Link
                to="/learn-more#donors"
                className="inline-flex items-center gap-2 text-sky-400 text-sm font-bold hover:underline"
              >
                Details <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>

            {/* NGOs Card */}
            <Card className="p-8 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <Handshake className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">NGOs</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Shelters and non-profit organizations claim available food or broadcast urgent community food needs directly to local donors.
                </p>
              </div>
              <Link
                to="/learn-more#ngos"
                className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold hover:underline"
              >
                Details <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>

            {/* Volunteers Card */}
            <Card className="p-8 flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                  <Truck className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Volunteers</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Community delivery heroes accept transport missions, coordinate pickups, and navigate directly with turn-by-turn routing.
                </p>
              </div>
              <Link
                to="/learn-more#volunteers"
                className="inline-flex items-center gap-2 text-amber-400 text-sm font-bold hover:underline"
              >
                Details <ArrowRight className="w-4 h-4" />
              </Link>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
