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
            'SELECT course_id FROM courses WHERE course_id = ? AND teacher_id = ?',
            [courseId, payload.userId]
        );

        if (courses.length === 0) {
            return NextResponse.json(
                { error: 'Course not found or access denied' },
                { status: 404 }
            );
        }

        // Get enrolled students
        const [students] = await pool.query<RowDataPacket[]>(
            `SELECT u.user_id, u.name, u.email, e.enrolled_at 
       FROM enrollments e 
       JOIN users u ON e.student_id = u.user_id 
       WHERE e.course_id = ? 
       ORDER BY u.name`,
            [courseId]
        );

        return NextResponse.json({ students });
    } catch (error) {
        console.error('Get students error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
