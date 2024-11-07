package com.mypage.mypage.controller;

import com.mypage.mypage.service.PageVisitService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/visits")
public class PageVisitController {
    private final PageVisitService pageVisitService;
    private final Logger logger = LoggerFactory.getLogger(PageVisitController.class);

    @PostMapping("/record")
    public ResponseEntity<?> recordVisit() {
        try {
            pageVisitService.recordPageVisit();
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("방문 기록 중 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("방문 기록 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        try {
            Map<String, Object> stats = pageVisitService.getVisitStatistics();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("통계 조회 중 오류 발생: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("통계 조회 중 오류가 발생했습니다: " + e.getMessage());
        }
    }
}