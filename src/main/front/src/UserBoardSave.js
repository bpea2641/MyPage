import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function UserBoardSave() {
  const [boardName, setBoardName] = useState('');
  const [boardText, setBoardText] = useState('');
  const [error, setError] = useState(null); // 에러 상태 추가

    const handleBoardSave = async () => {
      try {
        await axios.post('/api/board/save', {
          boardName: boardName,
          boardText: boardText,
        });
        alert('게시판 저장 성공');
        window.location.href = '/UserBoard';
      } catch (error) {
        setError('게시판 저장에 실패했습니다.');
      }
    };


  return (
    <div>
      <Typography variant="h5" gutterBottom>
        유저 게시판 세이브
      </Typography>

      <TextField
        label="Name"
        fullWidth
        margin="normal"
        value={boardName}
        onChange={(e) => setBoardName(e.target.value)} // 상태 설정
      />
      <TextField
        label="Text"
        fullWidth
        margin="normal"
        value={boardText}
        onChange={(e) => setBoardText(e.target.value)} // 상태 설정
      />

      {/* 에러 메시지 */}
      {error && (
        <Typography color="error" style={{ marginTop: '10px' }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        style={{ marginTop: '20px', backgroundColor: '#000000' }}
        onClick={handleBoardSave}
      >
        BoardSave
      </Button>
    </div>
  );
}

export default UserBoardSave;
