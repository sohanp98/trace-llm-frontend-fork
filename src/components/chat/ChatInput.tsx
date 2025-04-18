import React, { useState } from 'react';
import { Box, TextField, IconButton, Paper, Tooltip } from '@mui/material';
import { 
  Send as SendIcon,
  Add as AddIcon,
  Search as SearchIcon,
  QueryStats as QueryStatsIcon,
  MoreVert as MoreVertIcon,
  Mic as MicIcon 
} from '@mui/icons-material';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Enter unless Shift is pressed (for multi-line input)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    setIsListening(true);

    // Create speech recognition instance
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event: Event) => {
      console.error('Speech recognition error', (event as any).error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  return (
    <Box sx={{ px: 2, pb: 2, pt: 1, width: '100%', maxWidth: '800px', mx: 'auto' }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#404040',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.4)',
          },
        }}
      >
        <Tooltip title="Coming soon">
          <span>
            <IconButton 
              size="small"
              sx={{ color: 'rgba(255, 255, 255, 0.5)', ml: 0.5 }}
              disabled
            >
              <AddIcon />
            </IconButton>
          </span>
        </Tooltip>
        
        <TextField
          fullWidth
          placeholder="Ask anything"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isListening}
          variant="standard"
          InputProps={{
            disableUnderline: true,
          }}
          sx={{ 
            mx: 1,
            '& .MuiInputBase-input': {
              color: 'white',
              p: 1,
              maxHeight: '150px',
              overflow: 'auto',
              '&::placeholder': {
                color: 'rgba(255, 255, 255, 0.5)',
                opacity: 1,
              },
            }
          }}
        />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Coming soon">
            <span>
              <IconButton 
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                disabled
              >
                <SearchIcon />
              </IconButton>
            </span>
          </Tooltip>
          
          <Tooltip title="Coming soon">
            <span>
              <IconButton 
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.5)', mx: 0.5 }}
                disabled
              >
                <QueryStatsIcon />
              </IconButton>
            </span>
          </Tooltip>
          
          <Tooltip title="Coming soon">
            <span>
              <IconButton 
                size="small"
                sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                disabled
              >
                <MoreVertIcon />
              </IconButton>
            </span>
          </Tooltip>
          
          {message.trim() ? (
            <IconButton
              color="primary"
              onClick={handleSubmit}
              disabled={!message.trim() || disabled}
              sx={{ 
                ml: 0.5,
                color: 'white', 
                backgroundColor: '#2563eb',
                width: 35,
                height: 35,
                '&:hover': {
                  backgroundColor: '#1d4ed8',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(59, 130, 246, 0.5)',
                },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          ) : (
            <Tooltip title="Voice input">
              <IconButton
                sx={{ 
                  ml: 0.5,
                  color: 'white', 
                  backgroundColor: isListening ? '#ef4444' : '#2563eb',
                  width: 35,
                  height: 35,
                  '&:hover': {
                    backgroundColor: isListening ? '#b91c1c' : '#1d4ed8',
                  }
                }}
                onClick={startVoiceRecognition}
                disabled={disabled}
              >
                <MicIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInput;