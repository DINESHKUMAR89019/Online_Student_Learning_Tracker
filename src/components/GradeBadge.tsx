'use client';

import React from 'react';
import { Chip } from '@mui/material';

interface GradeBadgeProps {
    grade: string;
}

const gradeColors: Record<string, string> = {
    A: '#4caf50',
    B: '#8bc34a',
    C: '#ffc107',
    D: '#ff9800',
    F: '#f44336',
};

export default function GradeBadge({ grade }: GradeBadgeProps) {
    return (
        <Chip
            label={grade}
            sx={{
                bgcolor: gradeColors[grade] || '#9e9e9e',
                color: 'white',
                fontWeight: 700,
                minWidth: 40,
            }}
        />
    );
}
