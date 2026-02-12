import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

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
        const courseId = searchParams.get('course_id');

        if (!courseId) {
            return NextResponse.json(
                { error: 'Course ID is required' },
                { status: 400 }
            );
        }

        // Verify teacher owns the course
        const [courses] = await pool.query<RowDataPacket[]>(
            'SELECT title FROM courses WHERE course_id = ? AND teacher_id = ?',
            [courseId, payload.userId]
        );

        if (courses.length === 0) {
            return NextResponse.json(
                { error: 'Course not found or access denied' },
                { status: 404 }
            );
        }

        // Get average marks per assignment
        const [assignmentStats] = await pool.query<RowDataPacket[]>(
            `SELECT a.assignment_id, a.title, a.max_marks,
              AVG(m.marks_obtained) as avg_marks,
              COUNT(m.mark_id) as submissions
       FROM assignments a
       LEFT JOIN marks m ON a.assignment_id = m.assignment_id
       WHERE a.course_id = ?
       GROUP BY a.assignment_id
       ORDER BY a.created_at`,
            [courseId]
        );

        // Get grade distribution
        const [gradeDistribution] = await pool.query<RowDataPacket[]>(
            `SELECT m.grade, COUNT(*) as count
       FROM marks m
       JOIN assignments a ON m.assignment_id = a.assignment_id
       WHERE a.course_id = ?
       GROUP BY m.grade
       ORDER BY m.grade`,
            [courseId]
        );

        // Get top performers
        const [topStudents] = await pool.query<RowDataPacket[]>(
            `SELECT u.user_id, u.name, AVG(m.marks_obtained) as avg_marks
       FROM marks m
       JOIN assignments a ON m.assignment_id = a.assignment_id
       JOIN users u ON m.student_id = u.user_id
       WHERE a.course_id = ?
       GROUP BY u.user_id
       ORDER BY avg_marks DESC
       LIMIT 10`,
            [courseId]
        );

        // Get failing students (grade F)
        const [failingStudents] = await pool.query<RowDataPacket[]>(
            `SELECT DISTINCT u.user_id, u.name, u.email
       FROM marks m
       JOIN assignments a ON m.assignment_id = a.assignment_id
       JOIN users u ON m.student_id = u.user_id
       WHERE a.course_id = ? AND m.grade = 'F'
       ORDER BY u.name`,
            [courseId]
        );

        return NextResponse.json({
            courseTitle: courses[0].title,
            assignmentStats,
            gradeDistribution,
            topStudents,
            failingStudents,
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
