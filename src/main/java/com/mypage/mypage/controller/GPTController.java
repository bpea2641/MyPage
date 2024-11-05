package com.mypage.mypage.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/gpt")
public class GPTController {

    @PostMapping("/summarize")
    public ResponseEntity<?> summarizeText(@RequestBody Map<String, String> requestBody) {
        String text = requestBody.get("text");
        try {
            String summary = summarizeWithGPT(text);
            // 요약된 텍스트를 포맷팅하여 가독성을 높임
            String formattedSummary = formatSummaryText(summary);
            return ResponseEntity.ok(Map.of("summary", formattedSummary));
        } catch (Exception e) {
            System.err.println("GPT API 호출 중 오류 발생: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("텍스트 요약 중 오류가 발생했습니다.");
        }
    }

    private String summarizeWithGPT(String text) throws Exception {
        String openAiApiUrl = "https://api.openai.com/v1/chat/completions";
        String openAiApiKey = "";
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openAiApiKey);

        // 요청 본문을 객체로 구성하여 ObjectMapper를 사용하여 JSON 문자열로 변환
        HashMap<String, Object> map = new HashMap<>();
        map.put("model", "gpt-4");
        map.put("messages", new Object[]{
                new HashMap<String, String>() {{
                    put("role", "system");
                    put("content", "Summarize the following text in Korean.");
                }},
                new HashMap<String, String>() {{
                    put("role", "user");
                    put("content", text);
                }}
        });
        map.put("max_tokens", 5000);

        ObjectMapper objectMapper = new ObjectMapper();
        String requestBody = objectMapper.writeValueAsString(map);

        HttpEntity<String> request = new HttpEntity<>(requestBody, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(openAiApiUrl, request, String.class);

        return extractSummaryFromResponse(response.getBody());
    }

    // 요약된 텍스트에 번호 매기기 및 줄 바꿈 추가 (번호마다 줄 띄움 추가)
    private String formatSummaryText(String summary) {
        String[] sentences = summary.split("\\.\\s+"); // 문장 단위로 나눔
        StringBuilder formattedSummary = new StringBuilder();

        for (int i = 0; i < sentences.length; i++) {
            formattedSummary.append((i + 1)).append(". ").append(sentences[i].trim()).append("<br />"); // <br />로 줄 바꿈
        }

        return formattedSummary.toString();
    }


    private String extractSummaryFromResponse(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(responseBody);
            JsonNode choicesNode = rootNode.path("choices");
            if (choicesNode.isArray() && choicesNode.size() > 0) {
                JsonNode firstChoiceNode = choicesNode.get(0);
                return firstChoiceNode.path("message").path("content").asText().trim();
            } else {
                return "No summary available.";
            }
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing response.";
        }
    }
}
