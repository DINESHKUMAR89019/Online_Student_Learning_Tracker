'use client';

import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

interface ProgressBarProps {
    value: number;
    label?: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
    // Handle null/undefined values and convert to number
    const safeValue = Number(value) || 0;

    const getColor = (val: number) => {
        if (val >= 75) return 'success';
        if (val >= 50) return 'primary';
        if (val >= 25) return 'warning';
        return 'error';
    };

    return (
        <Box sx={{ width: '100%' }}>
            {label && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {label}
                </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress
                        variant="determinate"
                        value={safeValue}
                        color={getColor(safeValue)}
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                </Box>
                <Typography variant="body2" fontWeight={600}>
                    {safeValue.toFixed(0)}%
                </Typography>
            </Box>
        </Box>
    );
}
