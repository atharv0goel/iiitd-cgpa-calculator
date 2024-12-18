__USER__INPUT__ = True

if __name__ == "__main__":
    # Prompt the user for their semester-wise SGPAs
    if __USER__INPUT__:
        sgpas = []
        n_regular_sems = int(input("Number of regular semesters: "))
        n_summer_sems = int(input("Number of summer semesters: "))

        for sem in range(1, n_regular_sems+1):
            _sgpa = input(f"SGPA for Semester {sem}: ")
            _creds = input(f"# Graded Credits for Semester {sem}: ")
            sgpas.append( (float(_sgpa), float(_creds)) )

        for summer_sem in range(1, n_summer_sems+1):
            _sgpa = input(f"Enter SGPA for Summer Semester {summer_sem}: ")
            _creds = input(f"# Graded Credits for Summer Semester {summer_sem}: ")
            sgpas.append( (float(_sgpa), float(_creds)) )

        n_OC_creds = int(input("# Credits of OC/TA bucket: "))
    else:
        n_regular_sems = 7
        n_OC_creds = 6
        sgpas = [
            (10.0, 20),
            (10.0, 20),
            (10.0, 20),
            (10.0, 20),
            (10.0, 20),
            (10.0, 16),
            (10.0, 16),

            (10.0, 4),
            (10.0, 4)
        ]

    # sum up the number of credits across the tuples
    graded_creds = sum([creds for _, creds in sgpas])
    if n_regular_sems > 5:
        if n_regular_sems == 6:
            baseline = 116
        elif n_regular_sems == 7:
            baseline = 136
        else:
            baseline = 156
    total_creds = graded_creds + n_OC_creds

    N = max(0, total_creds - baseline)
    n_removal = min(8, N)
    n_extra = N - n_removal

    # prompt for their worst credits
    worst_grades = []
    print(f"You can remove {n_removal} credits. Enter the grades for the {n_removal} worst credits.")
    for i in range(n_removal // 4):
        _grade = float(input(f"Enter grade for the {i+1}th worst grade: "))
        _creds = int(input(f"Enter credits for the {i+1}th worst grade: "))
        worst_grades.append((_grade, _creds))

    numerator = 0
    for grade, creds in sgpas:
        numerator += grade * creds

    for grade, creds in worst_grades:
        numerator -= grade * creds

    denominator = baseline - n_OC_creds + n_extra

    print("--------------------")
    print(f"Total Credits: {total_creds}")
    print(f"Graded Credits: {graded_creds}")
    print(f"Number of OC/TA credits: {n_OC_creds}")
    print("--------------------")
    print(f"Baseline: {baseline}")
    print(f"Number of credits to remove: {n_removal}")
    print(f"Number of extra credits above removal: {n_extra}")
    print(f"Denominator: {denominator}")
    print("--------------------")
    cgpa = numerator / denominator
    print(f"CGPA: {cgpa:.2f}")
    print("--------------------")