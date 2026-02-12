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

        const { title, description } = await request.json();

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const [result] = await pool.query<any>(
            'INSERT INTO courses (title, description, teacher_id) VALUES (?, ?, ?)',
            [title, description || '', payload.userId]
        );

        return NextResponse.json({
            success: true,
            course_id: result.insertId,
        });
    } catch (error) {
        console.error('Create course error:', error);
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

        const [courses] = await pool.query<RowDataPacket[]>(
            'SELECT course_id, title, description, created_at FROM courses WHERE teacher_id = ? ORDER BY created_at DESC',
            [payload.userId]
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
