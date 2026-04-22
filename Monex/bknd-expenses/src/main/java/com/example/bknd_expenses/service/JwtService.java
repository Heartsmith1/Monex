package com.example.bknd_expenses.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public Long getUserIdFromAuthorizationHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Token invalido");
        }

        try {
            String token = authHeader.substring(7);
            Claims claims = extractClaims(token);
            Object userIdClaim = claims.get("userId");

            if (!(userIdClaim instanceof Number userId)) {
                throw new IllegalArgumentException("El token no contiene userId valido");
            }

            return userId.longValue();
        } catch (Exception ex) {
            throw new IllegalArgumentException("Token invalido");
        }
    }

    private Claims extractClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}