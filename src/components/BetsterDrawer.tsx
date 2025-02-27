
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  Home, 
  Trophy, 
  Users, 
  Settings, 
  HelpCircle, 
  LogOut,
  CreditCard,
  User
} from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { formatCurrency } from '@/lib/betUtils';

interface BetsterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const BetsterDrawer: React.FC<BetsterDrawerProps> = ({ 
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const { currentUser } = useGameContext();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 bg-gradient-to-b from-[#1A1F2C] to-black z-50 shadow-lg overflow-y-auto">
        <div className="p-4 flex justify-between items-center border-b border-[#9b87f5]/10">
          <h2 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
            BETSTER
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-gray-300 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4 border-b border-[#9b87f5]/10">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-[#9b87f5] flex items-center justify-center">
              <span className="text-white font-medium text-lg">{currentUser.name.charAt(0)}</span>
            </div>
            <div className="ml-3">
              <p className="font-medium text-white">{currentUser.name}</p>
              <p className="text-sm text-gray-400">Balance: {formatCurrency(currentUser.balance)}</p>
            </div>
          </div>
        </div>
        
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleNavigation('/dashboard')}
                className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md"
              >
                <Home className="h-5 w-5 mr-3" />
                <span>Home</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/lobby')}
                className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md"
              >
                <Users className="h-5 w-5 mr-3" />
                <span>Games</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/leaderboard')}
                className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md"
              >
                <Trophy className="h-5 w-5 mr-3" />
                <span>Leaderboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/profile')}
                className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md"
              >
                <User className="h-5 w-5 mr-3" />
                <span>Profile</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/wallet')}
                className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md"
              >
                <CreditCard className="h-5 w-5 mr-3" />
                <span>Wallet</span>
              </button>
            </li>
          </ul>
          
          <div className="mt-6 pt-6 border-t border-[#9b87f5]/10">
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => handleNavigation('/settings')}
                  className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md"
                >
                  <Settings className="h-5 w-5 mr-3" />
                  <span>Settings</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation('/help')}
                  className="w-full flex items-center px-3 py-2 text-gray-300 hover:bg-white/10 rounded-md"
                >
                  <HelpCircle className="h-5 w-5 mr-3" />
                  <span>Help & Support</span>
                </button>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-md"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
};

export default BetsterDrawer;
