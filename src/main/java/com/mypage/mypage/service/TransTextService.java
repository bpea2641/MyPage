package com.mypage.mypage.service;

import com.mypage.mypage.entity.TransTextEntity;
import com.mypage.mypage.repository.TransTextRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TransTextService {
    @Autowired
    private TransTextRepository transTextRepository;

    public TransTextEntity saveTransTextEntity(String transText, String summeryText) {
        TransTextEntity transTextEntity = new TransTextEntity();
        transTextEntity.setTransText(transText);
        transTextEntity.setSummeryText(summeryText);

        return transTextRepository.save(transTextEntity);
    }

    public List<TransTextEntity> getAllTransText() {
        return transTextRepository.findAll();
    }
}
