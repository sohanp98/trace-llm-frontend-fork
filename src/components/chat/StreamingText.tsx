import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { simulateTextStreaming } from '../../utils/streamingUtils';

interface StreamingTextProps {
  text: string;
  onComplete?: () => void;
}

const StreamingText: React.FC<StreamingTextProps> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    // Blinking cursor effect
    const cursorInterval = setInterval(() => {
      if (!isComplete) {
        setShowCursor(prev => !prev);
      } else {
        setShowCursor(false);
      }
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, [isComplete]);

  useEffect(() => {
    if (text && !isComplete) {
      const streamText = async () => {
        await simulateTextStreaming(
          text,
          (newText) => setDisplayedText(newText),
          () => {
            setIsComplete(true);
            if (onComplete) onComplete();
          },
          10 // Characters per update - adjust for speed
        );
      };

      streamText();
    }
  }, [text, isComplete, onComplete]);

  return (
    <Typography 
      component="div" 
      variant="body1" 
      sx={{ 
        whiteSpace: 'pre-wrap',
        color: 'white',
        lineHeight: 1.7
      }}
    >
      {displayedText}
      {showCursor && (
        <span style={{ 
          opacity: 0.7,
          color: 'rgba(255, 255, 255, 0.7)',
          animation: 'blink 1s step-end infinite'
        }}>
          ▋
        </span>
      )}
    </Typography>
  );
};

export default StreamingText;