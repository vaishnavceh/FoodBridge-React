import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Navigation, ArrowLeft, Radio, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { getOpenRequests, getFulfilledByMe, fulfillRequest } from '../services/requestService';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export const ViewRequests = () => {
  const [openRequests, setOpenRequests] = useState([]);
  const [myFulfillments, setMyFulfillments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fulfillingId, setFulfillingId] = useState(null);

  const fetchData = async () => {
    try {
      const [openRes, mineRes] = await Promise.all([
        getOpenRequests(),
        getFulfilledByMe()
      ]);
      setOpenRequests(openRes.data);
      setMyFulfillments(mineRes.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load NGO requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAcceptMission = async (requestId) => {
    const confirmed = window.confirm(
      'Accepting this will notify volunteers to pick up the food from you and deliver it to the NGO. Proceed?'
    );
    if (!confirmed) return;

    setFulfillingId(requestId);
    try {
      await fulfillRequest(requestId);
      toast.success(
        'Mission Accepted! A delivery request has been broadcasted to all active Volunteers.'
      );
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to accept mission');
    } finally {
      setFulfillingId(null);
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
      <header className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Mission <span className="text-sky-400">Center</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Intercept and fulfill direct resource requests from local community NGOs.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Base
        </Link>
      </header>

      {/* Accepted by You Section */}
      {myFulfillments.length > 0 && (
        <section className="mb-14">
          <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5" /> Accepted by You
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myFulfillments.map((r) => (
              <Card
                key={r.id}
                className="p-6 border-emerald-500/40 bg-emerald-950/20 flex flex-col justify-between"
              >
                <div>
                  <Badge variant="completed" className="mb-4">
                    Routing to Volunteer
                  </Badge>
                  <h2 className="text-xl font-bold text-white mb-1">{r.item_needed}</h2>
                  <p className="text-xs text-slate-400 mb-6">
                    Recipient: <strong className="text-white">{r.ngo?.username}</strong>
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={`tel:${r.contact_number}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" /> CALL NGO
                  </a>
                  {r.map_link && (
                    <a
                      href={r.map_link}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" /> DESTINATION
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Available NGO Signals Section */}
      <section>
        <h3 className="text-lg font-bold text-slate-300 flex items-center gap-2 mb-6">
          <Radio className="w-5 h-5 text-sky-400" /> Available NGO Signals
        </h3>

        {openRequests.length === 0 ? (
          <EmptyState
            icon={Radio}
            title="No active signals detected"
            description="There are currently no open NGO resource requests in your region."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openRequests.map((r) => (
              <Card
                key={r.id}
                className="p-6 border-white/10 flex flex-col justify-between hover:border-sky-400/50"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Badge variant="available">Open Request</Badge>
                    <Badge variant={r.urgency.toLowerCase()}>{r.urgency} Urgency</Badge>
                  </div>

                  <h2 className="text-xl font-bold text-white mb-1">{r.item_needed}</h2>
                  <p className="text-xs text-slate-400 mb-4">
                    NGO: <strong className="text-white">{r.ngo?.username}</strong> ({r.ngo?.location})
                  </p>

                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-300 space-y-1.5 mb-6">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Quantity Needed:</span>
                      <span className="font-bold text-white">{r.quantity_needed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Contact:</span>
                      <span className="font-mono text-slate-300">{r.contact_number}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="blue"
                  size="md"
                  isLoading={fulfillingId === r.id}
                  onClick={() => handleAcceptMission(r.id)}
                  className="w-full text-xs"
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

export default ViewRequests;
