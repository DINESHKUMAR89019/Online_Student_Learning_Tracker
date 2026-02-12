import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { calculateGrade } from '@/types';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== 'teacher') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { student_id, assignment_id, marks_obtained } = await request.json();

        if (!student_id || !assignment_id || marks_obtained === undefined) {
            return NextResponse.json(
                { error: 'Student ID, assignment ID, and marks are required' },
                { status: 400 }
            );
        }

        // Get assignment details and verify teacher owns the course
        const [assignments] = await pool.query<RowDataPacket[]>(
            `SELECT a.max_marks, a.course_id 
       FROM assignments a 
       JOIN courses c ON a.course_id = c.course_id 
       WHERE a.assignment_id = ? AND c.teacher_id = ?`,
            [assignment_id, payload.userId]
        );

        if (assignments.length === 0) {
            return NextResponse.json(
                { error: 'Assignment not found or access denied' },
                { status: 404 }
            );
        }

        const assignment = assignments[0];
        const grade = calculateGrade(marks_obtained, assignment.max_marks);

        // Insert or update marks
        await pool.query(
            `INSERT INTO marks (student_id, assignment_id, marks_obtained, grade) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE marks_obtained = ?, grade = ?`,
            [student_id, assignment_id, marks_obtained, grade, marks_obtained, grade]
        );

        // Update progress
        await updateProgress(student_id, assignment.course_id);

        return NextResponse.json({
            success: true,
            grade,
        });
    } catch (error) {
        console.error('Upload marks error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

async function updateProgress(studentId: number, courseId: number) {
    // Get total assignments for the course
    const [totalAssignments] = await pool.query<RowDataPacket[]>(
        'SELECT COUNT(*) as total FROM assignments WHERE course_id = ?',
        [courseId]
    );

    // Get completed assignments for the student
    const [completedAssignments] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) as completed 
     FROM marks m 
     JOIN assignments a ON m.assignment_id = a.assignment_id 
     WHERE m.student_id = ? AND a.course_id = ?`,
        [studentId, courseId]
    );

    const total = totalAssignments[0].total;
    const completed = completedAssignments[0].completed;
    const percentage = total > 0 ? (completed / total) * 100 : 0;

    // Update or insert progress
    await pool.query(
        `INSERT INTO progress (student_id, course_id, completion_percentage) 
     VALUES (?, ?, ?) 
     ON DUPLICATE KEY UPDATE completion_percentage = ?`,
        [studentId, courseId, percentage, percentage]
    );
}

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== 'teacher') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const assignmentId = searchParams.get('assignment_id');

        if (!assignmentId) {
            return NextResponse.json(
                { error: 'Assignment ID is required' },
                { status: 400 }
            );
        }

        // Verify teacher owns the course
        const [assignments] = await pool.query<RowDataPacket[]>(
            `SELECT a.assignment_id 
       FROM assignments a 
       JOIN courses c ON a.course_id = c.course_id 
       WHERE a.assignment_id = ? AND c.teacher_id = ?`,
            [assignmentId, payload.userId]
        );

        if (assignments.length === 0) {
            return NextResponse.json(
                { error: 'Assignment not found or access denied' },
                { status: 404 }
            );
        }

        const [marks] = await pool.query<RowDataPacket[]>(
            `SELECT m.mark_id, m.student_id, u.name as student_name, 
              m.marks_obtained, m.grade, m.submitted_at 
       FROM marks m 
       JOIN users u ON m.student_id = u.user_id 
       WHERE m.assignment_id = ?`,
            [assignmentId]
        );

        return NextResponse.json({ marks });
    } catch (error) {
        console.error('Get marks error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
