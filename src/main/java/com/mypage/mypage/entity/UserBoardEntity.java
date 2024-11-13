package com.mypage.mypage.entity;

import com.mypage.mypage.dto.UserBoardDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_board")
public class UserBoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idx;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String contentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_idx")
    private UserBoardEntity parent;

    @OneToMany(mappedBy = "parent")
    private Set<UserBoardEntity> children = new HashSet<>();

    @ElementCollection
    private Set<String> tags = new HashSet<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    @Column(name = "is_expanded", nullable = false, columnDefinition = "boolean default true")
    private Boolean expanded = true;

    @PrePersist // 엔티티가 처음으로 데이터베이스에 저장되기 전에 호출되는 어노테이션
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        // 새로운 게시글이 생성될 때 이 메서드가 호출되어 생성일과 수정일이 자동으로 기록.
    }

    @PreUpdate // 엔티티가 데이터베이스에서 업데이트되기 전에 호출되는 어노테이션
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        // 게시글이 수정될 때 이 메서드가 호출되어 수정일이 자동으로 갱신.
    }

    public static UserBoardEntity toUserBoardEntity(UserBoardDto dto) {
        UserBoardEntity entity = new UserBoardEntity();
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setContentType(dto.getContentType());
        entity.setTags(new HashSet<>(dto.getTags()));
        entity.setCreatedBy(dto.getCreatedBy());
        return entity;
    }
}
