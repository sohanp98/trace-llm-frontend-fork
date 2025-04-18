import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { 
  ThumbUp, 
  ThumbDown, 
  ContentCopy, 
  VolumeUp, 
  Cached 
} from '@mui/icons-material';
import { ChatMessage as ChatMessageType } from '../../types';
import StreamingText from './StreamingText';
import { useChat } from '../../contexts/ChatContext';

interface ChatMessageProps {
  message: ChatMessageType;
  isLatestAssistant: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatestAssistant }) => {
  const isUser = message.role === 'user';
  const { regenerateResponse } = useChat();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    // You could add a toast notification here
  };
  
  const readAloud = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message.content);
      window.speechSynthesis.speak(utterance);
    }
  };
  
  const handleRegenerate = () => {
    regenerateResponse(message.id);
  };
  
  return (
    <Box
      sx={{
        width: '100%',
        mb: 2,
        maxWidth: '800px',
        mx: 'auto',
      }}
    >
      {isUser ? (
        // User message - right aligned bubble
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            px: 3,
          }}
        >
          <Box
            sx={{
              backgroundColor: '#343541',
              color: 'white',
              borderRadius: '18px',
              py: 1.5,
              px: 2.5,
              maxWidth: '80%',
              wordBreak: 'break-word'
            }}
          >
            <Typography variant="body1">
              {message.content}
            </Typography>
          </Box>
        </Box>
      ) : (
        // Assistant message - full width with feedback options
        <Box
          sx={{
            px: 3,
            width: '100%',
            backgroundColor: isLatestAssistant ? 'rgba(68, 70, 84, 0.1)' : 'transparent',
            py: 2,
          }}
        >
          <Box sx={{ width: '100%' }}>
            {isLatestAssistant ? (
              <StreamingText text={message.content} />
            ) : (
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  color: 'white',
                  lineHeight: 1.7
                }}
              >
                {message.content}
              </Typography>
            )}
          </Box>
          
          {/* Feedback buttons */}
          <Box 
            sx={{ 
              display: 'flex', 
              mt: 2,
              color: 'rgba(255,255,255,0.5)'
            }}
          >
            <Tooltip title="Copy to clipboard">
              <IconButton 
                size="small" 
                onClick={copyToClipboard}
                sx={{ color: 'inherit', mr: 1 }}
              >
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Coming soon">
              <span>
                <IconButton 
                  size="small"
                  sx={{ color: 'inherit', mr: 1 }}
                  disabled
                >
                  <ThumbUp fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            
            <Tooltip title="Coming soon">
              <span>
                <IconButton 
                  size="small"
                  sx={{ color: 'inherit', mr: 1 }}
                  disabled
                >
                  <ThumbDown fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            
            <Tooltip title="Read aloud">
              <IconButton 
                size="small"
                sx={{ color: 'inherit', mr: 1 }}
                onClick={readAloud}
              >
                <VolumeUp fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Regenerate response">
              <IconButton 
                size="small"
                sx={{ color: 'inherit' }}
                onClick={handleRegenerate}
              >
                <Cached fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default ChatMessage;