
import { Game } from '@/context/GameContext';

/**
 * Calculates the potential winnings for a bet
 * @param amount Bet amount
 * @param multiplier Win multiplier (default: 10)
 * @returns Potential winnings
 */
export const calculatePotentialWinnings = (amount: number, multiplier = 10): number => {
  return amount * multiplier;
};

/**
 * Formats currency for display
 * @param amount Amount to format
 * @returns Formatted amount
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculates time remaining in a game
 * @param endTime End time of the game
 * @returns Time remaining as a formatted string
 */
export const calculateTimeRemaining = (endTime: Date | null): string => {
  if (!endTime) return 'Not started';
  
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Ended';
  
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Gets the status of a game with a formatted label
 * @param game Game object
 * @returns Formatted status
 */
export const getGameStatus = (game: Game): { label: string; color: string } => {
  switch (game.status) {
    case 'waiting':
      return { label: 'Waiting for Players', color: 'bg-amber-500' };
    case 'active':
      return { label: 'Betting Open', color: 'bg-emerald-500' };
    case 'completed':
      return { label: 'Game Ended', color: 'bg-neutral-500' };
    default:
      return { label: 'Unknown', color: 'bg-gray-500' };
  }
};

/**
 * Generates a random avatar URL
 * @param seed Seed for the avatar
 * @returns Avatar URL
 */
export const generateAvatar = (seed: string): string => {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;
};

/**
 * Get a subset of possible betting numbers based on a pattern
 * (e.g., "even", "odd", "high", "low")
 * @param pattern The pattern to filter by
 * @returns Array of numbers matching the pattern
 */
export const getNumbersByPattern = (pattern: 'even' | 'odd' | 'high' | 'low' | 'all'): number[] => {
  const allNumbers = Array.from({ length: 100 }, (_, i) => i + 1);
  
  switch (pattern) {
    case 'even':
      return allNumbers.filter(num => num % 2 === 0);
    case 'odd':
      return allNumbers.filter(num => num % 2 !== 0);
    case 'high':
      return allNumbers.filter(num => num > 50);
    case 'low':
      return allNumbers.filter(num => num <= 50);
    case 'all':
    default:
      return allNumbers;
  }
};

/**
 * Determine if a bet is a winner
 * @param betNumber Number bet on
 * @param winningNumber Winning number
 * @returns Whether the bet is a winner
 */
export const isBetWinner = (betNumber: number, winningNumber: number | null): boolean => {
  if (winningNumber === null) return false;
  return betNumber === winningNumber;
};

/**
 * Format a date for display
 * @param date Date to format
 * @returns Formatted date string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date);
};
