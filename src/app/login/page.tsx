'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, Container, Link as MuiLink } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting login with:', email);
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include', // Important: include cookies
            });

            console.log('Login response status:', res.status);
            const data = await res.json();
            console.log('Login response data:', data);

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            // Redirect based on role - use setTimeout to ensure cookie is set
            console.log('Login successful, redirecting to:', data.user.role);
            const dashboardUrl = data.user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';

            // Small delay to ensure cookie is set, then redirect
            setTimeout(() => {
                window.location.href = dashboardUrl;
            }, 100);
        } catch (err) {
            console.error('Login error:', err);
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
                            Sign in to your account
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
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
                                sx={{ mb: 3 }}
                            />
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
                                {loading ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>

                        <Typography align="center" sx={{ mt: 3 }}>
                            Don't have an account?{' '}
                            <Link href="/register" passHref legacyBehavior>
                                <MuiLink sx={{ fontWeight: 600, cursor: 'pointer' }}>
                                    Register here
                                </MuiLink>
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
