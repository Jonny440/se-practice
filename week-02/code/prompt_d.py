
def analyze_marks(marks, pass_mark=50):
    if not isinstance(marks, list):
        raise ValueError("marks must be a list")

    if len(marks) == 0:
        raise ValueError("marks cannot be empty")

    # Validate pass_mark
    if isinstance(pass_mark, bool) or not isinstance(pass_mark, (int, float)):
        raise ValueError("pass_mark must be numeric")

    if pass_mark < 0 or pass_mark > 100:
        raise ValueError("pass_mark must be between 0 and 100")

    # Validate marks
    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("all marks must be numeric")

        if mark < 0 or mark > 100:
            raise ValueError("marks must be between 0 and 100")

    average = round(sum(marks) / len(marks), 2)
    highest = max(marks)
    lowest = min(marks)

    passed = sum(mark >= pass_mark for mark in marks)
    pass_rate = round((passed / len(marks)) * 100, 2)

    return {
        "average": average,
        "highest": highest,
        "lowest": lowest,
        "pass_rate": pass_rate
    }


# --------------------
# Tests
# --------------------

# 1. One mark
assert analyze_marks([75]) == {
    "average": 75.0,
    "highest": 75,
    "lowest": 75,
    "pass_rate": 100.0
}

# 2. Decimal marks
assert analyze_marks([60.5, 70.5, 80.0]) == {
    "average": 70.33,
    "highest": 80.0,
    "lowest": 60.5,
    "pass_rate": 100.0
}

# 3. Custom pass_mark
assert analyze_marks([40, 60, 80], 70) == {
    "average": 60.0,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 33.33
}

# Example verification
assert analyze_marks([40, 60, 80], 50) == {
    "average": 60.0,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 66.67
}

# 4. Empty list
try:
    analyze_marks([])
    assert False, "Expected ValueError"
except ValueError:
    pass

# 5. Non-numeric value
try:
    analyze_marks([40, "60", 80])
    assert False, "Expected ValueError"
except ValueError:
    pass

# 6. Mark below 0
try:
    analyze_marks([40, -5, 80])
    assert False, "Expected ValueError"
except ValueError:
    pass

# 7. Mark above 100
try:
    analyze_marks([40, 101, 80])
    assert False, "Expected ValueError"
except ValueError:
    pass

print("All tests passed.")  
