import { CheckCircle2, DoorClosed, Lock, Users } from "lucide-react";
import type { Room } from "@/rooms";

/**
 * Presentation only: it shows what a room holds and reports the click. Every
 * decision about which rooms are listed, or whether one can be booked, belongs
 * to filter.ts and booking.ts.
 */
export default function RoomCard({
  room,
  selected,
  onSelect,
}: {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Select room ${room.name}`}
      className={[
        "w-full rounded-xl border-2 p-4 text-left transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2",
        selected
          ? "border-teal-500 bg-teal-50 ring-2 ring-teal-300"
          : "border-gray-200 bg-white hover:border-teal-300 hover:shadow-md",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex items-center gap-2">
          <DoorClosed className="h-5 w-5 shrink-0 text-teal-600" />
          <span className="text-base font-semibold text-gray-900">{room.name}</span>
        </span>
        {room.blocked ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
            <Lock className="h-3 w-3" /> Blocked
          </span>
        ) : selected ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700">
            <CheckCircle2 className="h-3 w-3" /> Selected
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {room.capacity} seats
        </span>
        <span className="text-gray-400">id: {room.id}</span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {room.equipment.length === 0 ? (
          <span className="text-xs text-gray-400">no equipment listed</span>
        ) : (
          room.equipment.map((item) => (
            <span
              key={item}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
            >
              {item}
            </span>
          ))
        )}
      </div>
    </button>
  );
}
