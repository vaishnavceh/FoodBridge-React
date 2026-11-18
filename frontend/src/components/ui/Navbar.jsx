import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, LogOut, LayoutDashboard, Shield, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0f0f0f]/85 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-extrabold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white group-hover:text-amber-400 transition-colors">
            FoodBridge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/learn-more"
            className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            How it Works
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {isAdmin ? (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 rounded-xl hover:bg-amber-500/20 transition-all"
                >
                  <Shield className="w-4 h-4" /> Admin Console
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}

              <span className="text-xs px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400 uppercase font-bold tracking-wider">
                {user?.role}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                icon={LogOut}
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Link to="/register">
                <Button variant="primary" size="md">
                  Join Movement
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-400 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900/95 border-b border-white/10 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/learn-more"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-white py-2"
          >
            How it Works
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-amber-400 font-bold py-2"
              >
                {isAdmin ? 'Admin Console' : 'Dashboard'}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left text-rose-400 font-semibold py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-white py-2"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block bg-amber-500 text-black text-center font-bold py-2 rounded-xl"
              >
                Join Movement
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
