import unittest
from booking import can_book

EARLY_NOW = 0


class BookingTests(unittest.TestCase):
    # Touching (AC4)
    def test_touching_end_is_allowed(self):
        self.assertIs(can_book(660, 720, EARLY_NOW, False, [(600, 660)]), True)

    def test_touching_start_is_allowed(self):
        self.assertIs(can_book(540, 600, EARLY_NOW, False, [(600, 660)]), True)

    # Overlap (AC4)
    def test_overlap_is_rejected(self):
        self.assertIs(can_book(630, 690, EARLY_NOW, False, [(600, 660)]), False)

    def test_request_inside_existing_is_rejected(self):
        self.assertIs(can_book(620, 640, EARLY_NOW, False, [(600, 660)]), False)

    def test_existing_inside_request_is_rejected(self):
        self.assertIs(can_book(600, 700, EARLY_NOW, False, [(620, 660)]), False)

    # Blocked (AC5)
    def test_blocked_is_rejected(self):
        self.assertIs(can_book(660, 720, EARLY_NOW, True, []), False)

    # Duration (AC3)
    def test_exactly_two_hours_is_allowed(self):
        self.assertIs(can_book(720, 840, EARLY_NOW, False, []), True)

    def test_over_two_hours_is_rejected(self):
        self.assertIs(can_book(720, 841, EARLY_NOW, False, []), False)

    # Starts now / past (AC1)
    def test_starts_now_is_rejected(self):
        self.assertIs(can_book(540, 570, 540, False, []), False)

    def test_starts_in_past_is_rejected(self):
        self.assertIs(can_book(500, 560, 540, False, []), False)

    # Zero-length / reversed (AC2)
    def test_zero_length_is_rejected(self):
        self.assertIs(can_book(600, 600, EARLY_NOW, False, []), False)

    def test_reversed_times_are_rejected(self):
        self.assertIs(can_book(700, 600, EARLY_NOW, False, []), False)

    # Existing: empty and several
    def test_empty_existing_allows_booking(self):
        self.assertIs(can_book(600, 660, EARLY_NOW, False, []), True)

    def test_fits_between_several_bookings_is_allowed(self):
        existing = [(540, 600), (600, 660), (720, 780)]
        self.assertIs(can_book(660, 720, EARLY_NOW, False, existing), True)

    def test_overlaps_one_of_several_bookings_is_rejected(self):
        existing = [(540, 600), (600, 660), (720, 780)]
        self.assertIs(can_book(700, 760, EARLY_NOW, False, existing), False)

    # Unchanged input
    def test_existing_list_is_not_mutated_on_allow(self):
        existing = [(600, 660), (720, 780)]
        can_book(660, 720, EARLY_NOW, False, existing)
        self.assertEqual(existing, [(600, 660), (720, 780)])

    def test_existing_list_is_not_mutated_on_reject(self):
        existing = [(600, 660), (720, 780)]
        can_book(630, 690, EARLY_NOW, False, existing)
        self.assertEqual(existing, [(600, 660), (720, 780)])

    def test_ending_after_day_limit_is_rejected(self):
        self.assertIs(can_book(1380, 1441, EARLY_NOW, False, []), False)
        
    def test_existing_list_is_not_mutated_on_allow(self):
        existing = [(720, 780), (600, 660)]
        can_book(660, 720, EARLY_NOW, False, existing)
        self.assertEqual(existing, [(720, 780), (600, 660)])

if __name__ == "__main__":
    unittest.main()
