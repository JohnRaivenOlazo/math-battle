"use client"
import React, { useState, useEffect } from 'react';
import GameHeader from '../components/GameHeader';
import BattleArena from '../components/BattleArena';
import Loader from '../components/Loader';
import { GameState, createCharacter } from '../utils/gameLogic';
import { useIsMobile } from '../hooks/use-mobile';

const Home = () => {
  const isMobile = useIsMobile();
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Game state
  const [gameState, setGameState] = useState<GameState>('intro');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  
  // Character state (simplified)
  const [playerCharacter, setPlayerCharacter] = useState(createCharacter('Peasant', difficulty));
  const [opponentCharacter, setOpponentCharacter] = useState(createCharacter('Enemy', difficulty));
  
  // Reset game
  const resetGame = React.useCallback(() => {
    setGameState('intro');
    setPlayerCharacter(createCharacter('Peasant', difficulty));
    setOpponentCharacter(createCharacter('Enemy', difficulty));
  }, [difficulty]);

  // Set up the game on initial load
  useEffect(() => {
    resetGame();
  }, [difficulty, resetGame]);
  
  // Handle difficulty change
  const handleDifficultyChange = (newDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(newDifficulty);
  };
  
  // Start game
  const startGame = () => {
    setGameState('playing');
  };
  
  // Handle round completion
  const handleRoundComplete = () => {
    setGameState('playing');
  };

  // Handle loader completion
  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <Loader onComplete={handleLoaderComplete} />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-game-dark to-black py-4 sm:py-8 overflow-x-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5QzkyQUMiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2LTRoLTJ2NGgtNHYyaDR2NGgydi00aDR2LTJoLTR6bTAtMzBWMGgtMnY0aC00djJoNHY0aDJWNmg0VjRoLTR6TTYgMzR2LTRINHY0SDB2Mmg0djRoMnYtNGg0di0ySDZ6TTYgNFYwSDR2NEgwdjJoNHY0aDJWNmg0VjRINnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-5 pointer-events-none"></div>
          
          {/* Game Header */}
          <div className="px-2 sm:px-4 max-w-7xl mx-auto">
            <GameHeader 
              gameState={gameState}
            />
          </div>
          
          {/* Introduction Screen */}
          {gameState === 'intro' && (
            <div className="max-w-4xl mx-auto px-4 my-4 sm:my-8 text-center animate-scale-in relative z-10">
              <div className="absolute inset-0 bg-gradient-crystal opacity-5 blur-xl rounded-xl"></div>
              
              <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-game-primary via-game-secondary to-game-accent">Russian Peasant Multiplication</h2>
              
              <div className="relative bg-black/40 backdrop-blur-md rounded-xl p-6 sm:p-8 mb-6 border border-game-primary/20 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-game-primary to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-game-accent to-transparent"></div>
                
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-secondary">Choose Difficulty:</h3>
                  <div className={`flex ${isMobile ? 'flex-col space-y-3' : 'justify-center space-x-6'}`}>
                    <button 
                      onClick={() => handleDifficultyChange('easy')}
                      className={`px-6 py-3 rounded-lg transition-all transform ${
                        difficulty === 'easy' 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-105' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:scale-105'
                      }`}
                    >
                      Easy
                    </button>
                    <button 
                      onClick={() => handleDifficultyChange('medium')}
                      className={`px-6 py-3 rounded-lg transition-all transform ${
                        difficulty === 'medium' 
                          ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-105' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:scale-105'
                      }`}
                    >
                      Medium
                    </button>
                    <button 
                      onClick={() => handleDifficultyChange('hard')}
                      className={`px-6 py-3 rounded-lg transition-all transform ${
                        difficulty === 'hard' 
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.5)] scale-105' 
                          : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:scale-105'
                      }`}
                    >
                      Hard
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={startGame}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-game-primary via-game-secondary to-game-accent text-white font-bold text-lg rounded-lg shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all transform hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
                >
                  <span className="relative z-10">Fight!</span>
                </button>
              </div>
              
              {/* Visual elements */}
              <div className="absolute -top-10 -left-10 w-20 h-20 bg-game-primary/10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-20 h-20 bg-game-accent/10 rounded-full blur-xl"></div>
            </div>
          )}
          
          {/* Battle Arena */}
          {gameState !== 'intro' && (
            <BattleArena
              playerCharacter={playerCharacter}
              opponentCharacter={opponentCharacter}
              difficulty={difficulty}
              updateGameState={setGameState}
              gameState={gameState}
              onRoundComplete={handleRoundComplete}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
