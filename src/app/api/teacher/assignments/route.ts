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
        if (!payload || payload.role !== 'teacher') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { course_id, title, max_marks } = await request.json();

        if (!course_id || !title || !max_marks) {
            return NextResponse.json(
                { error: 'Course ID, title, and max marks are required' },
                { status: 400 }
            );
        }

        // Verify the course belongs to this teacher
        const [courses] = await pool.query<RowDataPacket[]>(
            'SELECT course_id FROM courses WHERE course_id = ? AND teacher_id = ?',
            [course_id, payload.userId]
        );

        if (courses.length === 0) {
            return NextResponse.json(
                { error: 'Course not found or access denied' },
                { status: 404 }
            );
        }

        const [result] = await pool.query<any>(
            'INSERT INTO assignments (course_id, title, max_marks) VALUES (?, ?, ?)',
            [course_id, title, max_marks]
        );

        return NextResponse.json({
            success: true,
            assignment_id: result.insertId,
        });
    } catch (error) {
        console.error('Create assignment error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
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
        const courseId = searchParams.get('course_id');

        if (!courseId) {
            return NextResponse.json(
                { error: 'Course ID is required' },
                { status: 400 }
            );
        }

        // Verify the course belongs to this teacher
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

        const [assignments] = await pool.query<RowDataPacket[]>(
            'SELECT assignment_id, title, max_marks, created_at FROM assignments WHERE course_id = ? ORDER BY created_at DESC',
            [courseId]
        );

        return NextResponse.json({ assignments });
    } catch (error) {
        console.error('Get assignments error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
