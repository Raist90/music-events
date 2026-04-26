package auth

import (
	"md-api/env"
	"md-api/session"
	"md-api/user"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type authService struct {
	sessionRepository *session.Repository
	userRepository    *user.Repository
}

func NewService(s *session.Repository, u *user.Repository) *authService {
	return &authService{sessionRepository: s, userRepository: u}
}

func generateAccessToken(user *user.User) (string, error) {
	claims := jwt.MapClaims{
		"sub":  user.ID,
		"exp":  time.Now().Add(15 * time.Minute).Unix(),
		"type": "access",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	accessSecret := []byte(env.JWTSecret.Get())
	accessToken, err := token.SignedString(accessSecret)
	if err != nil {
		return "", err
	}
	return accessToken, nil
}

func generateRefreshToken(user *user.User) (string, error) {
	claims := jwt.MapClaims{
		"sub":  user.ID,
		"exp":  time.Now().Add(7 * 24 * time.Hour).Unix(), // 7 days
		"type": "refresh",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	var refreshSecret = env.JWTRefreshSecret.Get()
	refreshToken, err := token.SignedString([]byte(refreshSecret))
	if err != nil {
		return "", err
	}

	return refreshToken, nil
}
