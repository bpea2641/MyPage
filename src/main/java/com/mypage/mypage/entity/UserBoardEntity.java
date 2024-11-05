package com.mypage.mypage.entity;

import com.mypage.mypage.dto.UserBoardDto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class UserBoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idx;

    @Column
    private String boardName;

    @Column
    private String boardText;

//    @Column
//    private MultipartFile boardFile;

    public static UserBoardEntity toUserBoardEntity(UserBoardDto userBoardDto) {
        UserBoardEntity userBoardEntity = new UserBoardEntity();
        userBoardEntity.setBoardName(userBoardDto.getBoardName());
        userBoardEntity.setBoardText(userBoardDto.getBoardText());
        return userBoardEntity;
    }
}
