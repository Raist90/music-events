package testutil

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

const (
	// TestJWTSecret is a test-only JWT secret key
	TestJWTSecret = "test-jwt-secret-key-do-not-use-in-production"

	// TestAudience is the expected audience for JWT tokens
	TestAudience = "its-my-live-audience"
)

// GenerateTestToken creates a valid JWT token for testing.
// Parameters:
//   - secret: JWT secret key
//   - expiry: token expiration duration (e.g., 24*time.Hour)
//
// Returns:
//   - Signed token string
//   - Error if signing fails
func GenerateTestToken(secret []byte, expiry time.Duration) (string, error) {
	return generateToken(secret, expiry, TestAudience)
}

// GenerateExpiredToken creates an expired JWT token for testing auth failures.
// The token expired 1 hour ago.
func GenerateExpiredToken(secret []byte) (string, error) {
	return generateToken(secret, -1*time.Hour, TestAudience)
}

// GenerateInvalidAudienceToken creates a token with wrong audience
// for testing audience validation.
func GenerateInvalidAudienceToken(secret []byte) (string, error) {
	return generateToken(secret, 24*time.Hour, "wrong-audience")
}

// GenerateTokenWithClaims creates a token with custom claims for testing.
func GenerateTokenWithClaims(secret []byte, claims jwt.MapClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}

// generateToken is the internal helper that creates tokens with specified parameters.
func generateToken(secret []byte, expiry time.Duration, audience string) (string, error) {
	now := time.Now()
	claims := jwt.MapClaims{
		"aud": audience,
		"sub": "test-user",
		"iat": now.Unix(),
		"exp": now.Add(expiry).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}

// ParseToken parses and validates a JWT token for testing.
// Useful for verifying token contents in tests.
func ParseToken(tokenString string, secret []byte) (*jwt.Token, error) {
	return jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return secret, nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))
}
