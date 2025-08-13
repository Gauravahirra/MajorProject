import React from 'react';
import { Box } from '@mui/material';
import PublicNavbar from '../common/PublicNavbar';

function PublicLayout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNavbar />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1,
          pt: { xs: '64px', sm: '72px' },
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default PublicLayout; 