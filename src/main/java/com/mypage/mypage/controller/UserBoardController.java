package com.mypage.mypage.controller;

import com.mypage.mypage.dto.UserBoardDto;
import com.mypage.mypage.entity.UserBoardEntity;
import com.mypage.mypage.service.UserBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class UserBoardController {

    private final UserBoardService userBoardService;

    @PostMapping("/save")
    public ResponseEntity<?> saveBoard(@RequestBody UserBoardDto userBoardDto) {
        UserBoardEntity savedBoard = userBoardService.saveBoard(userBoardDto);
        if(savedBoard != null) {
            return ResponseEntity.ok("Save Board successful");
        } else {
            return ResponseEntity.badRequest().body("Save Board failed");
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<UserBoardEntity>> getAllBoard() {
        List<UserBoardEntity> userBoardEntities = userBoardService.getAllBoard();
        return ResponseEntity.ok(userBoardEntities);
    }
}
