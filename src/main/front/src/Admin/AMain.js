import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard.js';
import UserManagement from './UserManagement';
import Statistics from './Statistics';
import Settings from './Settings';
import AdminIndex from './Aindex';

function AMain() {
    return (
        <div>
            <AdminIndex>
                <Routes>
                    <Route path="/*" element={<div>관리자 메인 페이지</div>} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/statistics" element={<Statistics />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </AdminIndex>
        </div>
    );
}

export default AMain;