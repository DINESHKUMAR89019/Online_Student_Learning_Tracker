'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, TextField, Button, Alert, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Navbar from '@/components/Navbar';
import GradeBadge from '@/components/GradeBadge';

interface Course {
    course_id: number;
    title: string;
}

interface Assignment {
    assignment_id: number;
    title: string;
    max_marks: number;
}

interface Student {
    user_id: number;
    name: string;
    email: string;
}

export default function UploadMarksPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState('');
    const [marks, setMarks] = useState<Record<number, string>>({});
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchAssignments();
            fetchStudents();
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/teacher/courses');
            const data = await res.json();
            if (res.ok) setCourses(data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchAssignments = async () => {
        if (!selectedCourse) return;
        try {
            const res = await fetch(`/api/teacher/assignments?course_id=${selectedCourse}`);
            const data = await res.json();
            if (res.ok) setAssignments(data.assignments);
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const fetchStudents = async () => {
        if (!selectedCourse) return;
        try {
            const res = await fetch(`/api/teacher/students?course_id=${selectedCourse}`);
            const data = await res.json();
            if (res.ok) setStudents(data.students);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleMarksChange = (studentId: number, value: string) => {
        setMarks({ ...marks, [studentId]: value });
    };

    const handleSubmit = async (studentId: number) => {
        if (!marks[studentId]) return;

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('/api/teacher/marks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student_id: studentId,
                    assignment_id: parseInt(selectedAssignment),
                    marks_obtained: parseFloat(marks[studentId]),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to upload marks');
                setLoading(false);
                return;
            }

            setSuccess(`Marks uploaded successfully! Grade: ${data.grade}`);
            setMarks({ ...marks, [studentId]: '' });
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectedAssignmentData = assignments.find(a => a.assignment_id === parseInt(selectedAssignment));

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="teacher" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    Upload Student Marks
                </Typography>

                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Course</InputLabel>
                                    <Select
                                        value={selectedCourse}
                                        label="Select Course"
                                        onChange={(e: SelectChangeEvent) => setSelectedCourse(e.target.value)}
                                    >
                                        {courses.map((course) => (
                                            <MenuItem key={course.course_id} value={course.course_id}>
                                                {course.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth disabled={!selectedCourse}>
                                    <InputLabel>Select Assignment</InputLabel>
                                    <Select
                                        value={selectedAssignment}
                                        label="Select Assignment"
                                        onChange={(e: SelectChangeEvent) => setSelectedAssignment(e.target.value)}
                                    >
                                        {assignments.map((assignment) => (
                                            <MenuItem key={assignment.assignment_id} value={assignment.assignment_id}>
                                                {assignment.title} (Max: {assignment.max_marks})
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {selectedCourse && selectedAssignment && (
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom fontWeight={600}>
                                Students Enrolled ({students.length})
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Max Marks: {selectedAssignmentData?.max_marks}
                            </Typography>

                            {students.length === 0 ? (
                                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                    No students enrolled in this course
                                </Typography>
                            ) : (
                                <TableContainer component={Paper} variant="outlined">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>Student Name</strong></TableCell>
                                                <TableCell><strong>Email</strong></TableCell>
                                                <TableCell><strong>Marks</strong></TableCell>
                                                <TableCell><strong>Action</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {students.map((student) => (
                                                <TableRow key={student.user_id}>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.email}</TableCell>
                                                    <TableCell>
                                                        <TextField
                                                            size="small"
                                                            type="number"
                                                            placeholder="Enter marks"
                                                            value={marks[student.user_id] || ''}
                                                            onChange={(e) => handleMarksChange(student.user_id, e.target.value)}
                                                            inputProps={{ max: selectedAssignmentData?.max_marks, min: 0 }}
                                                            sx={{ width: 150 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            onClick={() => handleSubmit(student.user_id)}
                                                            disabled={!marks[student.user_id] || loading}
                                                        >
                                                            Submit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                )}
            </Container>
        </Box>
    );
}
