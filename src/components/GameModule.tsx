
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Crown, Award, Sword } from 'lucide-react';

interface GameModuleProps {
  type: 'bluff' | 'top-spot' | 'jackpot';
  name: string;
  description: string;
  players: number;
  prize: string;
}

const GameModule: React.FC<GameModuleProps> = ({
  type,
  name,
  description,
  players,
  prize
}) => {
  const navigate = useNavigate();
  
  const getIcon = () => {
    switch (type) {
      case 'bluff':
        return <Sword className="h-10 w-10 text-[#9b87f5]" />;
      case 'top-spot':
        return <Crown className="h-10 w-10 text-amber-500" />;
      case 'jackpot':
        return <Award className="h-10 w-10 text-emerald-500" />; // Changed Horse to Award
      default:
        return null;
    }
  };
  
  const getBgColor = () => {
    switch (type) {
      case 'bluff':
        return 'bg-[#9b87f5]/10 border-[#9b87f5]/20';
      case 'top-spot':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'jackpot':
        return 'bg-emerald-500/10 border-emerald-500/20';
      default:
        return 'bg-gray-100';
    }
  };
  
  return (
    <div className={`p-4 rounded-xl border ${getBgColor()} hover:shadow-lg transition-all`}>
      <div className="flex items-center space-x-4">
        <div className="shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold truncate">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
          
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <span>{players} active players</span>
            <span className="mx-2">•</span>
            <span>Prize: {prize}</span>
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/lobby?game=${type}`)}
          className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-secondary hover:bg-secondary/80"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default GameModule;
