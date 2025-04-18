import React, { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Chat, ChatMessage, HealthStatus } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { submitQuery } from '../api/apiService';
import { checkHealth } from '../api/healthService';

interface ChatContextProps {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat) => void;
  createNewChat: () => void;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, newTitle: string) => void;
  sendMessage: (content: string) => Promise<void>;
  regenerateResponse: (messageId: string) => Promise<void>;
  isTyping: boolean;
  health: HealthStatus;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useLocalStorage<Chat[]>('asktrace-chats', []);
  const [currentChat, setCurrentChatState] = useState<Chat | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [health, setHealth] = useState<HealthStatus>({
    status: 'unknown',
    lastChecked: new Date()
  });
  
  // Generate a unique tab ID when the component mounts
  const [tabId] = useState(() => uuidv4());
  
  // Track if we've created a temporary chat for this tab
  const [tempChatCreated, setTempChatCreated] = useState(false);

  // Create a temporary chat for this tab on mount
  useEffect(() => {
    if (!tempChatCreated) {
      const newTempChat: Chat = {
        id: `temp-${tabId}`, // Include tab ID to make it unique per tab
        title: 'New Chat',
        messages: [],
        createdAt: new Date()
      };
      setCurrentChatState(newTempChat);
      setTempChatCreated(true);
    }
  }, [tempChatCreated, tabId]);

  // Set up event listener for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // If chats were updated in another tab
      if (e.key === 'asktrace-chats' && e.newValue) {
        // If we're in a temporary chat, don't switch
        if (currentChat && currentChat.id.startsWith('temp-')) {
          return;
        }
        
        // Otherwise, refresh our chat list
        const updatedChats = JSON.parse(e.newValue);
        
        // If our current chat was deleted in another tab, create a new one
        if (currentChat && !updatedChats.some((c: Chat) => c.id === currentChat.id)) {
          createNewChat();
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [currentChat]);

  // Check health status initially and every 30 seconds
  useEffect(() => {
    const checkHealthStatus = async () => {
      const status = await checkHealth();
      setHealth(status);
    };

    checkHealthStatus();
    const interval = setInterval(checkHealthStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const setCurrentChat = (chat: Chat) => {
    setCurrentChatState(chat);
  };

  const createNewChat = () => {
    // Create a new temporary chat for this tab
    const newChat: Chat = {
      id: `temp-${uuidv4()}`, // Use a new UUID each time
      title: 'New Chat',
      messages: [],
      createdAt: new Date()
    };
    setCurrentChatState(newChat);
  };

  const deleteChat = (chatId: string) => {
    // Only delete from localStorage if it's a real chat (not a temp chat)
    if (!chatId.startsWith('temp-')) {
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);
    }
    
    // If we're deleting the current chat
    if (currentChat?.id === chatId) {
      // If we have saved chats, show the first one
      if (chats.length > 0 && chats[0].id !== chatId) {
        setCurrentChatState(chats[0]);
      } else {
        // Otherwise create a new temporary chat
        createNewChat();
      }
    }
  };

  const renameChat = (chatId: string, newTitle: string) => {
    // Check if this is a persisted chat
    const existingChat = chats.find(chat => chat.id === chatId);
    
    if (existingChat) {
      // Update a persisted chat in localStorage
      const updatedChats = chats.map(chat => 
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      );
      setChats(updatedChats);
    }
    
    // If this is the current chat, update it in state
    if (currentChat?.id === chatId) {
      setCurrentChatState({ ...currentChat, title: newTitle });
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentChat) return;

    // Create user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    // Check if this is a temp chat's first message
    const isTempChat = currentChat.id.startsWith('temp-');

    // Update chat with user message
    const updatedChat = {
      ...currentChat,
      messages: [...currentChat.messages, userMessage]
    };

    // If this is the first message, use it to update the chat title
    if (currentChat.messages.length === 0) {
      updatedChat.title = content.substring(0, 30) + (content.length > 30 ? '...' : '');
    }

    // Update current chat state
    setCurrentChatState(updatedChat);
    
    // If this is a temp chat with its first message, we need to convert it to a real chat
    if (isTempChat && currentChat.messages.length === 0) {
      // Create a new real chat ID
      const realChatId = uuidv4();
      const realChat = {
        ...updatedChat,
        id: realChatId
      };
      
      // Update state with the real chat
      setCurrentChatState(realChat);
      
      // Add to localStorage
      setChats([realChat, ...chats]);
    } else if (!isTempChat) {
      // Update existing chat in localStorage
      const updatedChats = chats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      );
      setChats(updatedChats);
    }

    // Show typing indicator
    setIsTyping(true);

    try {
      // Submit query to API
      const response = await submitQuery(content);
      
      // Create assistant response message
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };

      // Get the latest current chat
      const latestCurrentChat = isTempChat && currentChat.messages.length === 0
        ? { ...currentChat, id: uuidv4() } // Use the new real ID if this was a temp chat
        : currentChat;

      // Update chat with assistant message
      const finalChat = {
        ...latestCurrentChat,
        messages: [...updatedChat.messages, assistantMessage]
      };

      // Update current chat state
      setCurrentChatState(finalChat);
      
      // Update in localStorage (use the real ID if this was a temp chat)
      if (isTempChat && currentChat.messages.length === 0) {
        // For a new chat being saved for the first time
        setChats([finalChat, ...chats]);
      } else if (!isTempChat) {
        // For existing chats
        const finalChats = chats.map(chat => 
          chat.id === latestCurrentChat.id ? finalChat : chat
        );
        setChats(finalChats);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Create error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: new Date()
      };

      // Get the latest current chat
      const latestCurrentChat = isTempChat && currentChat.messages.length === 0
        ? { ...currentChat, id: uuidv4() } // Use the new real ID if this was a temp chat
        : currentChat;

      // Update chat with error message
      const errorChat = {
        ...latestCurrentChat,
        messages: [...updatedChat.messages, errorMessage]
      };

      // Update current chat state
      setCurrentChatState(errorChat);
      
      // Update in localStorage
      if (isTempChat && currentChat.messages.length === 0) {
        // For a new chat being saved for the first time
        setChats([errorChat, ...chats]);
      } else if (!isTempChat) {
        // For existing chats
        const errorChats = chats.map(chat => 
          chat.id === latestCurrentChat.id ? errorChat : chat
        );
        setChats(errorChats);
      }
    } finally {
      // Hide typing indicator
      setIsTyping(false);
    }
  };

  // Function to regenerate a response
  const regenerateResponse = async (messageId: string) => {
    if (!currentChat) return;
    
    // Find the index of the message that needs regeneration
    const messageIndex = currentChat.messages.findIndex(msg => msg.id === messageId);
    
    if (messageIndex === -1 || currentChat.messages[messageIndex].role !== 'assistant') {
      console.error('Invalid message for regeneration');
      return;
    }
    
    // Find the user message that prompted this response
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0) {
      if (currentChat.messages[userMessageIndex].role === 'user') {
        break;
      }
      userMessageIndex--;
    }
    
    if (userMessageIndex < 0) {
      console.error('Could not find corresponding user message');
      return;
    }
    
    const userMessage = currentChat.messages[userMessageIndex];
    
    // Create a new chat that includes only messages up to the user message
    let updatedMessages = currentChat.messages.slice(0, userMessageIndex + 1);
    
    // Update the chat with the trimmed messages
    const updatedChat = {
      ...currentChat,
      messages: updatedMessages
    };
    
    // Update state
    setCurrentChatState(updatedChat);
    
    // Check if this is a persisted chat
    const isTempChat = currentChat.id.startsWith('temp-');
    
    // Update chats list in localStorage only if this is a persisted chat
    if (!isTempChat) {
      const updatedChats = chats.map(chat => 
        chat.id === currentChat.id ? updatedChat : chat
      );
      setChats(updatedChats);
    }
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Resubmit the query
      const response = await submitQuery(userMessage.content);
      
      // Create new assistant response message
      const newAssistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };
      
      // Update chat with new assistant message
      const finalChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, newAssistantMessage]
      };
      
      // Update state
      setCurrentChatState(finalChat);
      
      // Update chats list in localStorage only if this is a persisted chat
      if (!isTempChat) {
        const finalChats = chats.map(chat => 
          chat.id === currentChat.id ? finalChat : chat
        );
        setChats(finalChats);
      }
    } catch (error) {
      console.error('Error regenerating response:', error);
      
      // Create error message
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: new Date()
      };
      
      // Update chat with error message
      const errorChat = {
        ...updatedChat,
        messages: [...updatedChat.messages, errorMessage]
      };
      
      // Update state
      setCurrentChatState(errorChat);
      
      // Update chats list in localStorage only if this is a persisted chat
      if (!isTempChat) {
        const errorChats = chats.map(chat => 
          chat.id === currentChat.id ? errorChat : chat
        );
        setChats(errorChats);
      }
    } finally {
      // Hide typing indicator
      setIsTyping(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        setCurrentChat,
        createNewChat,
        deleteChat,
        renameChat,
        sendMessage,
        regenerateResponse,
        isTyping,
        health
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};