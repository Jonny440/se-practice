import { EQUIPMENT } from "@/rooms";

/**
 * The filter form. It collects the two things filterRooms needs and hands them
 * up; it never decides which rooms survive (that is F1 and F2, in filter.ts).
 */
export default function FilterPanel({
  attendees,
  onAttendeesChange,
  equipment,
  onToggleEquipment,
}: {
  attendees: number;
  onAttendeesChange: (value: number) => void;
  equipment: string[];
  onToggleEquipment: (item: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-semibold text-gray-900">Find a room</h2>
      <p className="mt-0.5 text-sm text-gray-500">
        Only rooms that seat your group and have every item you tick are listed.
      </p>

      <div className="mt-4">
        <label htmlFor="attendees" className="block text-sm font-medium text-gray-700">
          Attendees
        </label>
        <input
          id="attendees"
          type="number"
          min={1}
          max={200}
          value={attendees}
          onChange={(event) => onAttendeesChange(Number(event.target.value))}
          className="mt-1.5 block w-32 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      <fieldset className="mt-4">
        <legend className="text-sm font-medium text-gray-700">Required equipment</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {EQUIPMENT.map((item) => (
            <label
              key={item}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={equipment.includes(item)}
                onChange={() => onToggleEquipment(item)}
                className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-400"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
