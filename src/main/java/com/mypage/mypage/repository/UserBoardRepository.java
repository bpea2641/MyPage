package com.mypage.mypage.repository;

import com.mypage.mypage.entity.UserBoardEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBoardRepository extends JpaRepository<UserBoardEntity, Integer> {
    @EntityGraph(attributePaths = {"children", "tags"})
    List<UserBoardEntity> findAll();
}
