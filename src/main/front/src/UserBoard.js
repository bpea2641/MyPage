import React, { useEffect, useState } from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// 프로그래밍 방식으로 페이지 이동
import axios from 'axios';

function UserBoard() {
  const [boardLists, setBoardLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBoardLists = async () => {
    try {
      const response = await axios.get('/api/board/list');
      setBoardLists(response.data);
      // /api/board/list에 get으로 요청을 보내고 해당 응답을 response에 넣음
      // 받은 response.data를 setBoardLists의 useState 함수를 통해 저장
    } catch (error) {
      setError('게시판을 가져오는 데 오류가 발생했습니다.');
      console.error('게시판 조회 오류: ', error);
    } finally {
      setLoading(false);
      // finally : 오류가 발생하든 안하든 무조건 실행되는 구문
      // 위의 상황이 끝났으니 loading을 false로 설정
    }
  };

  useEffect(() => {
    fetchBoardLists(); 
    // 컴포넌트가 마운트될 때 fetchBoardLists 함수를 호출
  }, []);


  const navigate = useNavigate();
  // 프로그래밍 방식으로 페이지이 이

  const handleNavigateToSave = () => {
    navigate('/UserBoardSave');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {/* gutterBottom : 버튼과 아래 텍스트 사이의 간격을 조절 */}
        유저 게시판
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleNavigateToSave}
        style={{ marginTop: '20px' }}
      >
        게시판 저장 페이지로 이동
      </Button>

      {loading ? (
        // 로딩 중일 시 로딩 메시지 출력
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <ul>
          {/* 받은 데이터를 반복문을 통해 출력 */}
          {boardLists.map((board) => (
            // boardLists.map((board)) 에서 정한 board를 반복문을 통해 출력
            <li key={board.idx}>
              <Typography variant="h6">{board.boardName}</Typography>
              <Typography>{board.boardText}</Typography>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

export default UserBoard;
