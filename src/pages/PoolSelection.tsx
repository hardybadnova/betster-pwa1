
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BetsterAppBar from '@/components/BetsterAppBar';
import BetsterBottomBar from '@/components/BetsterBottomBar';
import BetsterDrawer from '@/components/BetsterDrawer';
import { useGameContext } from '@/context/GameContext';
import { formatCurrency } from '@/lib/betUtils';
import { Crown, Award, Sword, ChevronRight, Users, Clock, CreditCard } from 'lucide-react';

const PoolSelection = () => {
  const [searchParams] = useSearchParams();
  const gameType = searchParams.get('game') as 'bluff' | 'top-spot' | 'jackpot' || 'bluff';
  const navigate = useNavigate();
  const { createGame } = useGameContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Create a game and navigate to it
  const handleJoinPool = (poolId: string, entryFee: number) => {
    // Create game data based on selected game type
    const gameData = {
      name: getGameName(gameType, poolId),
      createdBy: 'system',
      minBet: entryFee,
      maxBet: entryFee * 10,
      duration: gameType === 'jackpot' ? 3600 : 120, // 1 hour for jackpot, 2 minutes for others
    };
    
    // Create the game and navigate to it
    const gameId = createGame(gameData);
    navigate(`/game/${gameId}`);
  };
  
  // Get game name based on game type and pool ID
  const getGameName = (type: string, poolId: string) => {
    switch (type) {
      case 'bluff':
        return `Bluff the Tough - Pool ${poolId}`;
      case 'top-spot':
        return `Top Spot - Pool ${poolId}`;
      case 'jackpot':
        return `Jackpot Horse - Daily Draw`;
      default:
        return `Game Pool ${poolId}`;
    }
  };
  
  // Get game icon based on game type
  const getGameIcon = () => {
    switch (gameType) {
      case 'bluff':
        return <Sword className="h-14 w-14 text-[#9b87f5]" />;
      case 'top-spot':
        return <Crown className="h-14 w-14 text-amber-500" />;
      case 'jackpot':
        return <Award className="h-14 w-14 text-emerald-500" />;
      default:
        return null;
    }
  };
  
  // Get game title based on game type
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
  
  // Get game description based on game type
  const getGameDescription = () => {
    switch (gameType) {
      case 'bluff':
        return 'Choose a number between 0-15. The player who selects the least chosen number wins 50% of the prize pool. Second place gets 25% and third place gets 15%.';
      case 'top-spot':
        return 'Choose a number between 0-15. The player who selects the least chosen number wins 90% of the prize pool.';
      case 'jackpot':
        return 'The biggest game in Betster! Choose a number between 0-200. The player who selects the least chosen number from 10,000 players wins 90% of the massive prize pool. Runs once every 24 hours.';
      default:
        return '';
    }
  };
  
  // Get pool data based on game type
  const getPools = () => {
    if (gameType === 'jackpot') {
      return [
        {
          id: 'jackpot-1',
          name: 'Daily Jackpot',
          entryFee: 5000,
          players: '10,000',
          totalPrize: '50,000,000',
          startTime: 'Daily at 8:00 PM'
        }
      ];
    } else if (gameType === 'bluff') {
      return [
        {
          id: 'bluff-beginner',
          name: 'Beginner',
          entryFee: 100,
          players: '50',
          totalPrize: '5,000',
          startTime: 'Starts when full'
        },
        {
          id: 'bluff-intermediate',
          name: 'Intermediate',
          entryFee: 500,
          players: '50',
          totalPrize: '25,000',
          startTime: 'Starts when full'
        },
        {
          id: 'bluff-pro',
          name: 'Professional',
          entryFee: 1000,
          players: '50',
          totalPrize: '50,000',
          startTime: 'Starts when full'
        }
      ];
    } else {
      return [
        {
          id: 'topspot-beginner',
          name: 'Beginner',
          entryFee: 200,
          players: '50',
          totalPrize: '10,000',
          startTime: 'Starts when full'
        },
        {
          id: 'topspot-intermediate',
          name: 'Intermediate',
          entryFee: 1000,
          players: '50',
          totalPrize: '50,000',
          startTime: 'Starts when full'
        },
        {
          id: 'topspot-pro',
          name: 'Professional',
          entryFee: 2000,
          players: '50',
          totalPrize: '100,000',
          startTime: 'Starts when full'
        }
      ];
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col premium-gradient-bg text-white">
      <BetsterAppBar onOpenDrawer={() => setIsDrawerOpen(true)} title={getGameTitle()} />
      <BetsterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      <main className="flex-1 py-4 px-4 pb-20">
        <div className="container max-w-6xl mx-auto">
          {/* Game Header */}
          <div className="premium-glass-card p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="shrink-0 flex items-center justify-center h-24 w-24 rounded-xl bg-[#1A1F2C] border border-[#9b87f5]/20">
                {getGameIcon()}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold premium-text-gradient mb-2">{getGameTitle()}</h1>
                <p className="text-gray-300 mb-4">{getGameDescription()}</p>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="bg-[#1A1F2C] border border-[#9b87f5]/20 rounded-lg px-4 py-2 flex items-center">
                    <Users className="h-4 w-4 text-[#9b87f5] mr-2" />
                    <span className="text-sm">{gameType === 'jackpot' ? '10,000' : '50'} Players</span>
                  </div>
                  
                  <div className="bg-[#1A1F2C] border border-[#9b87f5]/20 rounded-lg px-4 py-2 flex items-center">
                    <Clock className="h-4 w-4 text-amber-500 mr-2" />
                    <span className="text-sm">
                      {gameType === 'jackpot' ? 'Daily at 8:00 PM' : 'Starts when full'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Available Pools */}
          <h2 className="text-xl font-semibold mb-4">Available Pools</h2>
          
          <div className="space-y-4">
            {getPools().map((pool) => (
              <div key={pool.id} className="premium-glass-card p-4 hover:shadow-lg transition-all">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="shrink-0 w-full sm:w-auto sm:flex-1">
                    <h3 className="text-lg font-semibold">{pool.name}</h3>
                    <div className="flex items-center flex-wrap gap-y-2 gap-x-4 mt-2 text-sm text-gray-300">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-[#9b87f5]" />
                        <span>{pool.players} Players</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-1 text-amber-500" />
                        <span>Entry: {formatCurrency(pool.entryFee)}</span>
                      </div>
                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-emerald-500" />
                        <span>Prize Pool: {formatCurrency(parseInt(pool.totalPrize.replace(/,/g, ''), 10))}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleJoinPool(pool.id, pool.entryFee)}
                    className="premium-button-gradient py-2 px-6 rounded-lg flex items-center justify-center font-medium shrink-0 w-full sm:w-auto"
                  >
                    Join Pool <ChevronRight className="h-4 w-4 ml-1" />
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
