# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** a booking that ends exactly when another begins is allowed under R3, because TODO.
- **Duration:** a booking of exactly two hours is allowed under R2, because TODO.
- **Cancellation**: a Student can cancel a booking they made, as stated in the corresponding user story. Cancellation does not change the booking rules for other students.

---

## US-TODO — View availability

### AC-01
- **Given** some rooms have existing bookings or blocked periods
- **When** the Student views availability for a selected future time range
- **Then** the system shows only rooms that are free and not blocked for the entire selected range

### AC-02
- **Given** a room is blocked during the selected time range
- **When** the Student views availability
- **Then** that room is not shown as available for that period

### AC-03
- **Given** all rooms are booked or blocked for the selected time range
- **When** the Student views availability
- **Then** the system indicates that no rooms are available for that period

---

## US-TODO — Book room

### AC-04
- **Given** a room is free and not blocked for a future time slot of two hours or less
- **When** the Student submits the booking
- **Then** the booking is created and the room is no longer available for that slot

### AC-05
- **Given** the requested booking starts now or in the past, or lasts longer than two hours
- **When** the Student submits the booking
- **Then** the booking is rejected and no booking is created

### AC-06
- **Given** another active booking for the same room overlaps the requested time slot, or the room is blocked during that slot
- **When** the Student submits the booking
- **Then** the booking is rejected and no booking is created

---

## US-TODO — Cancel booking

### AC-07
- **Given** the Student has a booking that has not yet started
- **When** the Student cancels the booking
- **Then** the booking is cancelled and the room becomes available for that time slot

### AC-08
- **Given** a booking was made by another Student
- **When** the Student attempts to cancel that booking
- **Then** the cancellation is rejected and the booking remains unchanged

### AC-09
- **Given** the Student's booking has already started or ended
- **When** the Student attempts to cancel it
- **Then** the cancellation is rejected and the booking remains unchanged
