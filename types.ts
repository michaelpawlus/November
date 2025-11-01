export interface Element {
  name: string;
  emoji: string;
}

export interface PlacedElement extends Element {
  id: string;
  x: number;
  y: number;
  z: number;
}

export interface DraggedData {
  element: Element;
  source: 'sidebar' | 'canvas';
  id?: string;
  offsetX: number;
  offsetY: number;
}
