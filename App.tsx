import React, { useState, useRef, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { Element, PlacedElement, DraggedData } from './types';
import { INITIAL_ELEMENTS, NOVEMBER_ELEMENT, ELEMENT_WIDTH, ELEMENT_HEIGHT } from './constants';

const LOCAL_STORAGE_KEY = 'november-game-state';

function App() {
  const [sidebarElements, setSidebarElements] = useState<Element[]>(INITIAL_ELEMENTS);
  const [placedElements, setPlacedElements] = useState<PlacedElement[]>([]);
  const [zCounter, setZCounter] = useState<number>(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const { sidebar, placed, z } = JSON.parse(savedState);
        if (sidebar && placed && z) {
          setSidebarElements(sidebar);
          setPlacedElements(placed);
          setZCounter(z);
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      const stateToSave = JSON.stringify({
        sidebar: sidebarElements,
        placed: placedElements,
        z: zCounter,
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, stateToSave);
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [sidebarElements, placedElements, zCounter]);

  const handleSidebarDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, element: Element) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const draggedData: DraggedData = {
      element,
      source: 'sidebar',
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(draggedData));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleCanvasElementDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, element: PlacedElement) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const draggedData: DraggedData = {
      element,
      source: 'canvas',
      id: element.id,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    };
    e.dataTransfer.setData('application/json', JSON.stringify(draggedData));
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const canvasBounds = canvasRef.current?.getBoundingClientRect();
    if (!canvasBounds) return;

    const draggedData: DraggedData = JSON.parse(e.dataTransfer.getData('application/json'));
    const { element, source, id, offsetX, offsetY } = draggedData;

    const x = e.clientX - canvasBounds.left - offsetX;
    const y = e.clientY - canvasBounds.top - offsetY;

    const isColliding = (elemX: number, elemY: number, target: PlacedElement) => {
      return (
        elemX < target.x + ELEMENT_WIDTH &&
        elemX + ELEMENT_WIDTH > target.x &&
        elemY < target.y + ELEMENT_HEIGHT &&
        elemY + ELEMENT_HEIGHT > target.y
      );
    };

    const targetElement = placedElements.find(
      (p) => p.id !== id && isColliding(x, y, p)
    );

    if (targetElement) {
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      
      const newNovember: PlacedElement = {
        ...NOVEMBER_ELEMENT,
        id: crypto.randomUUID(),
        x: targetElement.x,
        y: targetElement.y,
        z: nextZ,
      };

      setPlacedElements(prev => [
        ...prev.filter(p => p.id !== targetElement.id && p.id !== id),
        newNovember
      ]);
      
      if (!sidebarElements.some(el => el.name === NOVEMBER_ELEMENT.name)) {
        setSidebarElements(prev => [...prev, NOVEMBER_ELEMENT]);
      }
    } else {
      const nextZ = zCounter + 1;
      setZCounter(nextZ);
      
      if (source === 'sidebar') {
        const newElement: PlacedElement = {
          ...element,
          id: crypto.randomUUID(),
          x,
          y,
          z: nextZ,
        };
        setPlacedElements(prev => [...prev, newElement]);
      } else if (source === 'canvas' && id) {
        setPlacedElements(prev => 
          prev.map(p => (p.id === id ? { ...p, x, y, z: nextZ } : p))
        );
      }
    }
  }, [placedElements, sidebarElements, zCounter]);

  const handleClearCanvas = useCallback(() => {
    setPlacedElements([]);
    setSidebarElements(INITIAL_ELEMENTS);
    setZCounter(1);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen font-sans bg-gray-100 text-gray-800 overflow-hidden">
      <main ref={canvasRef} className="flex-grow h-full relative">
        <div className="absolute top-4 left-4 text-xl font-bold tracking-widest text-gray-800 select-none">
          NOVEMBER.CRAFT
        </div>
        <Canvas
          elements={placedElements}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onElementDragStart={handleCanvasElementDragStart}
        />
      </main>
      <aside className="w-full md:w-80 border-t-2 md:border-t-0 md:border-l-2 border-gray-200 bg-gray-50 flex-shrink-0 h-1/3 md:h-full">
        <Sidebar
          elements={sidebarElements}
          onDragStart={handleSidebarDragStart}
          onClear={handleClearCanvas}
        />
      </aside>
    </div>
  );
}

export default App;
