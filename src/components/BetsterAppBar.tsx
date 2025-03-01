
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Search, Wallet, CreditCard, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import UserBalance from './UserBalance';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BetsterAppBarProps {
  onOpenDrawer: () => void;
  title?: string;
}

// Format currency with rupee symbol
const formatRupees = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const BetsterAppBar: React.FC<BetsterAppBarProps> = ({ 
  onOpenDrawer,
  title = 'Betster'
}) => {
  const navigate = useNavigate();
  const { currentUser } = useGameContext();
  
  return (
    <div className="sticky top-0 z-40">
      <div className="h-16 px-4 border-b bg-gradient-to-r from-[#1A1F2C] to-black border-[#9b87f5]/10 flex items-center justify-between">
        {/* Left Section: Menu Button */}
        <div className="w-1/3 flex items-center justify-start">
          <button
            onClick={onOpenDrawer}
            className="h-10 w-10 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#9b87f5]/10"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        {/* Center Section: Branding */}
        <div className="w-1/3 flex items-center justify-center">
          <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#9b87f5] to-[#7E69AB]">
            BETSTER
          </h1>
        </div>
        
        {/* Right Section: Wallet and Profile */}
        <div className="w-1/3 flex items-center justify-end space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center justify-center h-10 w-10 rounded-full bg-[#1A1F2C] border border-[#9b87f5]/20 text-gray-300 hover:bg-[#9b87f5]/10">
                <Wallet className="h-5 w-5 text-[#9b87f5]" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 bg-[#1A1F2C] border border-[#9b87f5]/20 shadow-[0_0_30px_rgba(155,135,245,0.2)]">
              <div className="p-4 border-b border-[#9b87f5]/10">
                <h3 className="font-semibold text-white">Wallet</h3>
                <p className="text-gray-400 text-sm">Current Balance</p>
                <p className="text-xl font-bold premium-text-gradient">{formatRupees(currentUser.balance)}</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#9b87f5]/10">
                <button 
                  onClick={() => navigate('/deposit')}
                  className="p-3 flex flex-col items-center justify-center hover:bg-[#9b87f5]/10 transition-colors"
                >
                  <ArrowDownLeft className="h-5 w-5 text-emerald-500 mb-1" />
                  <span className="text-sm text-white">Deposit</span>
                </button>
                <button 
                  onClick={() => navigate('/withdraw')}
                  className="p-3 flex flex-col items-center justify-center hover:bg-[#9b87f5]/10 transition-colors"
                >
                  <ArrowUpRight className="h-5 w-5 text-amber-500 mb-1" />
                  <span className="text-sm text-white">Withdraw</span>
                </button>
              </div>
            </PopoverContent>
          </Popover>
          
          <div 
            className="h-10 w-10 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(155,135,245,0.3)]"
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
