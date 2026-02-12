'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AddIcon from '@mui/icons-material/Add';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';

interface Course {
    course_id: number;
    title: string;
    description: string;
    created_at: string;
}

export default function TeacherDashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

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
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="teacher" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    Teacher Dashboard
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <CardContent>
                                <SchoolIcon sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h3" fontWeight={700}>
                                    {courses.length}
                                </Typography>
                                <Typography variant="h6">Total Courses</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                            <CardContent>
                                <AssignmentIcon sx={{ fontSize: 48, mb: 2 }} />
                                <Typography variant="h6">Quick Actions</Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => router.push('/teacher/courses')}
                                    sx={{ mt: 2, bgcolor: 'white', color: '#f5576c', '&:hover': { bgcolor: '#f0f0f0' } }}
                                >
                                    Add New Course
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    My Courses
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : courses.length === 0 ? (
                    <Card>
                        <CardContent sx={{ py: 8, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No courses yet. Create your first course to get started!
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => router.push('/teacher/courses')}
                                sx={{ mt: 3 }}
                            >
                                Create Course
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {courses.map((course) => (
                            <Grid item xs={12} md={6} key={course.course_id}>
                                <Card sx={{ height: '100%', cursor: 'pointer', '&:hover': { boxShadow: 6 } }}>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight={600}>
                                            {course.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                            {course.description || 'No description'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Created: {new Date(course.created_at).toLocaleDateString()}
                                        </Typography>
                                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => router.push(`/teacher/assignments?course_id=${course.course_id}`)}
                                            >
                                                Assignments
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => router.push(`/teacher/analytics?course_id=${course.course_id}`)}
                                            >
                                                Analytics
                                            </Button>
                                        </Box>
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
