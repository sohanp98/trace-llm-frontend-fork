import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme/theme';
import { ChatProvider } from './contexts/ChatContext';
import AppLayout from './components/layout/AppLayout';
import ChatContainer from './components/chat/ChatContainer';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ChatProvider>
        <AppLayout>
          <ChatContainer />
        </AppLayout>
      </ChatProvider>
    </ThemeProvider>
  );
}

export default App;