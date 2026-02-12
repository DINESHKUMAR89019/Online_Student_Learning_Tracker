'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Grid } from '@mui/material';
import Navbar from '@/components/Navbar';
import ProgressBar from '@/components/ProgressBar';

interface Progress {
    course_title: string;
    completion_percentage: number;
    updated_at: string;
}

export default function StudentProgressPage() {
    const [progress, setProgress] = useState<Progress[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const res = await fetch('/api/student/progress');
            const data = await res.json();
            if (res.ok) setProgress(data.progress);
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const overallProgress = progress.length > 0
        ? progress.reduce((sum, p) => sum + p.completion_percentage, 0) / progress.length
        : 0;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Navbar role="student" />
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>
                    My Progress
                </Typography>

                <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Overall Progress
                        </Typography>
                        <Typography variant="h3" fontWeight={700} sx={{ mb: 2 }}>
                            {overallProgress.toFixed(1)}%
                        </Typography>
                        <Box sx={{ bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 2, p: 0.5 }}>
                            <Box
                                sx={{
                                    width: `${overallProgress}%`,
                                    height: 20,
                                    bgcolor: 'white',
                                    borderRadius: 2,
                                    transition: 'width 0.3s ease',
                                }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {progress.length === 0 ? (
                    <Card>
                        <CardContent sx={{ py: 8, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary">
                                No progress data available. Enroll in courses and complete assignments!
                            </Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Grid container spacing={3}>
                        {progress.map((item, index) => (
                            <Grid item xs={12} md={6} key={index}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom fontWeight={600}>
                                            {item.course_title}
                                        </Typography>
                                        <ProgressBar value={item.completion_percentage} />
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                            Last updated: {new Date(item.updated_at).toLocaleDateString()}
                                        </Typography>
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
