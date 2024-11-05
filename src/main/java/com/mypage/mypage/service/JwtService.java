package com.mypage.mypage.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import com.mypage.mypage.entity.UserEntity;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secretKey;
    
    private static final long EXPIRE_TIME = 1000 * 60 * 60 * 24; // 24시간

    public String createToken(UserEntity user) {
        Claims claims = Jwts.claims();
        claims.put("email", user.getUserEmail());
        claims.put("uuid", user.getUserUuid().toString());

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_TIME))
                .compact();
    }
}
