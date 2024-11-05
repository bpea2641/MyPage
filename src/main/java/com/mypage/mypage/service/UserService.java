package com.mypage.mypage.service;

import com.mypage.mypage.dto.GoogleLoginRequest;
import com.mypage.mypage.dto.UserDto;
import com.mypage.mypage.entity.UserEntity;
import com.mypage.mypage.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // 회원가입 기능
    public UserEntity registerUser(UserDto userDto) {
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(userDto.getUserPassword());
        userDto.setUserPassword(encodedPassword);

        // DTO를 Entity로 변환하여 저장
        UserEntity userEntity = UserEntity.toUserEntity(userDto);
        return userRepository.save(userEntity);
    }

    // 로그인 기능
    public Optional<UserEntity> loginUser(String userEmail, String userPassword) {
        Optional<UserEntity> userEntityOptional = userRepository.findByUserEmail(userEmail);

        if (userEntityOptional.isPresent()) {
            UserEntity userEntity = userEntityOptional.get();
            // 비밀번호 확인
            if (passwordEncoder.matches(userPassword, userEntity.getUserPassword())) {
                return Optional.of(userEntity);
            }
        }
        return Optional.empty();
    }

        public ResponseEntity<?> processGoogleLogin(GoogleLoginRequest request) {
        try {
            // 1. 기존 구글 계정 확인
            Optional<UserEntity> existingUser = userRepository.findByGoogleId(request.getGoogleId());
            
            UserEntity user;
            if (existingUser.isPresent()) {
                user = existingUser.get();
                // 기존 사용자 정보 업데이트
                user.setUserNickname(request.getName());
                user.setPicture(request.getPicture());
            } else {
                // 새 사용자 생성
                user = UserEntity.fromGoogleLogin(request);
            }
            
            user = userRepository.save(user);
            
            // JWT 토큰 생성
            String token = jwtService.createToken(user);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", UserDto.toUserDto(user));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Google login failed: " + e.getMessage());
        }
    }
}

