package com.example.bknd_expenses.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    public Long getUserIdFromAuthorizationHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Header Authorization invalido");
        }

        try {
            String token = authHeader.substring(7);
            Claims claims = extractClaims(token);

            Object userIdClaim = claims.get("userId");

            if (!(userIdClaim instanceof Number userId)) {
                throw new IllegalArgumentException("El token no contiene userId valido");
            }

            return userId.longValue();

        } catch (IllegalArgumentException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new IllegalArgumentException("Token invalido");
        }
    }

    private Claims extractClaims(String token) {
        if (jwtSecret == null || jwtSecret.length() < 32) {
            throw new IllegalStateException("El jwt.secret debe tener al menos 32 caracteres");
        }

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}