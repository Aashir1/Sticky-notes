import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import type { Note, NoteBounds } from "../../types/note";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

// A note can never be resized smaller than this, so it stays usable.
const MIN_WIDTH = 160;
const MIN_HEIGHT = 140;

// How long to wait after typing/dragging/resizing stops before syncing to shared
// state (and localStorage) — keeps rapid updates from spamming either one.
const SYNC_DELAY_MS = 300;

interface NoteCardProps {
  note: Note;
  autoFocus?: boolean;
  onPositionChange: (id: string, position: Pick<Note, "x" | "y">) => void;
  onSizeChange: (id: string, size: Pick<Note, "width" | "height">) => void;
  onTextChange: (id: string, text: string) => void;
  onBringToFront: (id: string) => void;
  onDragMove: (bounds: NoteBounds) => void;
  onDragEnd: (id: string, bounds: NoteBounds) => void;
  onDragCancel: () => void;
}

const NoteCard = ({
  note,
  autoFocus,
  onPositionChange,
  onSizeChange,
  onTextChange,
  onBringToFront,
  onDragMove,
  onDragEnd,
  onDragCancel,
}: NoteCardProps) => {
  const { id, zIndex } = note;
  const cardRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef<{ x: number; y: number } | null>(null);
  const resizeStartRef = useRef<
    { pointerX: number; pointerY: number; width: number; height: number } | null
  >(null);

  // Local copies so typing/dragging/resizing update the screen instantly; these are
  // synced up to shared state only once they settle (see the effects below).
  const [localText, setLocalText] = useState(note.text ?? "");
  const [localPosition, setLocalPosition] = useState({ x: note.x, y: note.y });
  const [localSize, setLocalSize] = useState({ width: note.width, height: note.height });

  const debouncedText = useDebouncedValue(localText, SYNC_DELAY_MS);
  const debouncedPosition = useDebouncedValue(localPosition, SYNC_DELAY_MS);
  const debouncedSize = useDebouncedValue(localSize, SYNC_DELAY_MS);

  useEffect(() => onTextChange(id, debouncedText), [id, debouncedText, onTextChange]);
  useEffect(
    () => onPositionChange(id, debouncedPosition),
    [id, debouncedPosition, onPositionChange],
  );
  useEffect(() => onSizeChange(id, debouncedSize), [id, debouncedSize, onSizeChange]);

  const pointerDownHandler = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    onBringToFront(id); // the note you just grabbed should draw above the others

    const bounds = card.getBoundingClientRect();
    dragOffsetRef.current = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const pointerMoveHandler = (event: PointerEvent<HTMLDivElement>) => {
    const offset = dragOffsetRef.current;
    const parent = cardRef.current?.parentElement;
    if (!offset || !parent) return;

    const bounds: NoteBounds = {
      left: event.clientX - offset.x,
      top: event.clientY - offset.y,
      width: localSize.width,
      height: localSize.height,
    };
    onDragMove(bounds); // live trash-hover highlight — stays instant, not debounced
    const parentBounds = parent.getBoundingClientRect();
    setLocalPosition({
      x: bounds.left - parentBounds.left,
      y: bounds.top - parentBounds.top,
    });
  };

  const pointerUpHandler = (event: PointerEvent<HTMLDivElement>) => {
    const offset = dragOffsetRef.current;
    if (offset) {
      onDragEnd(id, {
        left: event.clientX - offset.x,
        top: event.clientY - offset.y,
        width: localSize.width,
        height: localSize.height,
      });
    }
    dragOffsetRef.current = null;
  };

  const pointerCancelHandler = () => {
    dragOffsetRef.current = null;
    onDragCancel();
  };

  // Resizing tracks how far the pointer has moved from where the handle was grabbed,
  // and adds that delta to the note's size at the start of the drag.
  const resizePointerDownHandler = (event: PointerEvent<HTMLDivElement>) => {
    onBringToFront(id);
    resizeStartRef.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      width: localSize.width,
      height: localSize.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const resizePointerMoveHandler = (event: PointerEvent<HTMLDivElement>) => {
    const start = resizeStartRef.current;
    if (!start) return;

    setLocalSize({
      width: Math.max(MIN_WIDTH, start.width + (event.clientX - start.pointerX)),
      height: Math.max(MIN_HEIGHT, start.height + (event.clientY - start.pointerY)),
    });
  };

  const resizePointerUpHandler = () => {
    resizeStartRef.current = null;
  };

  return (
    <div
      ref={cardRef}
      className="absolute cursor-pointer rounded-sm"
      style={{
        left: localPosition.x,
        top: localPosition.y,
        width: localSize.width,
        height: localSize.height,
        zIndex,
        backgroundColor: "#f9c74f",
      }}
    >
      <div
        className="p-4 text-2xl font-bold h-1/5"
        onPointerDown={pointerDownHandler}
        onPointerMove={pointerMoveHandler}
        onPointerUp={pointerUpHandler}
        onPointerCancel={pointerCancelHandler}
        style={{
          touchAction: "none",
          cursor: "grab",
          backgroundColor: "color-mix(in srgb, #f9c74f 90%, black)",
        }}
      ></div>
      <div className="p-4 h-4/5">
        <textarea
          className="w-full h-full bg-transparent resize-none border-none outline-none"
          value={localText}
          onChange={(event) => setLocalText(event.target.value)}
          autoFocus={autoFocus}
          style={{ color: "#000000" }}
        ></textarea>
      </div>
      {/* Drag this corner to resize the note. */}
      <div
        onPointerDown={resizePointerDownHandler}
        onPointerMove={resizePointerMoveHandler}
        onPointerUp={resizePointerUpHandler}
        onPointerCancel={resizePointerUpHandler}
        className="absolute right-0 bottom-0 h-4 w-4 rounded-tl"
        style={{
          touchAction: "none",
          cursor: "nwse-resize",
          backgroundColor: "color-mix(in srgb, #f9c74f 70%, black)",
        }}
      ></div>
    </div>
  );
};

export default NoteCard;
