import React from 'react';
import { PlacedElement } from '../types';
import ElementCard from './ElementCard';

interface CanvasProps {
  elements: PlacedElement[];
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onElementDragStart: (e: React.DragEvent<HTMLDivElement>, element: PlacedElement) => void;
}

const Canvas: React.FC<CanvasProps> = ({ elements, onDragOver, onDrop, onElementDragStart }) => {
  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="w-full h-full bg-white relative overflow-hidden"
    >
      {elements.map((element) => (
        <div
          key={element.id}
          className="absolute transition-all duration-100 ease-out"
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            zIndex: element.z,
          }}
        >
          <ElementCard
            element={element}
            onDragStart={(e) => onElementDragStart(e, element)}
          />
        </div>
      ))}
    </div>
  );
};

export default Canvas;
