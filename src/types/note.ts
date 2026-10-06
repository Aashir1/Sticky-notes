export interface Note {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // stacking order — the note being dragged gets the highest value so it renders on top
  text?: string;
}

export type NoteBounds = Pick<DOMRect, "left" | "top" | "width" | "height">;
