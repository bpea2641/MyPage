package com.mypage.mypage.service;


import com.mypage.mypage.dto.UserBoardDto;
import com.mypage.mypage.entity.UserBoardEntity;
import com.mypage.mypage.repository.UserBoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserBoardService {

    private final UserBoardRepository userBoardRepository;

    public UserBoardEntity saveBoard(UserBoardDto userBoardDto) {
        UserBoardEntity userBoardEntity = UserBoardEntity.toUserBoardEntity(userBoardDto);
        return userBoardRepository.save(userBoardEntity);
    }

    public List<UserBoardEntity> getAllBoard() {
        return userBoardRepository.findAll();
    }
}
