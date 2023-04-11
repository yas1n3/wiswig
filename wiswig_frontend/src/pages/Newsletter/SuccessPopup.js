import React from 'react';
import { Typography } from '@mui/material';

export default function SuccessPopup(props) {
    return (
        <div style={{ padding: '1rem' }}>
            <Typography variant="h6">{props.message}</Typography>
        </div>
    );
}
