import React from 'react';
import { Box, Tooltip, CircularProgress } from '@mui/material';
import { keyframes } from '@mui/system';
import { useChat } from '../../contexts/ChatContext';

// Keyframes for the pulsing red light
const pulseRed = keyframes`
  0% {
    box-shadow: 0 0 8px 2px rgba(244, 67, 54, 0.4);
    opacity: 0.7;
  }
  50% {
    box-shadow: 0 0 15px 5px rgba(244, 67, 54, 0.7);
    opacity: 1;
  }
  100% {
    box-shadow: 0 0 8px 2px rgba(244, 67, 54, 0.4);
    opacity: 0.7;
  }
`;

const HealthIndicator: React.FC = () => {
  const { health } = useChat();
  
  return (
    <Box 
      sx={{ 
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1000,
      }}
    >
      {health.status === 'up' && (
        <Tooltip title="System is operational" arrow>
          <Box 
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#4caf50', // Green
              border: '1px solid rgba(255, 255, 255, 0.3)',
              position: 'relative',
              // Glossy effect
              '&:before': {
                content: '""',
                position: 'absolute',
                top: '15%',
                left: '15%',
                width: '50%',
                height: '25%',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                filter: 'blur(1px)'
              },
              // Constant glow
              boxShadow: '0 0 10px 2px rgba(76, 175, 80, 0.5)',
            }}
          />
        </Tooltip>
      )}
      
      {health.status === 'down' && (
        <Tooltip title="System is experiencing issues" arrow>
          <Box 
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#f44336', // Red
              border: '1px solid rgba(255, 255, 255, 0.3)',
              position: 'relative',
              // Glossy effect
              '&:before': {
                content: '""',
                position: 'absolute',
                top: '15%',
                left: '15%',
                width: '50%',
                height: '25%',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                filter: 'blur(1px)'
              },
              // Pulsing animation for red status
              animation: `${pulseRed} 1.5s infinite ease-in-out`,
            }}
          />
        </Tooltip>
      )}
      
      {health.status === 'unknown' && (
        <Tooltip title="Checking system status..." arrow>
          <CircularProgress size={20} thickness={5} />
        </Tooltip>
      )}
    </Box>
  );
};

export default HealthIndicator;