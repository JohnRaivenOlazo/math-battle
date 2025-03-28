
import React, { useEffect, useRef, useState } from 'react';
import TableRow from './TableRow';
import { highlightNumber } from '../utils/animations';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { Checkbox } from './ui/checkbox';

interface MultiplicationTableProps {
  steps: Array<{left: number, right: number, include: boolean}>;
  selectedIndices: number[];
  isSelectable: boolean;
  isShowingAnswer: boolean;
  onSelectRow: (index: number) => void;
}

const MultiplicationTable: React.FC<MultiplicationTableProps> = ({
  steps,
  selectedIndices,
  isSelectable,
  isShowingAnswer,
  onSelectRow
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [autoSelect, setAutoSelect] = useState(false);
  
  // Add entrance animation effect
  useEffect(() => {
    if (tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tr');
      rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          row.style.transition = 'all 0.3s ease-out';
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
      });
    }
  }, [steps]);
  
  // Add number highlight effect when showing answer
  useEffect(() => {
    if (isShowingAnswer && tableRef.current) {
      const includedCells = tableRef.current.querySelectorAll('.included-cell');
      includedCells.forEach((cell, index) => {
        setTimeout(() => {
          highlightNumber(cell as HTMLElement);
        }, index * 200);
      });
    }
  }, [isShowingAnswer]);

  // Auto-select rows with odd left numbers when autoSelect is enabled
  useEffect(() => {
    if (autoSelect && isSelectable) {
      const oddIndices = steps
        .map((step, index) => step.left % 2 !== 0 ? index : -1)
        .filter(index => index !== -1);
      
      oddIndices.forEach(index => {
        if (!selectedIndices.includes(index)) {
          onSelectRow(index);
        }
      });
    }
  }, [autoSelect, isSelectable, steps, selectedIndices, onSelectRow]);

  return (
    <div className="space-y-4">
      <div 
        ref={tableRef}
        className="overflow-hidden rounded-lg bg-black/60 backdrop-blur-md pixel-border-sm animate-scale-in max-h-[380px] relative"
      >
        {/* Decorative crystal elements */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-game-primary transform rotate-45 opacity-80"></div>
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-game-secondary transform rotate-45 opacity-80"></div>
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-game-accent transform rotate-45 opacity-80"></div>
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-game-primary transform rotate-45 opacity-80"></div>
        
        {/* Magic runes background effect */}
        <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute text-white text-lg font-mono"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: 0.5 + Math.random() * 0.5,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite alternate`
              }}
            >
              {['×', '+', '÷', '−', '∑', '√', '∞', 'Ω', 'Δ', '∇', '⌘', '⍟', '⌬', '⎔', '⟁', '⟒', '⧉', '⧮', '⨁', '✧'][i % 20]}
            </div>
          ))}
        </div>
        
        <div className="bg-gradient-to-b from-game-primary/20 to-transparent">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-game-primary via-game-secondary to-game-primary text-white font-pixel z-10">
              <tr>
                <th className="pt-1 pb-0.5 font-pixel text-xl relative">
                  <span className="relative z-10 inline-block transform hover:scale-110 transition-transform">Halve</span>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"></div>
                </th>
                <th className="pt-1 pb-0.5 font-pixel text-xl relative">
                  <span className="relative z-10 inline-block transform hover:scale-110 transition-transform">Double</span>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"></div>
                </th>
                <th className="pt-1 pb-0.5 px-4 font-pixel text-xl relative">
                  <span className="relative z-10 inline-block transform hover:scale-110 transition-transform">Include?</span>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20"></div>
                </th>
              </tr>
            </thead>
            <tbody className="relative text-white">
              {steps.map((step, index) => (
                <TableRow
                  key={index}
                  index={index}
                  left={step.left}
                  right={step.right}
                  isSelectable={isSelectable}
                  isSelected={selectedIndices.includes(index)}
                  isCorrectAnswer={step.include}
                  isShowingAnswer={isShowingAnswer}
                  onSelect={onSelectRow}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Magical glow effect around the table */}
        <div className="absolute inset-0 pointer-events-none rounded-lg" 
          style={{ 
            boxShadow: isShowingAnswer 
              ? 'inset 0 0 30px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.3)'
              : 'inset 0 0 15px rgba(139, 92, 246, 0.3), 0 0 10px rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            transition: 'all 0.3s ease-in-out'
          }}>
        </div>
      </div>

      {/* Learning assist features */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-2">
        <div className="flex items-center space-x-2">
          {isSelectable && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auto-select" 
                checked={autoSelect}
                onCheckedChange={(checked) => setAutoSelect(checked as boolean)}
                className="data-[state=checked]:bg-game-accent data-[state=checked]:text-white border-game-accent"
              />
              <label htmlFor="auto-select" className="text-sm cursor-pointer text-white/80 hover:text-white transition-colors">
                Hint
              </label>
            </div>
          )}
        </div>

        <Collapsible 
          open={showExplanation} 
          onOpenChange={setShowExplanation}
          className="w-full md:w-2/3 bg-black/40 rounded-lg p-2"
        >
          <CollapsibleTrigger className="flex items-center justify-center w-full text-sm text-game-accent hover:text-game-accent/80 transition-colors">
            <span>{showExplanation ? 'Hide Explanation' : 'Show Explanation'}</span>
            <svg 
              className={`ml-1 h-4 w-4 transition-transform ${showExplanation ? 'rotate-180' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24"
            >
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6 9 6 6 6-6"/>
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent className="text-sm text-white/80 p-2 space-y-2 animate-accordion-down">
            <p className="leading-relaxed">
              <span className="text-game-accent font-bold">Russian Peasant Multiplication</span> is an ancient method that uses binary principles:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>The left column shows halving (rounded down) until we reach 1</li>
              <li>The right column shows doubling</li>
              <li>We only include rows where the left number is odd</li>
              <li>The sum of the included right numbers equals our multiplication result</li>
            </ul>
            <p className="italic mt-2 text-game-accent">Tip: This works because every number can be expressed as a sum of powers of 2!</p>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default MultiplicationTable;
