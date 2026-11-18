import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-white">
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <footer className="py-12 px-6 border-t border-white/5 text-center text-slate-500 text-sm">
        <div className="flex justify-center gap-6 mb-4">
          <Link to="/learn-more" className="hover:text-slate-300 transition-colors">
            How it Works
          </Link>
          <Link to="/admin-login" className="hover:text-slate-300 transition-colors">
            Admin Portal
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} FoodBridge Platform | Zero Waste, Zero Hunger</p>
      </footer>
    </div>
  );
};

export default MainLayout;
