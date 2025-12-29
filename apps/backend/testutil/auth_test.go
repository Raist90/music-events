package testutil

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGenerateTestToken(t *testing.T) {
	secret := []byte("test-secret")
	expiry := 24 * time.Hour

	token, err := GenerateTestToken(secret, expiry)
	require.NoError(t, err)
	assert.NotEmpty(t, token)

	// Parse and verify token
	parsedToken, err := ParseToken(token, secret)
	require.NoError(t, err)
	assert.True(t, parsedToken.Valid)

	// Verify claims
	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	require.True(t, ok)
	assert.Equal(t, TestAudience, claims["aud"])
	assert.Equal(t, "test-user", claims["sub"])
}

func TestGenerateExpiredToken(t *testing.T) {
	secret := []byte("test-secret")

	token, err := GenerateExpiredToken(secret)
	require.NoError(t, err)
	assert.NotEmpty(t, token)

	// Parse token - should fail validation due to expiry
	parsedToken, err := ParseToken(token, secret)
	assert.Error(t, err)
	assert.False(t, parsedToken.Valid)
}

func TestGenerateInvalidAudienceToken(t *testing.T) {
	secret := []byte("test-secret")

	token, err := GenerateInvalidAudienceToken(secret)
	require.NoError(t, err)
	assert.NotEmpty(t, token)

	// Parse and verify token has wrong audience
	parsedToken, err := ParseToken(token, secret)
	require.NoError(t, err)

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	require.True(t, ok)
	assert.Equal(t, "wrong-audience", claims["aud"])
	assert.NotEqual(t, TestAudience, claims["aud"])
}

func TestGenerateTokenWithClaims(t *testing.T) {
	secret := []byte("test-secret")
	customClaims := jwt.MapClaims{
		"aud":  "custom-audience",
		"sub":  "custom-user",
		"role": "admin",
		"exp":  time.Now().Add(1 * time.Hour).Unix(),
	}

	token, err := GenerateTokenWithClaims(secret, customClaims)
	require.NoError(t, err)
	assert.NotEmpty(t, token)

	// Parse and verify custom claims
	parsedToken, err := ParseToken(token, secret)
	require.NoError(t, err)

	claims, ok := parsedToken.Claims.(jwt.MapClaims)
	require.True(t, ok)
	assert.Equal(t, "custom-audience", claims["aud"])
	assert.Equal(t, "custom-user", claims["sub"])
	assert.Equal(t, "admin", claims["role"])
}

func TestParseToken_InvalidSecret(t *testing.T) {
	secret := []byte("correct-secret")
	wrongSecret := []byte("wrong-secret")

	token, err := GenerateTestToken(secret, 24*time.Hour)
	require.NoError(t, err)

	// Try parsing with wrong secret - should fail
	parsedToken, err := ParseToken(token, wrongSecret)
	assert.Error(t, err)
	if parsedToken != nil {
		assert.False(t, parsedToken.Valid)
	}
}

func TestParseToken_MalformedToken(t *testing.T) {
	secret := []byte("test-secret")
	malformedToken := "not.a.valid.jwt.token"

	parsedToken, err := ParseToken(malformedToken, secret)
	assert.Error(t, err)
	assert.Nil(t, parsedToken)
}
