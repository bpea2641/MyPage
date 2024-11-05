package com.mypage.mypage.dto;

import com.mypage.mypage.entity.UserEntity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.sql.Timestamp;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idx;

    @Column
    private String userEmail;

    @Column
    private String userNickname;

    @Column
    private String userBirth;

    @Column
    private String userPassword;

    @Column
    private String userPhone;

    @Column
    private char userGender;

    @Column
    private Integer userAble;

    @Column
    private UUID userUuid;

    @Column
    private Timestamp createdTime;


    public static UserDto toUserDto(UserEntity userEntity) {
        UserDto userDto = new UserDto();
        userDto.setIdx(userEntity.getIdx());
        userDto.setUserNickname(userEntity.getUserNickname());
        userDto.setUserEmail(userEntity.getUserEmail());
        userDto.setUserPassword(userEntity.getUserPassword());
        userDto.setUserBirth(userEntity.getUserBirth());
        userDto.setUserPhone(userEntity.getUserPhone());
        userDto.setUserGender(userEntity.getUserGender());
        userDto.setUserAble(userEntity.getUserAble());
        userDto.setUserUuid(userEntity.getUserUuid());
        userDto.setCreatedTime(userEntity.getCreatedTime());
        return userDto;
    }
}
