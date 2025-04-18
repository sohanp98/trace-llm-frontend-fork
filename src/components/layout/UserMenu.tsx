import React from 'react';
import { 
  Box, 
  Button, 
  Tooltip 
} from '@mui/material';
import { Login, PersonAdd } from '@mui/icons-material';

const UserMenu: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Tooltip title="Coming soon!" arrow>
        <span>
          <Button 
            variant="outlined" 
            startIcon={<Login />}
            size="small"
            disabled
          >
            Login
          </Button>
        </span>
      </Tooltip>
      
      <Tooltip title="Coming soon!" arrow>
        <span>
          <Button 
            variant="contained" 
            startIcon={<PersonAdd />}
            size="small"
            disabled
          >
            Sign Up
          </Button>
        </span>
      </Tooltip>
    </Box>
  );
};

export default UserMenu;