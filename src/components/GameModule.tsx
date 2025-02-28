
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Crown, Award, Sword, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
        return <Award className="h-10 w-10 text-emerald-500" />;
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

  // Game brief descriptions
  const getGameBrief = () => {
    switch (type) {
      case 'bluff':
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-[#9b87f5]">Bluff the Tough</h4>
            <p className="text-sm text-gray-300">A strategic game where players try to choose the least selected number between 0-15. The player who selects the number that is chosen by the fewest other players wins.</p>
            <div className="pt-2 border-t border-[#9b87f5]/10 mt-2">
              <h5 className="text-xs font-semibold text-gray-300">Prize Distribution:</h5>
              <ul className="text-xs text-gray-400 list-disc pl-4 mt-1">
                <li>1st Place: 50% of pool</li>
                <li>2nd Place: 30% of pool</li>
                <li>3rd Place: 20% of pool</li>
              </ul>
            </div>
          </div>
        );
      case 'top-spot':
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-amber-500">Top Spot</h4>
            <p className="text-sm text-gray-300">A high-stakes game where you aim to claim the top spot by selecting the winning number between 0-15. The competition is intense as all players try to predict the lucky number.</p>
            <div className="pt-2 border-t border-amber-500/10 mt-2">
              <h5 className="text-xs font-semibold text-gray-300">Prize Distribution:</h5>
              <ul className="text-xs text-gray-400 list-disc pl-4 mt-1">
                <li>1st Place: 60% of pool</li>
                <li>2nd Place: 25% of pool</li>
                <li>3rd Place: 15% of pool</li>
              </ul>
            </div>
          </div>
        );
      case 'jackpot':
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-emerald-500">Jackpot Horse</h4>
            <p className="text-sm text-gray-300">The biggest game in Betster with massive prize pools. Choose your number between 0-15 and compete with up to 10,000 players for the grand jackpot.</p>
            <div className="pt-2 border-t border-emerald-500/10 mt-2">
              <h5 className="text-xs font-semibold text-gray-300">Prize Distribution:</h5>
              <ul className="text-xs text-gray-400 list-disc pl-4 mt-1">
                <li>1st Place: 70% of pool</li>
                <li>2nd Place: 20% of pool</li>
                <li>3rd Place: 10% of pool</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className={`p-4 rounded-xl border ${getBgColor()} hover:shadow-lg transition-all`}>
      <div className="flex items-center space-x-4">
        <div className="shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold truncate">{name}</h3>
            <Popover>
              <PopoverTrigger asChild>
                <button className="ml-2 h-5 w-5 rounded-full bg-[#1A1F2C] flex items-center justify-center hover:bg-[#9b87f5]/20">
                  <Info className="h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 bg-[#1A1F2C] border border-[#9b87f5]/20 shadow-[0_0_20px_rgba(155,135,245,0.2)]">
                {getGameBrief()}
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
          
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <span>{players} active players</span>
            <span className="mx-2">•</span>
            <span>Prize: {prize}</span>
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/pools?game=${type}`)}
          className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-secondary hover:bg-secondary/80"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default GameModule;
