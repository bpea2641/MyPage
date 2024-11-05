package com.mypage.mypage.controller;

import com.mypage.mypage.entity.TransTextEntity;
import com.mypage.mypage.service.TransTextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transText")
public class TransTextController {

    @Autowired
    private TransTextService transTextService;

    @PostMapping("/save")
    public ResponseEntity<?> saveTransText(@RequestBody Map<String, String> requestBody) {
        System.out.println("Received request: " + requestBody); // 로그 출력
        String transText = requestBody.get("transText");
        String summeryText = requestBody.get("summeryText");

        System.out.println("Received TransText: " + transText);
        System.out.println("Received SummaryText: " + summeryText);

        transTextService.saveTransTextEntity(transText, summeryText);
        return ResponseEntity.ok("저장 완료");
    }

    @GetMapping("/list")
    public ResponseEntity<List<TransTextEntity>> getAllTransText() {
        List<TransTextEntity> transTextEntities = transTextService.getAllTransText();
        return ResponseEntity.ok(transTextEntities);
    }
}
