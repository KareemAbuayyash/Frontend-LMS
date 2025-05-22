package com.example.lms.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtUtil {

    private final Key key;
    private static final long ACCESS_EXP  = 10 * 60 * 1000L;
    private static final long REFRESH_EXP = 30L * 24 * 60 * 60 * 1000;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        byte[] bytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(bytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims,T> fn) {
        return fn.apply(Jwts.parserBuilder().setSigningKey(key).build()
                           .parseClaimsJws(token).getBody());
    }

    public String generateAccessToken(UserDetails ud) {
        Map<String,Object> claims = new HashMap<>();
        claims.put("roles", ud.getAuthorities().stream()
                               .map(a -> a.getAuthority())
                               .collect(Collectors.toList()));
        return Jwts.builder()
                   .setClaims(claims)
                   .setSubject(ud.getUsername())
                   .setIssuedAt(new Date())
                   .setExpiration(new Date(System.currentTimeMillis()+ACCESS_EXP))
                   .signWith(key, SignatureAlgorithm.HS256)
                   .compact();
    }

    public String generateRefreshToken(UserDetails ud) {
        return Jwts.builder()
                   .setSubject(ud.getUsername())
                   .setIssuedAt(new Date())
                   .setExpiration(new Date(System.currentTimeMillis()+REFRESH_EXP))
                   .signWith(key, SignatureAlgorithm.HS256)
                   .compact();
    }

    public boolean isTokenValid(String token, UserDetails ud) {
        return extractUsername(token).equals(ud.getUsername()) &&
               !extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
