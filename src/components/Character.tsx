
import React, { useRef, useEffect } from 'react';
import { Character as CharacterType } from '../utils/gameLogic';

interface CharacterProps {
  character: CharacterType;
  isPlayer: boolean;
  isAttacking: boolean;
  isDamaged: boolean;
  victorious?: boolean;
  defeated?: boolean;
}

const Character: React.FC<CharacterProps> = ({ 
  character, 
  isPlayer, 
  isAttacking,
  isDamaged,
  victorious,
  defeated
}) => {
  const characterRef = useRef<HTMLDivElement>(null);
  const healthRef = useRef<HTMLDivElement>(null);
  
  // Health percentage
  const healthPercentage = Math.max(0, Math.floor((character.currentHealth / character.maxHealth) * 100));
  
  // Health bar color based on health percentage
  const getHealthColor = () => {
    if (healthPercentage > 70) return 'bg-gradient-to-r from-emerald-400 to-cyan-400';
    if (healthPercentage > 30) return 'bg-gradient-to-r from-yellow-400 to-amber-400';
    return 'bg-gradient-to-r from-red-500 to-rose-500';
  };

  return (
    <div 
      ref={characterRef}
      className={`relative flex flex-col items-center transition-all ${
        isPlayer ? 'order-1' : 'order-2'
      } ${
        isAttacking ? 'animate-attack' : ''
      } ${
        isDamaged ? 'animate-damage' : ''
      } ${
        victorious ? 'animate-float' : ''
      } ${
        defeated ? 'animate-crystal-shatter' : ''
      }`}
    >
      {/* Character Card */}
      <div className={`w-full sm:max-w-[200px] ${isPlayer ? 'bg-game-primary/10' : 'bg-game-secondary/10'} 
        backdrop-blur-md rounded-xl p-3 sm:p-4 border border-white/10 
        shadow-[0_0_15px_rgba(139,92,246,0.2)]
        ${victorious ? 'animate-glow' : ''}
        ${defeated ? 'opacity-50' : ''}`}>
        
        {/* Character Name */}
        <div className="font-bold text-lg sm:text-xl mb-2 text-center">
          <span className={`${isPlayer ? 'text-game-primary' : 'text-game-secondary'} ${victorious ? 'text-glow' : ''}`}>
            {character.name}
          </span>
          <span className="text-xs ml-1 text-game-accent">Lv.{Math.floor(character.level)}</span>
        </div>
        
        {/* HP Text */}
        <div className="text-xs sm:text-sm font-mono mb-1 text-white/80 flex justify-between">
          <span>HP:</span>
          <span>{character.currentHealth} / {character.maxHealth}</span>
        </div>
        
        {/* Health Bar with modern style */}
        <div className="health-bar w-full h-3 sm:h-4 bg-black/50 rounded-full mb-3 overflow-hidden relative">
          <div 
            ref={healthRef}
            className={`h-full ${getHealthColor()} transition-all duration-500`} 
            style={{ width: `${healthPercentage}%` }}
          />
          <div className="absolute inset-0 shadow-inner"></div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm bg-black/20 p-2 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-white/60">Attack</span>
            <span className="text-white font-mono">{character.attack}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">Defense</span>
            <span className="text-white font-mono">{character.defense}</span>
          </div>
        </div>
        
        {/* Status indicators - Using temporary animation only */}
        {isDamaged && (
          <div className="absolute inset-0 bg-red-500/20 animate-[damage-flash_0.5s_ease-in-out] rounded-xl" />
        )}
        
        {isAttacking && (
          <div className="absolute inset-0 bg-game-primary/10 rounded-xl" />
        )}
        
        {victorious && (
          <div className="absolute inset-0 bg-gradient-to-r from-game-primary/0 via-game-primary/20 to-game-primary/0 animate-shine rounded-xl" />
        )}
      </div>
    </div>
  );
};

export default Character;
