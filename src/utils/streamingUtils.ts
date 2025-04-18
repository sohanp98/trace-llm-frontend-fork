// Function to simulate streaming text
export const simulateTextStreaming = async (
    text: string,
    onTextUpdate: (text: string) => void,
    onComplete: () => void,
    speed: number = 10 // Characters per cycle
  ): Promise<void> => {
    return new Promise((resolve) => {
      let currentIndex = 0;
      const textLength = text.length;
      
      const streamText = () => {
        if (currentIndex < textLength) {
          // Calculate the next index, ensuring we don't exceed text length
          const nextIndex = Math.min(currentIndex + speed, textLength);
          
          // Update with the next chunk of text
          onTextUpdate(text.substring(0, nextIndex));
          
          // Move to next position
          currentIndex = nextIndex;
          
          // Continue streaming
          setTimeout(streamText, 20); // Adjust timing for realistic streaming effect
        } else {
          // Call complete callback
          onComplete();
          resolve();
        }
      };
      
      // Start streaming
      streamText();
    });
  };