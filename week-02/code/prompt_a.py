
# Python Program to Analyze Student Marks

marks = []

n = int(input("Enter number of subjects: "))

for i in range(n):
    mark = float(input(f"Enter mark for subject {i + 1}: "))
    marks.append(mark)

# Calculate statistics
total = sum(marks)
average = total / n
highest = max(marks)
lowest = min(marks)

# Determine grade
if average >= 90:
    grade = "A+"
elif average >= 80:
    grade = "A"
elif average >= 70:
    grade = "B"
elif average >= 60:
    grade = "C"
elif average >= 50:
    grade = "D"
else:
    grade = "F"

# Display results
print("\n--- Student Marks Analysis ---")
print("Total Marks:", total)
print("Average Marks:", round(average, 2))
print("Highest Mark:", highest)
print("Lowest Mark:", lowest)
print("Grade:", grade)
