package com.chezsan.backend_event_hub.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class HelloController {

    @GetMapping("/api/events")
    public String helloController(){
        return "Hellow";
    }

}
