// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript",
};
// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
        {
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50,
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150,
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500,
        },
    ],
};
// The provided learner submission data.
const LearnerSubmissions = [
    {
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47,
        },
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150,
        },
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400,
        },
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39,
        },
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140,
        },
    },
];
function getLearnerData(course, ag, submissions) {
    // here, we would process this data to achieve the desired result.
    const result = [];
    try {
        if (course.id != ag.course_id) {
            throw `The assignment group course id is not the same as the course id.`;
        }
        // if course id equals Assignment Group Course Id code continues
        let idArr = [];
        for (let i = 0; i < submissions.length; i++) {
            //console.log(submissions[i]);
            let submission = submissions[i];
            let id = submission.learner_id;
            //console.log(idArr.indexOf(id))
            //checking if the current learner_id is not in the idArr
            // -1 means that the id is not present
            // if not, create new report then add it to the result array
            if (idArr.indexOf(id) == -1) {
                const report = {};
                report.id = id;
                //console.log(report)
                report.score = 0;
                report.pointsPossible = 0;
                result.push(report);
                idArr.push(id);
            } //console.log(i)
            // passing the result of the findPointsPossible function into the pointsPossible variable
            let pointsPossible = findPointsPossible(
                ag.assignments,
                submission.assignment_id
            );
            // checking to see if pointsPossible are valid. If valid we continue through the else statement.
            if (pointsPossible <= 0) {
                throw `The points possible are invalid.`;
            } else {
                let score = isLate(
                    submission.submission.submitted_at,
                    findDueAt(ag.assignments, submission.assignment_id),
                    submission.submission.score,
                    pointsPossible);

                let reportIndex = findReport(result, id);

                if (reportIndex > -1 && submission.assignment_id < 3) {
                    let report = result[reportIndex];
                    report.score += score;

                    if (pointsPossible > -1) {
                        report.pointsPossible += pointsPossible;
                        let grade = score / pointsPossible;
                        report[submission.assignment_id] = grade;
                    }
                }
            }
        }
        calculateAverage(result);

        //console.log(idArr);

        //   const result = [
        //     {
        //       id: 125,
        //       avg: 0.985, // (47 + 150) / (50 + 150)
        //       1: 0.94, // 47 / 50
        //       2: 1.0 // 150 / 150
        //     },
        //     {
        //       id: 132,
        //       avg: 0.82, // (39 + 125) / (50 + 150)
        //       1: 0.78, // 39 / 50
        //       2: 0.833 // late: (140 - 15) / 150
        //     }
        //   ];
    } catch (error) {
        console.log(error);
    }

    return result;
}

function findReport(result, learner_id) {
    for (let i = 0; i < result.length; i++) {
        // result[i] represents the report object
        if  (result[i].id != learner_id) {
            continue
        }
            return i;
    }
    return -1;
}

function findPointsPossible(assignments, assignment_id) {
    for (const assignment of assignments)  {
            if (assignment.id === assignment_id) {
            return assignment.points_possible;
        }
    }
    return -1;
}

function findDueAt(assignments, assignment_id) {
    for (let i = 0; i < assignments.length; i++) {
        if (assignments[i].id === assignment_id) {
            return assignments[i].due_at;
        }
    }
    return "";
}

function isLate(submittedAt, dueAt, score, pointsPossible) {
    let assignmentIsLate = submittedAt > dueAt && score > pointsPossible * 0.1;
    if (assignmentIsLate) {
        return score - pointsPossible * 0.1;
    }
    return score;
}

function calculateAverage(result) {
    for (let i = 0; i < result.length; i++) {
        let report = result[i];
        let average = report.score / report.pointsPossible;
        report.avg = average;
        delete report.pointsPossible;
        delete report.score;
    }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);
