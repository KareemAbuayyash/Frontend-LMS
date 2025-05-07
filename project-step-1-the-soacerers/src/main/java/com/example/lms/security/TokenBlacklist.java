package com.example.lms.security;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklist {

    private final ConcurrentHashMap<String, Boolean> blacklist = new ConcurrentHashMap<>();

    public void addToken(String token) {
        blacklist.put(token, true);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklist.containsKey(token);
    }
}
