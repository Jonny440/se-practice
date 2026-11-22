import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  DoorClosed,
  SearchX,
  XCircle,
} from "lucide-react";
import { ROOMS } from "@/rooms";
import { MAX_DURATION, checkRoom } from "@/booking";
import { filterRooms } from "@/filter";
import { labelToMinutes, minutesToLabel } from "@/time";
import RoomCard from "@/components/RoomCard";
import FilterPanel from "@/components/FilterPanel";

// A fixed clock keeps every demonstration and screenshot reproducible.
const DEFAULT_NOW = "08:00";

export default function RoomAvailabilityChecker() {
  const [nowLabel, setNowLabel] = useState(DEFAULT_NOW);
  const [attendees, setAttendees] = useState(20);
  const [required, setRequired] = useState<string[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState(ROOMS[0].id);
  const [startLabel, setStartLabel] = useState("10:00");
  const [endLabel, setEndLabel] = useState("11:00");
  const [checked, setChecked] = useState(false);

  const matchingRooms = useMemo(
    () => filterRooms(ROOMS, { attendees, equipment: required }),
    [attendees, required]
  );

  // F5: the selection falls back to the first match, so the result always
  // belongs to the room the user is actually looking at.
  const selectedRoom = useMemo(
    () => matchingRooms.find((room) => room.id === selectedRoomId) ?? matchingRooms[0] ?? null,
    [matchingRooms, selectedRoomId]
  );

  const start = labelToMinutes(startLabel);
  const end = labelToMinutes(endLabel);
  const now = labelToMinutes(nowLabel);

  const duration = start !== null && end !== null && end > start ? end - start : null;

  const decision = useMemo(() => {
    if (!checked || !selectedRoom) return null;
    if (start === null || end === null || now === null) {
      return { available: false, invalidInput: true };
    }
    return {
      available: checkRoom(ROOMS, selectedRoom.id, { start, end, now }),
      invalidInput: false,
    };
  }, [checked, selectedRoom, start, end, now]);

  const bookings = useMemo(
    () => (selectedRoom ? [...selectedRoom.bookings].sort((a, b) => a.start - b.start) : []),
    [selectedRoom]
  );

  function toggleEquipment(item: string) {
    setRequired((current) =>
      current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item]
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
          <div className="flex items-center gap-3">
            <CalendarClock className="h-8 w-8 shrink-0" />
            <div>
              <h1 className="text-xl font-bold sm:text-3xl">Smart Campus Room Availability</h1>
              <p className="mt-1 text-sm text-teal-100 sm:text-base">
                Filter the campus catalog, pick a room, and check its own bookings.
              </p>
            </div>
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium">
            <Clock className="h-4 w-4" />
            <label htmlFor="now" className="text-teal-100">
              Current time:
            </label>
            <input
              id="now"
              type="time"
              value={nowLabel}
              onChange={(event) => setNowLabel(event.target.value)}
              className="rounded-md border border-white/30 bg-white/10 px-2 py-0.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/50 [color-scheme:dark]"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-6">
            <FilterPanel
              attendees={attendees}
              onAttendeesChange={setAttendees}
              equipment={required}
              onToggleEquipment={toggleEquipment}
            />

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Matching rooms{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({matchingRooms.length} of {ROOMS.length})
                </span>
              </h2>

              {matchingRooms.length === 0 ? (
                <div
                  data-testid="empty-state"
                  className="mt-4 flex items-start gap-3 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-6 text-amber-800"
                >
                  <SearchX className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">
                      No room matches {attendees}{" "}
                      {attendees === 1 ? "attendee" : "attendees"} with{" "}
                      {required.length === 0 ? "no extra equipment" : required.join(" + ")}.
                    </p>
                    <p className="mt-1 text-sm text-amber-700">
                      Try a smaller group, or untick an equipment item.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {matchingRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      selected={room.id === selectedRoom?.id}
                      onSelect={() => setSelectedRoomId(room.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Choose your time slot</h2>
              <p className="mt-0.5 text-sm text-gray-500">
                Start must be after the current time; a slot lasts at most {MAX_DURATION} minutes.
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="start" className="block text-sm font-medium text-gray-700">
                    Start time
                  </label>
                  <input
                    id="start"
                    type="time"
                    value={startLabel}
                    onChange={(event) => setStartLabel(event.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
                <div>
                  <label htmlFor="end" className="block text-sm font-medium text-gray-700">
                    End time
                  </label>
                  <input
                    id="end"
                    type="time"
                    value={endLabel}
                    onChange={(event) => setEndLabel(event.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Duration:{" "}
                <span className="font-medium text-gray-700">
                  {duration === null
                    ? "—"
                    : `${duration} min${duration > MAX_DURATION ? " (exceeds the limit)" : ""}`}
                </span>
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setChecked(true)}
                  disabled={!selectedRoom}
                  className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Check Availability
                </button>
                <button
                  type="button"
                  onClick={() => setChecked(false)}
                  className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                  Clear
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900">Result</h2>

              {!decision && (
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-gray-400">
                  <Clock className="h-5 w-5 shrink-0" />
                  <span className="text-sm">
                    Pick a room and a time slot, then press "Check Availability".
                  </span>
                </div>
              )}

              {decision?.invalidInput && (
                <div className="mt-4 rounded-xl border-2 border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  Enter a valid start time, end time and current time in HH:MM format.
                </div>
              )}

              {decision && !decision.invalidInput && selectedRoom && (
                <div
                  className={[
                    "mt-4 rounded-xl border-2 p-4",
                    decision.available
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    {decision.available ? (
                      <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
                    ) : (
                      <XCircle className="h-6 w-6 shrink-0 text-red-600" />
                    )}
                    <div>
                      <p
                        className={[
                          "text-base font-bold",
                          decision.available ? "text-emerald-700" : "text-red-700",
                        ].join(" ")}
                      >
                        {decision.available ? "Available" : "Unavailable"}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-700">
                        <span className="font-medium">{selectedRoom.name}</span> ·{" "}
                        {startLabel}–{endLabel}
                      </p>
                      <p
                        className={[
                          "mt-1 text-sm",
                          decision.available ? "text-emerald-700" : "text-red-700",
                        ].join(" ")}
                      >
                        {decision.available
                          ? `Free for ${end! - start!} minutes.`
                          : "A slot is unavailable when the start is not after the current time, it lasts more than " +
                            `${MAX_DURATION} minutes, the room is blocked, or it overlaps a booking.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <p className="mt-3 text-xs text-gray-400">
                Checking availability never creates or changes a booking.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <DoorClosed className="h-5 w-5 text-teal-600" />
                {selectedRoom ? `Bookings — ${selectedRoom.name}` : "Bookings"}
              </h2>

              {!selectedRoom ? (
                <p className="mt-2 text-sm text-gray-500">
                  Nothing to show until at least one room matches.
                </p>
              ) : (
                <>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {selectedRoom.blocked
                      ? "This room is blocked, so it can never be reported available."
                      : bookings.length === 0
                        ? "No existing bookings for this room."
                        : `${bookings.length} booking${bookings.length > 1 ? "s" : ""} on record.`}
                  </p>
                  {bookings.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {bookings.map((booking) => (
                        <li
                          key={`${booking.start}-${booking.end}`}
                          className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700"
                        >
                          {minutesToLabel(booking.start)} – {minutesToLabel(booking.end)}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
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
