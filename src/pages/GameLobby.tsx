
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import GameCard from '@/components/GameCard';
import { useGameContext } from '@/context/GameContext';
import { PlusCircle } from 'lucide-react';

const GameLobby = () => {
  const navigate = useNavigate();
  const { games } = useGameContext();
  
  // Group games by status
  const waitingGames = games.filter(game => game.status === 'waiting');
  const activeGames = games.filter(game => game.status === 'active');
  const completedGames = games.filter(game => game.status === 'completed');
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Game Lobby</h1>
              <p className="text-muted-foreground">
                Join an existing game or create your own
              </p>
            </div>
            
            <button
              onClick={() => navigate('/create')}
              className="flex items-center py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Game
            </button>
          </div>
          
          {/* Active Games */}
          <section className="mb-10 animate-slide-up">
            <h2 className="text-xl font-semibold mb-4">Active Games</h2>
            {activeGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground">No active games at the moment</p>
              </div>
            )}
          </section>
          
          {/* Waiting Games */}
          <section className="mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-xl font-semibold mb-4">Waiting for Players</h2>
            {waitingGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {waitingGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground">No games waiting for players</p>
              </div>
            )}
          </section>
          
          {/* Completed Games */}
          <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-xl font-semibold mb-4">Recently Completed</h2>
            {completedGames.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedGames.slice(0, 3).map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="glass-card p-6 text-center">
                <p className="text-muted-foreground">No completed games yet</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default GameLobby;
