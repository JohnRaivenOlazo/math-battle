import React from 'react';
import { GameState } from '../utils/gameLogic';

interface GameHeaderProps {
  gameState: GameState;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gameState }) => {
  const renderInstructions = () => {
    switch (gameState) {
      case 'intro':
        return "Prepare for the math duel! Choose rows with odd numbers in the left column.";
      case 'playing':
        return "Select the rows where the left number is ODD. These are the ones that count!";
      case 'checking':
        return "Checking your answer...";
      case 'correct':
        return "Correct! Great job! You dealt damage to your opponent.";
      case 'wrong':
        return "Oh no! That's not right. Your opponent gets to attack.";
      case 'opponentTurn':
        return "Your opponent is calculating their next move...";
      case 'victory':
        return "Victory! You've won the math duel!";
      case 'defeat':
        return "Defeat! Better luck next time.";
      default:
        return "Russian Peasant Multiplication: Select rows with odd numbers on the left.";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 text-center animate-fade-in">      
      <div className="bg-black/30 backdrop-blur-sm p-3 rounded text-white text-xl animate-pulse-subtle">
        {renderInstructions()}
      </div>
    </div>
  );
};

export default GameHeader;
