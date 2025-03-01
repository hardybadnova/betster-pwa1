
import React, { useMemo, useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Coins, BarChart3, History, TrendingUp, TrendingDown, ChevronRight, Gift } from 'lucide-react';
import GameModule from '@/components/GameModule';
import BetsterAppBar from '@/components/BetsterAppBar';
import BetsterBottomBar from '@/components/BetsterBottomBar';
import BetsterDrawer from '@/components/BetsterDrawer';

// Custom function to format currency with rupee symbol
const formatRupees = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const Dashboard = () => {
  const { currentUser, userBets, games } = useGameContext();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalBets = userBets.length;
    const totalBetAmount = userBets.reduce((sum, bet) => sum + bet.amount, 0);
    
    const winningBets = userBets.filter(bet => {
      const game = games.find(g => g.id === bet.gameId);
      if (!game || game.winningNumber === null) return false;
      return bet.number === game.winningNumber;
    });
    
    const winCount = winningBets.length;
    const totalWinnings = winningBets.reduce((sum, bet) => sum + bet.amount * 10, 0);
    
    return {
      totalBets,
      totalBetAmount,
      winCount,
      totalWinnings,
      profitLoss: totalWinnings - totalBetAmount,
      winRate: totalBets > 0 ? (winCount / totalBets) * 100 : 0
    };
  }, [userBets, games]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C]/80 to-black flex flex-col">
      <BetsterAppBar onOpenDrawer={() => setIsDrawerOpen(true)} title="Dashboard" />
      <BetsterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      <main className="flex-1 pb-20">
        <div className="p-4">
          {/* Welcome Card */}
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-[#9b87f5]/20 to-[#6E59A5]/20 border border-[#9b87f5]/10">
            <h2 className="text-xl font-bold text-white mb-1">Welcome back, {currentUser.name}</h2>
            <p className="text-gray-300 text-sm mb-4">Ready to place your bets today?</p>
            
            <div className="flex items-center">
              <div className="flex items-center bg-black/30 px-3 py-2 rounded-lg">
                <Coins className="h-5 w-5 text-amber-500 mr-2" />
                <span className="text-white font-bold">{formatRupees(currentUser.balance)}</span>
              </div>
              
              <button className="ml-3 flex items-center text-[#9b87f5] text-sm">
                <Gift className="h-4 w-4 mr-1" />
                <span>Daily Bonus</span>
              </button>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-black/30 border border-[#9b87f5]/10">
                <h3 className="text-xs text-gray-400 mb-1">Win Rate</h3>
                <div className="flex items-center">
                  <History className="h-4 w-4 text-[#9b87f5] mr-1" />
                  <span className="text-lg font-bold text-white">
                    {stats.winRate.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-black/30 border border-[#9b87f5]/10">
                <h3 className="text-xs text-gray-400 mb-1">Profit/Loss</h3>
                <div className="flex items-center">
                  {stats.profitLoss >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-rose-500 mr-1" />
                  )}
                  <span className={`text-lg font-bold ${
                    stats.profitLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {formatRupees(stats.profitLoss)}
                  </span>
                </div>
              </div>
              
              <div className="p-3 rounded-xl bg-black/30 border border-[#9b87f5]/10">
                <h3 className="text-xs text-gray-400 mb-1">Total Bets</h3>
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 text-[#9b87f5] mr-1" />
                  <span className="text-lg font-bold text-white">{stats.totalBets}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Modules */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Game Modules</h2>
              <button className="text-sm text-[#9b87f5] flex items-center">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              <GameModule 
                type="bluff" 
                name="Bluff the Tough" 
                description="Strategy game of numbers and psychology"
                players={124}
                prize="5,000"
              />
              
              <GameModule 
                type="top-spot" 
                name="Top Spot" 
                description="Beat other players by picking the least chosen number"
                players={87}
                prize="3,500"
              />
              
              <GameModule 
                type="jackpot" 
                name="Jackpot Horse" 
                description="Daily mega-pool with massive prize"
                players={215}
                prize="10,000"
              />
            </div>
          </div>
          
          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Recent Activity</h2>
              <button className="text-sm text-[#9b87f5] flex items-center">
                View All <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            
            {userBets.length > 0 ? (
              <div className="space-y-3">
                {userBets.slice(0, 3).map((bet, index) => {
                  const game = games.find(g => g.id === bet.gameId);
                  const isWinner = game?.winningNumber !== null && bet.number === game?.winningNumber;
                  return (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-black/30 border border-[#9b87f5]/10 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm text-white">{game?.name || 'Unknown Game'}</p>
                        <p className="text-xs text-gray-400">Bet on #{bet.number}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${isWinner ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isWinner ? `+${formatRupees(bet.amount * 10)}` : `-${formatRupees(bet.amount)}`}
                        </p>
                        <p className="text-xs text-gray-400">
                          {isWinner ? 'Won' : game?.status === 'completed' ? 'Lost' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-black/30 border border-[#9b87f5]/10 text-center">
                <p className="text-gray-400">No activity yet</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <BetsterBottomBar />
    </div>
  );
};

export default Dashboard;
