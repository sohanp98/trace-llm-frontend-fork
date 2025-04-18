import React from 'react';
import { Box } from '@mui/material';
import { useChat } from '../../contexts/ChatContext';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const ChatContainer: React.FC = () => {
  const { currentChat, sendMessage, isTyping } = useChat();
  
  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: '#1e1e1e', // Match ChatGPT dark theme
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          scrollBehavior: 'smooth',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          },
        }}
      >
        <ChatMessages
          messages={currentChat?.messages || []}
          isTyping={isTyping}
        />
      </Box>
      
      <Box 
        sx={{ 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          pt: 1,
          pb: 2,
        }}
      >
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={isTyping}
        />
        
        {/* ChatGPT disclaimer footer */}
        <Box
          sx={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '0.75rem',
            mt: 1,
            mx: 'auto',
            maxWidth: '600px',
          }}
        >
          AskTRACE can make mistakes. Check important information.
        </Box>
      </Box>
    </Box>
  );
};

export default ChatContainer;