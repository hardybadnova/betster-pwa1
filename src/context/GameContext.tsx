import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Define types
type User = {
  id: string;
  name: string;
  balance: number;
  avatar: string;
};

type Bet = {
  userId: string;
  gameId: string;
  number: number;
  amount: number;
  timestamp: number;
};

export type Game = {
  id: string;
  name: string;
  createdBy: string;
  createdAt: number;
  status: 'waiting' | 'active' | 'completed';
  minBet: number;
  maxBet: number;
  duration: number; // in seconds
  winningNumber: number | null;
  participants: string[];
  bets: Bet[];
  endTime: number | null;
};

type GameContextType = {
  currentUser: User;
  games: Game[];
  userBets: Bet[];
  createGame: (gameData: Omit<Game, 'id' | 'createdAt' | 'status' | 'participants' | 'bets' | 'winningNumber' | 'endTime'>) => string;
  joinGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;
  placeBet: (gameId: string, number: number, amount: number) => boolean;
  startGame: (gameId: string) => void;
  generateWinningNumber: (gameId: string) => number;
  isUserInGame: (gameId: string) => boolean;
  updateBalance: (amount: number) => void;
  addFakePlayers: (gameId: string, count: number) => void;
};

// Generate a unique ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Create the context
const GameContext = createContext<GameContextType | undefined>(undefined);

