import React, { useEffect, useState } from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import axios from 'axios';

function TransTextList() {
  const [transTexts, setTransTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransTexts = async () => {
    try {
      const response = await axios.get('/api/transText/list');
      setTransTexts(response.data);
    } catch (error) {
      setError('데이터를 가져오는 데 오류가 발생했습니다.');
      console.error('데이터 조회 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransTexts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        저장된 텍스트 목록
      </Typography>

      {loading ? (
        <Typography>로딩 중...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Grid container spacing={2}>
          {transTexts.map((transText) => (
            <Grid item xs={12} md={6} key={transText.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">전체 텍스트:</Typography>
                  <Typography>{transText.transText}</Typography>
                  <Typography variant="h6">요약된 텍스트:</Typography>
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: transText.summeryText
                        ? transText.summeryText.replace(/\n/g, '<br />') // 줄 바꿈을 <br />로 처리
                        : '요약된 텍스트가 없습니다.',
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default TransTextList;
