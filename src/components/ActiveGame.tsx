
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Game, useGameContext } from '@/context/GameContext';
import { calculateTimeRemaining, formatCurrency } from '@/lib/betUtils';
import BettingCard from './BettingCard';
import NumberPad from './NumberPad';
import { Users, Clock, Trophy, MessageSquare, Eye, ChartBar } from 'lucide-react';

interface ActiveGameProps {
  game: Game;
}

const ActiveGame: React.FC<ActiveGameProps> = ({ game }) => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{user: string, message: string, timestamp: Date}[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { startGame, addFakePlayers, currentUser, updateBalance } = useGameContext();
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

  // Handle sending chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const newMessage = {
        user: currentUser.name,
        message: chatMessage,
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage('');
    }
  };

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  // Handle viewing hints
  const handleViewHint = () => {
    // Calculate 1% of entry fee (using minBet as proxy for entry fee)
    const hintFee = game.minBet;
    
    // Check if user has enough balance
    if (currentUser.balance < hintFee) {
      toast({
        title: 'Insufficient funds',
        description: `You need ${formatCurrency(hintFee)} to view hints`,
        variant: 'destructive',
      });
      return;
    }
    
    // Deduct fee from balance
    updateBalance(-hintFee);
    
    // Show hint
    setShowHint(true);
    toast({
      title: 'Hint unlocked',
      description: `${formatCurrency(hintFee)} has been deducted from your balance`,
    });
  };

  // Generate fake data for past games
  const getPastGamesData = () => {
    return Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      date: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)), // One day ago per entry
      winningNumber: Math.floor(Math.random() * 16),
      players: 30 + Math.floor(Math.random() * 20),
      mostPickedNumber: Math.floor(Math.random() * 16)
    }));
  };

  // Generate fake player data
  const getPlayers = () => {
    const players = [
      { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, games: 24, wins: 5 },
      ...game.participants
        .filter(id => id !== currentUser.id)
        .map((id, index) => ({
          id,
          name: `Player${index + 1}`,
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${id}`,
          games: 10 + Math.floor(Math.random() * 90),
          wins: Math.floor(Math.random() * 20)
        }))
    ];
    
    // Ensure we have exactly 50 players by adding or removing
    if (players.length < 50) {
      const extraPlayers = Array.from({ length: 50 - players.length }).map((_, i) => ({
        id: `extra-${i}`,
        name: `Player${players.length + i + 1}`,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=extra-${i}`,
        games: 10 + Math.floor(Math.random() * 90),
        wins: Math.floor(Math.random() * 20)
      }));
      return [...players, ...extraPlayers];
    }
    
    return players.slice(0, 50); // Limit to 50 players
  };

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
        
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm">{game.participants.length} Players</span>
          </div>
          
          {game.status === 'active' && (
            <div className="flex items-center text-amber-500">
              <Clock className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Time left: {timeRemaining}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Player List - Left Side */}
          <div className="lg:col-span-4 glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Players (50)</h3>
              <button 
                onClick={() => setShowChat(!showChat)}
                className="p-2 rounded-full bg-secondary hover:bg-secondary/80"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
            </div>
            
            {showChat ? (
              <div className="h-[500px] flex flex-col">
                <div className="flex-1 overflow-auto mb-4 px-2">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-4">
                      No messages yet. Start chatting!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {chatMessages.map((msg, i) => (
                        <div 
                          key={i} 
                          className={`flex ${msg.user === currentUser.name ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg px-3 py-2 ${
                              msg.user === currentUser.name 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary'
                            }`}
                          >
                            <div className="text-xs opacity-70 mb-1">
                              {msg.user} • {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                            <div>{msg.message}</div>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-secondary px-3 py-2 rounded-md"
                  />
                  <button 
                    type="submit"
                    className="bg-primary text-primary-foreground px-3 py-2 rounded-md"
                  >
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <div className="h-[500px] overflow-auto thin-scrollbar">
                {getPlayers().map((player) => (
                  <div 
                    key={player.id}
                    className="flex items-center p-2 border-b border-border hover:bg-secondary/20 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                      <img src={player.avatar} alt={player.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {player.name} {player.id === currentUser.id && <span className="text-primary">(You)</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {player.games} games • {player.wins} wins
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Right Side: Number Pad and Betting */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* Number Selection */}
              <div className="md:col-span-3">
                <div className="glass-card p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Choose a Number (0-15)</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleViewHint}
                        disabled={showHint}
                        className="flex items-center space-x-1 text-xs py-1 px-3 rounded-md bg-secondary/80 hover:bg-secondary disabled:opacity-50"
                      >
                        <Eye className="h-3 w-3" />
                        <span>Hint ({formatCurrency(game.minBet)})</span>
                      </button>
                    </div>
                  </div>
                  
                  {showHint ? (
                    <div className="mb-6">
                      <div className="mb-3 text-xs text-muted-foreground flex items-center">
                        <ChartBar className="h-3 w-3 mr-1" />
                        Last 10 Games Statistics
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-2">Date</th>
                              <th className="text-center py-2 px-2">Winning #</th>
                              <th className="text-center py-2 px-2">Players</th>
                              <th className="text-center py-2 px-2">Most Picked</th>
                            </tr>
                          </thead>
                          <tbody>
                            {getPastGamesData().map((gameData) => (
                              <tr key={gameData.id} className="border-b border-border hover:bg-secondary/20">
                                <td className="py-2 px-2">
                                  {gameData.date.toLocaleDateString()}
                                </td>
                                <td className="py-2 px-2 text-center font-medium text-primary">
                                  {gameData.winningNumber}
                                </td>
                                <td className="py-2 px-2 text-center">
                                  {gameData.players}
                                </td>
                                <td className="py-2 px-2 text-center text-amber-500">
                                  {gameData.mostPickedNumber}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <button 
                        onClick={() => setShowHint(false)}
                        className="mt-4 text-xs text-primary hover:underline"
                      >
                        Close Hints
                      </button>
                    </div>
                  ) : null}
                  
                  <NumberPad 
                    onSelectNumber={handleSelectNumber}
                    selectedNumber={selectedNumber}
                    maxNumber={15} // Limit numbers to 0-15
                  />
                </div>
              </div>
              
              {/* Betting Card */}
              <div className="md:col-span-2">
                <BettingCard 
                  gameId={game.id}
                  selectedNumber={selectedNumber}
                  onSuccess={handleBetSuccess}
                  onError={handleBetError}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {game.status === 'waiting' && (
        <div className="glass-card p-8 text-center">
          <h3 className="text-xl font-medium mb-4">Waiting for Game to Start</h3>
          <p className="text-muted-foreground">
            Once the game starts, you'll be able to place bets on numbers from 0 to 15.
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
