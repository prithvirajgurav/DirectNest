package com.directnest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class DirectNestApplication {
    public static void main(String[] args) {
        SpringApplication.run(DirectNestApplication.class, args);
    }
}
