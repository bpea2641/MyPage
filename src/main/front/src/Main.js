import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import VoiceRecording from './VoiceRecording'; // VoiceRecording.js 파일을 임포트
import TransTextList from './TransTextList'; // 방금 만든 TransTextList 컴포넌트
import UserBoard from './UserBoard';
import UserBoardSave from './UserBoardSave'
import AMain from './Admin/AMain';

function Main() {
    return (    
        <div>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/voice-recording" element={<VoiceRecording />} />
                <Route path="/transcripts" element={<TransTextList />} />
                <Route path="/UserBoard" element={<UserBoard />} />
                <Route path="/UserBoardSave" element={<UserBoardSave />} />
                <Route path="/admin/*" element={<AMain />} />
            </Routes>
        </div>
    );
}

export default Main;
