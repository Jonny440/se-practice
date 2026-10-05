# User stories — Smart Campus study room booking

6 to 8 stories. Keep the shape exactly: ID, the As/I want/so that sentence, a priority, one
assumption. Roles are **Student** or **Administrator** only.

Delete the TODO lines as you fill them in — the checker treats a leftover TODO as unfinished work.

---

### US-01
**Story:** As a Student, I want to view which study rooms are free and when, so that I can pick a room and time slot that actually works for me.
**Priority:** High
**Assumption:** Availability reflects current bookings and blocked rooms at the moment the student views it.

### US-02
**Story:** As a Student, I want to book a free room for a time slot, so that I have a guaranteed place to study.
**Priority:** High
**Assumption:** The student may hold only bookings that satisfy R1–R4; the system rejects any request that violates them.

### US-03
**Story:** As a Student, I want to cancel a reservation I made, so that the room is released for others and I am no longer committed to it.
**Priority:** High
**Assumption:** A student can cancel only a booking they themselves made.

### US-04
**Story:** As a Student, I want to receive a confirmation when I book or cancel, so that I know the action succeeded and can rely on it.
**Priority:** Medium
**Assumption:** Confirmation is limited to booking and cancellation outcomes (UC-06); no reminders or other notifications are sent.

### US-05
**Story:** As an Administrator, I want to block/unblock a room from booking, so that i can decide if the room available or not.
**Priority:** High
**Assumption:** Blocking takes effect immediately, and any attempt to book a blocked room is rejected under R4. Unblocking does not alter or restore any bookings that were cancelled or prevented while the room was blocked.

### US-06
**Story:** As an Administrator, I want to review how rooms have been used over a period, so that I can see demand patterns and decide how rooms should be managed.
**Priority:** Medium
**Assumption:** Usage review is based on recorded bookings and blocked periods within the selected period; it does not include check-in or attendance data.

<!-- Add two more blocks in the same shape if you kept 7 or 8 stories. -->
