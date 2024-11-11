import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Chip,
  Button,
  CircularProgress 
} from '@mui/material';
import axios from 'axios';

function UserBoardDetail() {
  const navigate = useNavigate();
  const { idx } = useParams();
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const response = await axios.get(`/api/board/${idx}`);
        setBoard(response.data);
        setLoading(false);
      } catch (error) {
        setError('게시글을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchBoard();
  }, [idx]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!board) return <Typography>게시글을 찾을 수 없습니다.</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {board.title}
        </Typography>
        
        <Typography variant="body2" color="textSecondary" gutterBottom>
          작성자: {board.createdBy} | 
          작성일: {new Date(board.createdAt).toLocaleDateString()}
        </Typography>

        {board.tags && board.tags.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            {board.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                sx={{ mr: 1 }} 
              />
            ))}
          </div>
        )}

        <Typography variant="body1" sx={{ mt: 3, whiteSpace: 'pre-wrap' }}>
          {board.content}
        </Typography>

        <Button 
          variant="contained" 
          onClick={() => navigate('/UserBoard')}
          sx={{ mt: 3 }}
        >
          목록으로
        </Button>
      </Paper>
    </Container>
  );
}

export default UserBoardDetail; 