import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';

export const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-10 min-h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
