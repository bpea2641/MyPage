import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
`;

const StatCard = styled.div`
    background: ${props => props.theme.background};
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

    h3 {
        margin-bottom: 1rem;
        color: ${props => props.theme.text};
    }

    .number {
        font-size: 2.5rem;
        font-weight: bold;
        color: ${props => props.theme.primary};
    }
`;

function PageHits() {
    const [stats, setStats] = useState({
        todayVisits: 0,
        totalVisits: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 페이지 방문 기록
                await axios.post('/api/visits/record');
                
                // 통계 데이터 가져오기
                const response = await axios.get('/api/visits/statistics');
                setStats(response.data);
            } catch (error) {
                console.error('데이터 요청 실패:', error.response?.data || error.message);
            }
        };

        fetchData();
    }, []);

    return (
        <StatsContainer>
            <StatCard>
                <h3>오늘의 방문자</h3>
                <div className="number">{stats.todayVisits}</div>
            </StatCard>
            <StatCard>
                <h3>총 방문자</h3>
                <div className="number">{stats.totalVisits}</div>
            </StatCard>
        </StatsContainer>
    );
}

export default PageHits;