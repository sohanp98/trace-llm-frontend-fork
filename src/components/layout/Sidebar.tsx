import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  IconButton,
  Button,
  TextField,
  Divider,
  useMediaQuery,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  ChatBubbleOutline,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useChat } from '../../contexts/ChatContext';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth: number;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose, drawerWidth }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { chats, currentChat, setCurrentChat, createNewChat, deleteChat, renameChat } = useChat();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreateNewChat = () => {
    createNewChat();
    if (isMobile) {
      onClose();
    }
  };

  const handleSelectChat = (chat: typeof chats[0]) => {
    setCurrentChat(chat);
    if (isMobile) {
      onClose();
    }
  };

  const handleStartRename = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditTitle(currentTitle);
  };

  const handleSaveRename = () => {
    if (editingChatId && editTitle.trim()) {
      renameChat(editingChatId, editTitle.trim());
      setEditingChatId(null);
      setEditTitle('');
    }
  };

  const handleCancelRename = () => {
    setEditingChatId(null);
    setEditTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  };

  const drawerContent = (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%',
      backgroundColor: '#202123', // ChatGPT's sidebar color
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2
      }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'white' }}>
          AskTRACE
        </Typography>
        {isMobile && (
          <IconButton onClick={onClose} edge="end" sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Box sx={{ p: 2 }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleCreateNewChat}
          sx={{
            borderRadius: '8px',
            color: 'white',
            borderColor: 'rgba(255,255,255,0.2)',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'rgba(255,255,255,0.08)'
            },
            justifyContent: 'flex-start',
            textAlign: 'left',
            py: 1
          }}
        >
          New Chat
        </Button>
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
      
      <List sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
        {chats.length === 0 ? (
          <ListItem sx={{ opacity: 0.7, color: 'white' }}>
            <ListItemText primary="No chat history yet" />
          </ListItem>
        ) : (
          chats.map((chat) => (
            <ListItem 
              key={chat.id} 
              disablePadding
              sx={{ 
                mb: 0.5,
                '&:hover .MuiBox-root': {
                  opacity: 1,
                  transition: 'opacity 0.2s'
                }
              }}
              secondaryAction={
                editingChatId !== chat.id ? (
                  <Box sx={{ display: 'flex', opacity: 0 }}>
                    <Tooltip title="Rename">
                      <IconButton 
                        edge="end" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartRename(chat.id, chat.title);
                        }}
                        sx={{ color: 'white' }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        edge="end" 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(chat.id);
                        }}
                        sx={{ color: 'white' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ) : null
              }
            >
              {editingChatId === chat.id ? (
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 2, py: 1 }}>
                  <TextField
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    size="small"
                    fullWidth
                    placeholder="Chat name"
                    sx={{
                      '& .MuiInputBase-input': {
                        color: 'white',
                      }
                    }}
                  />
                  <IconButton size="small" onClick={handleSaveRename} sx={{ color: 'white' }}>
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleCancelRename} sx={{ color: 'white' }}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              ) : (
                <ListItemButton
                  selected={currentChat?.id === chat.id}
                  onClick={() => handleSelectChat(chat)}
                  sx={{ 
                    borderRadius: '8px',
                    pr: 7, // Make room for action buttons
                    py: 1.5,
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(52, 53, 65, 0.95)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(52, 53, 65, 0.7)',
                    }
                  }}
                >
                  <ChatBubbleOutline sx={{ mr: 2, fontSize: '1.2rem', color: 'rgba(255,255,255,0.5)' }} />
                  <ListItemText 
                    primary={chat.title} 
                    secondary={formatDate(chat.createdAt)}
                    primaryTypographyProps={{
                      noWrap: true,
                      style: { 
                        maxWidth: '180px',
                        color: 'white',
                        fontWeight: 400,
                      }
                    }}
                    secondaryTypographyProps={{
                      style: {
                        color: 'rgba(255,255,255,0.5)',
                      }
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onClose}
          sx={{
            position: 'fixed',
            top: 10,
            left: 10,
            zIndex: 1100,
            display: { sm: 'none' },
            color: 'white'
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            border: 'none'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            border: 'none'
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;