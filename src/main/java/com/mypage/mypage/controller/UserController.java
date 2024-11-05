package com.mypage.mypage.controller;

import com.mypage.mypage.dto.GoogleLoginRequest;
import com.mypage.mypage.dto.UserDto;
import com.mypage.mypage.entity.UserEntity;
import com.mypage.mypage.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // 회원가입 요청 처리
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody UserDto userDto) {
        UserEntity registeredUser = userService.registerUser(userDto);
        if (registeredUser != null) {
            return ResponseEntity.ok("Registration successful");
        } else {
            return ResponseEntity.badRequest().body("Registration failed");
        }
    }
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDto userDto) {
        try {
            Optional<UserEntity> userEntityOptional = userService.loginUser(userDto.getUserEmail(), userDto.getUserPassword());
            
            // 디버깅을 위한 로그
            System.out.println("로그인 시도 - 이메일: " + userDto.getUserEmail());
            
            if (userEntityOptional.isPresent()) {
                UserEntity user = userEntityOptional.get();
                
                // 상세 로그 출력
                System.out.println("=== 로그인 성공 정보 ===");
                System.out.println("로그인 성공한 사용자: " + user.toString());
                System.out.println("닉네임: " + user.getUserNickname());
                System.out.println("이메일: " + user.getUserEmail());
                System.out.println("=====================");
                
                Map<String, Object> response = new HashMap<>();
                response.put("userNickname", user.getUserNickname());
                response.put("userEmail", user.getUserEmail());
                response.put("message", "Login successful");
                
                // 응답 데이터 로그
                System.out.println("응답 데이터: " + response);
                
                return ResponseEntity.ok(response);
            } else {
                System.out.println("로그인 실패 - 사용자를 찾을 수 없음");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
            }
        } catch (Exception e) {
            System.out.println("로그인 처리 중 에러 발생: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login processing error");  
        }
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        return userService.processGoogleLogin(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        try {
            // JWT 토큰 쿠키 제거
            Cookie cookie = new Cookie("accessToken", null);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0); // 즉시 만료
            response.addCookie(cookie);

            return ResponseEntity.ok("Logout successful");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Logout failed: " + e.getMessage());
        }
    }
}
