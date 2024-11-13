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
@Slf4j // 로깅 기능을 추가
public class UserBoardService {

    private final UserBoardRepository userBoardRepository;

    public UserBoardDto saveBoard(UserBoardDto boardDto) {
        UserBoardEntity parent = null; 
        // 부모 게시글 초기화.
        // 해당 메서드는 처음으로 게시판을 저장하는 것이기 때문에 부모 게시글이 존재하지 않음.
        if (boardDto.getParentIdx() != null) {
            parent = userBoardRepository.findById(boardDto.getParentIdx())
                .orElseThrow(() -> new RuntimeException("상위 페이지를 찾을 수 없습니다."));
        }

        // 게시글 Entity 생성
        UserBoardEntity entity = UserBoardEntity.builder()
            .title(boardDto.getTitle()) // 제목 생성
            .content(boardDto.getContent()) // 내용 생성
            .contentType(boardDto.getContentType()) // 콘텐츠 타입 생성
            .tags(new HashSet<>(boardDto.getTags())) // 태그 설정
            .parent(parent) // 부모 설정. 여기선 null
            .expanded(boardDto.getExpanded() != null ? boardDto.getExpanded() : false) // 확장 여부 설정
            .build(); // 객체 설정

        // 게시글 저장
        UserBoardEntity savedEntity = userBoardRepository.save(entity);
        return convertToDto(savedEntity); // convertToDto로 Dto로 변환해서 DB에 저장
    }

    // 페이지 불러들이는 메서드(조회)
    public List<UserBoardDto> getAllBoard() {
        try {
            // entities에 Repository로 findAll() 해서 모든 리스트를 안에 저장
            List<UserBoardEntity> entities = userBoardRepository.findAll();
            return entities.stream()
                .filter(entity -> entity.getParent() == null)  // 최상위 페이지만
                .map(this::convertToDtoWithChildren) // DTO로 변환
                .collect(Collectors.toList()); // 리스트로 수집
        } catch (Exception e) {
            log.error("Error in getAllBoard", e);
            throw new RuntimeException("Failed to get boards", e);
        }
    }


    // 자식 게시글을 포함한 DTO 변환 메서드
    private UserBoardDto convertToDtoWithChildren(UserBoardEntity entity) {
        UserBoardDto dto = new UserBoardDto(); // DTO 생성
        dto.setIdx(entity.getIdx()); // 자식 게시글 IDX 생성
        dto.setTitle(entity.getTitle()); // 제목 설정
        dto.setContent(entity.getContent()); // 내용 설정
        dto.setContentType(entity.getContentType()); // 콘텐츠 타입 설정
        dto.setTags(new ArrayList<>(entity.getTags())); // 타입 설정
        dto.setCreatedAt(entity.getCreatedAt()); // 생성일 설정
        dto.setUpdatedAt(entity.getUpdatedAt()); // 수정일 설정
        dto.setCreatedBy(entity.getCreatedBy()); // 만든자 설정
        dto.setExpanded(entity.getExpanded()); // 확장 여부 설정

        // 만약 부모 게시글이 NULL이 아니라면
        // 부모 인덱스 설정
        if (entity.getParent() != null) {
            dto.setParentIdx(entity.getParent().getIdx());
        }

        // 만약 자식 게시글이 NULL 이 아니고 자식 엔티티가 존재한다면
        if (entity.getChildren() != null && !entity.getChildren().isEmpty()) {
            dto.setChildren(
                entity.getChildren().stream() 
                    .map(this::convertToDtoWithChildren) // DTO로 변환
                    .collect(Collectors.toList()) // 리스트로 수집
            );
        } else {
            dto.setChildren(new ArrayList<>()); // 자식이 없으면 빈 리스트로 생성
        }

        return dto;
    }

    // 단일 게시글 DTO 변환 메서드
    private UserBoardDto convertToDto(UserBoardEntity entity) {
        return UserBoardDto.builder()
            .idx(entity.getIdx()) // 인덱스 설정
            .title(entity.getTitle()) // 제목 설정
            .content(entity.getContent()) // 내용 설정
            .contentType(entity.getContentType()) // 콘텐츠 타입 설정
            .parentIdx(entity.getParent() != null ? entity.getParent().getIdx() : null) // 부모 게시글 설정. 만약 없다면 NULL로 설정
            .tags(new ArrayList<>(entity.getTags())) // 태그 설정
            .createdAt(entity.getCreatedAt()) // 생성일 설정
            .updatedAt(entity.getUpdatedAt()) // 수정일 설정
            .createdBy(entity.getCreatedBy()) // 지은이 설정
            .expanded(entity.getExpanded()) // 확장 여부 설정
            .build();
    }

    // 특정 게시글 조회 메서드
    @Transactional(readOnly = true) // 읽기 전용 트랜잭션
    public UserBoardDto getBoardById(Integer idx) {
        UserBoardEntity entity = userBoardRepository.findById(idx) // 특정 게시글 찾기
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        return convertToDto(entity);
    }

    // 게시글 수정 메서드
    public UserBoardDto updateBoard(Integer idx, UserBoardDto boardDto) {
        UserBoardEntity entity = userBoardRepository.findById(idx) // 특정 게시글 찾기
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        
        // 특정 게시글을 찾은 이후 내용과 제목을 덧씌우기
        entity.setContent(boardDto.getContent());
        entity.setTitle(boardDto.getTitle());
        if (boardDto.getTags() != null) {
            entity.setTags(new HashSet<>(boardDto.getTags())); // 태그 수정
        }
        
        // 수정 내용 덧씌우기
        UserBoardEntity updated = userBoardRepository.save(entity);
        return convertToDto(updated);
    }

    // 게시글 확장 / 축소 토글 메서드
    public void togglePage(Integer idx, Boolean isExpanded) {
        UserBoardEntity entity = userBoardRepository.findById(idx) // 확장 / 축소 할 게시글 찾기
            .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        entity.setExpanded(isExpanded); // 확장 여부 설정
        userBoardRepository.save(entity);
    }
}
