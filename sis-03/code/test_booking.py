import unittest

from booking import can_book


# Base data for the brief's cases (report.md section 5):
# now = 540, blocked = False, existing = [(600, 660)].
def check(start, end, now=540, blocked=False, existing=None):
    return can_book(start, end, now, blocked, [(600, 660)] if existing is None else existing)


class BookingCaseTests(unittest.TestCase):
    """The twelve cases of the brief, minus the screen-width one."""

    def test_t1_touching_end_is_allowed(self):
        self.assertIs(check(660, 720), True)

    def test_t2_overlap_is_rejected(self):
        self.assertIs(check(630, 690), False)

    def test_t3_blocked_room_is_rejected(self):
        self.assertIs(check(660, 720, blocked=True), False)

    def test_t4_exactly_120_minutes_is_allowed(self):
        self.assertIs(check(720, 840), True)

    def test_t5_121_minutes_is_rejected(self):
        self.assertIs(check(720, 841), False)

    def test_t6_starting_now_is_rejected(self):
        self.assertIs(check(540, 570), False)

    def test_t7_reversed_times_are_rejected(self):
        self.assertIs(check(720, 660), False)

    def test_t8_ending_at_midnight_is_allowed(self):
        self.assertIs(check(1380, 1440), True)

    def test_t9_ending_past_midnight_is_rejected(self):
        self.assertIs(check(1380, 1441), False)


class DayBoundaryTests(unittest.TestCase):
    def test_zero_length_is_rejected(self):
        self.assertIs(check(700, 700), False)

    def test_negative_start_is_rejected(self):
        self.assertIs(check(-30, 30), False)

    def test_one_minute_after_now_is_allowed(self):
        self.assertIs(check(541, 571), True)


class OverlapTests(unittest.TestCase):
    def test_t10_overlap_with_second_booking_is_rejected(self):
        self.assertIs(check(720, 780, existing=[(600, 660), (700, 760)]), False)

    def test_containing_an_existing_booking_is_rejected(self):
        self.assertIs(check(570, 690), False)

    def test_ending_at_the_existing_start_is_allowed(self):
        self.assertIs(check(570, 600), True)

    def test_unsorted_booking_list_is_checked_completely(self):
        self.assertIs(check(610, 650, existing=[(900, 960), (600, 660)]), False)

    def test_free_slot_between_three_bookings_is_allowed(self):
        self.assertIs(
            check(760, 800, existing=[(600, 660), (700, 760), (800, 860)]), True
        )


class InputSafetyTests(unittest.TestCase):
    def test_t11_same_check_twice_stays_available(self):
        self.assertIs(check(660, 720), True)
        self.assertIs(check(660, 720), True)

    def test_existing_is_unchanged_after_an_accepted_request(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        self.assertIs(can_book(780, 840, 540, False, existing), True)
        self.assertEqual(existing, [(900, 960), (600, 660), (700, 760)])

    def test_existing_is_unchanged_after_a_rejected_request(self):
        existing = [(900, 960), (600, 660), (700, 760)]
        self.assertIs(can_book(610, 650, 540, False, existing), False)
        self.assertEqual(existing, [(900, 960), (600, 660), (700, 760)])

    def test_result_is_a_real_boolean(self):
        self.assertIsInstance(check(660, 720), bool)
        self.assertIsInstance(check(630, 690), bool)


if __name__ == "__main__":
    unittest.main()
