import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== 'student') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { course_id } = await request.json();

        if (!course_id) {
            return NextResponse.json(
                { error: 'Course ID is required' },
                { status: 400 }
            );
        }

        // Check if already enrolled
        const [existing] = await pool.query<RowDataPacket[]>(
            'SELECT enroll_id FROM enrollments WHERE student_id = ? AND course_id = ?',
            [payload.userId, course_id]
        );

        if (existing.length > 0) {
            return NextResponse.json(
                { error: 'Already enrolled in this course' },
                { status: 409 }
            );
        }

        // Enroll student
        await pool.query(
            'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
            [payload.userId, course_id]
        );

        // Initialize progress
        await pool.query(
            'INSERT INTO progress (student_id, course_id, completion_percentage) VALUES (?, ?, 0)',
            [payload.userId, course_id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Enroll error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
