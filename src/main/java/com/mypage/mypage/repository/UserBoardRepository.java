package com.mypage.mypage.repository;

import com.mypage.mypage.entity.UserBoardEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBoardRepository extends JpaRepository<UserBoardEntity, Integer> {
    @EntityGraph(attributePaths = {"children", "tags"})
    List<UserBoardEntity> findAll();
    // @EntityGraph를 사용하면 특정 쿼리에서 어떤 연관된 엔티티를 즉시 로딩할지를 명시할 수 있다.
    // 해당 명령어에선 children과 tags가 함께 로딩되도록 JPA에게 지시했다.
    // 연관된 엔티티를 미리 로딩함으로써, 나중에 해당 엔티티에 접근할 때 추가적인 쿼리를 실행하지 않아도 된다.
    // 이로써 N + 1 문제를 방지하고 성능을 향상시킬 수 있다.
}
