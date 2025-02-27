
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { formatCurrency } from '@/lib/betUtils';
import { Coins } from 'lucide-react';

interface UserBalanceProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const UserBalance: React.FC<UserBalanceProps> = ({ 
  size = 'md', 
  showIcon = true,
  className = ''
}) => {
  const { currentUser } = useGameContext();
  
  // Determine text size based on the size prop
  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-bold',
  };
  
  // Determine icon size based on the size prop
  const iconSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={`flex items-center ${className}`}>
      {showIcon && (
        <Coins className={`${iconSizeClasses[size]} mr-2 text-amber-500`} />
      )}
      <span className={`${textSizeClasses[size]} font-medium`}>
        {formatCurrency(currentUser.balance)}
      </span>
    </div>
  );
};

export default UserBalance;
