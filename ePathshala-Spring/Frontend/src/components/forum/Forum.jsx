import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Paper,
  Avatar,
  Badge
} from '@mui/material';
import {
  Forum as ForumIcon,
  Add as AddIcon,
  Search as SearchIcon,
  School as SchoolIcon,
  Computer as ComputerIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Visibility as VisibilityIcon,
  Comment as CommentIcon,
  Pin as PinIcon,
  Lock as LockIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';

function Forum() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [threads, setThreads] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dialog states
  const [newThreadDialog, setNewThreadDialog] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    categoryId: ''
  });
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadThreads(selectedCategory.id);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/forum/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]);
        }
      }
    } catch (error) {
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const loadThreads = async (categoryId) => {
    try {
      const response = await fetch(`/api/forum/categories/${categoryId}/threads`);
      if (response.ok) {
        const data = await response.json();
        setThreads(data.content || []);
      }
    } catch (error) {
      setError('Failed to load threads');
    }
  };

  const handleCreateThread = async () => {
    try {
      const response = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newThread)
      });

      if (response.ok) {
        setNewThreadDialog(false);
        setNewThread({ title: '', content: '', categoryId: '' });
        loadThreads(selectedCategory.id);
      }
    } catch (error) {
      setError('Failed to create thread');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const response = await fetch(`/api/forum/search?query=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.content || []);
        setShowSearch(true);
      }
    } catch (error) {
      setError('Failed to search threads');
    }
  };

  const getCategoryIcon = (icon) => {
    switch (icon) {
      case 'school': return <SchoolIcon />;
      case 'computer': return <ComputerIcon />;
      case 'chat': return <ChatIcon />;
      default: return <ForumIcon />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading forum...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Forum
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          placeholder="Search threads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={!searchQuery.trim()}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setNewThreadDialog(true)}
        >
          New Thread
        </Button>
      </Box>

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedCategory?.id === category.id ? 2 : 1,
                  borderColor: selectedCategory?.id === category.id ? 'primary.main' : 'divider'
                }}
                onClick={() => setSelectedCategory(category)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: category.color, mr: 1 }}>
                      {getCategoryIcon(category.icon)}
                    </Avatar>
                    <Typography variant="h6" component="div">{category.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} component="div">
                    {category.description}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      size="small"
                      label={`${category.threadCount} threads`}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={`${category.replyCount} replies`}
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Threads */}
      {selectedCategory && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Threads in {selectedCategory.name}
          </Typography>
          
          {showSearch ? (
            <Box>
              <Button onClick={() => setShowSearch(false)} sx={{ mb: 2 }}>
                Back to Category
              </Button>
              <Typography variant="h6" gutterBottom>
                Search Results
              </Typography>
            </Box>
          ) : null}

          <List>
            {(showSearch ? searchResults : threads).map((thread) => (
              <Paper key={thread.id} sx={{ mb: 2 }}>
                <ListItem
                  button
                  onClick={() => navigate(`/forum/thread/${thread.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <ListItemText
                    primary={
                      <React.Fragment>
                        {thread.isPinned && <PinIcon color="primary" sx={{ mr: 1, verticalAlign: 'middle' }} />}
                        {thread.isLocked && <LockIcon color="error" sx={{ mr: 1, verticalAlign: 'middle' }} />}
                        <Typography variant="h6" component="span">{thread.title}</Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.secondary" component="div">
                          By {thread.authorName} • {formatDate(thread.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }} component="div">
                          {thread.content.substring(0, 200)}...
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        size="small"
                        icon={<VisibilityIcon />}
                        label={thread.viewCount}
                      />
                      <Chip
                        size="small"
                        icon={<CommentIcon />}
                        label={thread.replyCount}
                      />
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </Paper>
            ))}
          </List>
        </Box>
      )}

      {/* New Thread Dialog */}
      <Dialog open={newThreadDialog} onClose={() => setNewThreadDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Thread</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            value={newThread.title}
            onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newThread.categoryId}
              onChange={(e) => setNewThread({ ...newThread, categoryId: e.target.value })}
              label="Category"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={6}
            value={newThread.content}
            onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewThreadDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateThread}
            variant="contained"
            disabled={!newThread.title || !newThread.content || !newThread.categoryId}
          >
            Create Thread
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Forum; 