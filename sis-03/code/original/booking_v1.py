def can_book(start, end, now, blocked, existing):
    # AC1: valid time range and start must be after now
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: booking duration must be at most 120 minutes
    if end - start > 120:
        return False

    # AC3: room must not be blocked
    if blocked:
        return False

    # AC4: requested interval must not overlap any existing booking
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False

    # AC5: all acceptance criteria are satisfied
    return True
