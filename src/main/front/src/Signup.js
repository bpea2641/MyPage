import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Select, MenuItem, Link, Divider } from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon } from '@mui/icons-material';
import Stack from '@mui/material/Stack';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [birth, setBirth] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('');
    const [error, setError] = useState('');

    const handleSignup = async () => {
        if (password !== confirmPassword) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post('/api/users/signup', {
                userEmail: email,
                userPassword: password,
                userNickname: nickname,
                userBirth: birth,
                userPhone: phone,
                userGender: gender,
            });
            alert('회원가입 성공');
            window.location.href = '/login';
        } catch (error) {
            setError('회원가입에 실패했습니다.');
        }
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: '50px' }}>
            <Stack direction="column" alignItems="center" spacing={2}>
                <Typography variant="h4" component="h1">
                    Sign up
                </Typography>
            </Stack>

            {/* 입력 필드 */}
            <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Nickname"
                fullWidth
                margin="normal"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
            />
            <TextField
                label="Birth Date"
                fullWidth
                margin="normal"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
            />
            <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Select
                label="Gender"
                fullWidth
                margin="normal"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
            >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
            </Select>
            <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
                label="Confirm Password"
                type="password"
                fullWidth
                margin="normal"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* 에러 메시지 */}
            {error && (
                <Typography color="error" style={{ marginTop: '10px' }}>
                    {error}
                </Typography>
            )}

            {/* 가입 버튼 */}
            <Button
                variant="contained"
                fullWidth
                style={{ marginTop: '20px', backgroundColor: '#000000' }}
                onClick={handleSignup}
            >
                Sign up
            </Button>

            {/* 구분선 */}
            <Divider style={{ marginTop: '20px', marginBottom: '10px' }}>or</Divider>

            {/* 소셜 로그인 버튼 */}
            <Stack direction="column" spacing={2}>
                <Button
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    fullWidth
                >
                    Sign up with Google
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<FacebookIcon />}
                    fullWidth
                >
                    Sign up with Facebook
                </Button>
            </Stack>

            {/* 로그인 링크 */}
            <Typography variant="body2" align="center" style={{ marginTop: '10px' }}>
                Already have an account?{' '}
                <Link href="/login" underline="none">
                    Sign in
                </Link>
            </Typography>
        </Container>
    );
}

export default Signup;
