package com.mypage.mypage.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class GoogleLoginRequest {
    private String email;
    private String name;
    private String googleId;
    private String picture;
}