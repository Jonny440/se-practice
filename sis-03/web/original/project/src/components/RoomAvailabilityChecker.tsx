import { useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  DoorClosed,
  Building2,
  Users,
  Lock,
  CalendarClock,
} from "lucide-react";
import { ROOMS, SAMPLE_BOOKINGS, Room } from "@/lib/rooms";
import {
  checkAvailability,
  labelToMinutes,
  minutesToLabel,
  MINUTES_PER_DAY,
  MAX_DURATION,
} from "@/lib/availability";

const TIME_OPTIONS: { label: string; value: number }[] = (() => {
  const opts: { label: string; value: number }[] = [];
  for (let m = 0; m <= MINUTES_PER_DAY; m += 15) {
    opts.push({ label: minutesToLabel(m), value: m });
  }
  return opts;
})();

function useCurrentTime(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function RoomCard({
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
      disabled={room.blocked}
      className={[
        "w-full text-left rounded-xl border-2 p-4 transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50",
        room.blocked
          ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
          : selected
            ? "border-teal-500 bg-teal-50 ring-2 ring-teal-400"
            : "border-gray-200 bg-white hover:border-teal-300 hover:shadow-md cursor-pointer",
      ].join(" ")}
      aria-pressed={selected}
      aria-label={`Select room ${room.name}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <DoorClosed className="h-5 w-5 text-teal-600 shrink-0" />
          <span className="font-semibold text-gray-900 text-base">{room.name}</span>
        </div>
        {room.blocked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
            <Lock className="h-3 w-3" /> Blocked
          </span>
        )}
        {selected && !room.blocked && (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-2.5 py-0.5 text-xs font-medium text-teal-700">
            <CheckCircle2 className="h-3 w-3" /> Selected
          </span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
        <span className="inline-flex items-center gap-1">
          <Building2 className="h-3.5 w-3.5" /> {room.building}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" /> {room.capacity} seats
        </span>
      </div>
    </button>
  );
}

export default function RoomAvailabilityChecker() {
  const currentTime = useCurrentTime();
  const [selectedRoomId, setSelectedRoomId] = useState<string>(ROOMS[0].id);
  const [startLabel, setStartLabel] = useState("10:30");
  const [endLabel, setEndLabel] = useState("11:30");
  const [result, setResult] = useState<{
    available: boolean;
    reason?: string;
    checked: boolean;
  } | null>(null);

  const selectedRoom = useMemo(
    () => ROOMS.find((r) => r.id === selectedRoomId)!,
    [selectedRoomId]
  );

  const roomBookings = useMemo(
    () => SAMPLE_BOOKINGS.filter((b) => b.roomId === selectedRoomId),
    [selectedRoomId]
  );

  function handleCheck() {
    const start = labelToMinutes(startLabel);
    const end = labelToMinutes(endLabel);

    if (start === null || end === null) {
      setResult({
        available: false,
        reason: "Please enter valid times in HH:MM format.",
        checked: true,
      });
      return;
    }

    const res = checkAvailability(start, end, currentTime, selectedRoom, SAMPLE_BOOKINGS);
    setResult({ ...res, checked: true });
  }

  function handleReset() {
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
          <div className="flex items-center gap-3">
            <CalendarClock className="h-8 w-8 shrink-0" />
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                Smart Campus Room Availability
              </h1>
              <p className="mt-1 text-sm text-teal-100 sm:text-base">
                Check whether a campus room is free for your desired time slot.
              </p>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Clock className="h-4 w-4" />
            Current time: {minutesToLabel(currentTime)}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column: Room selection + time inputs */}
          <section className="space-y-6">
            {/* Room selection */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Select a room</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Blocked rooms cannot be booked.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {ROOMS.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    selected={room.id === selectedRoomId}
                    onSelect={() => {
                      setSelectedRoomId(room.id);
                      setResult(null);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Time input */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Choose your time slot</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Maximum 120 minutes. Start must be after the current time.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="start-time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start time
                  </label>
                  <select
                    id="start-time"
                    value={startLabel}
                    onChange={(e) => {
                      setStartLabel(e.target.value);
                      setResult(null);
                    }}
                    className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    {TIME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.label}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="end-time"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End time
                  </label>
                  <select
                    id="end-time"
                    value={endLabel}
                    onChange={(e) => {
                      setEndLabel(e.target.value);
                      setResult(null);
                    }}
                    className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  >
                    {TIME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.label}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-500">
                Duration:{" "}
                <span className="font-medium text-gray-700">
                  {(() => {
                    const s = labelToMinutes(startLabel);
                    const e = labelToMinutes(endLabel);
                    if (s === null || e === null) return "—";
                    const diff = e - s;
                    if (diff <= 0) return "—";
                    return `${diff} min${diff > MAX_DURATION ? " (exceeds 120-min limit)" : ""}`;
                  })()}
                </span>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={handleCheck}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Check Availability
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>

          {/* Right column: result + existing bookings */}
          <section className="space-y-6">
            {/* Result */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Result</h2>

              {!result?.checked && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-gray-400">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">
                    Pick a room and time slot, then press "Check Availability".
                  </span>
                </div>
              )}

              {result?.checked && (
                <div
                  className={[
                    "mt-4 rounded-xl border-2 p-4 transition-all duration-300",
                    result.available
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    {result.available ? (
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="h-6 w-6 shrink-0 text-red-600" />
                    )}
                    <div>
                      <p
                        className={[
                          "text-base font-bold",
                          result.available ? "text-emerald-700" : "text-red-700",
                        ].join(" ")}
                      >
                        {result.available ? "Available" : "Unavailable"}
                      </p>
                      <p
                        className={[
                          "mt-0.5 text-sm",
                          result.available ? "text-emerald-600" : "text-red-600",
                        ].join(" ")}
                      >
                        {result.available
                          ? `Room ${selectedRoom.name} is free from ${startLabel} to ${endLabel}.`
                          : result.reason}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs text-gray-400">
                Checking availability does not create or modify any bookings.
              </p>
            </div>

            {/* Existing bookings for selected room */}
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Existing bookings — {selectedRoom.name}
              </h2>
              <p className="mt-0.5 text-sm text-gray-500">
                {selectedRoom.blocked
                  ? "This room is blocked."
                  : roomBookings.length === 0
                    ? "No existing bookings for this room."
                    : `${roomBookings.length} booking${roomBookings.length > 1 ? "s" : ""} on record.`}
              </p>

              {roomBookings.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {roomBookings
                    .sort((a, b) => a.start - b.start)
                    .map((b, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm"
                      >
                        <span className="font-medium text-gray-700">
                          {minutesToLabel(b.start)} – {minutesToLabel(b.end)}
                        </span>
                        <span className="text-gray-500">{b.bookedBy}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-gray-400">
          Smart Campus Room Availability Checker — fictional sample data
        </div>
      </footer>
    </div>
  );
}

