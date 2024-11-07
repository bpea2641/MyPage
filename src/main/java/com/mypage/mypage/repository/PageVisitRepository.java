package com.mypage.mypage.repository;

import com.mypage.mypage.entity.PageVisitEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface PageVisitRepository extends JpaRepository<PageVisitEntity, Long> {
    Optional<PageVisitEntity> findByVisitDate(LocalDate date);
}