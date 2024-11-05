import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Checkbox, FormControlLabel, Link, Divider } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const GOOGLE_CLIENT_ID = "341302595429-8cup4hsgf9dpg78nobuohec0st69mm54.apps.googleusercontent.com";

    const handleLogin = async () => {
        try {
            const response = await axios.post('/api/users/login', {
                userEmail: email,
                userPassword: password,
            });
            
            // 응답 데이터가 유효한지 확인
            if (response.data && response.data.userNickname && response.data.userEmail) {
                const userData = {
                    userNickname: response.data.userNickname,
                    userEmail: response.data.userEmail
                };
                
                sessionStorage.setItem('user', JSON.stringify(userData));

                // 상태 업데이트를 위한 이벤트 발생
                window.dispatchEvent(new Event('storage'));
                
                alert('로그인 성공');
                window.location.href = '/';
            } else {
                console.error('유효하지 않은 응답 데이터:', response.data);
                setError('로그인 처리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            setError('이메일 또는 비밀번호가 잘못되었습니다.');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);  // jwt_decode에서 jwtDecode로 변경
            console.log('Google 로그인 성공:', decoded);
            
            // 백엔드로 Google 인증 정보 전송
            const response = await axios.post('/api/users/google-login', {
                email: decoded.email,
                name: decoded.name,
                googleId: decoded.sub,
                picture: decoded.picture
            });

            document.cookie = `accessToken=${response.data.token}; path=/; HttpOnly`;

            sessionStorage.setItem('user', JSON.stringify({
                userNickname: decoded.name,  // name을 userNickname으로 변경
                userEmail: decoded.email
            }));

            alert('구글 로그인 성공');
            window.location.href = '/';
        } catch (error) {
            setError('구글 로그인 중 오류가 발생했습니다.');
            console.error('Google login error:', error);
        }
    };

    const handleGoogleError = () => {
        setError('구글 로그인에 실패하였습니다.');
        console.error('Google login failed');
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <Container maxWidth="xs" style={{ marginTop: '50px' }}>
                <Stack direction="column" alignItems="center" spacing={2}>
                    <Typography variant="h4" component="h1">
                        Sign in
                    </Typography>
                </Stack>

                {/* 이메일 및 비밀번호 필드 */}
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <TextField
                        label="Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Link href="#" underline="none" variant="body2">
                        Forgot your password?
                    </Link>
                </Stack>

                {/* 기억하기 체크박스 */}
                <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="Remember me"
                />

                {/* 로그인 버튼 */}
                <Button
                    variant="contained"
                    fullWidth
                    style={{ marginTop: '20px', backgroundColor: '#000000' }}
                    onClick={handleLogin}
                >
                    Sign in
                </Button>

                {/* 에러 메시지 */}
                {error && (
                    <Typography color="error" style={{ marginTop: '10px' }}>
                        {error}
                    </Typography>
                )}

                {/* 회원가입 링크 */}
                <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
                    Don't have an account?{' '}
                    <Link href="/signup" underline="none">
                        Sign up
                    </Link>
                </Typography>

                {/* 구분선 */}
                <Divider style={{ marginTop: '20px', marginBottom: '10px' }}>or</Divider>
                {/* 소셜 로그인 버튼 */}
                <Stack direction="column" spacing={2}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        render={(renderProps) => (
                            <Button
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                variant="outlined"
                                startIcon={<GoogleIcon />}
                                fullWidth    
                            >
                                Sign in with Google
                            </Button>
                        )}
                    />
                </Stack>
            </Container>
        </GoogleOAuthProvider>
    );
}

export default Login;
