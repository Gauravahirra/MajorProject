import React from 'react';
import { Box } from '@mui/material';
import UnifiedNavigation from './UnifiedNavigation';

const UnifiedDashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <UnifiedNavigation>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: 'background.default',
            minHeight: '100vh',
            overflow: 'auto'
          }}
        >
          {children}
        </Box>
      </UnifiedNavigation>
    </Box>
  );
};

export default UnifiedDashboardLayout;
