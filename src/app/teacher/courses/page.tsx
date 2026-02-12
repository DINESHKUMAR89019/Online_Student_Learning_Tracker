'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, TextField, Button, Alert, Grid } from '@mui/material';
import Navbar from '@/components/Navbar';
import AddIcon from '@mui/icons-material/Add';

interface Course {
    course_id: number;
    title: string;
    description: string;
}

export default function TeacherCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('/api/teacher/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to create course');
                setLoading(false);
                return;
            }

            setSuccess('Course created successfully!');
            setTitle('');
            setDescription('');
            fetchCourses();
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
                    Course Management
                </Typography>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    Create New Course
                                </Typography>

                                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                                <form onSubmit={handleSubmit}>
                                    <TextField
                                        fullWidth
                                        label="Course Title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        multiline
                                        rows={4}
                                        sx={{ mb: 3 }}
                                    />
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        disabled={loading}
                                    >
                                        {loading ? 'Creating...' : 'Create Course'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    My Courses ({courses.length})
                                </Typography>

                                {courses.length === 0 ? (
                                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                        No courses yet. Create your first course!
                                    </Typography>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                        {courses.map((course) => (
                                            <Card key={course.course_id} variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {course.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {course.description || 'No description'}
                                                    </Typography>
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
