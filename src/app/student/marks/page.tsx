'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Navbar from '@/components/Navbar';
import GradeBadge from '@/components/GradeBadge';

interface Mark {
    assignment_title: string;
    marks_obtained: number;
    max_marks: number;
    grade: string;
    course_title: string;
    submitted_at: string;
}

export default function StudentMarksPage() {
    const [marks, setMarks] = useState<Mark[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMarks();
    }, []);

    const fetchMarks = async () => {
        try {
            const res = await fetch('/api/student/marks');
            const data = await res.json();
            if (res.ok) setMarks(data.marks);
        } catch (error) {
            console.error('Error fetching marks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Group marks by course
    const marksByCourse = marks.reduce((acc, mark) => {
        if (!acc[mark.course_title]) {
            acc[mark.course_title] = [];
        }
        acc[mark.course_title].push(mark);
        return acc;
    }, {} as Record<string, Mark[]>);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="student" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    My Marks & Grades
                </Typography>

                {marks.length === 0 ? (
                    <Card>
                        <CardContent sx={{ py: 8, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No marks available yet. Complete assignments to see your grades here!
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {Object.entries(marksByCourse).map(([courseTitle, courseMarks]) => (
                            <Card key={courseTitle}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom fontWeight={600}>
                                        {courseTitle}
                                    </Typography>
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong>Assignment</strong></TableCell>
                                                    <TableCell><strong>Marks Obtained</strong></TableCell>
                                                    <TableCell><strong>Max Marks</strong></TableCell>
                                                    <TableCell><strong>Percentage</strong></TableCell>
                                                    <TableCell><strong>Grade</strong></TableCell>
                                                    <TableCell><strong>Date</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {courseMarks.map((mark, index) => {
                                                    const percentage = ((mark.marks_obtained / mark.max_marks) * 100).toFixed(1);
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>{mark.assignment_title}</TableCell>
                                                            <TableCell>{mark.marks_obtained}</TableCell>
                                                            <TableCell>{mark.max_marks}</TableCell>
                                                            <TableCell>{percentage}%</TableCell>
                                                            <TableCell>
                                                                <GradeBadge grade={mark.grade} />
                                                            </TableCell>
                                                            <TableCell>
                                                                {new Date(mark.submitted_at).toLocaleDateString()}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
