def analyze_marks(marks, pass_mark=50):
    # Validate the list is not empty
    if not marks:
        raise ValueError("marks cannot be empty")

    # Validate pass_mark
    if isinstance(pass_mark, bool) or not isinstance(pass_mark, (int, float)):
        raise ValueError("pass_mark must be numeric")

    if not 0 <= pass_mark <= 100:
        raise ValueError("pass_mark must be between 0 and 100")

    # Validate every mark
    for mark in marks:
        if isinstance(mark, bool) or not isinstance(mark, (int, float)):
            raise ValueError("all marks must be numeric")

        if not 0 <= mark <= 100:
            raise ValueError("marks must be between 0 and 100")

    average = sum(marks) / len(marks)
    highest = max(marks)
    lowest = min(marks)

    passed = sum(mark >= pass_mark for mark in marks)
    pass_rate = (passed / len(marks)) * 100

    return {
        "average": round(average, 2),
        "highest": highest,
        "lowest": lowest,
        "pass_rate": round(pass_rate, 2)
    }


# Tests

# 1. Basic example
assert analyze_marks([40, 60, 80], 50) == {
    "average": 60.0,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 66.67
}

# 2. One mark
assert analyze_marks([75]) == {
    "average": 75.0,
    "highest": 75,
    "lowest": 75,
    "pass_rate": 100.0
}

# 3. Decimal marks
assert analyze_marks([50.5, 75.5, 90.0]) == {
    "average": 72.0,
    "highest": 90.0,
    "lowest": 50.5,
    "pass_rate": 100.0
}

# 4. Custom pass mark
assert analyze_marks([40, 60, 80], 70) == {
    "average": 60.0,
    "highest": 80,
    "lowest": 40,
    "pass_rate": 33.33
}

# 5. Empty list
try:
    analyze_marks([])
    assert False
except ValueError:
    pass

# 6. Text value
try:
    analyze_marks([40, "60", 80])
    assert False
except ValueError:
    pass

# 7. Mark below 0
try:
    analyze_marks([40, -5, 80])
    assert False
except ValueError:
    pass

# 8. Mark above 100
try:
    analyze_marks([40, 105, 80])
    assert False
except ValueError:
    pass

print("All tests passed!")
