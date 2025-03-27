
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';

interface BattleFeedbackProps {
  message: string;
  type: 'info' | 'success' | 'error' | 'critical' | 'special';
  duration?: number;
  onDismiss?: () => void;
}

const BattleFeedback: React.FC<BattleFeedbackProps> = ({ 
  message, 
  type, 
  duration = 3000,
  onDismiss 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onDismiss]);
  
  if (!isVisible) return null;
  
  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-game-success/80 to-game-success/40 border-game-success';
      case 'error':
        return 'bg-gradient-to-r from-game-damage/80 to-game-damage/40 border-game-damage';
      case 'critical':
        return 'bg-gradient-to-r from-yellow-600/80 to-yellow-500/40 border-yellow-500 text-yellow-200';
      case 'special':
        return 'bg-gradient-to-r from-indigo-600/80 to-purple-500/40 border-indigo-400 text-indigo-200';
      case 'info':
      default:
        return 'bg-gradient-to-r from-game-primary/80 to-game-secondary/40 border-game-primary';
    }
  };
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in w-full max-w-md">
      <Card className={`pixel-border-sm ${getTypeStyles()} p-2 backdrop-blur-md text-white shadow-lg`}>
        <CardContent className="p-2 text-center">
          <p className="font-pixel text-lg">{message}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BattleFeedback;
