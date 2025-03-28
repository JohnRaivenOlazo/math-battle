
import React from 'react';
import { GameState } from '../utils/gameLogic';

interface GameHeaderProps {
  gameState: GameState;
  score: number;
  streak: number;
  round: number;
}

const GameHeader: React.FC<GameHeaderProps> = ({ gameState, score, streak, round }) => {
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
      <div className="flex justify-between items-center px-4 py-2 bg-black/20 backdrop-blur-sm rounded mb-2">
        <div className="flex items-center space-x-4">
          <div className="text-xl text-white">
            <span className="text-game-secondary">Round:</span> {round}
          </div>
          <div className="text-xl text-white">
            <span className="text-game-secondary">Streak:</span> {streak}
          </div>
        </div>
        <div className="text-2xl font-bold text-white">
          <span className="text-game-secondary">Score:</span> {score}
        </div>
      </div>
      
      <div className="bg-black/30 backdrop-blur-sm p-3 rounded text-white text-xl animate-pulse-subtle">
        {renderInstructions()}
      </div>
    </div>
  );
};

export default GameHeader;
