package com.mypage.mypage.service;

import com.mypage.mypage.entity.PageVisitEntity;
import com.mypage.mypage.repository.PageVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PageVisitService {
    private final PageVisitRepository pageVisitRepository;

    @Transactional
    public void recordPageVisit() {
        LocalDate today = LocalDate.now();
        PageVisitEntity pageVisit = pageVisitRepository.findByVisitDate(today)
                .orElseGet(() -> {
                    PageVisitEntity newVisit = new PageVisitEntity();
                    newVisit.setVisitDate(today);
                    newVisit.setVisitCount(0);
                    return newVisit;
                });
        
        pageVisit.increaseCount();
        pageVisitRepository.save(pageVisit);
    }

    public Map<String, Object> getVisitStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        LocalDate today = LocalDate.now();
        
        // 오늘의 방문자 수
        int todayVisits = pageVisitRepository.findByVisitDate(today)
                .map(PageVisitEntity::getVisitCount)
                .orElse(0);
        
        // 총 방문자 수
        int totalVisits = pageVisitRepository.findAll().stream()
                .mapToInt(PageVisitEntity::getVisitCount)
                .sum();
        
        statistics.put("todayVisits", todayVisits);
        statistics.put("totalVisits", totalVisits);
        
        return statistics;
    }
}