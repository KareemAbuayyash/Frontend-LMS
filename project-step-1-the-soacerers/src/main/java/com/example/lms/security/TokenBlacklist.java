package com.example.lms.security;

import org.springframework.stereotype.Component;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklist {
    private final ConcurrentHashMap<String,Boolean> black = new ConcurrentHashMap<>();
    public void addToken(String token) { black.put(token,true); }
    public boolean isTokenBlacklisted(String token) { return black.containsKey(token); }
}
