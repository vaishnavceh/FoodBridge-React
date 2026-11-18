import React, { useEffect, useState } from 'react';
import { Truck, Phone, Navigation, User, Package, CheckCircle2, Radio, Check } from 'lucide-react';
import { getVolunteerTasks } from '../services/volunteerService';
import { acceptMission, completeMission } from '../services/donationService';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export const VolunteerTasks = () => {
  const [tasks, setTasks] = useState({ available: [], active: [] });
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await getVolunteerTasks();
      setTasks(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load volunteer tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAccept = async (id) => {
    const confirmed = window.confirm('Claim this transport mission?');
    if (!confirmed) return;

    setActionLoadingId(id);
    try {
      await acceptMission(id);
      toast.success('Mission claimed! It is now in your active assignments.');
      fetchTasks();
    } catch (err) {
      toast.error(err.message || 'Could not claim mission');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleComplete = async (id) => {
    const confirmed = window.confirm('Has the food been delivered successfully to the recipient?');
    if (!confirmed) return;

    setActionLoadingId(id);
    try {
      await completeMission(id);
      toast.success('Outstanding! Delivery completed and logged to your service history.');
      fetchTasks();
    } catch (err) {
      toast.error(err.message || 'Could not complete delivery');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10 pb-6 border-b border-white/5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Mission <span className="text-amber-400">Board</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Active community delivery dispatches and available logistics runs.
        </p>
      </div>

      {/* 1. In Progress Active Missions */}
      {tasks.active.length > 0 && (
        <section className="mb-14">
          <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-400 pl-3 mb-6">
            In Progress <span className="text-white">Missions</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.active.map((row) => (
              <Card
                key={row.id}
                className="p-6 border-emerald-500/40 bg-emerald-950/20 flex flex-col justify-between"
              >
                <div>
                  <Badge variant="completed" className="mb-3">
                    CLAIMED &amp; IN ROUTE
                  </Badge>

                  <h3 className="text-xl font-bold text-white mb-2">{row.food_type}</h3>

                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-3">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Donor: <strong className="text-white">{row.donor?.username}</strong>
                  </p>

                  <div className="space-y-2 mb-6">
                    {row.phone && (
                      <a
                        href={`tel:${row.phone}`}
                        className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {row.phone}
                      </a>
                    )}
                    {row.location && (
                      <a
                        href={row.location}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Turn-by-turn Navigation
                      </a>
                    )}
                  </div>
                </div>

                <Button
                  variant="green"
                  size="md"
                  isLoading={actionLoadingId === row.id}
                  onClick={() => handleComplete(row.id)}
                  className="w-full text-xs font-black"
                  icon={CheckCircle2}
                >
                  MARK AS DELIVERED
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 2. Available Missions */}
      <section>
        <h2 className="text-xl font-bold text-amber-400 border-l-4 border-amber-400 pl-3 mb-6">
          Available <span className="text-white">Missions</span>
        </h2>

        {tasks.available.length === 0 ? (
          <EmptyState
            icon={Truck}
            title="No new missions available"
            description="All current signals have been claimed. Keep this board open to catch the next alert!"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.available.map((row) => (
              <Card
                key={row.id}
                className="p-6 border-white/10 flex flex-col justify-between hover:border-amber-400/50"
              >
                <div>
                  <Badge variant="pending" className="mb-3">
                    Live Signal
                  </Badge>

                  <h3 className="text-xl font-bold text-white mb-2">{row.food_type}</h3>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 space-y-1.5 mb-6">
                    <div className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      <span>Qty: <strong>{row.quantity}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span>Donor: <strong>{row.donor?.username}</strong></span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  isLoading={actionLoadingId === row.id}
                  onClick={() => handleAccept(row.id)}
                  className="w-full text-xs font-black"
                  icon={Radio}
                >
                  ACCEPT MISSION
                </Button>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default VolunteerTasks;
