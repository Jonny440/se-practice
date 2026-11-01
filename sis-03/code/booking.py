DAY_END = 1440
MAX_DURATION = 120


def can_book(start, end, now, blocked, existing):
    """Return True when the room can be used from `start` to `end`."""

    # AC1: whole minutes inside the day, start before end, start strictly after now.
    if not (0 <= start < end <= DAY_END):
        return False
    if start <= now:
        return False

    # AC2: at most two hours, 120 minutes exactly is allowed.
    if end - start > MAX_DURATION:
        return False

    # AC3: a blocked room accepts nothing.
    if blocked:
        return False

    # AC4: overlap, where intervals touching at an endpoint do not overlap.
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False

    # AC5: the request is only judged, `existing` is never modified.
    return True
