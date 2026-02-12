'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';
import GradeBadge from '@/components/GradeBadge';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface Stats {
    total_courses: number;
    total_assignments: number;
    avg_marks: number;
    avg_progress: number;
}

interface Course {
    course_id: number;
    title: string;
    teacher_name: string;
    progress: number;
}

interface RecentMark {
    assignment_title: string;
    marks_obtained: number;
    grade: string;
    course_title: string;
}

export default function StudentDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [recentMarks, setRecentMarks] = useState<RecentMark[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [analyticsRes, coursesRes, marksRes] = await Promise.all([
                fetch('/api/student/analytics'),
                fetch('/api/student/courses'),
                fetch('/api/student/marks'),
            ]);

            const [analyticsData, coursesData, marksData] = await Promise.all([
                analyticsRes.json(),
                coursesRes.json(),
                marksRes.json(),
            ]);

            if (analyticsRes.ok) setStats(analyticsData.stats);
            if (coursesRes.ok) {
                const enrolledCourses = coursesData.courses.filter((c: any) => c.is_enrolled);
                setCourses(enrolledCourses);
            }
            if (marksRes.ok) setRecentMarks(marksData.marks.slice(0, 5));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Navbar role="student" />
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="student" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    Student Dashboard
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <CardContent>
                                <SchoolIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight={700}>
                                    {stats?.total_courses || 0}
                                </Typography>
                                <Typography variant="h6">Enrolled Courses</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                            <CardContent>
                                <AssignmentIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight={700}>
                                    {stats?.total_assignments || 0}
                                </Typography>
                                <Typography variant="h6">Assignments</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <CardContent>
                                <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight={700}>
                                    {stats?.avg_marks ? stats.avg_marks.toFixed(1) : '0'}
                                </Typography>
                                <Typography variant="h6">Average Marks</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    My Courses
                                </Typography>
                                {courses.length === 0 ? (
                                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                        No courses enrolled yet
                                    </Typography>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                        {courses.map((course) => (
                                            <Card key={course.course_id} variant="outlined">
                                                <CardContent>
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {course.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                        Teacher: {course.teacher_name}
                                                    </Typography>
                                                    <ProgressBar value={course.progress} label="Progress" />
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    Recent Grades
                                </Typography>
                                {recentMarks.length === 0 ? (
                                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                        No grades yet
                                    </Typography>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                        {recentMarks.map((mark, index) => (
                                            <Card key={index} variant="outlined">
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Box>
                                                            <Typography variant="body1" fontWeight={600}>
                                                                {mark.assignment_title}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {mark.course_title}
                                                            </Typography>
                                                        </Box>
                                                        <Box sx={{ textAlign: 'right' }}>
                                                            <GradeBadge grade={mark.grade} />
                                                            <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                                {mark.marks_obtained} marks
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
