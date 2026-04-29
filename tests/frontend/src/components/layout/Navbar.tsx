import React from 'react';
import { Button } from '@/components/ui';

interface NavbarProps {
  className?: string;
  title?: string;
  userName?: string;
  onLogout?: () => void;
  onMenuClick?: () => void;
  showMenuButton?: boolean;
}

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const Navbar: React.FC<NavbarProps> = ({ 
  className, 
  title = 'Dashboard',
  userName = 'Usuário',
  onLogout,
  onMenuClick,
  showMenuButton = false
}) => {
  return (
    <header className={className}>
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <button
              type="button"
              onClick={onMenuClick}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors md:hidden"
              aria-label="Abrir menu"
            >
              <MenuIcon />
            </button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-500">Bem-vindo, {userName}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            leftIcon={<LogoutIcon />}
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};
