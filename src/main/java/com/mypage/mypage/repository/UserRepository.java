package com.mypage.mypage.repository;

import com.mypage.mypage.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByUserEmail(String userEmail);
    Optional<UserEntity> findByGoogleId(String googleId); // 추가
}
