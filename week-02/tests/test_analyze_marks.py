
def test_analyze_marks(analyze_marks):
    # Test 1
    result = analyze_marks([40, 60, 80], 50)
    assert result["average"] == 60
    assert result["highest"] == 80
    assert result["lowest"] == 40
    assert result["pass_rate"] == 66.67

    # Test 2
    result = analyze_marks([100], 50)
    assert result["average"] == 100
    assert result["highest"] == 100
    assert result["lowest"] == 100
    assert result["pass_rate"] == 100

    # Test 3
    result = analyze_marks([49.5, 50], 50)
    assert result["average"] == 49.75
    assert result["highest"] == 50
    assert result["lowest"] == 49.5
    assert result["pass_rate"] == 50

    # Test 4
    try:
        analyze_marks([], 50)
        assert False
    except ValueError:
        pass

    # Test 5
    try:
        analyze_marks([40, "60"], 50)
        assert False
    except ValueError:
        pass

    # Test 6
    try:
        analyze_marks([-1, 50, 101], 50)
        assert False
    except ValueError:
        pass
