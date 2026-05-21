import React, { ReactNode, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 dark:to-slate-800" dir="rtl">
      <TopBar toggleSidebar={toggleSidebar} />
      
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar open={isSidebarOpen} />
        
        <main className={`flex-1 p-6 mt-16 transition-all duration-300 ${isSidebarOpen ? 'mr-64' : 'mr-20'} overflow-auto`}>
          {title && (
            <div className="mb-6 text-right">
              <h1 className="text-2xl font-semibold text-gray-800 dark:text-slate-100">{title}</h1>
              <p className="text-sm text-gray-500 mt-1 dark:text-slate-400">
                {user?.role === 'admin' ? 'Admin Dashboard' : 'Restaurant Dashboard'}
              </p>
            </div>
          )}
          
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
