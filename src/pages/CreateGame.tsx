
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { useGameContext } from '@/context/GameContext';
import { Clock, DollarSign } from 'lucide-react';

const CreateGame = () => {
  const navigate = useNavigate();
  const { createGame } = useGameContext();
  const { toast } = useToast();
  
  // Form state
  const [gameName, setGameName] = useState('');
  const [minBet, setMinBet] = useState(100);
  const [maxBet, setMaxBet] = useState(1000);
  const [duration, setDuration] = useState(60); // seconds
  
  // Form validation
  const isFormValid = 
    gameName.trim().length > 0 && 
    minBet > 0 && 
    maxBet > minBet &&
    duration >= 30;
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    const gameId = createGame({
      name: gameName,
      createdBy: 'user',
      minBet,
      maxBet,
      duration,
    });
    
    toast({
      title: 'Game created successfully',
      description: 'Your game is now in the lobby waiting for players',
    });
    
    navigate(`/game/${gameId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container max-w-3xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create a New Game</h1>
            <p className="text-muted-foreground">
              Set up your own betting game with custom parameters
            </p>
          </div>
          
          <div className="glass-card p-8 animate-slide-up">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* Game Name */}
                <div>
                  <label htmlFor="game-name" className="block font-medium mb-2">
                    Game Name
                  </label>
                  <input
                    id="game-name"
                    type="text"
                    value={gameName}
                    onChange={(e) => setGameName(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-input bg-background"
                    placeholder="Enter a name for your game"
                    maxLength={30}
                    required
                  />
                </div>
                
                {/* Bet Limits */}
                <div>
                  <label className="block font-medium mb-2">
                    Betting Limits
                  </label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Minimum Bet</span>
                      </div>
                      <input
                        type="number"
                        value={minBet}
                        onChange={(e) => setMinBet(Number(e.target.value))}
                        min={10}
                        max={10000}
                        step={10}
                        className="w-full px-4 py-2 rounded-md border border-input bg-background"
                        required
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Maximum Bet</span>
                      </div>
                      <input
                        type="number"
                        value={maxBet}
                        onChange={(e) => setMaxBet(Number(e.target.value))}
                        min={100}
                        max={50000}
                        step={100}
                        className="w-full px-4 py-2 rounded-md border border-input bg-background"
                        required
                      />
                    </div>
                  </div>
                  {minBet >= maxBet && (
                    <p className="text-destructive text-sm mt-1">
                      Maximum bet must be greater than minimum bet
                    </p>
                  )}
                </div>
                
                {/* Game Duration */}
                <div>
                  <label className="block font-medium mb-2">
                    Game Duration
                  </label>
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Time for placing bets</span>
                  </div>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-md border border-input bg-background"
                    required
                  >
                    <option value={30}>30 seconds</option>
                    <option value={60}>1 minute</option>
                    <option value={120}>2 minutes</option>
                    <option value={300}>5 minutes</option>
                    <option value={600}>10 minutes</option>
                  </select>
                </div>
                
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
                  >
                    Create Game
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/lobby')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Back to Game Lobby
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateGame;
