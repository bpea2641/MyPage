package com.mypage.mypage.service;

import com.mypage.mypage.entity.PageVisitEntity;
import com.mypage.mypage.repository.PageVisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PageVisitService {
    private final PageVisitRepository pageVisitRepository;

    public void recordPageVisit() {
        LocalDate today = LocalDate.now();
        PageVisitEntity pageVisit = pageVisitRepository.findByVisitDate(today)
                .orElse(new PageVisitEntity());
        
        if (pageVisit.getVisitDate() == null) {
            pageVisit.setVisitDate(today);
        }
        
        pageVisit.increaseCount();
        pageVisitRepository.save(pageVisit);
    }

    public Map<String, Object> getVisitStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        // 오늘의 방문자 수
        int todayVisits = pageVisitRepository.findByVisitDate(LocalDate.now())
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