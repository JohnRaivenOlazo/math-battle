
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Character from './Character';
import MultiplicationTable from './MultiplicationTable';
import BattleFeedback from './BattleFeedback';
import { 
  calculateRussianPeasant, 
  checkSelectedRows,
  calculateDamage,
  calculateScore,
  generateNumbers,
  getAnswerFeedback,
  GameState,
  Character as CharacterType,
  levelUpCharacter
} from '../utils/gameLogic';
import { 
  playAttackAnimation,
  showDamageNumber,
  animateHealthBar,
  playVictoryAnimation,
  playDefeatAnimation
} from '../utils/animations';
import { useIsMobile } from '../hooks/use-mobile';

interface BattleArenaProps {
  playerCharacter: CharacterType;
  opponentCharacter: CharacterType;
  difficulty: 'easy' | 'medium' | 'hard';
  updateScore: (points: number) => void;
  updateStreak: (increasedStreak: number) => void;
  updateGameState: (state: GameState) => void;
  gameState: GameState;
  onRoundComplete: () => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({
  playerCharacter,
  opponentCharacter,
  difficulty,
  updateScore,
  updateStreak,
  updateGameState,
  gameState,
  onRoundComplete
}) => {
  const isMobile = useIsMobile();
  
  // References for animation targets
  const playerRef = useRef<HTMLDivElement>(null);
  const opponentRef = useRef<HTMLDivElement>(null);
  
  // Game state
  const [numbers, setNumbers] = useState<[number, number]>([0, 0]);
  const [steps, setSteps] = useState<Array<{left: number, right: number, include: boolean}>>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isPlayerAttacking, setIsPlayerAttacking] = useState(false);
  const [isOpponentAttacking, setIsOpponentAttacking] = useState(false);
  const [timeBonus, setTimeBonus] = useState(10);
  const [timerActive, setTimerActive] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState<{text: string, type: 'info' | 'success' | 'error' | 'critical' | 'special'} | null>(null);
  const [battleLog, setBattleLog] = useState<{text: string, timestamp: number}[]>([]);
  
  // Player and opponent state
  const [player, setPlayer] = useState<CharacterType>(playerCharacter);
  const [opponent, setOpponent] = useState<CharacterType>(opponentCharacter);
  
  // Generate a new problem
  const generateNewProblem = useCallback(() => {
    const [a, b] = generateNumbers(difficulty);
    setNumbers([a, b]);
    
    const { steps: newSteps } = calculateRussianPeasant(a, b);
    setSteps(newSteps);
    
    setSelectedIndices([]);
    setTimeBonus(10);
    setTimerActive(true);
    updateGameState('playing');
    
    // Add battle log entry
    addToBattleLog(`New challenge: ${a} × ${b}`);
  }, [difficulty, updateGameState]);
  
  // Generate a new problem when the component mounts or when the round changes
  useEffect(() => {
    if (gameState === 'intro' || gameState === 'playing') {
      generateNewProblem();
    }
  }, [difficulty, gameState, generateNewProblem]);
  
