import React, { useState } from 'react';
import { Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Navbar from '../common/Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

function DashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem('mainSidebarCollapsed');
    return stored === 'true';
  });
  
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('mainSidebarCollapsed', !prev);
      return !prev;
    });
  };

  // Calculate sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? 60 : 280;

  return (
    <Box 
      className="dashboard-container"
      sx={{ 
        display: 'flex', 
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        backgroundColor: 'background.default'
      }}
    >
      {/* Desktop Sidebar - Always present on desktop */}
      {!isMobile && (
        <Box
          sx={{
            width: `${sidebarWidth}px`,
            flexShrink: 0,
            transition: 'width 0.3s ease-in-out',
            zIndex: theme.zIndex.drawer + 1
          }}
        >
          <Sidebar
            open={sidebarOpen}
            onClose={handleSidebarToggle}
            collapsed={sidebarCollapsed}
            onCollapse={handleSidebarCollapse}
            isMobile={false}
          />
        </Box>
      )}
      
      {/* Mobile Sidebar - Overlay */}
      {isMobile && (
        <Sidebar
          open={sidebarOpen}
          onClose={handleSidebarToggle}
          collapsed={false} // Never collapsed on mobile
          onCollapse={handleSidebarCollapse}
          isMobile={true}
        />
      )}
      
      {/* Main Content Area */}
      <Box 
        className="app-wrapper" 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          flexGrow: 1,
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Fixed Navbar */}
        <Navbar 
          onMenuClick={handleSidebarToggle}
          isMobile={isMobile}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        {/* Spacer to prevent content from being hidden behind fixed navbar */}
        <Box
          sx={{
            height: { xs: '64px', sm: '72px' },
            width: '100%',
            flexShrink: 0
          }}
        />
        
        {/* Mobile Menu Toggle - only show if needed */}
        {isMobile && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            position: 'sticky',
            top: { xs: '64px', sm: '72px' },
            zIndex: theme.zIndex.appBar - 1
          }}>
            <IconButton
              color="inherit"
              aria-label="open sidebar"
              onClick={handleSidebarToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}
        
        {/* Page Content */}
        <Box 
          component="main" 
          className="main-content" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3 },
            width: '100%',
            overflow: 'auto',
            minHeight: 0, // Allow content to shrink
            backgroundColor: 'background.paper'
          }}
        >
          {children}
        </Box>
        
        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}

export default React.memo(DashboardLayout); 