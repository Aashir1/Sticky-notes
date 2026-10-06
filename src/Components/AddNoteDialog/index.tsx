import { useState, type FormEvent } from "react";
import type { Note } from "../../types/note";

interface AddNoteDialogProps {
  initialPosition: { x: number; y: number };
  onClose: () => void;
  // zIndex is assigned automatically when the note is added, so it's not collected here
  onSubmit: (note: Omit<Note, "id" | "zIndex">) => void;
}

const AddNoteDialog = ({
  initialPosition,
  onClose,
  onSubmit,
}: AddNoteDialogProps) => {
  const [draft, setDraft] = useState({
    ...initialPosition,
    width: 250,
    height: 220,
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(draft);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-note-title"
        className="w-full max-w-md rounded-lg bg-white p-6 text-stone-900 shadow-2xl"
      >
        <h2 id="add-note-title" className="mb-5 text-xl font-semibold">
          Add a note
        </h2>
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          {([
            ["width", "Width"],
            ["height", "Height"],
            ["x", "Position X"],
            ["y", "Position Y"],
          ] as const).map(([field, label]) => (
            <label key={field} className="flex flex-col gap-1 text-sm font-medium">
              {label}
              <input
                type="number"
                min={field === "x" || field === "y" ? 0 : 120}
                max={field === "x" || field === "y" ? undefined : 1200}
                required
                value={draft[field]}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    [field]: Number(event.target.value),
                  }))
                }
                className="rounded border border-stone-300 px-3 py-2 font-normal focus:border-stone-600 focus:outline-none"
              />
            </label>
          ))}
          <div className="col-span-2 mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
            >
              Create note
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default AddNoteDialog;
