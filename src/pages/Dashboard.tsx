
import React, { useMemo } from 'react';
import Header from '@/components/Header';
import UserBalance from '@/components/UserBalance';
import { useGameContext } from '@/context/GameContext';
import { formatCurrency, formatDate, isBetWinner } from '@/lib/betUtils';
import { Coins, BarChart3, History, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
  const { currentUser, userBets, games } = useGameContext();
  
  // Calculate stats
  const stats = useMemo(() => {
    const totalBets = userBets.length;
    const totalBetAmount = userBets.reduce((sum, bet) => sum + bet.amount, 0);
    
    const winningBets = userBets.filter(bet => {
      const game = games.find(g => g.id === bet.gameId);
      if (!game || game.winningNumber === null) return false;
      return isBetWinner(bet.number, game.winningNumber);
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
  
  // Get the five most recent bets
  const recentBets = [...userBets]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 5);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Dashboard</h1>
            <p className="text-muted-foreground">
              Track your betting performance and history
            </p>
          </div>
          
          {/* Balance and Stats */}
          <div className="glass-card p-6 mb-8 animate-slide-up">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-4 lg:col-span-1">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Balance</h3>
                <div className="flex items-center">
                  <Coins className="h-8 w-8 text-amber-500 mr-3" />
                  <span className="text-3xl font-bold">{formatCurrency(currentUser.balance)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 md:col-span-4 lg:col-span-3 gap-4">
                <div className="neo-morphism p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Bets</h3>
                  <div className="flex items-center">
                    <BarChart3 className="h-5 w-5 text-primary mr-2" />
                    <span className="text-xl font-bold">{stats.totalBets}</span>
                  </div>
                </div>
                
                <div className="neo-morphism p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Win Rate</h3>
                  <div className="flex items-center">
                    <History className="h-5 w-5 text-primary mr-2" />
                    <span className="text-xl font-bold">{stats.winRate.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="neo-morphism p-4 rounded-xl">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Profit/Loss</h3>
                  <div className="flex items-center">
                    {stats.profitLoss >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-emerald-500 mr-2" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-rose-500 mr-2" />
                    )}
                    <span className={`text-xl font-bold ${
                      stats.profitLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    }`}>
                      {formatCurrency(stats.profitLoss)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Bets */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-semibold mb-4">Recent Bets</h2>
            {recentBets.length > 0 ? (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Game
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Result
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentBets.map((bet) => {
                        const game = games.find(g => g.id === bet.gameId);
                        const isWinner = game?.winningNumber !== null && bet.number === game?.winningNumber;
                        const isPending = game?.status !== 'completed';
                        
                        return (
                          <tr key={`${bet.gameId}-${bet.timestamp.getTime()}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatDate(bet.timestamp)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {game?.name || 'Unknown Game'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {bet.number}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {formatCurrency(bet.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {isPending ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800">
                                  Pending
                                </span>
                              ) : isWinner ? (
                                <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-800">
                                  Won {formatCurrency(bet.amount * 10)}
                                </span>
                              ) : (
                                <span className="px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-800">
                                  Lost
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground">You haven't placed any bets yet</p>
              </div>
            )}
          </div>
          
          {/* Get More Currency */}
          <div className="glass-card p-8 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl font-medium mb-2">Need More Currency?</h3>
            <p className="text-muted-foreground mb-6">
              This is a demo app with virtual currency. You can always get more!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-2 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Refresh App
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
