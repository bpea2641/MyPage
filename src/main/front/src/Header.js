import React from 'react';
import { AppBar, Toolbar, Button, Typography, Stack, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Header() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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
        navigate('/admin/AMain');
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

    return (
        <AppBar position="static" style={{ backgroundColor: '#f5f7fa', boxShadow: 'none' }}>
            <Toolbar style={{ justifyContent: 'space-between' }}>
                {/* 로고 부분 */}
                <Stack direction="row" alignItems="center">
                    {/*<img src="/path_to_logo" alt="Logo" style={{ width: 40, marginRight: 10 }} />*/}
                    <Typography variant="h6" style={{ color: '#2563EB', fontWeight: 'bold', marginLeft: '200px' }} onClick={handleHomeClick}>
                        MyPage
                    </Typography>
                </Stack>

                {/* 네비게이션 메뉴 */}
                <Stack direction="row" spacing={3}>
                    <Link href="#" color="black" underline="none" onClick={handleVoiceRecordingClick}>
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

                <Stack direction="row" spacing={2} alignItems="center">
                    {user ? (
                        <>
                            <Typography style={{ color: 'black' }}>
                            {user.userNickname || user.name}님  {/* name도 체크 */}
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="black" 
                                style={{ backgroundColor: '#000000' }} 
                                onClick={handleLogout}
                            >
                                로그아웃
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="contained" color="black" style={{ backgroundColor: '#000000' }} onClick={handleLoginClick}>
                                Sign in
                            </Button>
                            <Button variant="contained" color="black" style={{ backgroundColor: '#000000' }} onClick={handleSignupClick}>
                                Sign up
                            </Button>
                        </>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
}

export default Header;



