'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Button, Grid, Chip, Alert } from '@mui/material';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Course {
    course_id: number;
    title: string;
    description: string;
    teacher_name: string;
    is_enrolled: number;
    progress: number;
}

export default function StudentCoursesPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/student/courses');
            const data = await res.json();
            if (res.ok) setCourses(data.courses);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleEnroll = async (courseId: number) => {
        setError('');
        setSuccess('');
        setLoading(courseId);

        try {
            const res = await fetch('/api/student/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ course_id: courseId }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to enroll');
                setLoading(null);
                return;
            }

            setSuccess('Successfully enrolled in course!');
            fetchCourses();
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    const enrolledCourses = courses.filter(c => c.is_enrolled);
    const availableCourses = courses.filter(c => !c.is_enrolled);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="student" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    Courses
                </Typography>

                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    My Enrolled Courses ({enrolledCourses.length})
                </Typography>

                {enrolledCourses.length === 0 ? (
                    <Card sx={{ mb: 4 }}>
                        <CardContent sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                You haven't enrolled in any courses yet. Browse available courses below!
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {enrolledCourses.map((course) => (
                            <Grid item xs={12} md={6} key={course.course_id}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                                            <Typography variant="h6" fontWeight={600}>
                                                {course.title}
                                            </Typography>
                                            <Chip
                                                icon={<CheckCircleIcon />}
                                                label="Enrolled"
                                                color="success"
                                                size="small"
                                            />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {course.description || 'No description'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                            Teacher: {course.teacher_name}
                                        </Typography>
                                        <ProgressBar value={course.progress} label="Course Progress" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Available Courses ({availableCourses.length})
                </Typography>

                {availableCourses.length === 0 ? (
                    <Card>
                        <CardContent sx={{ py: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                No more courses available at the moment.
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {availableCourses.map((course) => (
                            <Grid item xs={12} md={6} key={course.course_id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" fontWeight={600} gutterBottom>
                                            {course.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {course.description || 'No description'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
                                            Teacher: {course.teacher_name}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => handleEnroll(course.course_id)}
                                            disabled={loading === course.course_id}
                                        >
                                            {loading === course.course_id ? 'Enrolling...' : 'Enroll Now'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>
        </Box>
    );
}
