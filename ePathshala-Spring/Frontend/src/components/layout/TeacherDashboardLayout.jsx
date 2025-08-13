import React, { useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Navbar from '../common/Navbar';
import TeacherSidebar from './TeacherSidebar';
import Footer from './Footer';

function TeacherDashboardLayout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const stored = localStorage.getItem('teacherSidebarCollapsed');
    return stored === 'true';
  });
  
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSidebarCollapse = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('teacherSidebarCollapsed', !prev);
      return !prev;
    });
  };

  // Calculate sidebar width based on collapsed state
  const sidebarWidth = sidebarCollapsed ? 60 : 280;

  return (
    <Box 
      className="teacher-dashboard-container"
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
          <TeacherSidebar
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
        <TeacherSidebar
          open={sidebarOpen}
          onClose={handleSidebarToggle}
          collapsed={false} // Never collapsed on mobile
          onCollapse={handleSidebarCollapse}
          isMobile={true}
        />
      )}
      
      {/* Main Content Area */}
      <Box 
        className="teacher-app-wrapper" 
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
        
        {/* Page Content */}
        <Box 
          component="main" 
          className="teacher-main-content" 
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

export default React.memo(TeacherDashboardLayout);