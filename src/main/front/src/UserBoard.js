import React, { useState, useEffect, useCallback } from 'react';
import { Box, Drawer, IconButton, Typography, TextField, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import styled from 'styled-components';
import { debounce } from 'lodash';

const DRAWER_WIDTH = 300;

const MainContainer = styled(Box)`
  display: flex;
  height: 100vh;
`;
  
const SideBar = styled(Box)`
  width: ${DRAWER_WIDTH}px;
  flex-shrink: 0;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
`;

const ContentArea = styled(Box)`
  flex-grow: 1;
  padding: 20px;
  background: #ffffff;
`;

const PageList = styled(Box)`
  padding: 16px;
`;

const PageItem = styled(Paper)`
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;

const Editor = styled(TextField)`
  width: 100%;
  .MuiInputBase-root {
    padding: 20px;
  }
`;

const TitleEditor = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SaveStatus = styled(Typography)`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.1);
`;

// 중첩된 페이지 아이템 컴포넌트
const NestedPageItem = ({ page, level = 0, onSelect, onToggle, onAddSubPage, onDelete, currentPageId }) => {
  const [isExpanded, setIsExpanded] = useState(page.expanded);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    onToggle(page.idx, !isExpanded);
  };

  const handleAddSubPage = (e) => {
    e.stopPropagation();
    onAddSubPage(page.idx);
  };

  return (
    <>
      <PageItem 
        sx={{ ml: level * 2 }}
        elevation={currentPageId === page.idx ? 3 : 1}
        onClick={() => onSelect(page.idx)}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            {page.children?.length > 0 && (
              <IconButton size="small" onClick={handleToggle}>
                {isExpanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}
              </IconButton>
            )}
            <Typography variant="subtitle1">{page.title || "제목 없음"}</Typography>
          </Box>
          <Box>
            <IconButton 
              size="small" 
              onClick={handleAddSubPage}
              sx={{ mr: 1 }}
            >
              <AddCircleOutlineIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(page.idx);
              }}
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
  const [currentPage, setCurrentPage] = useState(null);
  const [content, setContent] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [saveStatus, setSaveStatus] = useState('저장됨');

  useEffect(() => {
    fetchPages();
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get('/api/board/list');
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    }
  };

  const handlePageSelect = async (pageId) => {
    try {
      const response = await axios.get(`/api/board/${pageId}`);
      setCurrentPage(response.data);
      setContent(response.data.content);
    } catch (error) {
      console.error('Error fetching page:', error);
    }
  };

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

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (currentPage) {
      debouncedSave(currentPage.idx, newContent);
    }
  };

  const handleNewPage = async () => {
    try {
      const response = await axios.post('/api/board/save', {
        title: '새 페이지',
        content: '',
        contentType: 'TEXT',
        tags: []
      });
      await fetchPages();
      handlePageSelect(response.data.idx);
    } catch (error) {
      console.error('Error creating new page:', error);
    }
  };

  const handleTitleChange = async (e) => {
    if (!currentPage) return;
    
    const newTitle = e.target.value;
    setCurrentPage(prev => ({
      ...prev,
      title: newTitle
    }));
    
    try {
      await debouncedSaveTitle(currentPage.idx, newTitle);
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

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
    []
  );

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

  const handleToggle = async (pageId, isExpanded) => {
    try {
      await axios.patch(`/api/board/${pageId}/toggle`, { isExpanded });
      fetchPages();
    } catch (error) {
      console.error('Error toggling page:', error);
    }
  };

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

  return (
    <MainContainer>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{ width: DRAWER_WIDTH }}
        >
          {sideBarContent}
        </Drawer>
      ) : (
        <SideBar>{sideBarContent}</SideBar>
      )}
      
      <ContentArea>
        {isMobile && (
          <IconButton onClick={() => setDrawerOpen(true)} sx={{ mb: 2 }}>
            <MenuIcon />
          </IconButton>
        )}
        
        {currentPage && (
          <Box display="flex" alignItems="center" mb={3}>
            {isEditingTitle ? (
              <TextField
                fullWidth
                variant="standard"
                value={currentPage.title}
                onChange={handleTitleChange}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
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
          <Editor
            multiline
            fullWidth
            variant="outlined"
            value={content}
            onChange={handleContentChange}
            placeholder="여기에 내용을 입력하세요..."
            minRows={20}
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
