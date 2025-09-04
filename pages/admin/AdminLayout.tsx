import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar';
import { MenuIcon } from '../../components/Icons';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard';
    if (path === 'admin') return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="lg:ml-64 transition-all duration-300 ease-in-out">
        <header className="sticky top-0 bg-gray-900/80 backdrop-blur-md z-20">
            <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8 border-b border-gray-700/50">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden text-gray-400 hover:text-white"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-white ml-2 lg:ml-0">{getPageTitle()}</h1>
                <div>
                    {/* User Profile / Search can go here */}
                </div>
            </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
