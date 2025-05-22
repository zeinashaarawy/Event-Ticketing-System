import React from 'react';
import MyEvents from './MyEvents';
import { Box, Typography } from '@mui/material';

const TestAnalytics = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, mt: 2, textAlign: 'center' }}>
        Event Analytics Dashboard (Test Mode)
      </Typography>
      <MyEvents />
    </Box>
  );
};

export default TestAnalytics; 