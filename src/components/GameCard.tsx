
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game, useGameContext } from '@/context/GameContext';
import { formatCurrency, getGameStatus, calculateTimeRemaining, formatDate } from '@/lib/betUtils';
import { Users, Clock, DollarSign } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const navigate = useNavigate();
  const { joinGame, isUserInGame } = useGameContext();
  
  // Get formatted status
  const status = getGameStatus(game);
  
  // Check if user is already in the game
  const userJoined = isUserInGame(game.id);
  
  // Handle join game
  const handleJoinGame = () => {
    if (!userJoined) {
      joinGame(game.id);
    }
    navigate(`/game/${game.id}`);
  };
  
  return (
    <div className="glass-card overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg">{game.name}</h3>
          <span className={`text-xs px-2 py-1 rounded-full text-white ${status.color}`}>
            {status.label}
          </span>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{game.participants.length} Players</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            {game.status === 'active' && game.endTime ? (
              <span>Ends in: {calculateTimeRemaining(game.endTime)}</span>
            ) : (
              <span>Duration: {game.duration} seconds</span>
            )}
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {formatCurrency(game.minBet)} - {formatCurrency(game.maxBet)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Created: {formatDate(game.createdAt)}</span>
          
          <button
            onClick={handleJoinGame}
            className="py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            {userJoined ? 'Enter Game' : 'Join Game'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
