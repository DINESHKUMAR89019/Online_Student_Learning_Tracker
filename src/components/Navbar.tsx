'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useRouter, usePathname } from 'next/navigation';

interface NavbarProps {
    role?: 'student' | 'teacher';
    userName?: string;
}

export default function Navbar({ role, userName }: NavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    const studentLinks = [
        { label: 'Dashboard', path: '/student/dashboard' },
        { label: 'Courses', path: '/student/courses' },
        { label: 'Marks', path: '/student/marks' },
        { label: 'Progress', path: '/student/progress' },
        { label: 'Analytics', path: '/student/analytics' },
    ];

    const teacherLinks = [
        { label: 'Dashboard', path: '/teacher/dashboard' },
        { label: 'Courses', path: '/teacher/courses' },
        { label: 'Assignments', path: '/teacher/assignments' },
        { label: 'Upload Marks', path: '/teacher/upload-marks' },
        { label: 'Analytics', path: '/teacher/analytics' },
    ];

    const links = role === 'teacher' ? teacherLinks : studentLinks;

    const drawer = (
        <Box sx={{ width: 250 }} onClick={() => setDrawerOpen(false)}>
            <List>
                {links.map((link) => (
                    <ListItem
                        key={link.path}
                        onClick={() => router.push(link.path)}
                        sx={{
                            cursor: 'pointer',
                            bgcolor: pathname === link.path ? 'primary.light' : 'transparent',
                        }}
                    >
                        <ListItemText primary={link.label} />
                    </ListItem>
                ))}
                <ListItem onClick={handleLogout} sx={{ cursor: 'pointer' }}>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <Toolbar>
                    {isMobile && (
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={() => setDrawerOpen(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        📚 Learning Tracker
                    </Typography>
                    {!isMobile && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {links.map((link) => (
                                <Button
                                    key={link.path}
                                    color="inherit"
                                    onClick={() => router.push(link.path)}
                                    sx={{
                                        fontWeight: pathname === link.path ? 700 : 400,
                                        borderBottom: pathname === link.path ? '2px solid white' : 'none',
                                    }}
                                >
                                    {link.label}
                                </Button>
                            ))}
                        </Box>
                    )}
                    {userName && (
                        <Typography variant="body2" sx={{ ml: 2, mr: 2 }}>
                            {userName}
                        </Typography>
                    )}
                    {!isMobile && (
                        <Button color="inherit" onClick={handleLogout} variant="outlined">
                            Logout
                        </Button>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                {drawer}
            </Drawer>
        </>
    );
}
