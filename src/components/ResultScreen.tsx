
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Crown, Award, ChevronRight, BarChart3, Users } from 'lucide-react';
import { Game, useGameContext } from '@/context/GameContext';
import { formatCurrency } from '@/lib/betUtils';

interface ResultScreenProps {
  game: Game;
  gameType: 'bluff' | 'top-spot' | 'jackpot';
  onPlayAgain: () => void;
}

interface NumberSelectionStat {
  number: number;
  count: number;
  players: string[];
}

const ResultScreen: React.FC<ResultScreenProps> = ({ game, gameType, onPlayAgain }) => {
  const navigate = useNavigate();
  const { currentUser } = useGameContext();
  
  // Auto-redirect after 30 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onPlayAgain();
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [onPlayAgain]);
  
  // Calculate number selection statistics
  const calculateNumberStats = (): NumberSelectionStat[] => {
    const stats: Record<number, { count: number, players: string[] }> = {};
    
    // Initialize stats for all possible numbers (0-15 for standard games, 0-200 for jackpot)
    const maxNumber = gameType === 'jackpot' ? 200 : 15;
    for (let i = 0; i <= maxNumber; i++) {
      stats[i] = { count: 0, players: [] };
    }
    
    // Count selections for each number
    game.bets.forEach(bet => {
      if (!stats[bet.number]) {
        stats[bet.number] = { count: 0, players: [] };
      }
      stats[bet.number].count++;
      stats[bet.number].players.push(bet.userId);
    });
    
    // Convert to array and sort by count (ascending, with least chosen first)
    return Object.entries(stats).map(([number, data]) => ({
      number: parseInt(number),
      count: data.count,
      players: data.players
    }))
    .sort((a, b) => a.count - b.count);
  };
  
  const numberStats = calculateNumberStats();
  
  // Determine winners (top 3 least chosen numbers)
  const winners = numberStats.slice(0, 3);
  
  // Check if current user is a winner
  const userBets = game.bets.filter(bet => bet.userId === currentUser.id).map(bet => bet.number);
  const userWinningPosition = winners.findIndex(w => userBets.includes(w.number));
  const isWinner = userWinningPosition !== -1;
  
  // Calculate prize amount
  const calculatePrize = (position: number): number => {
    // Calculate total pool
    const totalPool = game.bets.reduce((sum, bet) => sum + bet.amount, 0);
    
    // Apply GST and house fee
    const afterTaxAndFee = totalPool * 0.72 * 0.9; // Deduct 28% GST and 10% house fee
    
    if (gameType === 'bluff') {
      // Prize distribution for Bluff the Tough
      switch (position) {
        case 0: return afterTaxAndFee * 0.5; // 50% for 1st place
        case 1: return afterTaxAndFee * 0.25; // 25% for 2nd place
        case 2: return afterTaxAndFee * 0.15; // 15% for 3rd place
        default: return 0;
      }
    } else {
      // Prize distribution for Top Spot and Jackpot Horse
      return position === 0 ? afterTaxAndFee : 0; // 90% for 1st place only
    }
  };
  
  // Helper to get player names (mock implementation)
  const getPlayerName = (userId: string): string => {
    if (userId === currentUser.id) return currentUser.name;
    return `Player ${userId.substring(0, 4)}`;
  };
  
  // Determine which icon to show based on game type
  const getWinnerIcon = () => {
    switch (gameType) {
      case 'bluff': return <Sword className="h-16 w-16 text-[#9b87f5]" />;
      case 'top-spot': return <Crown className="h-16 w-16 text-amber-500" />;
      case 'jackpot': return <Award className="h-16 w-16 text-emerald-500" />;
    }
  };
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 pb-20">
      <div className="premium-glass-card p-6 mb-6">
        {isWinner ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0, rotate: [0, 5, 0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-4"
            >
              {getWinnerIcon()}
            </motion.div>
            <h2 className="text-3xl font-bold premium-text-gradient mb-2">Congratulations!</h2>
            <p className="text-lg text-white mb-4">
              You won {userWinningPosition === 0 ? "1st" : userWinningPosition === 1 ? "2nd" : "3rd"} place!
            </p>
            <div className="bg-[#1A1F2C] border border-[#9b87f5]/20 rounded-lg p-4 inline-block">
              <p className="text-sm text-gray-400">Your prize:</p>
              <p className="text-2xl font-bold text-emerald-500">
                {formatCurrency(calculatePrize(userWinningPosition))}
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="text-center mb-8">
            <Trophy className="h-12 w-12 text-amber-500 mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">Better luck next time!</h2>
            <p className="text-gray-400 mb-4">
              You didn't win this round. The winning numbers were {winners[0].number}, {winners[1]?.number}, and {winners[2]?.number}.
            </p>
          </div>
        )}
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-amber-500" />
              Winners
            </h3>
            <span className="text-sm text-gray-400">{gameType === 'bluff' ? 'Top 3 Winners' : 'Winner'}</span>
          </div>
          
          <div className="space-y-4">
            {winners.slice(0, gameType === 'bluff' ? 3 : 1).map((winner, index) => (
              <div key={index} className="bg-[#1A1F2C] border border-[#9b87f5]/20 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                      index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-[#9b87f5]' : 'bg-emerald-500'
                    }`}>
                      <span className="font-bold text-black">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold">Number {winner.number}</p>
                      <p className="text-sm text-gray-400">Selected by {winner.count} player{winner.count !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Prize</p>
                    <p className="font-bold text-emerald-500">{formatCurrency(calculatePrize(index))}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-[#9b87f5]" />
              Number Distribution
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {numberStats.slice(0, 8).map((stat) => (
              <div key={stat.number} className="bg-[#1A1F2C] border border-[#9b87f5]/10 rounded-lg p-3 text-center">
                <div className={`text-xl font-bold mb-1 ${
                  winners.slice(0, gameType === 'bluff' ? 3 : 1).some(w => w.number === stat.number)
                    ? winners[0].number === stat.number
                      ? 'text-amber-500'
                      : winners[1]?.number === stat.number
                        ? 'text-[#9b87f5]'
                        : 'text-emerald-500'
                    : 'text-white'
                }`}>
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.count} pick{stat.count !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <button
            onClick={onPlayAgain}
            className="w-full py-3 premium-button-gradient rounded-lg flex items-center justify-center font-medium"
          >
            Play Again <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
      
      <div className="premium-glass-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-[#9b87f5]" />
            All Number Selections
          </h3>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto thin-scrollbar">
          <table className="w-full premium-table">
            <thead>
              <tr>
                <th className="text-left py-2 px-3">Number</th>
                <th className="text-center py-2 px-3">Times Chosen</th>
                <th className="text-right py-2 px-3">Players</th>
              </tr>
            </thead>
            <tbody>
              {numberStats.filter(stat => stat.count > 0).map((stat) => (
                <tr key={stat.number} className={
                  winners.slice(0, gameType === 'bluff' ? 3 : 1).some(w => w.number === stat.number)
                    ? 'bg-[#9b87f5]/10'
                    : ''
                }>
                  <td className="py-2 px-3">
                    <span className={
                      winners.slice(0, gameType === 'bluff' ? 3 : 1).some(w => w.number === stat.number)
                        ? winners[0].number === stat.number
                          ? 'text-amber-500 font-bold'
                          : winners[1]?.number === stat.number
                            ? 'text-[#9b87f5] font-bold'
                            : 'text-emerald-500 font-bold'
                        : ''
                    }>
                      {stat.number}
                    </span>
                  </td>
                  <td className="text-center py-2 px-3">{stat.count}</td>
                  <td className="text-right py-2 px-3 text-sm text-gray-400">
                    {stat.players.length === 0
                      ? "None"
                      : stat.players.length <= 3
                        ? stat.players.map(p => getPlayerName(p)).join(', ')
                        : `${stat.players.slice(0, 3).map(p => getPlayerName(p)).join(', ')} +${stat.players.length - 3} more`
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
