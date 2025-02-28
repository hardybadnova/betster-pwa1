
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ActiveGame from '@/components/ActiveGame';
import { useGameContext } from '@/context/GameContext';
import BetsterAppBar from '@/components/BetsterAppBar';
import BetsterBottomBar from '@/components/BetsterBottomBar';
import BetsterDrawer from '@/components/BetsterDrawer';

const Game = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { games, joinGame, isUserInGame } = useGameContext();
  const { toast } = useToast();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
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
    <div className="min-h-screen flex flex-col premium-gradient-bg text-white">
      <BetsterAppBar onOpenDrawer={() => setIsDrawerOpen(true)} title={game.name} />
      <BetsterDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      
      <main className="flex-1 py-4">
        <ActiveGame game={game} />
      </main>
      
      <BetsterBottomBar />
    </div>
  );
};

export default Game;
