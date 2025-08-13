import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Reply as ReplyIcon,
  ArrowBack as ArrowBackIcon,
  Send as SendIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';

function ThreadDetail() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [newReply, setNewReply] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [replyDialog, setReplyDialog] = useState(false);

  useEffect(() => {
    if (threadId) {
      loadThread();
      loadReplies();
    }
  }, [threadId]);

  const loadThread = async () => {
    try {
      const response = await fetch(`/api/forum/threads/${threadId}`);
      if (response.ok) {
        const data = await response.json();
        setThread(data);
      } else {
        setError('Thread not found');
      }
    } catch (error) {
      setError('Failed to load thread');
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async () => {
    try {
      const response = await fetch(`/api/forum/threads/${threadId}/replies`);
      if (response.ok) {
        const data = await response.json();
        setReplies(data.content || []);
      }
    } catch (error) {
      console.error('Failed to load replies:', error);
    }
  };

  const handleReply = async () => {
    if (!newReply.trim()) return;

    try {
      const replyData = {
        content: newReply.trim(),
        threadId: parseInt(threadId),
        parentReplyId: replyTo?.id || null
      };

      const response = await fetch('/api/forum/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(replyData)
      });

      if (response.ok) {
        const createdReply = await response.json();
        setReplies(prev => [...prev, createdReply]);
        setNewReply('');
        setReplyTo(null);
        setReplyDialog(false);
        
        // Refresh thread to update reply count
        loadThread();
      } else {
        setError('Failed to post reply');
      }
    } catch (error) {
      setError('Failed to post reply');
    }
  };

  const startReply = (reply = null) => {
    setReplyTo(reply);
    setReplyDialog(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  const renderReply = (reply, level = 0) => (
    <Card key={reply.id} sx={{ mb: 2, ml: level * 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <PersonIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography variant="subtitle2">{reply.authorName}</Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(reply.createdAt)}
              </Typography>
              <Chip size="small" label={`#${reply.replyNumber}`} variant="outlined" />
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
              {reply.content}
            </Typography>
            <Button
              size="small"
              startIcon={<ReplyIcon />}
              onClick={() => startReply(reply)}
            >
              Reply
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading thread...</Typography>
      </Box>
    );
  }

  if (error || !thread) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || 'Thread not found'}</Typography>
        <Button onClick={() => navigate('/forum')} startIcon={<ArrowBackIcon />}>
          Back to Forum
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/forum')}
          sx={{ cursor: 'pointer' }}
        >
          Forum
        </Link>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate(`/forum/category/${thread.categoryId}`)}
          sx={{ cursor: 'pointer' }}
        >
          {thread.categoryName}
        </Link>
        <Typography color="text.primary">{thread.title}</Typography>
      </Breadcrumbs>

      {/* Thread */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h5">{thread.title}</Typography>
                {thread.isPinned && <Chip size="small" label="Pinned" color="warning" />}
                {thread.isLocked && <Chip size="small" label="Locked" color="error" />}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="subtitle2">{thread.authorName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate(thread.createdAt)}
                </Typography>
                <Chip size="small" label={`${thread.viewCount} views`} variant="outlined" />
                <Chip size="small" label={`${thread.replyCount} replies`} variant="outlined" />
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 2 }}>
                {thread.content}
              </Typography>
              {!thread.isLocked && (
                <Button
                  variant="contained"
                  startIcon={<ReplyIcon />}
                  onClick={() => startReply()}
                >
                  Reply to Thread
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Replies */}
      <Typography variant="h6" gutterBottom>
        Replies ({replies.length})
      </Typography>
      
      {replies.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No replies yet. Be the first to reply!
          </Typography>
        </Paper>
      ) : (
        <List>
          {replies.map((reply) => renderReply(reply))}
        </List>
      )}

      {/* Reply Dialog */}
      <Dialog open={replyDialog} onClose={() => setReplyDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {replyTo ? `Reply to ${replyTo.authorName}` : 'Reply to Thread'}
        </DialogTitle>
        <DialogContent>
          {replyTo && (
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
              <Typography variant="caption" color="text.secondary">
                Replying to: {replyTo.authorName}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {replyTo.content.substring(0, 100)}...
              </Typography>
            </Paper>
          )}
          <TextField
            fullWidth
            multiline
            rows={4}
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Write your reply..."
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(false)}>Cancel</Button>
          <Button
            onClick={handleReply}
            variant="contained"
            disabled={!newReply.trim()}
            startIcon={<SendIcon />}
          >
            Post Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ThreadDetail; 