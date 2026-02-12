'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, TextField, Button, Alert, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Navbar from '@/components/Navbar';
import AddIcon from '@mui/icons-material/Add';

interface Course {
    course_id: number;
    title: string;
}

interface Assignment {
    assignment_id: number;
    title: string;
    max_marks: number;
    created_at: string;
}

export default function TeacherAssignmentsPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [title, setTitle] = useState('');
    const [maxMarks, setMaxMarks] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchAssignments();
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/teacher/courses');
            const data = await res.json();
            if (res.ok) {
                setCourses(data.courses);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchAssignments = async () => {
        if (!selectedCourse) return;
        try {
            const res = await fetch(`/api/teacher/assignments?course_id=${selectedCourse}`);
            const data = await res.json();
            if (res.ok) {
                setAssignments(data.assignments);
            }
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('/api/teacher/assignments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    course_id: parseInt(selectedCourse),
                    title,
                    max_marks: parseInt(maxMarks),
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to create assignment');
                setLoading(false);
                return;
            }

            setSuccess('Assignment created successfully!');
            setTitle('');
            setMaxMarks('');
            fetchAssignments();
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="teacher" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    Assignment Management
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    Create New Assignment
                                </Typography>

                                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                                <FormControl fullWidth sx={{ mb: 2 }}>
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

                                {selectedCourse && (
                                    <form onSubmit={handleSubmit}>
                                        <TextField
                                            fullWidth
                                            label="Assignment Title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                            sx={{ mb: 2 }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Maximum Marks"
                                            type="number"
                                            value={maxMarks}
                                            onChange={(e) => setMaxMarks(e.target.value)}
                                            required
                                            sx={{ mb: 3 }}
                                        />
                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            disabled={loading}
                                        >
                                            {loading ? 'Creating...' : 'Create Assignment'}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    Assignments ({assignments.length})
                                </Typography>

                                {!selectedCourse ? (
                                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                        Select a course to view assignments
                                    </Typography>
                                ) : assignments.length === 0 ? (
                                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                        No assignments yet. Create your first assignment!
                                    </Typography>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                        {assignments.map((assignment) => (
                                            <Card key={assignment.assignment_id} variant="outlined">
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                        <Box>
                                                            <Typography variant="h6" fontWeight={600}>
                                                                {assignment.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Max Marks: {assignment.max_marks}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Created: {new Date(assignment.created_at).toLocaleDateString()}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
