
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Game, useGameContext } from '@/context/GameContext';
import { calculateTimeRemaining, formatCurrency } from '@/lib/betUtils';
import BettingCard from './BettingCard';
import NumberPad from './NumberPad';
import { Users, Clock, Trophy } from 'lucide-react';

interface ActiveGameProps {
  game: Game;
}

const ActiveGame: React.FC<ActiveGameProps> = ({ game }) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const { startGame, addFakePlayers } = useGameContext();
  const { toast } = useToast();

  // Handle number selection
  const handleSelectNumber = (number: number) => {
    setSelectedNumber(number);
  };

  // Handle bet success
  const handleBetSuccess = () => {
    toast({
      title: 'Bet placed successfully',
      description: `You bet on number ${selectedNumber}`,
    });
    setSelectedNumber(null);
  };

  // Handle bet error
  const handleBetError = (message: string) => {
    toast({
      title: 'Error placing bet',
      description: message,
      variant: 'destructive',
    });
  };

  // Update time remaining
  useEffect(() => {
    const updateTime = () => {
      if (game.status === 'active' && game.endTime) {
        setTimeRemaining(calculateTimeRemaining(game.endTime));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [game]);

  // Handle start game
  const handleStartGame = () => {
    startGame(game.id);
    toast({
      title: 'Game started',
      description: 'The betting is now open!',
    });
  };

  // Handle add fake players
  const handleAddFakePlayers = () => {
    addFakePlayers(game.id, 3);
    toast({
      title: 'Players joined',
      description: '3 new players have joined the game',
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{game.participants.length} Players</span>
          </div>
          
          {game.status === 'active' && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-sm">Time left: {timeRemaining}</span>
            </div>
          )}
        </div>
        
        {game.status === 'completed' && game.winningNumber !== null && (
          <div className="bg-primary/10 p-4 rounded-lg inline-flex items-center mb-4">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            <span className="font-medium">Winning Number: </span>
            <span className="text-xl font-bold ml-2">{game.winningNumber}</span>
          </div>
        )}
        
        {game.status === 'waiting' && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              onClick={handleStartGame}
              className="py-2 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              Start Game
            </button>
            
            <button
              onClick={handleAddFakePlayers}
              className="py-2 px-6 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-colors w-full sm:w-auto"
            >
              Add Players
            </button>
          </div>
        )}
      </div>
      
      {game.status === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <NumberPad 
              onSelectNumber={handleSelectNumber}
              selectedNumber={selectedNumber}
            />
          </div>
          
          <div>
            <BettingCard 
              gameId={game.id}
              selectedNumber={selectedNumber}
              onSuccess={handleBetSuccess}
              onError={handleBetError}
            />
          </div>
        </div>
      )}
      
      {game.status === 'waiting' && (
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-medium mb-4">Waiting for Game to Start</h3>
          <p className="text-muted-foreground">
            Once the game starts, you'll be able to place bets on numbers from 1 to 100.
          </p>
        </div>
      )}
      
      {game.status === 'completed' && (
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-medium mb-4">Game Completed</h3>
          <p className="text-muted-foreground mb-4">
            This game is already finished. Check out other active games in the lobby.
          </p>
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/lobby'}
              className="py-2 px-6 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveGame;
