export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
  blocked: boolean;
}

export interface Booking {
  roomId: string;
  start: number; // minutes from midnight
  end: number; // minutes from midnight
  bookedBy: string;
}

export const ROOMS: Room[] = [
  { id: "r1", name: "A101", building: "Engineering Block", capacity: 40, blocked: false },
  { id: "r2", name: "A102", building: "Engineering Block", capacity: 30, blocked: false },
  { id: "r3", name: "B201", building: "Science Block", capacity: 25, blocked: true },
  { id: "r4", name: "B202", building: "Science Block", capacity: 50, blocked: false },
  { id: "r5", name: "C105", building: "Library Wing", capacity: 20, blocked: false },
];

export const SAMPLE_BOOKINGS: Booking[] = [
  { roomId: "r1", start: 540, end: 600, bookedBy: "Dr. Smith" },   // 09:00–10:00
  { roomId: "r1", start: 780, end: 840, bookedBy: "Prof. Lee" },    // 13:00–14:00
  { roomId: "r2", start: 600, end: 660, bookedBy: "Dr. Patel" },    // 10:00–11:00
  { roomId: "r4", start: 600, end: 660, bookedBy: "Prof. Garcia" }, // 10:00–11:00
  { roomId: "r4", start: 700, end: 760, bookedBy: "Dr. Chen" },     // 11:40–12:40
  { roomId: "r5", start: 660, end: 720, bookedBy: "Prof. Brown" },  // 11:00–12:00
];
