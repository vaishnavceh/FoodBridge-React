import React, { useEffect, useState } from 'react';
import {
  Users,
  Activity,
  RotateCcw,
  Trash2,
  UserX,
  Store,
  Building2,
  Bike,
  Shield,
  Layers
} from 'lucide-react';
import {
  getAdminStats,
  getAdminUsers,
  deleteUser,
  getLogistics
} from '../services/adminService';
import { resetMission, deleteDonation } from '../services/donationService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState({ donors: [], ngos: [], volunteers: [] });
  const [logistics, setLogistics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, logisticsRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getLogistics()
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setLogistics(logisticsRes.data);
    } catch (err) {
      toast.error(err.message || 'Failed to load administrative data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResetMission = async (id) => {
    try {
      await resetMission(id);
      toast.success('Mission reset to available status');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to reset mission');
    }
  };

  const handleDeleteDonation = async (id) => {
    const confirmed = window.confirm('Permanently remove this donation listing from the database?');
    if (!confirmed) return;

    try {
      await deleteDonation(id);
      toast.success('Donation listing deleted');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete donation');
    }
  };

  const handleDeleteUser = async (id, username) => {
    const confirmed = window.confirm(`Permanently block and delete user "${username}"?`);
    if (!confirmed) return;

    try {
      await deleteUser(id);
      toast.success(`User ${username} removed`);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const totalUsers = stats?.totalUsers || 0;
  const totalDonations = stats?.totalDonations || 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header */}
      <header className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-amber-400" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Command <span className="text-amber-400">Center</span>
          </h1>
        </div>
        <p className="text-slate-400 text-sm">
          Real-time system analytics and relational database management.
        </p>
      </header>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card className="p-6 border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-amber-400" /> User Distribution ({totalUsers} total)
          </h3>
          <div className="space-y-4">
            {stats?.roleCounts?.map((r) => {
              const pct = totalUsers > 0 ? (r.count / totalUsers) * 100 : 0;
              return (
                <div key={r.role}>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span className="uppercase tracking-wider">{r.role}</span>
                    <span>{r.count} users ({Math.round(pct)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Donation Lifecycle */}
        <Card className="p-6 border-white/10">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-sky-400" /> Donation Lifecycle ({totalDonations} total)
          </h3>
          <div className="space-y-4">
            {stats?.statusCounts?.map((s) => {
              const pct = totalDonations > 0 ? (s.count / totalDonations) * 100 : 0;
              return (
                <div key={s.status}>
                  <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                    <span className="uppercase tracking-wider">{s.status}</span>
                    <span>{s.count} items ({Math.round(pct)}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full bg-sky-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Live Logistics Tracker */}
      <Card className="overflow-hidden p-0 border-white/10">
        <div className="p-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" /> Live Logistics Tracker
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {logistics.length} active records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.01]">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Food Item
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Donor
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Volunteer
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logistics.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-semibold text-white">{row.food_type}</td>
                  <td className="p-4 text-slate-300">{row.donor?.username}</td>
                  <td className="p-4 text-slate-300">
                    {row.volunteer?.username ? (
                      <span className="text-amber-400 font-medium">
                        {row.volunteer.username}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge variant={row.status}>{row.status}</Badge>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {row.status === 'pending' && (
                      <button
                        onClick={() => handleResetMission(row.id)}
                        title="Reset to Available"
                        className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteDonation(row.id)}
                      title="Remove Listing"
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Role-Specific User Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Donors */}
        <Card className="overflow-hidden p-0 border-white/10">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
            <Store className="w-4 h-4 text-sky-400" />
            <h4 className="text-sm font-bold text-white">Donors ({users.donors.length})</h4>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
            {users.donors.map((u) => (
              <div key={u.id} className="p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-white">{u.username}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(u.id, u.username)}
                  className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* NGOs */}
        <Card className="overflow-hidden p-0 border-white/10">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white">NGOs ({users.ngos.length})</h4>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
            {users.ngos.map((u) => (
              <div key={u.id} className="p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-white">{u.username}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(u.id, u.username)}
                  className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Volunteers */}
        <Card className="overflow-hidden p-0 border-white/10">
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center gap-2">
            <Bike className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white">Volunteers ({users.volunteers.length})</h4>
          </div>
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5">
            {users.volunteers.map((u) => (
              <div key={u.id} className="p-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-white">{u.username}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </div>
                <button
                  onClick={() => handleDeleteUser(u.id, u.username)}
                  className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                >
                  <UserX className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
