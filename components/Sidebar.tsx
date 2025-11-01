import React from 'react';
import ElementCard from './ElementCard';
import { Element } from '../types';

interface SidebarProps {
  elements: Element[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, element: Element) => void;
  onClear: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ elements, onDragStart, onClear }) => {
  const sortedElements = [...elements].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <div className="p-4 border-b-2 border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">November</h1>
        <p className="text-sm text-gray-500">Combine any two elements.</p>
      </div>
      <div className="flex-grow overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-2">
          {sortedElements.map((element) => (
            <ElementCard
              key={element.name}
              element={element}
              onDragStart={(e) => onDragStart(e, element)}
            />
          ))}
        </div>
      </div>
      <div className="p-4 border-t-2 border-gray-200">
        <button
          onClick={onClear}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