  // Timer for time bonus
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (timerActive && timeBonus > 0 && gameState === 'playing') {
      timer = setInterval(() => {
        setTimeBonus(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, gameState, timeBonus]);

  
  // Add to battle log
  const addToBattleLog = (text: string) => {
    setBattleLog(prev => [
      { text, timestamp: Date.now() },
      ...prev.slice(0, 9) // Keep only the last 10 entries
    ]);
  };
  
  // Handle row selection
  const handleRowSelect = (index: number) => {
    if (gameState !== 'playing') return;
    
    setSelectedIndices(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };
  
  // Submit answer
  const handleSubmit = () => {
    setTimerActive(false);
    updateGameState('checking');
    
    // Check if the answer is correct
    const isCorrect = checkSelectedRows(selectedIndices, steps);
    
    setTimeout(() => {
      if (isCorrect) {
        // Calculate damage and update score
        const { damage, isCritical } = calculateDamage(numbers[0], numbers[1], timeBonus);
        const { score, multiplier } = calculateScore(damage, timeBonus, currentStreak, isCritical);
        
        // Build feedback message
        let messageText = `Correct! ${damage} damage`;
        let messageType: 'success' | 'critical' = 'success';
        
        if (isCritical) {
          messageText = `CRITICAL HIT! ${damage} damage!`;
          messageType = 'critical';
          addToBattleLog(`Critical hit! ${damage} damage dealt!`);
        } else {
          addToBattleLog(`Correct! ${damage} damage dealt.`);
        }
        
        if (multiplier > 1) {
          messageText += ` (${multiplier.toFixed(1)}x combo!)`;
        }
        
        setFeedbackMessage({ text: messageText, type: messageType });
        
        // Update streak
        const newStreak = currentStreak + 1;
        setCurrentStreak(newStreak);
        updateStreak(newStreak);
        
        // Update score
        updateScore(score);
        
        // Update game state
        updateGameState('correct');
        
        // Player attacks
        setIsPlayerAttacking(true);
        
        // Update opponent health
        const newHealth = Math.max(0, opponent.currentHealth - damage);
        
        // Play attack animation
        if (playerRef.current && opponentRef.current) {
          playAttackAnimation(playerRef.current, opponentRef.current, () => {
            // Show damage number
            if (opponentRef.current) {
              showDamageNumber(opponentRef.current, damage, false);
            }
            
            // Update opponent health
            setOpponent(prev => ({
              ...prev,
              currentHealth: newHealth
            }));
            
            // Animate health bar
            if (opponentRef.current) {
              const healthBar = opponentRef.current.querySelector('.health-bar div') as HTMLElement;
              if (healthBar) {
                animateHealthBar(healthBar, (newHealth / opponent.maxHealth) * 100);
              }
            }
            
            setIsPlayerAttacking(false);
            
            // Check if opponent is defeated
            if (newHealth <= 0) {
              if (opponentRef.current) {
                playDefeatAnimation(opponentRef.current);
              }
              if (playerRef.current) {
                playVictoryAnimation(playerRef.current);
              }
              
              // Level up player
              const leveledUpPlayer = levelUpCharacter(player);
              setPlayer(leveledUpPlayer);
              
              setFeedbackMessage({
                text: `Victory! You leveled up to level ${leveledUpPlayer.level}!`,
                type: 'success'
              });
              
              addToBattleLog(`Victory! You defeated ${opponent.name} and reached level ${leveledUpPlayer.level}!`);
              
              updateGameState('victory');
            } else {
              // Next round
              setTimeout(() => {
                onRoundComplete();
              }, 1500);
            }
          });
        }
      } else {
        // Get feedback on why answer was wrong
        const feedback = getAnswerFeedback(selectedIndices, steps);
        setFeedbackMessage({ 
          text: `Incorrect. ${feedback}`, 
          type: 'error' 
        });
        
        addToBattleLog(`Incorrect answer. Enemy preparing counter-attack!`);
        
        // Reset streak
        setCurrentStreak(0);
        updateStreak(0);
        
        // Update game state
        updateGameState('wrong');
        
        // Opponent attacks
        setIsOpponentAttacking(true);
        
        // Calculate damage
        const damage = opponent.attack - Math.floor(player.defense / 2);
        const actualDamage = Math.max(5, damage);
        
        // Update player health
        const newHealth = Math.max(0, player.currentHealth - actualDamage);
        
        // Play attack animation
        if (opponentRef.current && playerRef.current) {
          playAttackAnimation(opponentRef.current, playerRef.current, () => {
            // Show damage number
            if (playerRef.current) {
              showDamageNumber(playerRef.current, actualDamage);
            }
            
            // Update player health
            setPlayer(prev => ({
              ...prev,
              currentHealth: newHealth
            }));
            
            // Animate health bar
            if (playerRef.current) {
              const healthBar = playerRef.current.querySelector('.health-bar div') as HTMLElement;
              if (healthBar) {
                animateHealthBar(healthBar, (newHealth / player.maxHealth) * 100);
              }
            }
            
            setIsOpponentAttacking(false);
            
            // Check if player is defeated
            if (newHealth <= 0) {
              if (playerRef.current) {
                playDefeatAnimation(playerRef.current);
              }
              if (opponentRef.current) {
                playVictoryAnimation(opponentRef.current);
              }
              
              setFeedbackMessage({
                text: `Defeat! You've been vanquished...`,
                type: 'error'
              });
              
              addToBattleLog(`Defeat! You have been vanquished by ${opponent.name}.`);
              
              updateGameState('defeat');
            } else {
              // Next round
              setTimeout(() => {
                onRoundComplete();
              }, 1500);
            }
          });
        }
      }
    }, 1000);
  };
  
  // Handle feedback dismiss
  const handleFeedbackDismiss = () => {
    setFeedbackMessage(null);
  };
  
  // Reset game
  const resetGame = () => {
    setPlayer(playerCharacter);
    setOpponent(opponentCharacter);
    setCurrentStreak(0);
    setBattleLog([]);
    updateStreak(0);
    updateGameState('intro');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-6">
      {/* Feedback display */}
      {feedbackMessage && (
        <BattleFeedback 
          message={feedbackMessage.text}
          type={feedbackMessage.type}
          onDismiss={handleFeedbackDismiss}
        />
      )}
      
      <div className="mb-8">
        <div className="flex flex-col xl:flex-row gap-6 items-stretch">
          {/* Main battle area with glow effect */}
          <div className="w-full xl:w-2/3 relative bg-black/40 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-game-primary/30 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <div className="absolute -z-10 inset-0 overflow-hidden blur-2xl opacity-10">
              <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-game-primary rounded-full transform translate-x-1/4 translate-y-1/4"></div>
              <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-game-secondary rounded-full transform -translate-x-1/4 -translate-y-1/4"></div>
            </div>
            
            <div className="text-center mb-6">
              <div className="text-2xl sm:text-3xl font-bold font-pixel mb-2">
                <span className="text-game-primary">{numbers[0]}</span> 
                <span className="text-white mx-2">×</span> 
                <span className="text-game-secondary">{numbers[1]}</span> 
                <span className="text-white mx-2">=</span> 
                <span className="text-game-accent">{numbers[0] * numbers[1]}</span>
              </div>
              
              {(gameState === 'playing' || gameState === 'checking') && (
                <div className="bg-black/30 backdrop-blur-sm rounded-lg p-2 mb-2 w-full max-w-xs mx-auto">
                  <div className="font-bold text-md mb-1 text-white/90">Time Bonus: {timeBonus}</div>
                  <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-1000"
                      style={{ 
                        width: `${(timeBonus / 10) * 100}%`,
                        background: `linear-gradient(to right, #8B5CF6, #F97316)`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Characters section */}
            <div className={`${isMobile ? 'flex flex-col gap-6' : 'grid grid-cols-2 gap-6'} mb-6`}>
              {/* Player Character */}
              <div ref={playerRef} className="flex justify-center">
                <Character 
                  character={player}
                  isPlayer={true}
                  isAttacking={isPlayerAttacking}
                  isDamaged={isOpponentAttacking}
                  victorious={gameState === 'victory'}
                  defeated={gameState === 'defeat'}
                />
              </div>
              
              {/* Opponent Character */}
              <div ref={opponentRef} className="flex justify-center">
                <Character 
                  character={opponent}
                  isPlayer={false}
                  isAttacking={isOpponentAttacking}
                  isDamaged={isPlayerAttacking}
                  victorious={gameState === 'defeat'}
                  defeated={gameState === 'victory'}
                />
              </div>
            </div>
            
            {/* Multiplication Table with improved visuals */}
            <div className="overflow-x-auto mb-6 bg-black/30 backdrop-blur-sm rounded-lg p-2 sm:p-4 border border-white/10">
              <MultiplicationTable
                steps={steps}
                selectedIndices={selectedIndices}
                isSelectable={gameState === 'playing'}
                isShowingAnswer={gameState === 'correct' || gameState === 'wrong'}
                onSelectRow={handleRowSelect}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              {gameState === 'playing' && (
                <button
                  onClick={() => handleSubmit()}
                  className="px-8 py-3 bg-gradient-to-r from-game-primary to-game-secondary text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                >
                  Submit Answer
                </button>
              )}
              
              {(gameState === 'victory' || gameState === 'defeat') && (
                <button
                  onClick={resetGame}
                  className="px-8 py-3 bg-gradient-to-r from-game-accent to-orange-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(249,115,22,0.3)] hover:shadow-[0_0_20px_rgba(249,115,22,0.5)]"
                >
                  Play Again
                </button>
              )}
            </div>
          </div>
          
          {/* Battle log section */}
          <div className="w-full xl:w-1/3">
            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-game-secondary/30 shadow-[0_0_20px_rgba(217,70,239,0.2)] h-full">
              <h3 className="font-pixel text-lg mb-3 text-transparent bg-clip-text bg-gradient-to-r from-game-primary to-game-secondary border-b border-white/10 pb-2">Battle Log</h3>
              
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {battleLog.map((log, index) => (
                  <div key={index} className="text-sm text-white/80 border-b border-white/5 pb-2 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <span className="text-white/50 mr-2 font-mono text-xs">[{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                    {log.text}
                  </div>
                ))}
                {battleLog.length === 0 && (
                  <div className="text-sm text-white/40 italic">Waiting for the battle to begin...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleArena;
