import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Package, Plus, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyDonations } from '../services/donationService';
import { formatDate } from '../utils/formatters';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import toast from 'react-hot-toast';

export const MyDonations = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await getMyDonations();
        setDonations(res.data);
      } catch (err) {
        toast.error(err.message || 'Failed to load donation history');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const handlePrintSlip = (donation) => {
    setSelectedDonation(donation);
    setTimeout(() => {
      window.print();
    }, 100);
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My <span className="text-sky-400">Donations</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Complete record of your community food contributions.
          </p>
        </div>

        <Link to="/donate">
          <Button variant="blue" size="md" icon={Plus}>
            New Donation
          </Button>
        </Link>
      </div>

      {donations.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No donations recorded"
          description="You haven't published any food donations yet. Make your first broadcast today!"
          action={
            <Link to="/donate">
              <Button variant="blue" size="md">
                Broadcast Food Now
              </Button>
            </Link>
          }
        />
      ) : (
        <Card className="overflow-hidden p-0 border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="p-4 text-xs font-bold text-sky-400 uppercase tracking-wider">
                    DATE
                  </th>
                  <th className="p-4 text-xs font-bold text-sky-400 uppercase tracking-wider">
                    ITEM DESCRIPTION
                  </th>
                  <th className="p-4 text-xs font-bold text-sky-400 uppercase tracking-wider">
                    QTY
                  </th>
                  <th className="p-4 text-xs font-bold text-sky-400 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="p-4 text-xs font-bold text-sky-400 uppercase tracking-wider text-right">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {donations.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 text-slate-400 font-mono text-xs">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="p-4 font-semibold text-white">{row.food_type}</td>
                    <td className="p-4 text-slate-300">{row.quantity}</td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded-md font-bold uppercase bg-white/5 border border-white/10 text-slate-300">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handlePrintSlip(row)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-black font-extrabold text-xs transition-colors shadow-sm cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> REPRINT SLIP
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Hidden Printable Certificate for Reprint */}
      {selectedDonation && (
        <div id="printable-certificate" className="hidden">
          <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '15px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>FOODBRIDGE DONATION CERTIFICATE</h2>
            <p style={{ fontSize: '12px', color: '#666' }}>Official Verified Redistribution Receipt</p>
          </div>
          <div style={{ marginTop: '30px', fontSize: '16px', lineHeight: '2' }}>
            <p><strong>DONOR:</strong> {user?.username}</p>
            <p><strong>TX ID:</strong> FB-{new Date(selectedDonation.created_at).getTime()}</p>
            <p><strong>ITEM:</strong> {selectedDonation.food_type}</p>
            <p><strong>QTY:</strong> {selectedDonation.quantity}</p>
            <p><strong>GPS:</strong> <br /><span style={{ fontSize: '12px' }}>{selectedDonation.location}</span></p>
          </div>
          <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ color: '#10b981', fontWeight: '800', fontSize: '14px' }}>
              &#10004; DIGITALLY SIGNED &amp; RECORDED
            </div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              Issued: {new Date(selectedDonation.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonations;
