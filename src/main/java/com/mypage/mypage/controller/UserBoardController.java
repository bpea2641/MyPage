package com.mypage.mypage.controller;

import com.mypage.mypage.dto.UserBoardDto;
import com.mypage.mypage.service.UserBoardService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class UserBoardController {

    private final UserBoardService userBoardService;
    private static final Logger log = LoggerFactory.getLogger(UserBoardController.class);

    @PostMapping("/save")
    public ResponseEntity<?> saveBoard(@RequestBody UserBoardDto userBoardDto) {
        UserBoardDto savedBoard = userBoardService.saveBoard(userBoardDto);
        if(savedBoard != null) {
            return ResponseEntity.ok("Save Board successful");
        } else {
            return ResponseEntity.badRequest().body("Save Board failed");
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserBoardDto>> getAllBoard() {
        try {
            List<UserBoardDto> boards = userBoardService.getAllBoard();
            return ResponseEntity.ok(boards);
        } catch (Exception e) {
            log.error("Error getting all boards", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{idx}")
    public ResponseEntity<UserBoardDto> getBoardById(@PathVariable Integer idx) {
        UserBoardDto boardDto = userBoardService.getBoardById(idx);
        return ResponseEntity.ok(boardDto);
    }

    @PatchMapping("/{idx}")
    public ResponseEntity<UserBoardDto> updateBoard(
        @PathVariable Integer idx,
        @RequestBody UserBoardDto boardDto
    ) {
        UserBoardDto updated = userBoardService.updateBoard(idx, boardDto);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{idx}/toggle")
    public ResponseEntity<Void> togglePage(
        @PathVariable Integer idx,
        @RequestBody Map<String, Boolean> request
    ) {
        userBoardService.togglePage(idx, request.get("isExpanded"));
        return ResponseEntity.ok().build();
    }
}
