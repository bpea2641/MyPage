package com.mypage.mypage.controller;

import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    @GetMapping("/")
    public ResponseEntity<String> AdminMain() {
        return ResponseEntity.ok().body("admin/Aindex");
    }
}
