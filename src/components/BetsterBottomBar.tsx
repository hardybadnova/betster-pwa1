
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { History, Award, MessageSquare } from 'lucide-react';

const BetsterBottomBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { path: '/bet-history', label: 'Bet History', icon: History },
    { path: '/milestones', label: 'Milestones', icon: Award },
    { path: '/support', label: 'Chat Support', icon: MessageSquare },
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
            className={`flex flex-col items-center justify-center w-full h-16 ${
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
