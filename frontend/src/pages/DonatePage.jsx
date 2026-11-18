import React, { useState } from 'react';
import { Printer, CheckCircle, Radio, Clock, Phone, MapPin, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createDonation } from '../services/donationService';
import MapPicker from '../components/maps/MapPicker';
import { Button } from '../components/ui/Button';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';

export const DonatePage = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    food_type: '',
    quantity: '',
    freshness: 'Freshly Cooked',
    phone: '',
    location: '',
    expiry: '',
    availability_from: '',
    availability_to: ''
  });

  const [loading, setLoading] = useState(false);
  const [createdDonation, setCreatedDonation] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (mapUrl) => {
    setFormData((prev) => ({ ...prev, location: mapUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.location) {
      toast.error('Please pick a location on the map or sync GPS');
      return;
    }

    setLoading(true);

    try {
      const res = await createDonation({
        ...formData,
        map_link: formData.location
      });
      setCreatedDonation(res.data);
      toast.success('Food broadcast published to the network!');
    } catch (err) {
      toast.error(err.message || 'Failed to broadcast donation');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Broadcast <span className="text-sky-400">Donation</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Select location and provide food details for the redistribution network.
        </p>
      </div>

      {/* Success Banner if newly created */}
      {createdDonation && (
        <div className="mb-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="font-extrabold text-emerald-300 text-base">BROADCAST IS LIVE</h4>
              <p className="text-slate-300 text-xs">
                Your digital donation certificate is ready for verification and printing.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handlePrint}
            icon={Printer}
            className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10"
          >
            PRINT SLIP
          </Button>
        </div>
      )}

      {/* Map Picker */}
      <div className="mb-8">
        <label className="block text-xs uppercase font-extrabold tracking-wider text-sky-400 mb-3 border-l-2 border-sky-400 pl-2">
          Step 1: Tag Pickup Coordinates
        </label>
        <MapPicker value={formData.location} onChange={handleLocationChange} />
      </div>

      {/* Form Card */}
      <Card className="p-8 border-white/10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <span className="text-xs font-extrabold tracking-wider text-sky-400 uppercase border-l-2 border-sky-400 pl-2 block mb-4">
            Step 2: Food Information
          </span>

          {/* Food Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Item Description
            </label>
            <input
              type="text"
              name="food_type"
              required
              value={formData.food_type}
              onChange={handleChange}
              placeholder="e.g. 20 Packets of Vegetable Biryani"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Quantity */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Total Quantity
              </label>
              <input
                type="text"
                name="quantity"
                required
                value={formData.quantity}
                onChange={handleChange}
                placeholder="e.g. 15 KG or 30 Packs"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>

            {/* Freshness Condition */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Condition
              </label>
              <select
                name="freshness"
                value={formData.freshness}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              >
                <option value="Freshly Cooked" className="bg-slate-900">Freshly Cooked</option>
                <option value="Packaged / Sealed" className="bg-slate-900">Packaged / Sealed</option>
              </select>
            </div>
          </div>

          <span className="text-xs font-extrabold tracking-wider text-sky-400 uppercase border-l-2 border-sky-400 pl-2 block pt-4">
            Step 3: Logistics &amp; Contact
          </span>

          {/* Contact Phone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Contact Number (For Volunteer Coordination)
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>

          {/* Generated GPS Navigation Link */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Generated GPS Navigation Link
            </label>
            <input
              type="text"
              name="location"
              readOnly
              required
              value={formData.location}
              placeholder="Click on the map above to set location"
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sky-400 font-mono text-xs focus:outline-none cursor-default"
            />
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Food Expiry Deadline
            </label>
            <input
              type="datetime-local"
              name="expiry"
              required
              value={formData.expiry}
              onChange={handleChange}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>

          {/* Availability From / To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Availability From
              </label>
              <input
                type="datetime-local"
                name="availability_from"
                required
                value={formData.availability_from}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Availability To
              </label>
              <input
                type="datetime-local"
                name="availability_to"
                required
                value={formData.availability_to}
                onChange={handleChange}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="blue"
            size="lg"
            isLoading={loading}
            className="w-full mt-6 py-4 text-base"
          >
            INITIATE NETWORK BROADCAST
          </Button>
        </form>
      </Card>

      {/* Hidden Printable Certificate */}
      <div id="printable-certificate" className="hidden">
        <div style={{ textAlign: 'center', borderBottom: '2px solid #000', paddingBottom: '15px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>FOODBRIDGE DONATION CERTIFICATE</h2>
          <p style={{ fontSize: '12px', color: '#666' }}>Zero Waste Logistics Platform</p>
        </div>
        <div style={{ marginTop: '30px', fontSize: '16px', lineHeight: '2' }}>
          <p><strong>DONOR:</strong> {user?.username}</p>
          <p><strong>CONTACT:</strong> {formData.phone}</p>
          <p><strong>TX ID:</strong> FB-{createdDonation?.id || Date.now()}</p>
          <p><strong>ITEM:</strong> {formData.food_type}</p>
          <p><strong>QTY:</strong> {formData.quantity}</p>
          <p><strong>GPS:</strong> <br /><span style={{ fontSize: '12px' }}>{formData.location}</span></p>
        </div>
        <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ color: '#10b981', fontWeight: '800', fontSize: '14px' }}>
            &#10004; DIGITALLY SIGNED &amp; VERIFIED
          </div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            Issued on: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePage;
