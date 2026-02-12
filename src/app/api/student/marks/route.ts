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

        const [marks] = await pool.query<RowDataPacket[]>(
            `SELECT m.mark_id, m.marks_obtained, m.grade, m.submitted_at,
              a.title as assignment_title, a.max_marks,
              c.title as course_title, c.course_id
       FROM marks m
       JOIN assignments a ON m.assignment_id = a.assignment_id
       JOIN courses c ON a.course_id = c.course_id
       WHERE m.student_id = ?
       ORDER BY c.course_id, m.submitted_at DESC`,
            [payload.userId]
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
