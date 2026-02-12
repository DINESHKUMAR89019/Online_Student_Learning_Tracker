export interface User {
    user_id: number;
    name: string;
    email: string;
    role: 'student' | 'teacher';
    created_at?: Date;
}

export interface Course {
    course_id: number;
    title: string;
    description: string;
    teacher_id: number;
    teacher_name?: string;
    created_at?: Date;
}

export interface Assignment {
    assignment_id: number;
    course_id: number;
    title: string;
    max_marks: number;
    created_at?: Date;
}

export interface Mark {
    mark_id: number;
    student_id: number;
    assignment_id: number;
    marks_obtained: number;
    grade: string;
    submitted_at?: Date;
    assignment_title?: string;
    max_marks?: number;
    course_title?: string;
}

export interface Progress {
    progress_id: number;
    student_id: number;
    course_id: number;
    completion_percentage: number;
    updated_at?: Date;
}

export interface Enrollment {
    enroll_id: number;
    student_id: number;
    course_id: number;
    enrolled_at?: Date;
}

export const calculateGrade = (marksObtained: number, maxMarks: number): string => {
    const percentage = (marksObtained / maxMarks) * 100;

    if (percentage >= 90) return 'A';
    if (percentage >= 75) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
};
