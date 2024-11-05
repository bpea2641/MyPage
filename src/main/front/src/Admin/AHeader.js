import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';

function AHeader() {
    const navigate = useNavigate();

    return (
        <AppBar position="static">
            <Toolbar>
                {/* 로고 영역 */}
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Admin Header
                </Typography>

                {/* 네비게이션 메뉴들 */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton 
                        color="inherit" 
                        onClick={() => navigate('/')}
                    >
                        <DashboardIcon />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                            메뉴1
                        </Typography>
                    </IconButton>

                    <IconButton 
                        color="inherit"
                        onClick={() => navigate('/')}
                    >
                        <PeopleIcon />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                            메뉴2
                        </Typography>
                    </IconButton>

                    <IconButton 
                        color="inherit"
                        onClick={() => navigate('/')}
                    >
                        <DescriptionIcon />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                            메뉴3
                        </Typography>
                    </IconButton>

                    <IconButton 
                        color="inherit"
                        onClick={() => navigate('/')}
                    >
                        <SettingsIcon />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                            메뉴4
                        </Typography>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default AHeader;