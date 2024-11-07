package com.mypage.mypage.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
public class PageVisitEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "integer default 0")
    private Integer visitCount = 0;

    @Column
    private LocalDate visitDate;

    public void increaseCount() {
        this.visitCount++;
    }
}