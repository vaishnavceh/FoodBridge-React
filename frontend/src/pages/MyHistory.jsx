import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { getVolunteerHistory } from '../services/volunteerService';
import { formatDate } from '../utils/formatters';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export const MyHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getVolunteerHistory();
        setHistory(res.data);
      } catch (err) {
        toast.error(err.message || 'Failed to load volunteer history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Service <span className="text-amber-400">History</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Log of fulfilled transport missions and deliveries.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </header>

      {history.length === 0 ? (
        <EmptyState
          icon={History}
          title="No completed missions yet"
          description="You haven't completed any transport missions yet. Check the Mission Board to accept your first assignment!"
          action={
            <Link
              to="/volunteer-tasks"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors"
            >
              Go to Mission Board
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden p-0 border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Mission Date
                  </th>
                  <th className="p-4 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="p-4 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="p-4 text-xs font-bold text-amber-400 uppercase tracking-wider text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {history.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-slate-400 font-mono text-xs">
                      {formatDate(row.updated_at)}
                    </td>
                    <td className="p-4 font-semibold text-white">{row.food_type}</td>
                    <td className="p-4 text-slate-300">
                      {row.donor?.username || 'Verified Donor'}
                    </td>
                    <td className="p-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" /> COMPLETED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyHistory;
