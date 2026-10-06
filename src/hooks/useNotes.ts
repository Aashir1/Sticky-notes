import { useCallback } from "react";
import type { Note } from "../types/note";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "sticky-notes:notes";

// All note state lives here, backed by localStorage. `initialNotes` is only
// used the very first time the app runs (i.e. when storage is empty).
export function useNotes(initialNotes: Note[] = []) {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, initialNotes);

  const addNote = useCallback(
    (note: Omit<Note, "id" | "zIndex">) => {
      const id = crypto.randomUUID();
      setNotes((current) => [...current, { ...note, id, zIndex: current.length + 1 }]);
      return id; // handed back so the caller can e.g. focus this exact note
    },
    [setNotes],
  );

  const updatePosition = useCallback(
    (id: string, position: Pick<Note, "x" | "y">) => {
      setNotes((current) =>
        current.map((note) => (note.id === id ? { ...note, ...position } : note)),
      );
    },
    [setNotes],
  );

  const updateSize = useCallback(
    (id: string, size: Pick<Note, "width" | "height">) => {
      setNotes((current) =>
        current.map((note) => (note.id === id ? { ...note, ...size } : note)),
      );
    },
    [setNotes],
  );

  const updateText = useCallback(
    (id: string, text: string) => {
      setNotes((current) =>
        current.map((note) => (note.id === id ? { ...note, text } : note)),
      );
    },
    [setNotes],
  );

  const removeNote = useCallback(
    (id: string) => {
      setNotes((current) => current.filter((note) => note.id !== id));
    },
    [setNotes],
  );

  // Gives the note the highest zIndex of the bunch, so whichever one you grab renders on top.
  const bringToFront = useCallback(
    (id: string) => {
      setNotes((current) => {
        const maxZ = current.reduce((max, note) => Math.max(max, note.zIndex), 0);
        return current.map((note) =>
          note.id === id ? { ...note, zIndex: maxZ + 1 } : note,
        );
      });
    },
    [setNotes],
  );

  return { notes, addNote, updatePosition, updateSize, updateText, removeNote, bringToFront };
}