// Random names for fake players
const fakeNames = [
  'Alex Smith', 'Jordan Lee', 'Taylor Kim', 'Morgan Chen', 'Casey Lopez',
  'Riley Brown', 'Jamie Wilson', 'Drew Garcia', 'Quinn Davis', 'Avery Martin'
];

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initial state
  const [currentUser, setCurrentUser] = useState<User>({
    id: generateId(),
    name: 'You',
    balance: 10000, // Start with ₹10,000
    avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${generateId()}`
  });

  const [games, setGames] = useState<Game[]>([]);
  const [userBets, setUserBets] = useState<Bet[]>([]);

  // Create a new game
  const createGame = useCallback((gameData: Omit<Game, 'id' | 'createdAt' | 'status' | 'participants' | 'bets' | 'winningNumber' | 'endTime'>) => {
    const gameId = generateId();
    const newGame: Game = {
      id: gameId,
      ...gameData,
      createdAt: Date.now(),
      status: 'waiting',
      participants: [currentUser.id],
      bets: [],
      winningNumber: null,
      endTime: null
    };

    setGames(prevGames => [...prevGames, newGame]);
    return gameId;
  }, [currentUser.id]);

  // Join a game
  const joinGame = useCallback((gameId: string) => {
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId && !game.participants.includes(currentUser.id)
          ? { ...game, participants: [...game.participants, currentUser.id] }
          : game
      )
    );
  }, [currentUser.id]);

  // Leave a game
  const leaveGame = useCallback((gameId: string) => {
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId
          ? { ...game, participants: game.participants.filter(id => id !== currentUser.id) }
          : game
      )
    );
  }, [currentUser.id]);

  // Place a bet
  const placeBet = useCallback((gameId: string, number: number, amount: number) => {
    // Check if user has enough balance
    if (currentUser.balance < amount) {
      return false;
    }

    // Find the game
    const game = games.find(g => g.id === gameId);
    if (!game || game.status !== 'active') {
      return false;
    }

    // Check if bet is within limits
    if (amount < game.minBet || amount > game.maxBet) {
      return false;
    }

    // Add the bet
    const newBet: Bet = {
      userId: currentUser.id,
      gameId,
      number,
      amount,
      timestamp: Date.now()
    };

    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId
          ? { ...game, bets: [...game.bets, newBet] }
          : game
      )
    );

    // Update user's bets
    setUserBets(prevBets => [...prevBets, newBet]);

    // Deduct from balance
    setCurrentUser(prevUser => ({
      ...prevUser,
      balance: prevUser.balance - amount
    }));

    return true;
  }, [currentUser, games]);

  // Start a game
  const startGame = useCallback((gameId: string) => {
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId
          ? { 
              ...game, 
              status: 'active',
              endTime: Date.now() + game.duration * 1000
            }
          : game
      )
    );

    // Set a timer to end the game
    const game = games.find(g => g.id === gameId);
    if (game) {
      setTimeout(() => {
        generateWinningNumber(gameId);
      }, game.duration * 1000);
    }
  }, [games]);

  // Generate a winning number and end the game
  const generateWinningNumber = useCallback((gameId: string) => {
    // Random number between 1 and 100
    const winningNumber = Math.floor(Math.random() * 100) + 1;

    setGames(prevGames => 
      prevGames.map(game => {
        if (game.id === gameId) {
          // Calculate winnings
          game.bets.forEach(bet => {
            if (bet.number === winningNumber && bet.userId === currentUser.id) {
              // Win is 10x the bet amount
              setCurrentUser(prevUser => ({
                ...prevUser,
                balance: prevUser.balance + bet.amount * 10
              }));
            }
          });

          return { 
            ...game, 
            status: 'completed',
            winningNumber
          };
        }
        return game;
      })
    );

    return winningNumber;
  }, [currentUser.id]);

  // Check if user is in a game
  const isUserInGame = useCallback((gameId: string) => {
    const game = games.find(g => g.id === gameId);
    return game ? game.participants.includes(currentUser.id) : false;
  }, [currentUser.id, games]);

  // Update user balance
  const updateBalance = useCallback((amount: number) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      balance: prevUser.balance + amount
    }));
  }, []);

  // Add fake players to a game
  const addFakePlayers = useCallback((gameId: string, count: number) => {
    // Create fake players
    const fakePlayers = Array.from({ length: count }).map(() => {
      const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      return generateId();
    });

    // Add fake players to the game
    setGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId
          ? { ...game, participants: [...game.participants, ...fakePlayers] }
          : game
      )
    );

    // Generate fake bets if the game is active
    const game = games.find(g => g.id === gameId);
    if (game && game.status === 'active') {
      const fakeBets = fakePlayers.map(playerId => {
        const randomNumber = Math.floor(Math.random() * 100) + 1;
        const randomAmount = Math.floor(Math.random() * (game.maxBet - game.minBet + 1)) + game.minBet;
        
        return {
          userId: playerId,
          gameId,
          number: randomNumber,
          amount: randomAmount,
          timestamp: Date.now()
        };
      });

      setGames(prevGames => 
        prevGames.map(game => 
          game.id === gameId
            ? { ...game, bets: [...game.bets, ...fakeBets] }
            : game
        )
      );
    }
  }, [games]);

  // Add example games for demo
  useEffect(() => {
    // Only add example games if none exist
    if (games.length === 0) {
      const exampleGame1 = {
        id: generateId(),
        name: "Quick Pick Game",
        createdBy: "system",
        createdAt: Date.now(),
        status: 'waiting' as const,
        minBet: 100,
        maxBet: 1000,
        duration: 60,
        winningNumber: null,
        participants: ["system", generateId(), generateId()],
        bets: [],
        endTime: null
      };

      const exampleGame2 = {
        id: generateId(),
        name: "High Roller Room",
        createdBy: "system",
        createdAt: Date.now() - 1000 * 60 * 5, // 5 minutes ago
        status: 'active' as const,
        minBet: 500,
        maxBet: 5000,
        duration: 300,
        winningNumber: null,
        participants: ["system", generateId(), generateId(), generateId(), generateId()],
        bets: [],
        endTime: Date.now() + 1000 * 60 * 10 // 10 minutes from now
      };

      setGames([exampleGame1, exampleGame2]);
    }
  }, []);

  // Create the context value
  const value = {
    currentUser,
    games,
    userBets,
    createGame,
    joinGame,
    leaveGame,
    placeBet,
    startGame,
    generateWinningNumber,
    isUserInGame,
    updateBalance,
    addFakePlayers
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Hook to use the game context
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
