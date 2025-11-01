import React from 'react';
import { Element } from '../types';

interface ElementCardProps {
  element: Element;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
}

const ElementCard: React.FC<ElementCardProps> = ({ element, onDragStart }) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    onDragStart(e);
    // Optional: Add a custom drag image
    // e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="flex items-center justify-center w-[120px] h-[48px] px-3 py-2 bg-gray-50 rounded-lg shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing transition-all duration-150 hover:shadow-md hover:border-blue-400 hover:-translate-y-0.5"
    >
      <span className="text-xl mr-2 select-none" role="img" aria-label={element.name}>{element.emoji}</span>
      <span className="font-medium text-sm text-gray-800 select-none truncate">{element.name}</span>
    </div>
  );
};

export default ElementCard;
