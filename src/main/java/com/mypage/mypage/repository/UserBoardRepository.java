package com.mypage.mypage.repository;

import com.mypage.mypage.entity.UserBoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBoardRepository extends JpaRepository<UserBoardEntity, Integer> {
}
