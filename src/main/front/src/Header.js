import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Button, 
    Typography, 
    Stack, 
    Link, 
    Container,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Switch
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTheme } from './DarkMode/ThemeContext';
import axios from 'axios';

function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const checkUser = () => {
            const loggedInUser = sessionStorage.getItem('user');
            console.log('세션 스토리지 확인:', loggedInUser);
            
            if (loggedInUser && loggedInUser !== '{}') {
                try {
                    const userData = JSON.parse(loggedInUser);
                    console.log('파싱된 유저 데이터:', userData);
                    
                    // userNickname이 있는 경우에만 user 상태 업데이트
                    if (userData && userData.userNickname) {
                        setUser(userData);
                    } else {
                        console.log('유효하지 않은 사용자 데이터');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('사용자 데이터 파싱 오류:', error);
                    setUser(null);
                }
            } else {
                console.log('세션 스토리지에 사용자 데이터 없음');
                setUser(null);
            }
        };

        checkUser();

        window.addEventListener('storage', checkUser);
        return () => window.removeEventListener('storage', checkUser);
    }, []);

    useEffect(() => {
        console.log('현재 user 상태:', user);
    }, [user]);

    // 스크롤 이벤트 감지
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {  // 50px 이상 스크롤되면 투명 효과 적용
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    const handleHomeClick = () => {
        navigate('/');
    }

    const handleVoiceRecordingClick = () => {
        navigate('/voice-recording');
    }

    const handleTransTextClick = () => {
        navigate('/transcripts');
    }

    const handleUserBoard = () => {
        navigate('/UserBoard');
    }

    const handleAMain = () => {
        navigate('/Admin/AMain');
    }

    const handleLogout = async () => {
        try {
            // 백엔드에 로그아웃 요청
            await axios.post('/api/users/logout');
            
            // 세션 스토리지 클리어
            sessionStorage.removeItem('user');
            // 쿠키 제거
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const settingsDrawer = (
        <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
                sx: {
                    width: 300,
                    padding: '20px',
                    backgroundColor: isDarkMode ? '#121212' : '#ffffff',
                    color: isDarkMode ? '#ffffff' : '#000000',
                }
            }}
        >
            <List>
                <ListItem>
                    <Typography variant="h6" style={{ marginBottom: '20px' }}>
                        설정
                    </Typography>
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <DarkModeIcon color={isDarkMode ? 'primary' : 'action'} />
                    </ListItemIcon>
                    <ListItemText primary="다크 모드" />
                    <Switch
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        color="primary"
                    />
                </ListItem>
                {/* 추가 설정 항목들은 여기에 추가 */}
            </List>
        </Drawer>
    );

    return (
        <Container 
            maxWidth="xl" 
            style={{ 
                position: 'fixed',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 1000,
                width: '100%',
                transition: 'all 0.3s ease-in-out',  // 부드러운 전환 효과
            }}
        >
            <AppBar 
                position="static" 
                style={{ 
                    // 스크롤 상태에서 투명도 ���절
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.6)' : '#ffffff',
                    // 스크롤 상태에서 그림자 조절 and 원위치에서 그림자 조절
                    boxShadow: isScrolled ? '0px 4px 20px rgba(0, 0, 0, 0.1)' : '1px 4px 6px 1px rgb(0 0 0 / 0.3)',
                    // border 지름 조절
                    borderRadius: '16px',
                    width: '100%',
                    margin: '0 auto',
                    // 스크롤 상태에서 불러오는 효과 조절
                    backdropFilter: isScrolled ? 'blur(10px)' : 'none',
                    // transition = 부드러운 전환 효과
                    transition: 'all 0.3s ease-in-out'
                }}
            >
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    {/* justifyContent = 왼쪽 오른쪽 정렬, space-between = 왼쪽 오른쪽 간격 조절 */}
                    {/* 로고 부분 */}
                    <Stack direction="row" alignItems="center">
                        {/* direction = 방향 조절, alignItems = 세로 정렬 */}
                        <Typography 
                            variant="h6" 
                            style={{ 
                                color: '#2563EB', 
                                fontWeight: 'bold', 
                                marginLeft: '40px'
                            }} 
                            onClick={handleHomeClick}
                        >
                            MyPage
                        </Typography>
                    </Stack>

                    {/* 네비게이션 메뉴 */}
                    <Stack direction="row" spacing={3}>
                        <Link href="#" 
                            color="black" 
                            underline="none" 
                            onClick={handleVoiceRecordingClick}
                            style={{ 
                                // 스크롤 상태에서 투명도 조절
                                opacity: isScrolled ? 0.8 : 1,
                                // transition = 부드러운 전환 효과
                                transition: 'opacity 0.3s ease-in-out'
                            }}
                        >
                            메뉴1
                        </Link>
                        <Link href="#" color="black" underline="none" onClick={handleTransTextClick}>
                            메뉴2
                        </Link>
                        <Link href="#" color="black" underline="none" onClick={handleUserBoard}>
                            메뉴3
                        </Link>
                        <Link href="#" color="black" underline="none" onClick={handleAMain}>
                            메뉴4
                        </Link>
                        <Link href="#" color="black" underline="none">
                            메뉴5
                        </Link>
                        <Link href="#" color="black" underline="none">
                            메뉴6
                        </Link>
                    </Stack>

                    {/* 로그인/회원가입 버튼 섹션 수정 */}
                    <Stack 
                        direction="row" 
                        spacing={2} 
                        alignItems="center"
                        style={{ marginRight: '40px' }}
                    >
                        {user ? (
                            <>
                                <Typography style={{ 
                                    color: 'black',
                                    opacity: isScrolled ? 0.8 : 1
                                }}>
                                    {user.userNickname || user.name}님
                                </Typography>
                                <IconButton 
                                    onClick={toggleDrawer(true)}
                                    style={{
                                        color: isScrolled ? 'rgba(0, 0, 0, 0.8)' : '#000000',
                                    }}
                                >
                                    <SettingsIcon />
                                </IconButton>
                                <Button 
                                    variant="contained" 
                                    style={{ 
                                        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : '#000000',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease-in-out'
                                    }} 
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </Button>
                            </>
                        ) : (
                            <>
                                <IconButton 
                                    onClick={toggleDrawer(true)}
                                    style={{
                                        color: isScrolled ? 'rgba(0, 0, 0, 0.8)' : '#000000',
                                    }}
                                >
                                    <SettingsIcon />
                                </IconButton>
                                <Button 
                                    variant="contained" 
                                    style={{ 
                                        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : '#000000',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease-in-out'
                                    }} 
                                    onClick={handleLoginClick}
                                >
                                    Sign in
                                </Button>
                                <Button 
                                    variant="contained" 
                                    style={{ 
                                        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.8)' : '#000000',
                                        borderRadius: '8px',
                                        transition: 'all 0.3s ease-in-out'
                                    }} 
                                    onClick={handleSignupClick}
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Stack>
                </Toolbar>
            </AppBar>
            {settingsDrawer}
        </Container>
    );
}

export default Header;