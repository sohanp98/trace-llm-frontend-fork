import React, { useRef, useEffect } from 'react';
import { Box, Typography, CircularProgress, Fade } from '@mui/material';
import { ChatMessage as ChatMessageType } from '../../types';
import ChatMessage from './ChatMessage';

interface ChatMessagesProps {
  messages: ChatMessageType[];
  isTyping: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change or when typing indicator appears/disappears
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        pt: 4,
        pb: 2,
      }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            opacity: 0.9,
            color: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
            What can I help with?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '600px', 
              textAlign: 'center',
              color: 'rgba(255,255,255,0.7)'
            }}
          >
            Ask me about TRACE surveys - I can analyze student feedback and provide insights about courses and instructors.
          </Typography>
        </Box>
      ) : (
        messages.map((message, index) => (
          <ChatMessage
            key={message.id}
            message={message}
            isLatestAssistant={
              message.role === 'assistant' &&
              index === messages.length - 1 &&
              messages[messages.length - 1].role === 'assistant'
            }
          />
        ))
      )}
      
      {isTyping && (
        <Fade in={isTyping}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 3,
              maxWidth: '800px',
              mx: 'auto',
              width: '100%'
            }}
          >
            <CircularProgress size={16} sx={{ mr: 2, color: 'rgba(255,255,255,0.7)' }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
              Thinking...
            </Typography>
          </Box>
        </Fade>
      )}
      
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatMessages;