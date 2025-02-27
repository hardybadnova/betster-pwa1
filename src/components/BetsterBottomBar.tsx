
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, Trophy, BarChart3, PlusCircle } from 'lucide-react';

const BetsterBottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/lobby', label: 'Games', icon: Users },
    { path: '/create', label: 'Create', icon: PlusCircle },
    { path: '/leaderboard', label: 'Rankings', icon: Trophy },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#1A1F2C] to-black border-t border-[#9b87f5]/10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`flex flex-col items-center justify-center w-16 h-16 ${
              isActive(item.path) 
                ? 'text-[#9b87f5]' 
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => navigate(item.path)}
          >
            <item.icon className={`h-5 w-5 ${isActive(item.path) ? 'text-[#9b87f5]' : ''}`} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BetsterBottomBar;
