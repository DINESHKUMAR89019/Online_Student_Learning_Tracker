'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid } from '@mui/material';
import Navbar from '@/components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface AnalyticsData {
    marksOverTime: any[];
    gradeDistribution: any[];
    courseProgress: any[];
    stats: {
        total_courses: number;
        total_assignments: number;
        avg_marks: number;
        avg_progress: number;
    };
}

const COLORS = ['#4caf50', '#8bc34a', '#ffc107', '#ff9800', '#f44336'];

export default function StudentAnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/student/analytics');
            const data = await res.json();
            if (res.ok) setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!analytics) {
        return (
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
                <Navbar role="student" />
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                        My Analytics
                    </Typography>
                    <Card>
                        <CardContent sx={{ py: 8, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No analytics data available yet. Complete assignments to see your performance!
                            </Typography>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
        );
    }

    const marksData = analytics.marksOverTime.map(m => ({
        name: m.assignment_title,
        marks: Number(m.marks_obtained),
        maxMarks: Number(m.max_marks),
        percentage: ((Number(m.marks_obtained) / Number(m.max_marks)) * 100).toFixed(1),
    }));

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="student" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    My Analytics
                </Typography>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <CardContent>
                                <Typography variant="h4" fontWeight={700}>
                                    {analytics.stats.total_courses || 0}
                                </Typography>
                                <Typography variant="body1">Courses</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                            <CardContent>
                                <Typography variant="h4" fontWeight={700}>
                                    {analytics.stats.total_assignments || 0}
                                </Typography>
                                <Typography variant="body1">Assignments</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <CardContent>
                                <Typography variant="h4" fontWeight={700}>
                                    {analytics.stats.avg_marks ? Number(analytics.stats.avg_marks).toFixed(1) : '0'}
                                </Typography>
                                <Typography variant="body1">Avg Marks</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                            <CardContent>
                                <Typography variant="h4" fontWeight={700}>
                                    {analytics.stats.avg_progress ? Number(analytics.stats.avg_progress).toFixed(0) : '0'}%
                                </Typography>
                                <Typography variant="body1">Avg Progress</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    Marks Over Time
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={marksData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="marks" stroke="#667eea" strokeWidth={2} name="Marks Obtained" />
                                        <Line type="monotone" dataKey="maxMarks" stroke="#764ba2" strokeWidth={2} name="Max Marks" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom fontWeight={600}>
                                    Grade Distribution
                                </Typography>
                                {analytics.gradeDistribution.length === 0 ? (
                                    <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                        No grades yet
                                    </Typography>
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={analytics.gradeDistribution}
                                                dataKey="count"
                                                nameKey="grade"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label
                                            >
                                                {analytics.gradeDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom fontWeight={600}>
                            Course Progress
                        </Typography>
                        {analytics.courseProgress.length === 0 ? (
                            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                                No progress data available
                            </Typography>
                        ) : (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analytics.courseProgress}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="course_title" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="completion_percentage" fill="#667eea" name="Completion %" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
