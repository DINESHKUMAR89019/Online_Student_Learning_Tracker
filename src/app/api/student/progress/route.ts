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

        const [progress] = await pool.query<RowDataPacket[]>(
            `SELECT p.progress_id, p.completion_percentage, p.updated_at,
              c.course_id, c.title as course_title
       FROM progress p
       JOIN courses c ON p.course_id = c.course_id
       WHERE p.student_id = ?
       ORDER BY c.title`,
            [payload.userId]
        );

        return NextResponse.json({ progress });
    } catch (error) {
        console.error('Get progress error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
