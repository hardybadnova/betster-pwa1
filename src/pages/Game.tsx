
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ActiveGame from '@/components/ActiveGame';
import { useGameContext } from '@/context/GameContext';

const Game = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { games, joinGame, isUserInGame } = useGameContext();
  const { toast } = useToast();
  
  // Find the game
  const game = games.find(g => g.id === gameId);
  
  // Handle missing game
  useEffect(() => {
    if (!gameId || !game) {
      toast({
        title: 'Game not found',
        description: 'The game you are looking for does not exist',
        variant: 'destructive',
      });
      navigate('/lobby');
      return;
    }
    
    // Join the game if not already in it
    if (!isUserInGame(gameId)) {
      joinGame(gameId);
      toast({
        title: 'Joined game',
        description: `You've joined ${game.name}`,
      });
    }
  }, [gameId, game, navigate, toast, joinGame, isUserInGame]);
  
  if (!game) {
    return null; // Redirect is handled in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1A1F2C]/90 to-black">
      <Header />
      
      <main className="flex-1 py-4">
        <ActiveGame game={game} />
      </main>
    </div>
  );
};

export default Game;
