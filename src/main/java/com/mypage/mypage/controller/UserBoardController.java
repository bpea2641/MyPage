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
// 기존의 Controller은 받은 데이터를 가지고 다시 주소로 가고.
// RestController은 받은 데이터를 판단해서 ok를 보냄.
@RequiredArgsConstructor // 생성자 자동 생성
@RequestMapping("/api/board")
public class UserBoardController {

    private final UserBoardService userBoardService;
    private static final Logger log = LoggerFactory.getLogger(UserBoardController.class);

    // 게시글 저장하는 메서드
    @PostMapping("/save")
    public ResponseEntity<?> saveBoard(@RequestBody UserBoardDto userBoardDto) {
        UserBoardDto savedBoard = userBoardService.saveBoard(userBoardDto); // Service로 주소로 받은 userBoardDto 입력을 저장.
        if(savedBoard != null) { // 만약 saveBoard가 null 이 아니면
            return ResponseEntity.ok("Save Board successful");
        } else {
            return ResponseEntity.badRequest().body("Save Board failed");
        }
    }

    // 모든 게시글 불러오는 메서드
    @GetMapping("/list")
    public ResponseEntity<List<UserBoardDto>> getAllBoard() {
        try {
            List<UserBoardDto> boards = userBoardService.getAllBoard();
            return ResponseEntity.ok(boards);
            // Service로 getAllBoard() 실행해서 게시글을 불러오고 문제가 없으면 ResponseEntity.ok
        } catch (Exception e) {
            // 만약 불러오는데 오류가 있다면
            log.error("Error getting all boards", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 게시글의 상세 페이지로 갈 때 사용하는 메서드
    @GetMapping("/{idx}")
    public ResponseEntity<UserBoardDto> getBoardById(@PathVariable Integer idx) { // idx를 찾아 조회
        UserBoardDto boardDto = userBoardService.getBoardById(idx); // getBoardById로 게시글 idx를 찾음
        return ResponseEntity.ok(boardDto); // 문제 없다면 ResponseEntity.ok
    }

    // 게시글 수정 메서드
    @PatchMapping("/{idx}") // @PatchMapping = 리소스의 일부를 수정할 때 사용함. (부분업데이트)
    public ResponseEntity<UserBoardDto> updateBoard(
        @PathVariable Integer idx, // 경로 변수로 idx를 받고 
        @RequestBody UserBoardDto boardDto // 수정할 게시글 DTO를 요청 본문에서 받음
    ) {
        UserBoardDto updated = userBoardService.updateBoard(idx, boardDto); // 서비스에서 게시글 수정
        return ResponseEntity.ok(updated); // 문제가 없다면 수정된 게시글 반환
    }

    // 게시글 확장 / 축소 토글 메서드
    @PatchMapping("/{idx}/toggle") // @PatchMapping = 리소스의 일부를 수정할 때 사용함. (부분업데이트)
    public ResponseEntity<Void> togglePage( // 특정 게시글의 확장 / 축소 요청을 처리
        @PathVariable Integer idx, // 경로 변수로 idx를 받는다.
        @RequestBody Map<String, Boolean> request // 요청 본문에서 확장 여부를 받는다.
    ) {
        userBoardService.togglePage(idx, request.get("isExpanded")); // 서비스에서 확장 여부 토글
        return ResponseEntity.ok().build(); // 성공적으로 처리 되었을 때 build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePage(@PathVariable Integer id) {
        try {
            userBoardService.deletePage(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting page with id: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } 
    }
}
