import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HomeIcon from '@mui/icons-material/Home';
import AHeader from './AHeader';

const drawerWidth = 240;

function Aindex({children}) {
    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AHeader />
            <Box sx={{ display: 'flex', flex: 1}}>
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            marginTop: '64px',
                            height: 'calc(100% - 64px)',
                            position: 'fixed',
                        },
                    }}
                >
                    <Box sx={{ overflow: 'auto' }}>
                        <List>
                            <ListItem component="div" onClick={() => navigate('/Admin')}>
                                <ListItemIcon>
                                    <AdminPanelSettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="관리자 페이지" />
                            </ListItem>
                            <ListItem component="div" onClick={() => navigate('/Admin/dashboard')}>
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                                <ListItemText primary="대시보드" />
                            </ListItem>
                            <ListItem component="div" onClick={() => navigate('/Admin/users')}>
                                <ListItemIcon>
                                    <PeopleIcon />
                                </ListItemIcon>
                                <ListItemText primary="사용자 관리" />
                            </ListItem>
                            <Divider />
                            <ListItem component="div" onClick={() => navigate('/Admin/statistics')}>
                                <ListItemIcon>
                                    <BarChartIcon />
                                </ListItemIcon>
                                <ListItemText primary="통계" />
                            </ListItem>
                            <ListItem component="div" onClick={() => navigate('/Admin/settings')}>
                                <ListItemIcon>
                                    <SettingsIcon />
                                </ListItemIcon>
                                <ListItemText primary="설정" />
                            </ListItem>
                            <ListItem component="div" onClick={() => navigate('/')}>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="홈페이지" />
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>

                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    {children || (
                        <Typography gutterBottom>
                            <h1>관리자 메인 페이지</h1>
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default Aindex;