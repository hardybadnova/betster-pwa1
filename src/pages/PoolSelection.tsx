
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameContext } from '@/context/GameContext';
import { Users, Coins, ArrowRight } from 'lucide-react';
import BetsterAppBar from '@/components/BetsterAppBar';
import BetsterBottomBar from '@/components/BetsterBottomBar';
import BetsterDrawer from '@/components/BetsterDrawer';
import { formatCurrency } from '@/lib/betUtils';

interface PoolOption {
  fee: number;
  maxPlayers: number;
  currentPlayers: number;
  status: 'open' | 'filling' | 'almost-full';
}

const PoolSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { createGame } = useGameContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Get the game type from URL query params
  const queryParams = new URLSearchParams(location.search);
  const gameType = queryParams.get('game') as 'bluff' | 'top-spot' | 'jackpot' || 'bluff';
  
  // Set game title based on game type
  const getGameTitle = () => {
    switch (gameType) {
      case 'bluff':
        return 'Bluff the Tough';
      case 'top-spot':
        return 'Top Spot';
      case 'jackpot':
        return 'Jackpot Horse';
      default:
        return 'Game Pools';
    }
  };
  
  // Generate pool options based on game type
  const poolOptions: PoolOption[] = (() => {
    if (gameType === 'jackpot') {
      return [
        { fee: 20, maxPlayers: 10000, currentPlayers: 4623, status: 'filling' },
        { fee: 50, maxPlayers: 10000, currentPlayers: 2815, status: 'filling' }
      ];
    } else {
      return [
        { fee: 20, maxPlayers: 50, currentPlayers: 32, status: 'filling' },
        { fee: 50, maxPlayers: 50, currentPlayers: 46, status: 'almost-full' },
        { fee: 100, maxPlayers: 50, currentPlayers: 28, status: 'filling' },
        { fee: 500, maxPlayers: 50, currentPlayers: 12, status: 'open' },
        { fee: 1000, maxPlayers: 50, currentPlayers: 8, status: 'open' },
        { fee: 2000, maxPlayers: 50, currentPlayers: 4, status: 'open' }
      ];
    }
  })();

  // Handle joining a pool
  const handleJoinPool = (fee: number) => {
    // Create a new game with the selected entry fee
    const gameId = createGame({
      name: `${getGameTitle()} - ${formatCurrency(fee)} Pool`,
      createdBy: 'user',
      minBet: fee / 10, // Min bet is 10% of entry fee
      maxBet: fee * 2, // Max bet is 2x entry fee
      duration: 300, // 5 minutes in seconds
    });
    
    // Navigate to the created game
    navigate(`/game/${gameId}`);
  };
  
  // Get status badge color
  const getStatusColor = (status: PoolOption['status']) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-500/20 text-emerald-500';
      case 'filling':
        return 'bg-amber-500/20 text-amber-500';
      case 'almost-full':
        return 'bg-rose-500/20 text-rose-500';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Get status label
  const getStatusLabel = (status: PoolOption['status']) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'filling':
        return 'Filling Up';
      case 'almost-full':
        return 'Almost Full';
      default:
        return 'Unavailable';
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C]/80 to-black flex flex-col">
      <BetsterAppBar 
        onOpenDrawer={() => setIsDrawerOpen(true)} 
        title={getGameTitle()}
      />
      <BetsterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      <main className="flex-1 pb-20">
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Select Entry Pool</h2>
            <p className="text-gray-400 text-sm">
              Choose a pool based on your preferred entry fee
            </p>
          </div>
          
          <div className="space-y-4">
            {poolOptions.map((pool, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-[#9b87f5]/10 to-black/50 border border-[#9b87f5]/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-black/40 border border-[#9b87f5]/20 flex items-center justify-center mr-3">
                      <Coins className="h-5 w-5 text-[#9b87f5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">
                        {formatCurrency(pool.fee)} Entry
                      </h3>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-400">
                          {pool.currentPlayers}/{pool.maxPlayers} players
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(pool.status)}`}>
                      {getStatusLabel(pool.status)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-300">
                      Prize Pool: <span className="text-[#9b87f5]">{formatCurrency(pool.fee * pool.maxPlayers * 0.8)}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Top 3 players win prizes
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleJoinPool(pool.fee)}
                    className="flex items-center py-2 px-4 bg-[#9b87f5] text-white rounded-md hover:bg-[#8a76e4] transition-colors"
                  >
                    Join <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <BetsterBottomBar />
    </div>
  );
};

export default PoolSelection;
