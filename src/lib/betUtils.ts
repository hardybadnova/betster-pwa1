
// betUtils.ts - Utility functions for betting operations

/**
 * Format a number as currency with rupee symbol
 */
export const formatCurrency = (value: number): string => {
  return `₹${value.toLocaleString('en-IN')}`;
};

/**
 * Calculate the payout amount based on bet amount and multiplier
 */
export const calculatePayout = (betAmount: number, multiplier: number): number => {
  return betAmount * multiplier;
};

/**
 * Calculate fees for a transaction
 */
export const calculateFees = (amount: number, feePercentage: number): number => {
  return amount * (feePercentage / 100);
};

/**
 * Check if a user has sufficient balance for a bet
 */
export const hasSufficientBalance = (balance: number, betAmount: number): boolean => {
  return balance >= betAmount;
};

/**
 * Generate a random result for a game
 */
export const generateRandomResult = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Find the least frequently chosen number in an array
 */
export const findLeastChosenNumber = (numbers: number[]): number | null => {
  if (numbers.length === 0) return null;
  
  // Count frequency of each number
  const frequency: Record<number, number> = {};
  numbers.forEach(num => {
    frequency[num] = (frequency[num] || 0) + 1;
  });
  
  // Find the number with minimum frequency
  let minFreq = Infinity;
  let leastChosenNumber = null;
  
  for (const [numStr, freq] of Object.entries(frequency)) {
    const num = parseInt(numStr);
    if (freq < minFreq) {
      minFreq = freq;
      leastChosenNumber = num;
    }
  }
  
  return leastChosenNumber;
};

/**
 * Get an appropriate CSS class based on a number's popularity
 */
export const getNumberPopularityClass = (frequency: number, maxFrequency: number): string => {
  const ratio = frequency / maxFrequency;
  
  if (ratio === 0) return 'bg-gray-200 text-gray-600';
  if (ratio < 0.2) return 'bg-blue-100 text-blue-700';
  if (ratio < 0.4) return 'bg-green-100 text-green-700';
  if (ratio < 0.6) return 'bg-yellow-100 text-yellow-700';
  if (ratio < 0.8) return 'bg-orange-100 text-orange-700';
  return 'bg-red-100 text-red-700';
};

/**
 * Calculate time remaining until a given end time
 */
export const calculateTimeRemaining = (endTime: number): string => {
  const now = Date.now();
  const timeLeft = endTime - now;

  if (timeLeft <= 0) return 'Ended';

  const minutes = Math.floor(timeLeft / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

/**
 * Format a date for display
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Get game status information with label and color
 */
export const getGameStatus = (game: { status: string; endTime?: number }): { label: string; color: string } => {
  switch (game.status) {
    case 'waiting':
      return { label: 'Waiting', color: 'bg-blue-500' };
    case 'active':
      return { label: 'Active', color: 'bg-green-500' };
    case 'completed':
      return { label: 'Completed', color: 'bg-gray-500' };
    default:
      return { label: 'Unknown', color: 'bg-gray-500' };
  }
};

/**
 * Get numbers filtered by pattern
 */
export const getNumbersByPattern = (filter: 'all' | 'even' | 'odd' | 'high' | 'low'): number[] => {
  // Generate numbers from 0 to 200 (maximum needed for any game)
  const allNumbers = Array.from({ length: 201 }, (_, i) => i);
  
  switch (filter) {
    case 'all':
      return allNumbers;
    case 'even':
      return allNumbers.filter(num => num % 2 === 0);
    case 'odd':
      return allNumbers.filter(num => num % 2 !== 0);
    case 'high':
      return allNumbers.filter(num => num > 100);
    case 'low':
      return allNumbers.filter(num => num <= 100);
    default:
      return allNumbers;
  }
};

/**
 * Calculate potential winnings for a bet
 */
export const calculatePotentialWinnings = (betAmount: number): number => {
  const multiplier = 1.8; // Default multiplier
  return betAmount * multiplier;
};
