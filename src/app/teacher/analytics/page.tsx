'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import Navbar from '@/components/Navbar';
import GradeBadge from '@/components/GradeBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Course {
    course_id: number;
    title: string;
}

interface AnalyticsData {
    courseTitle: string;
    assignmentStats: any[];
    gradeDistribution: any[];
    topStudents: any[];
    failingStudents: any[];
}

const COLORS = ['#4caf50', '#8bc34a', '#ffc107', '#ff9800', '#f44336'];

export default function TeacherAnalyticsPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchAnalytics();
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

    const fetchAnalytics = async () => {
        if (!selectedCourse) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/teacher/analytics?course_id=${selectedCourse}`);
            const data = await res.json();
            if (res.ok) setAnalytics(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="teacher" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    Course Analytics
                </Typography>

                <Card sx={{ mb: 4 }}>
                    <CardContent>
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
                    </CardContent>
                </Card>

                {analytics && (
                    <>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                            {analytics.courseTitle}
                        </Typography>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={8}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight={600}>
                                            Assignment Performance
                                        </Typography>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={analytics.assignmentStats}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="title" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="avg_marks" fill="#667eea" name="Average Marks" />
                                                <Bar dataKey="max_marks" fill="#764ba2" name="Max Marks" />
                                            </BarChart>
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
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight={600}>
                                            Top Performers
                                        </Typography>
                                        {analytics.topStudents.length === 0 ? (
                                            <Typography color="text.secondary">No data available</Typography>
                                        ) : (
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell><strong>Rank</strong></TableCell>
                                                            <TableCell><strong>Student</strong></TableCell>
                                                            <TableCell><strong>Avg Marks</strong></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {analytics.topStudents.map((student, index) => (
                                                            <TableRow key={student.user_id}>
                                                                <TableCell>{index + 1}</TableCell>
                                                                <TableCell>{student.name}</TableCell>
                                                                <TableCell>{Number(student.avg_marks || 0).toFixed(2)}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight={600}>
                                            Students Needing Attention (Grade F)
                                        </Typography>
                                        {analytics.failingStudents.length === 0 ? (
                                            <Typography color="text.secondary">No students with failing grades</Typography>
                                        ) : (
                                            <TableContainer>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell><strong>Student</strong></TableCell>
                                                            <TableCell><strong>Email</strong></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {analytics.failingStudents.map((student) => (
                                                            <TableRow key={student.user_id}>
                                                                <TableCell>{student.name}</TableCell>
                                                                <TableCell>{student.email}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )}
            </Container>
        </Box>
    );
}
