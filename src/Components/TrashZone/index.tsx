import trashIcon from "../../assets/svg/trash.svg";

interface TrashZoneProps {
  isActive: boolean;
}

const TrashZone = ({ isActive }: TrashZoneProps) => {
  return (
    <div
      className={`flex h-full w-full items-center justify-center transition-colors duration-200 ${
        isActive ? "bg-red-800" : "bg-amber-700"
      }`}
    >
      <img
        className="h-8 w-8 brightness-0 invert transition-transform duration-200"
        src={trashIcon}
        alt="Trash"
        style={{ transform: isActive ? "scale(2)" : "scale(1)" }}
      />
    </div>
  );
};

export default TrashZone;
