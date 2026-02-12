'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Container, Link as MuiLink, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'teacher'>('student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Registration failed');
                setLoading(false);
                return;
            }

            // Redirect based on role
            const dashboardUrl = role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
            router.push(dashboardUrl);
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 2,
            }}
        >
            <Container maxWidth="sm">
                <Card sx={{ borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                            📚 Learning Tracker
                        </Typography>
                        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                            Create your account
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                sx={{ mb: 2 }}
                            />
                            <FormControl fullWidth sx={{ mb: 3 }}>
                                <InputLabel>I am a</InputLabel>
                                <Select
                                    value={role}
                                    label="I am a"
                                    onChange={(e) => setRole(e.target.value as 'student' | 'teacher')}
                                >
                                    <MenuItem value="student">Student</MenuItem>
                                    <MenuItem value="teacher">Teacher</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                }}
                            >
                                {loading ? 'Creating account...' : 'Register'}
                            </Button>
                        </form>

                        <Typography align="center" sx={{ mt: 3 }}>
                            Already have an account?{' '}
                            <Link href="/login" passHref legacyBehavior>
                                <MuiLink sx={{ fontWeight: 600, cursor: 'pointer' }}>
                                    Sign in here
                                </MuiLink>
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
