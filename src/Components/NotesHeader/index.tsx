import plusIcon from "../../assets/svg/plus.svg";

interface NotesHeaderProps {
  onAddNote: () => void;
}

const NotesHeader = ({ onAddNote }: NotesHeaderProps) => {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 text-white">
      <h1 className="m-0 text-3xl font-bold">Notes</h1>
      <button
        type="button"
        onClick={onAddNote}
        aria-label="Add note"
        title="Add note"
        className="flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <img
          src={plusIcon}
          alt=""
          aria-hidden="true"
          className="h-6 w-6 brightness-0 invert"
        />
      </button>
    </header>
  );
};

export default NotesHeader;
