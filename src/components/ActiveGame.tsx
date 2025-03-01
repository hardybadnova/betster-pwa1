import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Game, useGameContext } from '@/context/GameContext';
import { calculateTimeRemaining, formatCurrency } from '@/lib/betUtils';
import BettingCard from './BettingCard';
import NumberPad from './NumberPad';
import ResultScreen from './ResultScreen';
import { Users, Clock, Trophy, MessageSquare, Eye, ChartBar, Swords } from 'lucide-react';

interface ActiveGameProps {
  game: Game;
  gameType?: 'bluff' | 'top-spot' | 'jackpot';
}

const ActiveGame: React.FC<ActiveGameProps> = ({ 
  game,
  gameType = 'bluff' // Default to bluff game type
}) => {
  const navigate = useNavigate();
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{user: string, message: string, timestamp: number}[]>([]);
  const [showResults, setShowResults] = useState(false);
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

  // Update time remaining and check for game completion
  useEffect(() => {
    const updateTime = () => {
      if (game.status === 'active' && game.endTime) {
        const remaining = calculateTimeRemaining(game.endTime);
        setTimeRemaining(remaining);
        
        // Show results when game ends
        if (remaining === 'Ended' && !showResults) {
          setShowResults(true);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [game, showResults]);

  // Handle start game
  const handleStartGame = () => {
    startGame(game.id);
    toast({
      title: 'Game started',
      description: 'The betting is now open!',
    });
  };

  // Handle play again
  const handlePlayAgain = () => {
    setShowResults(false);
    // Navigate to lobby or another game
    navigate('/lobby');
  };

  // Handle add fake players
  const handleAddFakePlayers = () => {
    const count = gameType === 'jackpot' ? 1000 : 10;
    addFakePlayers(game.id, count);
    toast({
      title: 'Players joined',
      description: `${count} new players have joined the game`,
    });
  };

  // Handle sending chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const newMessage = {
        user: currentUser.name,
        message: chatMessage,
        timestamp: Date.now()
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
    // Calculate hint fee based on game type
    const hintFee = gameType === 'jackpot' ? game.minBet * 5 : game.minBet;
    
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
      winningNumber: gameType === 'jackpot' 
        ? Math.floor(Math.random() * 200) 
        : Math.floor(Math.random() * 16),
      players: gameType === 'jackpot' ? 8000 + Math.floor(Math.random() * 2000) : 30 + Math.floor(Math.random() * 20),
      mostPickedNumber: gameType === 'jackpot' 
        ? Math.floor(Math.random() * 200) 
        : Math.floor(Math.random() * 16)
    }));
  };

  // Generate fake player data
  const getPlayers = () => {
    const playerCount = gameType === 'jackpot' ? 100 : 50;
    
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
    
    // Ensure we have the correct number of players
    if (players.length < playerCount) {
      const extraPlayers = Array.from({ length: playerCount - players.length }).map((_, i) => ({
        id: `extra-${i}`,
        name: `Player${players.length + i + 1}`,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=extra-${i}`,
        games: 10 + Math.floor(Math.random() * 90),
        wins: Math.floor(Math.random() * 20)
      }));
      return [...players, ...extraPlayers];
    }
    
    return players.slice(0, playerCount);
  };
  
  // Show the result screen if game is completed or results are ready to show
  if (showResults || game.status === 'completed') {
    return <ResultScreen game={game} gameType={gameType} onPlayAgain={handlePlayAgain} />;
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6 pb-20">
      {/* Game Header with Timer */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2 premium-text-gradient">{game.name}</h1>
        
        {game.status === 'active' && (
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="py-2 px-6 bg-[#1A1F2C] border border-[#9b87f5]/20 rounded-full flex items-center space-x-3">
              <Clock className="h-5 w-5 text-amber-500" />
              <div className="text-xl font-medium">{timeRemaining}</div>
            </div>
          </div>
        )}
        
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
              className="py-2 px-6 premium-button-gradient text-white rounded-md font-medium w-full sm:w-auto"
            >
              Start Game
            </button>
            
            <button
              onClick={handleAddFakePlayers}
              className="py-2 px-6 bg-[#1A1F2C] border border-[#9b87f5]/20 text-white rounded-md font-medium hover:bg-[#9b87f5]/10 transition-colors w-full sm:w-auto"
            >
              Add Players
            </button>
          </div>
        )}
      </div>
      
      {/* Game content */}
      {game.status === 'active' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Number Selection - Center Top */}
          <div className="lg:col-span-12 order-2 lg:order-1">
            <div className="premium-glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold premium-text-gradient">
                  {gameType === 'jackpot' ? 'Choose a Number (0-200)' : 'Choose a Number (0-15)'}
                </h3>
                <div className="flex space-x-2">
                  <div className="py-1 px-3 bg-[#1A1F2C] border border-[#9b87f5]/20 rounded-full text-xs flex items-center">
                    <Clock className="h-3 w-3 text-amber-500 mr-1" />
                    <span>{timeRemaining}</span>
                  </div>
                  <button
                    onClick={handleViewHint}
                    disabled={showHint}
                    className="flex items-center space-x-1 text-xs py-1 px-3 rounded-full bg-[#1A1F2C] border border-[#9b87f5]/20 hover:bg-[#9b87f5]/10 disabled:opacity-50"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Hint ({formatCurrency(gameType === 'jackpot' ? game.minBet * 5 : game.minBet)})</span>
                  </button>
                </div>
              </div>
              
              {showHint && (
                <div className="mb-6">
                  <div className="mb-3 text-xs text-muted-foreground flex items-center">
                    <ChartBar className="h-3 w-3 mr-1" />
                    Last 10 Games Statistics
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm premium-table">
                      <thead>
                        <tr>
                          <th className="text-left py-2 px-2">Date</th>
                          <th className="text-center py-2 px-2">Winning #</th>
                          <th className="text-center py-2 px-2">Players</th>
                          <th className="text-center py-2 px-2">Most Picked</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getPastGamesData().map((gameData) => (
                          <tr key={gameData.id}>
                            <td className="py-2 px-2">
                              {gameData.date.toLocaleDateString()}
                            </td>
                            <td className="py-2 px-2 text-center font-medium text-[#9b87f5]">
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
                    className="mt-4 text-xs text-[#9b87f5] hover:underline"
                  >
                    Close Hints
                  </button>
                </div>
              )}
              
              <NumberPad 
                onSelectNumber={handleSelectNumber}
                selectedNumber={selectedNumber}
                maxNumber={gameType === 'jackpot' ? 200 : 15}
              />
            </div>
          </div>
          
          {/* Betting Card - Left Side */}
          <div className="lg:col-span-4 order-1 lg:order-2">
            <BettingCard 
              gameId={game.id}
              selectedNumber={selectedNumber}
              onSuccess={handleBetSuccess}
              onError={handleBetError}
              gameType={gameType}
            />
          </div>
          
          {/* Player List - Right Side */}
          <div className="lg:col-span-8 order-3">
            <div className="premium-glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold premium-text-gradient">
                  Players ({gameType === 'jackpot' ? '10,000' : '50'})
                </h3>
                <button 
                  onClick={() => setShowChat(!showChat)}
                  className="p-2 rounded-full bg-[#1A1F2C] border border-[#9b87f5]/20 hover:bg-[#9b87f5]/10"
                >
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
              
              {showChat ? (
                <div className="h-[350px] flex flex-col">
                  <div className="flex-1 overflow-auto mb-4 px-2 thin-scrollbar">
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
                                  ? 'bg-[#9b87f5] text-white' 
                                  : 'bg-[#1A1F2C]'
                              }`}
                            >
                              <div className="text-xs opacity-70 mb-1">
                                {msg.user} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                      className="flex-1 bg-[#1A1F2C] border border-[#9b87f5]/20 px-3 py-2 rounded-md text-white"
                    />
                    <button 
                      type="submit"
                      className="premium-button-gradient px-3 py-2 rounded-md text-white"
                    >
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 h-[350px] overflow-y-auto thin-scrollbar">
                  {getPlayers().map((player) => (
                    <div 
                      key={player.id}
                      className="flex flex-col items-center p-2 bg-[#1A1F2C]/50 border border-[#9b87f5]/10 rounded-lg hover:bg-[#9b87f5]/10 transition-colors"
                    >
                      <div className="h-12 w-12 rounded-full overflow-hidden mb-2 border-2 border-[#9b87f5]/20">
                        <img src={player.avatar} alt={player.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm truncate w-full">
                          {player.name} {player.id === currentUser.id && <span className="text-[#9b87f5]">•</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {player.wins} wins
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {game.status === 'waiting' && (
        <div className="premium-glass-card p-8 text-center">
          <h3 className="text-xl font-medium mb-4">Waiting for Game to Start</h3>
          <p className="text-muted-foreground">
            {gameType === 'jackpot' 
              ? 'Once the game starts, you\'ll be able to place bets on numbers from 0 to 200.'
              : 'Once the game starts, you\'ll be able to place bets on numbers from 0 to 15.'}
          </p>
          <p className="text-muted-foreground mt-2">
            {gameType === 'bluff' 
              ? 'The player who picks the least chosen number wins 50% of the pool!'
              : gameType === 'top-spot'
                ? 'The player who picks the least chosen number wins 90% of the pool!'
                : 'The player who picks the least chosen number out of 10,000 players wins 90% of the massive pool!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default ActiveGame;
