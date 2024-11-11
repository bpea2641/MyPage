package com.mypage.mypage.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserBoardDto {
    private Integer idx;
    private String title;
    private String content;
    private String contentType;
    private Integer parentIdx;
    private List<String> tags = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private List<UserBoardDto> children = new ArrayList<>();
    private Boolean expanded = true;
}
