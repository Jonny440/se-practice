export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: { start: number; end: number }[];
};

export const EQUIPMENT = ["projector", "whiteboard", "video-conference", "microphone"];

/**
 * The fictional catalog. Bookings live on the room they belong to (minutes after
 * midnight, 600 = 10:00), so no other file has to join a room to its bookings.
 */
export const ROOMS: Room[] = [
  {
    id: "aurora",
    name: "Aurora Hall",
    capacity: 40,
    equipment: ["projector", "whiteboard", "video-conference"],
    blocked: false,
    bookings: [
      { start: 600, end: 660 },
      { start: 780, end: 840 },
    ],
  },
  {
    id: "cedar",
    name: "Cedar Lab",
    capacity: 24,
    equipment: ["projector", "whiteboard"],
    blocked: false,
    bookings: [{ start: 540, end: 600 }],
  },
  {
    id: "basalt",
    name: "Basalt Studio",
    capacity: 12,
    equipment: ["whiteboard"],
    blocked: true,
    bookings: [],
  },
  {
    id: "delta",
    name: "Delta Auditorium",
    capacity: 80,
    equipment: ["projector", "microphone", "video-conference"],
    blocked: false,
    bookings: [
      { start: 480, end: 540 },
      { start: 900, end: 960 },
    ],
  },
  {
    id: "elm",
    name: "Elm Seminar Room",
    capacity: 18,
    equipment: ["projector"],
    blocked: false,
    bookings: [{ start: 660, end: 720 }],
  },
  {
    id: "fjord",
    name: "Fjord Workshop",
    capacity: 30,
    equipment: ["whiteboard", "video-conference"],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
];
