package com.swp.evmsystem.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Slf4j
@Service
public class JwtService {

    private final RedisTemplate<String, String> redisTemplate;
    private static final String BLACKLIST_PREFIX = "blacklist:token:";

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public JwtService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Extract username (email) from JWT token
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract expiration date from JWT token
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract a specific claim from JWT token
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Generate token with only UserDetails
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    /**
     * Generate token with extra claims and UserDetails
     */
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, jwtExpiration);
    }

    /**
     * Generate refresh token
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, jwtExpiration * 7); // 7 times longer
    }

    /**
     * Build JWT token with claims, user details, and expiration
     */
    private String buildToken(
            Map<String, Object> extraClaims,
            UserDetails userDetails,
            long expiration
    ) {
        String token = Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
        log.debug("Built JWT token for user {}: {}", userDetails.getUsername(), token);
        return token;
    }

    /**
     * Validate if token is valid for the user
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        boolean isValid = (username.equals(userDetails.getUsername()))
                && !isTokenExpired(token)
                && !isTokenBlacklisted(token);
        log.debug("JWT token validation for user {}: {}", userDetails.getUsername(), isValid);
        return isValid;
    }

    /**
     * Check if token is expired
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extract all claims from JWT token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Get signing key from secret
     */
    private Key getSignInKey() {
        // Decode Base64-encoded secret key
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Get token expiration time in milliseconds
     */
    public long getExpirationTime() {
        return jwtExpiration;
    }

    /**
     * Check if token can be refreshed (not expired beyond refresh window)
     */
    public boolean canTokenBeRefreshed(String token) {
        try {
            final Date expiration = extractExpiration(token);
            return expiration.after(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extract custom claim from token
     */
    public Object extractClaim(String token, String claimName) {
        final Claims claims = extractAllClaims(token);
        return claims.get(claimName);
    }

    /**
     * Generate token with custom claims for specific user
     */
    public String generateTokenWithClaims(
            UserDetails userDetails,
            String claimKey,
            Object claimValue
    ) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(claimKey, claimValue);
        return generateToken(claims, userDetails);
    }

    /**
     * Validate token without UserDetails (basic validation)
     */
    public boolean isTokenValidBasic(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get remaining time until token expiration in milliseconds
     */
    public long getRemainingExpirationTime(String token) {
        Date expiration = extractExpiration(token);
        return expiration.getTime() - System.currentTimeMillis();
    }

    /**
     * Blacklist a token (for logout)
     */
    public void blacklistToken(String token) {
        long remainingTime = getRemainingExpirationTime(token);
        if (remainingTime > 0) {
            String key = BLACKLIST_PREFIX + token;
            long ttlSeconds = remainingTime / 1000;
            redisTemplate.opsForValue().set(key, "blacklisted", ttlSeconds, TimeUnit.SECONDS);
            log.info("Token blacklisted successfully with TTL: {} seconds", ttlSeconds);
        }
    }

    /**
     * Check if token is blacklisted
     */
    private boolean isTokenBlacklisted(String token) {
        String key = BLACKLIST_PREFIX + token;
        Boolean exists = redisTemplate.hasKey(key);
        return exists != null && exists;
    }
}