import React, { useState, useRef } from 'react';
import { Button, Typography, Grid } from '@mui/material';
import axios from 'axios';

function VoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [summary, setSummary] = useState(null);
  const mediaRecorderRef = useRef(null); // 녹음기 객체
  const audioChunksRef = useRef([]); // 해당 녹음의 음성의 청크를 배열로 저장

  const startRecording = async () => {
    setIsRecording(true); // 녹음 시작
    audioChunksRef.current = []; // 해당 배열의 데이터값을 []로 초기화

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // 녹음기 객체 생성
      mediaRecorderRef.current = new MediaRecorder(stream);
      // 녹음기 객체의 이벤트 핸들러 설정
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      // 녹음의 데이터를 초 단위로 size가 0 이상일 시 audioChunksRef에 저장


      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        // 녹음된 데이터가 정지일 시 audioBlob에 wav파일 형식으로 저장
        // 이후 audioUrl에 웹에서 사용할 수 있는 Url형식으로 저장
        // setAudioURL의 useState 함수를 통해 저장

        const formData = new FormData();
        // 백엔드로 보낼 폼데이터 생성
        formData.append('file', audioBlob, 'recording.wav');
        // file : 서버에서 받을 때 사용할 필드 이름
        // audioBlob : 녹음된 음성의 데이터
        // recording.wav : 서버에서 받을 때 사용할 파일 이름

        try {
          const response = await axios.post('/api/audio/transcribe', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          // 해당 주소에 post로 formData를 보내고 밑에 headers는 파일 데이터를 보내기 위한 설정

          const transcribedText = response.data.transcript;
          setTranscript(transcribedText);
          // 서버에서 음성을 텍스트로 변환시킨 결과(response.data.transcript)를 setTranscript의 useState 함수를 통해 저장

          const gptResponse = await axios.post('/api/gpt/summarize', { text: transcribedText });
          console.log('GPT Response:', gptResponse.data); // 요약 텍스트 로그 출력
          setSummary(gptResponse.data.summary);
          // 위에서 받은 transcribedText를 /api/gpt/summarize에 post로 보내고 해당 응답을 gptResponse에 저장
          // console.log를 통해 디버깅을 해주고
          // setSummary의 useState 함수에 해당 gptResponse의 요약 데이터를 저장

            try {
                await axios.post('/api/transText/save', {
                    transText: transcribedText,
                    summeryText: gptResponse.data.summary,
                    // 위에서 받은 transcribedText와 gptResponse의 요약 데이터를 백엔드로 보내고
                });
            } catch (error) {
                console.error('Error saving summary text:', error.response ? error.response.data : error.message);
                // 요약 데이터에 문제가 생겼을 시 에러 메시지 출력
            }

        } catch (error) {
          console.error('Error uploading audio:', error);
          // 음성 데이터를 백엔드로 보내는 과정에서 에러가 생겼을 시 에러 메시지 출력
        }
      };

      mediaRecorderRef.current.start();
      // 녹음기 객체의 start 함수를 통해 녹음 시작
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // 녹음기에서 마이크에 녹음에 문제가 생겼을 시 에러 메시지 출력
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };
  // 녹음 종료 및 setIsRecording의 useState 함수를 false로 설정
  // 이후 만약 mediaRecorderRef.current가 존재하면 녹음기 객체의 stop 함수를 통해 녹음 종료

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        음성 녹음 및 변환
      </Typography>
      {/* gutterBottom : 버튼과 아래 텍스트 사이의 간격을 조절 */}
      <Button
        variant="contained"
        color="primary"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? '녹음 종료' : '녹음 시작'}
      </Button>

      {audioURL && (
        <div>
          <Typography variant="h6">녹음된 파일:</Typography>
          <audio src={audioURL} controls />
        </div>
      )}
      {/* audioURL이 있을 때 오디오 플레이어가 실행이 됨
          controls가 있을 때만 컨트롤 버튼이 나옴 */}

        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={12} md={6}> 
            {/* 그리드 컨테이너
                xs : 12개의 열 중 1개의 열을 차지
                md : 12개의 열 중 6개의 열을 차지 */}
            <Typography variant="h6">변환된 전체 텍스트:</Typography>
            <Typography>{transcript || '변환된 텍스트가 없습니다.'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6">요약된 텍스트:</Typography>
            <Typography
              dangerouslySetInnerHTML={{
                __html: summary
                // dangerouslySetInnerHTML : HTML을 직접 삽입할 때 사용
                // __html : 삽입할 HTML 코드, 반드시 써야함.
                  ? summary.replace(/\n/g, '<br />')
                  // summary의 텍스트를 html 형식으로 변경
                  // 그 후 줄 바꿈을 <br />로 변경
                  : '요약된 텍스트가 없습니다.'
              }}
            />
          </Grid>
        </Grid>
    </div>
  );
}

export default VoiceRecording;
