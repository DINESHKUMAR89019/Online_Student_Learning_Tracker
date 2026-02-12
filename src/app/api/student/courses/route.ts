import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

// Get all available courses
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

        const [courses] = await pool.query<RowDataPacket[]>(
            `SELECT c.course_id, c.title, c.description, c.created_at,
              u.name as teacher_name,
              CASE WHEN e.enroll_id IS NOT NULL THEN 1 ELSE 0 END as is_enrolled,
              COALESCE(p.completion_percentage, 0) as progress
       FROM courses c
       JOIN users u ON c.teacher_id = u.user_id
       LEFT JOIN enrollments e ON c.course_id = e.course_id AND e.student_id = ?
       LEFT JOIN progress p ON c.course_id = p.course_id AND p.student_id = ?
       ORDER BY c.created_at DESC`,
            [payload.userId, payload.userId]
        );

        return NextResponse.json({ courses });
    } catch (error) {
        console.error('Get courses error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
