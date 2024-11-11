package com.mypage.mypage.service;

import com.mypage.mypage.dto.UserBoardDto;
import com.mypage.mypage.entity.UserBoardEntity;
import com.mypage.mypage.repository.UserBoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserBoardService {

    private final UserBoardRepository userBoardRepository;

    public UserBoardDto saveBoard(UserBoardDto boardDto) {
        UserBoardEntity parent = null;
        if (boardDto.getParentIdx() != null) {
            parent = userBoardRepository.findById(boardDto.getParentIdx())
                .orElseThrow(() -> new RuntimeException("상위 페이지를 찾을 수 없습니다."));
        }

        UserBoardEntity entity = UserBoardEntity.builder()
            .title(boardDto.getTitle())
            .content(boardDto.getContent())
            .contentType(boardDto.getContentType())
            .tags(new HashSet<>(boardDto.getTags()))
            .parent(parent)
            .expanded(boardDto.getExpanded() != null ? boardDto.getExpanded() : false)
            .build();

        UserBoardEntity savedEntity = userBoardRepository.save(entity);
        return convertToDto(savedEntity);
    }

    public List<UserBoardDto> getAllBoard() {
        try {
            List<UserBoardEntity> entities = userBoardRepository.findAll();
            return entities.stream()
                .filter(entity -> entity.getParent() == null)  // 최상위 페이지만
                .map(this::convertToDtoWithChildren)
                .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error in getAllBoard", e);
            throw new RuntimeException("Failed to get boards", e);
        }
    }

    private UserBoardDto convertToDtoWithChildren(UserBoardEntity entity) {
        UserBoardDto dto = new UserBoardDto();
        dto.setIdx(entity.getIdx());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setContentType(entity.getContentType());
        dto.setTags(new ArrayList<>(entity.getTags()));
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        dto.setCreatedBy(entity.getCreatedBy());
        dto.setExpanded(entity.getExpanded());
        
        if (entity.getParent() != null) {
            dto.setParentIdx(entity.getParent().getIdx());
        }

        if (entity.getChildren() != null && !entity.getChildren().isEmpty()) {
            dto.setChildren(
                entity.getChildren().stream()
                    .map(this::convertToDtoWithChildren)
                    .collect(Collectors.toList())
            );
        } else {
            dto.setChildren(new ArrayList<>());
        }

        return dto;
    }

    private UserBoardDto convertToDto(UserBoardEntity entity) {
        return UserBoardDto.builder()
            .idx(entity.getIdx())
            .title(entity.getTitle())
            .content(entity.getContent())
            .contentType(entity.getContentType())
            .parentIdx(entity.getParent() != null ? entity.getParent().getIdx() : null)
            .tags(new ArrayList<>(entity.getTags()))
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .createdBy(entity.getCreatedBy())
            .expanded(entity.getExpanded())
            .build();
    }

    @Transactional(readOnly = true)
    public UserBoardDto getBoardById(Integer idx) {
        UserBoardEntity entity = userBoardRepository.findById(idx)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        return convertToDto(entity);
    }

    public UserBoardDto updateBoard(Integer idx, UserBoardDto boardDto) {
        UserBoardEntity entity = userBoardRepository.findById(idx)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        entity.setContent(boardDto.getContent());
        entity.setTitle(boardDto.getTitle());
        if (boardDto.getTags() != null) {
            entity.setTags(new HashSet<>(boardDto.getTags()));
        }
        
        UserBoardEntity updated = userBoardRepository.save(entity);
        return convertToDto(updated);
    }

    public void togglePage(Integer idx, Boolean isExpanded) {
        UserBoardEntity entity = userBoardRepository.findById(idx)
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        entity.setExpanded(isExpanded);
        userBoardRepository.save(entity);
    }
}
