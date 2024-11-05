package com.mypage.mypage.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/audio")
public class AudioController {

    private static final Logger logger = LoggerFactory.getLogger(AudioController.class);

    @PostMapping("/transcribe")
    public ResponseEntity<?> transcribeAudio(@RequestParam("file") MultipartFile file) {
        try {
            // 파일 형식 체크
            if (!Objects.equals(file.getContentType(), "audio/wav")) {
                return ResponseEntity.badRequest().body("지원되지 않는 파일 형식입니다. WAV 파일만 업로드 가능합니다.");
            }

            // Whisper API 연동
            String transcript = transcribeAudioToText(file);
            return ResponseEntity.ok(Map.of("transcript", transcript));
        } catch (Exception e) {
            logger.error("Audio error1: ", e);  // 에러 로그 기록
            logger.info("Uploaded file: name={}, size={}, contentType={}", file.getOriginalFilename(), file.getSize(), file.getContentType());
            return ResponseEntity.status(500).body("오디오 파일 처리 중 오류가 발생했습니다.");
        }
    }

    private String transcribeAudioToText(MultipartFile file) throws Exception {
        String openAiApiUrl = "https://api.openai.com/v1/audio/transcriptions";
        String openAiApiKey = "";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(openAiApiKey);

        // Whisper API 요청 구성
        // Multipart body 설정 (파일 이름과 Content Type을 명시)
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource fileAsResource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();  // 파일 이름 설정
            }
        };

        body.add("file", fileAsResource);
        body.add("model", "whisper-1");

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(openAiApiUrl, requestEntity, String.class);

        // Whisper 응답 처리
        return extractTranscriptFromResponse(response.getBody());
    }

    private String extractTranscriptFromResponse(String responseBody) throws Exception {
        // JSON 응답에서 텍스트를 추출하는 로직
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        return jsonNode.get("text").asText();  // Whisper API의 'text' 필드에서 변환된 텍스트를 추출
    }
}
