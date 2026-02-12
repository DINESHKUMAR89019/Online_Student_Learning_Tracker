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
        if (!payload || payload.role !== 'student') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get marks over time for line chart
        const [marksOverTime] = await pool.query<RowDataPacket[]>(
            `SELECT m.marks_obtained, m.submitted_at, a.title as assignment_title,
              a.max_marks, c.title as course_title
       FROM marks m
       JOIN assignments a ON m.assignment_id = a.assignment_id
       JOIN courses c ON a.course_id = c.course_id
       WHERE m.student_id = ?
       ORDER BY m.submitted_at`,
            [payload.userId]
        );

        // Get grade distribution
        const [gradeDistribution] = await pool.query<RowDataPacket[]>(
            `SELECT grade, COUNT(*) as count
       FROM marks
       WHERE student_id = ?
       GROUP BY grade
       ORDER BY grade`,
            [payload.userId]
        );

        // Get progress by course
        const [courseProgress] = await pool.query<RowDataPacket[]>(
            `SELECT c.title as course_title, p.completion_percentage
       FROM progress p
       JOIN courses c ON p.course_id = c.course_id
       WHERE p.student_id = ?
       ORDER BY c.title`,
            [payload.userId]
        );

        // Get overall statistics
        const [stats] = await pool.query<RowDataPacket[]>(
            `SELECT 
         COUNT(DISTINCT e.course_id) as total_courses,
         COUNT(m.mark_id) as total_assignments,
         AVG(m.marks_obtained) as avg_marks,
         AVG(p.completion_percentage) as avg_progress
       FROM enrollments e
       LEFT JOIN marks m ON m.student_id = e.student_id
       LEFT JOIN progress p ON p.student_id = e.student_id AND p.course_id = e.course_id
       WHERE e.student_id = ?`,
            [payload.userId]
        );

        return NextResponse.json({
            marksOverTime,
            gradeDistribution,
            courseProgress,
            stats: stats[0] || {},
        });
    } catch (error) {
        console.error('Get analytics error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
