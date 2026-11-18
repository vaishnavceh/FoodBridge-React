import React, { useEffect, useState } from 'react';
import { Navigation, Send, Radio, AlertTriangle, CheckCircle2, Phone, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyRequests, createRequest } from '../services/requestService';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export const MyRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    item_needed: '',
    quantity_needed: '',
    contact_number: '',
    map_link: '',
    urgency: 'Medium'
  });
  const [submitting, setSubmitting] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      setRequests(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const link = `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
        setFormData((prev) => ({ ...prev, map_link: link }));
        setGpsLocked(true);
        toast.success('GPS Coordinates Locked!');
      },
      (err) => {
        toast.error(`GPS Error: ${err.message}`);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createRequest(formData);
      toast.success('Food request signal broadcasted successfully!');
      setFormData({
        item_needed: '',
        quantity_needed: '',
        contact_number: '',
        map_link: '',
        urgency: 'Medium'
      });
      setGpsLocked(false);
      fetchRequests();
    } catch (err) {
      toast.error(err.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Signal <span className="text-emerald-400">Broadcast</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Broadcast community resource requests directly to regional food donors.
        </p>
      </div>

      {/* Command Bar Form */}
      <Card className="p-6 mb-10 border-emerald-500/20 bg-slate-900/60">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Item needed */}
            <div className="sm:col-span-4">
              <input
                type="text"
                required
                placeholder="Item needed (e.g. 50 Meals, Rice)"
                value={formData.item_needed}
                onChange={(e) => setFormData({ ...formData, item_needed: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Qty */}
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                placeholder="Qty (e.g. 30)"
                value={formData.quantity_needed}
                onChange={(e) => setFormData({ ...formData, quantity_needed: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* Phone */}
            <div className="sm:col-span-3">
              <input
                type="tel"
                required
                placeholder="Contact Phone"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            {/* GPS Lock */}
            <div className="sm:col-span-1">
              <button
                type="button"
                onClick={handleGetLocation}
                title="Lock Current GPS"
                className={`w-full py-3 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  gpsLocked
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>

            {/* Urgency */}
            <div className="sm:col-span-2">
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-emerald-400"
              >
                <option value="Low" className="bg-slate-900">Low Urgency</option>
                <option value="Medium" className="bg-slate-900">Medium</option>
                <option value="High" className="bg-slate-900">High</option>
                <option value="Critical" className="bg-slate-900">Critical</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              variant="green"
              size="md"
              isLoading={submitting}
              icon={Send}
            >
              SEND SIGNAL
            </Button>
          </div>
        </form>
      </Card>

      {/* Requests Feed */}
      <h3 className="text-xl font-bold text-white mb-4">Your Broadcast Feed</h3>

      {requests.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="No requests broadcasted"
          description="Broadcast a food need above when your shelter or organization requires supplies."
        />
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const isFulfilled = r.status === 'fulfilled';
            return (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-slate-900/40 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-500/30 transition-all"
              >
                <div>
                  <h4 className="text-base font-bold text-white">{r.item_needed}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    {r.contact_number}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-sm font-semibold text-slate-300">
                    Qty: <strong className="text-white">{r.quantity_needed}</strong>
                  </div>

                  <Badge variant={r.urgency.toLowerCase()}>
                    {r.urgency}
                  </Badge>

                  <div className="text-right min-w-[120px]">
                    {isFulfilled ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                        <CheckCircle2 className="w-4 h-4" /> FIXED BY {r.fulfiller?.username || 'Donor'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-sky-400 flex items-center gap-1 justify-end">
                        <Radio className="w-3.5 h-3.5 animate-pulse" /> ALIVE
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyRequests;
