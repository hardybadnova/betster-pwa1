
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import UserBalance from './UserBalance';

interface BetsterAppBarProps {
  onOpenDrawer: () => void;
  title?: string;
}

const BetsterAppBar: React.FC<BetsterAppBarProps> = ({ 
  onOpenDrawer,
  title = 'Betster'
}) => {
  const navigate = useNavigate();
  const { currentUser } = useGameContext();
  
  return (
    <div className="sticky top-0 z-40">
      <div className="h-16 px-4 border-b bg-gradient-to-r from-[#1A1F2C] to-black border-[#9b87f5]/10 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onOpenDrawer}
            className="h-10 w-10 rounded-full flex items-center justify-center text-gray-300 hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="ml-4">
            <h1 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
              {title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="h-10 w-10 rounded-full flex items-center justify-center text-gray-300 hover:bg-white/10">
            <Search className="h-5 w-5" />
          </button>
          
          <button className="h-10 w-10 rounded-full flex items-center justify-center text-gray-300 hover:bg-white/10 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#9b87f5]"></span>
          </button>
          
          <div 
            className="h-10 w-10 rounded-full bg-[#9b87f5] flex items-center justify-center cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <span className="text-white font-medium">{currentUser.name.charAt(0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BetsterAppBar;
