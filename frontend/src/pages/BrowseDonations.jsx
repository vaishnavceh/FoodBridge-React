import React, { useEffect, useState } from 'react';
import { Radio, Navigation, Clock, Package, Check, ShieldCheck, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { browseDonations, claimDonation } from '../services/donationService';
import { calculateTimeRemaining } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export const BrowseDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);

  const fetchDonations = async () => {
    try {
      const res = await browseDonations();
      setDonations(res.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const handleClaim = async (donationId) => {
    setClaimingId(donationId);
    try {
      await claimDonation(donationId);
      toast.success('Mission secured! Donation reserved for pickup.');
      fetchDonations();
    } catch (err) {
      toast.error(err.message || 'Donation could not be reserved');
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const roleAccent = user?.role === 'volunteer' ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-white/5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Live <span className={roleAccent}>Broadcasts</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time surplus food radar and reservation grid.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300">
          <span className={roleAccent}>{user?.role}</span> COMMAND
        </div>
      </div>

      {donations.length === 0 ? (
        <EmptyState
          icon={Radio}
          title="No live broadcasts found"
          description="There are currently no active food broadcasts in your area. Please check back shortly."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((item) => {
            const isMine = item.claimed_by === user?.id;
            const isAvailable = item.status === 'available';
            const { hours, percentage, text: timeText } = calculateTimeRemaining(item.expiry);

            return (
              <Card
                key={item.id}
                className={`p-6 flex flex-col justify-between transition-all ${
                  isMine
                    ? 'border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-900/20'
                    : 'border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                      Donor: {item.donor?.username || 'Verified Donor'}
                    </span>
                    <Badge variant={isAvailable ? 'available' : isMine ? 'completed' : 'claimed'}>
                      {isAvailable ? 'LIVE SIGNAL' : isMine ? 'YOUR MISSION' : 'CLAIMED'}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{item.food_type}</h3>
                  <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {item.donor?.location || 'Local Area'}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-4 bg-black/30 p-2.5 rounded-xl border border-white/5">
                    <span className="flex items-center gap-1.5">
                      <Package className="w-3.5 h-3.5 text-amber-400" />
                      {item.quantity}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      {timeText}
                    </span>
                  </div>

                  {/* Decay Bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-6">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentage > 50
                          ? 'bg-emerald-400'
                          : percentage > 20
                          ? 'bg-amber-400'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2">
                  {isAvailable ? (
                    <Button
                      variant="green"
                      size="md"
                      isLoading={claimingId === item.id}
                      onClick={() => handleClaim(item.id)}
                      className="w-full text-xs"
                      icon={Radio}
                    >
                      RESERVE FOR PICKUP
                    </Button>
                  ) : isMine ? (
                    <div className="space-y-2">
                      <div className="w-full py-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-xs text-center flex items-center justify-center gap-1.5 border border-emerald-500/30">
                        <ShieldCheck className="w-4 h-4" /> MISSION SECURED
                      </div>
                      <a
                        href={item.location}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-200 text-black font-extrabold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-md"
                      >
                        <Navigation className="w-4 h-4" /> OPEN NAVIGATION
                      </a>
                    </div>
                  ) : (
                    <div className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs text-center">
                      RESERVED BY ANOTHER RECIPIENT
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseDonations;
