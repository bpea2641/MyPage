import React, { useState, useEffect, useCallback } from 'react';
import { Box, Drawer, IconButton, Typography, Paper, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // React Quill 스타일
import axios from 'axios';
import styled from 'styled-components';
import { debounce } from 'lodash';

// 사이드바 넓이
const DRAWER_WIDTH = 300;

// Main 쪽 컨테이너, 해당 페이지를 담당하는 컨테이너
const MainContainer = styled(Box)`
  display: flex; // 블록 요소를 가로로 배치
  height: 100vh;
`;

// 옆 사이드바 컨테이너
const SideBar = styled(Box)`
  width: ${DRAWER_WIDTH}px;
  flex-shrink: 0; // 컨테이너 크기 조절 시 줄어들지 않음
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

// 중앙 컨테이너
const ContentArea = styled(Box)`
  flex-grow: 1; // 컨테이너 크기 조절 시 증가
  padding: 20px;
  background: #ffffff;
`;

// 페이지 목록 컨테이너
const PageList = styled(Box)`
  padding: 16px;
`;

// 페이지 목록 아이템 컨테이너
const PageItem = styled(Paper)`
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer; // 마우스 오버 시 포인터 표시
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

// 사이드바 옆 입력박스 컨테이너
const Editor = styled(TextField)`
  width: 100%;
  .MuiInputBase-root { // MuiInputBase-root = 입력 박스 컨테이너
    padding: 20px;
  }
`;

// 페이지 제목 컨테이너
const TitleEditor = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

// 저장 상태? 컨테이너
const SaveStatus = styled(Typography)`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.1);
`;

const modules = {
  toolbar: [
    [{ 'header': [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet'}],
    [{ 'align': []}],
    ['clean']
  ],
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'list',
  'bullet',
  'align',
]

// 중첩된 페이지 아이템 컴포넌트
const NestedPageItem = ({ page, level = 0, onSelect, onToggle, onAddSubPage, onDelete, currentPageId }) => {
  const [isExpanded, setIsExpanded] = useState(page.expanded);
  // 페이지 확장 상태
  // isExpanded = 가 어미 페이지를 따라감

  const handleToggle = (e) => { // 페이지 확장 상태 토글
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    onToggle(page.idx, !isExpanded);
  };

  const handleAddSubPage = (e) => { // 하위 페이지 추가
    e.stopPropagation();
    onAddSubPage(page.idx);
  };

  return (
    <>
    {/* 페이지 아이템 컨테이너 = 페이지 목록 아이템 */}
      <PageItem 
        sx={{ ml: level * 2 }} // ml = margin-left, level = 페이지 레벨
        elevation={currentPageId === page.idx ? 3 : 1} // elevation = 그림자 효과
        onClick={() => onSelect(page.idx)} // 페이지 선택 시 이벤트
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          {/* justify-content="space-between" = 양쪽 정렬 */}
          {/* align-items="center" = 수직 정렬 */}
          <Box display="flex" alignItems="center">
            {page.children?.length > 0 && (
              // 하위 페이지가 있는 경우 확장 아이콘 표시
              <IconButton size="small" onClick={handleToggle}>
                {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </IconButton>
            )}
            <Typography variant="subtitle1">{page.title || "제목 없음"}</Typography>
            {/* variant="subtitle1" = 서브타이틀 스타일 */}
            {/* 페이지의 제목이 있으면 page.title 표시, 없으면 "제목 없음" 표시 */}
          </Box>
          <Box>
            <IconButton 
              size="small" 
              onClick={handleAddSubPage}
              sx={{ mr: 1 }} // mr = margin-right = 오른쪽 여백
            >
              <AddCircleOutlineIcon fontSize="small" />
              {/* 하위 페이지 추가 아이콘 */}
            </IconButton>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(page.idx);
              }}
              // 페이지 삭 아이콘
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </PageItem>
      {isExpanded && page.children?.map(childPage => (
        <NestedPageItem
          key={childPage.idx}
          page={childPage}
          level={level + 1}
          onSelect={onSelect}
          onToggle={onToggle}
          onAddSubPage={onAddSubPage}
          onDelete={onDelete}
          currentPageId={currentPageId}
        />
      ))}
    </>
  );
};

function UserBoard() {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null); // 현재 페이지
  const [content, setContent] = useState('');
  const [isMobile, setIsMobile] = useState(false); // 모바일 화면 여부
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saveStatus, setSaveStatus] = useState('저장됨'); // 저장 상태

  useEffect(() => {
    fetchPages(); // 페이지 목록 가져오기
    const handleResize = () => setIsMobile(window.innerWidth < 600); // 모바일 화면 여부 확인
    window.addEventListener('resize', handleResize);
    // 브라우저 크기 변경 시 이벤트 추가, resize 이벤트 발생 시 handleResize 함수 호출
    handleResize(); // 모바일 화면 여부 확인
    return () => window.removeEventListener('resize', handleResize); // 브라우저 크기 변경 시 이벤트 제거
  }, []);

  // 페이지 목록 가져오기
  const fetchPages = async () => {
    try {
      const response = await axios.get('/api/board/list');
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  // 페이지 선택 시 이벤트
  const handlePageSelect = async (pageId) => {
    try {
      const response = await axios.get(`/api/board/${pageId}`);
      setCurrentPage(response.data);
      setContent(response.data.content);
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

  // 내용 저장 이벤트, 실시간 저장
  const debouncedSave = React.useCallback(
    debounce(async (pageId, content) => {
      setSaveStatus('저장 중...');
      try {
        await axios.patch(`/api/board/${pageId}`, {
          ...currentPage,
          content
        });
        setSaveStatus('저장됨');
      } catch (error) {
        console.error('Error saving content:', error);
        setSaveStatus('저장 실패');
      }
    }, 1000),
    [currentPage]
  );

  // 내용 변경 시 이벤트
  const handleContentChange = (newContent) => {
    setContent(newContent);
    if (currentPage) {
      debouncedSave(currentPage.idx, newContent);
    }
  };

  // 새 페이지 생성 이벤트
  const handleNewPage = async () => {
    try {
      const response = await axios.post('/api/board/save', {
        title: '새 페이지',
        content: '',
        contentType: 'TEXT',
        tags: []
        // 태그 빈 배열
      });
      // 페이지 목록 가져오기
      await fetchPages();
      // 새 페이지 선택
      handlePageSelect(response.data.idx);
    } catch (error) {
      console.error('Error creating new page:', error);
    }
  };

  // 페이지 제목 변경 이벤트
  const handleTitleChange = async (e) => {
    if (!currentPage) return;
    
    const newTitle = e.target.value;
    setCurrentPage(prev => ({
      ...prev,
      title: newTitle
    }));
    
    // 페이지 제목 변경 시 이벤트
    try {
      await debouncedSaveTitle(currentPage.idx, newTitle);
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  // 페이지 제목 저장 이벤트, 실시간 저장
  const debouncedSaveTitle = useCallback(
    debounce(async (pageId, title) => {
      try {
        await axios.patch(`/api/board/${pageId}`, {
          title: title
        });
        fetchPages();
      } catch (error) {
        console.error('Error saving title:', error);
      }
    }, 500),
    // 0.5초 후 저장
    []
  );

  // 페이지 삭제 이벤트, 아직 미완
  const handleDeletePage = async (pageId) => {
    if (!window.confirm('정말 이 페이지를 삭제하시겠습니까?')) return;
    
    try {
      await axios.delete(`/api/board/${pageId}`);
      setCurrentPage(null);
      setContent('');
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  // 하위 페이지 추가 이벤트
  const handleAddSubPage = async (parentId) => {
    try {
      const response = await axios.post('/api/board/save', {
        title: '',
        content: '',
        contentType: 'TEXT',
        parentIdx: parentId,
        tags: []
      });
      await fetchPages();
      handlePageSelect(response.data.idx);
      setIsEditingTitle(true);
    } catch (error) {
      console.error('Error creating sub-page:', error);
    }
  };

  // 페이지 확장 상태 토글 이벤트
  const handleToggle = async (pageId, isExpanded) => {
    try {
      await axios.patch(`/api/board/${pageId}/toggle`, { isExpanded });
      // 페이지 확장 상태 토글
      fetchPages();
      // 페이지 목록 가져오기
    } catch (error) {
      console.error('Error toggling page:', error);
    }
  };

  // 사이드바 컨텐츠
  const sideBarContent = (
    <>
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">페이지 목록</Typography>
        <IconButton onClick={() => handleAddSubPage(null)}>
          <AddIcon />
        </IconButton>
      </Box>
      <PageList>
        {pages.filter(page => !page.parent).map((page) => (
          // 부모 페이지가 없는 페이지만 표시
          <NestedPageItem
            key={page.idx}
            page={page}
            onSelect={handlePageSelect}
            onToggle={handleToggle}
            onAddSubPage={handleAddSubPage}
            onDelete={handleDeletePage}
            currentPageId={currentPage?.idx}
          />
        ))}
      </PageList>
    </>
  );

  // 메인 컨테이너
  return (
    <MainContainer>
      {isMobile ? (
        // 모바일 화면 시 사이드바 표시
        <Drawer
          variant="temporary" // variant = temporary = 임시 표시
          open={drawerOpen} // 사이드바 열림 여부
          onClose={() => setDrawerOpen(false)} // 사이드바 닫힘 이벤트
          sx={{ width: DRAWER_WIDTH }} // 사이드바 넓이
        >
          {sideBarContent} 
          {/* 사이드바 컨텐츠 */}
        </Drawer>
      ) : (
        <SideBar>{sideBarContent}</SideBar>
      )}
      
      <ContentArea>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ mb: 2 }}> 
          {/* 사이드바 열림 아이콘 */}
            <MenuIcon />
          </IconButton>
        )}
        
        {currentPage && (
          <Box display="flex" alignItems="center" mb={3}>
            {isEditingTitle ? (
              <TextField
                fullWidth
                variant="standard" // variant = standard = 표준 스타일
                value={currentPage.title} // 페이지 제목
                onChange={handleTitleChange} // 페이지 제목 변경 이벤트
                onBlur={() => setIsEditingTitle(false)} // 텍스트 입력 창 벗어날 시 이벤트
                // onBlur = 텍스트 입력 창 벗어날 시 이벤트
                onKeyDown={(e) => {
                  // Enter 키 입력 시 이벤트
                  if (e.key === 'Enter') {
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                InputProps={{
                  style: { fontSize: '2rem' }
                }}
              />
            ) : (
              <Box 
                display="flex" 
                alignItems="center" 
                onClick={() => setIsEditingTitle(true)}
                sx={{ cursor: 'pointer' }}
              >
                <Typography variant="h4" sx={{ mr: 1 }}>
                  {currentPage.title || "제목 없음"}
                </Typography>
                <EditIcon fontSize="small" color="action" />
              </Box>
            )}
          </Box>
        )}
        
        {currentPage ? (
          <ReactQuill
            value={content}
            onChange={handleContentChange}
            placeholder="여기에 내용을 입력하세요..."
            modules={modules} // 툴바 설정
            formats={formats} // 포맷 설정
            style={{ minHeight: '400px' }} // 최소 높이 설정
          />
        ) : (
          <Typography variant="h6" color="textSecondary" align="center">
            페이지를 선택하거나 새로운 페이지를 만드세요
          </Typography>
        )}
      </ContentArea>
      {currentPage && <SaveStatus>{saveStatus}</SaveStatus>}
    </MainContainer>
  );
}

export default UserBoard;
