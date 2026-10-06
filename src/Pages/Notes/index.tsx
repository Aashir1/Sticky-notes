import { useRef, useState } from "react";
import AddNoteDialog from "../../Components/AddNoteDialog";
import NoteCard from "../../Components/NotesCard";
import NotesHeader from "../../Components/NotesHeader";
import TrashZone from "../../Components/TrashZone";
import { useNotes } from "../../hooks/useNotes";
import type { Note, NoteBounds } from "../../types/note";

const Notes = () => {
  // notes (including edits, position, and size) are persisted to localStorage inside useNotes
  const { notes, addNote, updatePosition, updateSize, updateText, removeNote, bringToFront } =
    useNotes();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const [newlyAddedId, setNewlyAddedId] = useState<string | null>(null);
  const trashZoneRef = useRef<HTMLElement>(null);

  // A note counts as "over the trash" when its center point lands inside the trash zone's rect.
  const isNoteOverTrash = (noteBounds: NoteBounds) => {
    const trashBounds = trashZoneRef.current?.getBoundingClientRect();
    if (!trashBounds) return false;

    const centerX = noteBounds.left + noteBounds.width;
    const centerY = noteBounds.top + noteBounds.height;

    return (
      centerX >= trashBounds.left &&
      centerX <= trashBounds.right &&
      centerY >= trashBounds.top &&
      centerY <= trashBounds.bottom
    );
  };

  const handleAddNote = (note: Omit<Note, "id" | "zIndex">) => {
    setNewlyAddedId(addNote(note)); // so only this note gets autoFocus
    setIsAddDialogOpen(false);
  };

  const handleDragMove = (bounds: NoteBounds) => {
    setIsOverTrash(isNoteOverTrash(bounds));
  };

  const handleDragEnd = (id: string, bounds: NoteBounds) => {
    if (isNoteOverTrash(bounds)) {
      removeNote(id); // dropped on the trash zone — delete it
    }
    setIsOverTrash(false);
  };

  return (
    <div>
      <section className="h-[85vh] w-full relative">
        <NotesHeader onAddNote={() => setIsAddDialogOpen(true)} />
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            autoFocus={note.id === newlyAddedId}
            onPositionChange={updatePosition}
            onSizeChange={updateSize}
            onTextChange={updateText}
            onBringToFront={bringToFront}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onDragCancel={() => setIsOverTrash(false)}
          />
        ))}
      </section>
      <section ref={trashZoneRef} className="h-[15vh] w-full">
        <TrashZone isActive={isOverTrash} />
      </section>
      {isAddDialogOpen && (
        <AddNoteDialog
          initialPosition={{
            x: 100,
            y: 100,
          }}
          onClose={() => setIsAddDialogOpen(false)}
          onSubmit={handleAddNote}
        />
      )}
    </div>
  );
};

export default Notes;
