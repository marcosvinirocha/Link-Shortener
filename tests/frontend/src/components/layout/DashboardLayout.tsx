import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  userName?: string;
  onLogout?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  className,
  title,
  userName,
  onLogout 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarClose = () => setIsSidebarOpen(false);
  const handleSidebarToggle = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          className="bg-white border-b" 
          title={title}
          userName={userName}
          onLogout={onLogout}
          onMenuClick={handleSidebarToggle}
          showMenuButton={true}
        />
        <main className={`flex-1 p-6 ${className || ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};
