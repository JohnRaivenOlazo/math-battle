'use client'
import React, { useRef, useEffect } from 'react';
import { animateRowSelection } from '../utils/animations';

interface TableRowProps {
  index: number;
  left: number;
  right: number;
  isSelectable: boolean;
  isSelected: boolean;
  isCorrectAnswer: boolean;
  isShowingAnswer: boolean;
  onSelect: (index: number) => void;
}

const TableRow: React.FC<TableRowProps> = ({
  index,
  left,
  right,
  isSelectable,
  isSelected,
  isCorrectAnswer,
  isShowingAnswer,
  onSelect
}) => {
  const rowRef = useRef<HTMLTableRowElement>(null);
  
  // Apply animation when selected state changes
  useEffect(() => {
    if (rowRef.current) {
      animateRowSelection(rowRef.current, isSelected);
    }
  }, [isSelected]);

  // Determine background color for indication
  const getRowBgColor = () => {
    if (!isShowingAnswer) return '';
    
    if (isCorrectAnswer) {
      return isSelected ? 'bg-green-500/30' : 'bg-red-500/30';
    } else {
      return isSelected ? 'bg-red-500/30' : '';
    }
  };

  return (
    <tr 
      ref={rowRef}
      className={`border-b border-gray-700/30 transition-colors ${
        isSelectable ? 'cursor-pointer hover:bg-game-primary/10' : ''
      } ${
        isSelected ? 'bg-game-primary/20' : ''
      } ${
        getRowBgColor()
      }`}
      onClick={() => isSelectable && onSelect(index)}
    >
      <td className="py-2 px-4 text-center border-r border-gray-700/30">
        {left}
        {left % 2 !== 0 && isShowingAnswer && (
          <span className="ml-2 text-game-success">★</span>
        )}
      </td>
      <td className="py-2 px-4 text-center">
        {right}
      </td>
      <td className="py-2 px-4 text-center border-l border-gray-700/30">
        {isSelected ? (
          <span className="inline-block w-5 h-5 bg-game-primary rounded-sm"></span>
        ) : (
          <span className="inline-block w-5 h-5 border-2 border-gray-500 rounded-sm"></span>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
