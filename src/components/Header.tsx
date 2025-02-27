
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { formatCurrency } from '@/lib/betUtils';
import { Menu, X, LayoutDashboard, Users, PlusCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { currentUser } = useGameContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: <Users className="h-4 w-4 mr-2" /> },
    { path: '/lobby', label: 'Game Lobby', icon: <Users className="h-4 w-4 mr-2" /> },
    { path: '/create', label: 'Create Game', icon: <PlusCircle className="h-4 w-4 mr-2" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
  ];

  // Toggle mobile menu
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="premium-glass-card sticky top-0 z-50 py-4 px-6">
      <div className="container max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl tracking-tight premium-text-gradient">BetBuddy</span>
        </Link>

        {/* Balance display */}
        <div className="hidden md:flex items-center bg-[#1A1F2C] border border-[#9b87f5]/20 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-gray-300">Balance:</span>
          <span className="ml-2 font-bold text-white">{formatCurrency(currentUser.balance)}</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center text-sm font-medium transition-colors hover:text-[#9b87f5] ${
                location.pathname === item.path
                  ? 'text-[#9b87f5]'
                  : 'text-gray-400'
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-[#9b87f5]" />
          ) : (
            <Menu className="h-6 w-6 text-[#9b87f5]" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden premium-glass-card absolute top-full left-0 right-0 animate-fade-in">
          <nav className="container max-w-7xl mx-auto py-4 px-6 flex flex-col space-y-4">
            {/* Balance display mobile */}
            <div className="flex items-center bg-[#1A1F2C] border border-[#9b87f5]/20 px-4 py-2 rounded-full">
              <span className="text-sm font-medium text-gray-300">Balance:</span>
              <span className="ml-2 font-bold text-white">{formatCurrency(currentUser.balance)}</span>
            </div>
            
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center text-sm font-medium transition-colors py-2 ${
                  location.pathname === item.path
                    ? 'text-[#9b87f5]'
                    : 'text-gray-400'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
