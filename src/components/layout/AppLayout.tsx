import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import UserMenu from './UserMenu';
import HealthIndicator from './HealthIndicator';

interface AppLayoutProps {
  children: React.ReactNode;
}

const drawerWidth = 260;

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#1e1e1e' // Same as ChatGPT dark background
    }}>
      {/* Sidebar */}
      <Sidebar
        open={mobileOpen}
        onClose={handleDrawerToggle}
        drawerWidth={drawerWidth}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'relative',
        }}
      >
        {/* User menu at top right */}
        <Box
          sx={{
            position: 'absolute',
            top: 10,
            right: 20,
            zIndex: 10,
          }}
        >
          <UserMenu />
        </Box>

        {/* Main content area */}
        <Box
          sx={{
            flexGrow: 1,
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {children}
        </Box>

        {/* Health indicator */}
        <HealthIndicator />
      </Box>
    </Box>
  );
};

export default AppLayout;