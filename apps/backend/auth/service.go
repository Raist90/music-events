package auth

import (
	"context"
	"errors"
	"md-api/env"
	"md-api/user"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type LoginParams struct {
	Email, Username, Password string
}

func (s *authService) Login(ctx context.Context, params LoginParams) (string, error) {
	if err := params.validate(); err != nil {
		return "", err
	}

	var user *user.User
	if params.Email != "" {
		u, err := s.userRepository.GetUserByEmail(ctx, params.Email)
		if err != nil {
			return "", err
		}
		user = u
	} else {
		u, err := s.userRepository.GetUserByUsername(ctx, params.Username)
		if err != nil {
			return "", err
		}
		user = u
	}

	if !checkPasswordHash(params.Password, user.PasswordHash) {
		return "", errors.New("invalid credentials")
	}

	storedRefreshToken := s.sessionRepository.GetSession(ctx, user.ID.String())
	if storedRefreshToken != "" {
		return storedRefreshToken, nil
	}

	newRefreshToken, err := generateRefreshToken(user)
	if err != nil {
		return "", err
	}
	err = s.sessionRepository.CreateSession(ctx, user.ID.String(), newRefreshToken, time.Now().Add(7*24*time.Hour))
	if err != nil {
		return "", err
	}
	return newRefreshToken, nil
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (s *LoginParams) validate() error {
	if (s.Email == "" && s.Username == "") || s.Password == "" {
		return errors.New("email or username and password are required")
	}
	return nil
}

func (s *authService) isRefreshTokenActive(ctx context.Context, token string) bool {
	return s.sessionRepository.IsValidSession(ctx, token)
}

func (s *authService) Logout(ctx context.Context, refreshToken string) error {
	return s.sessionRepository.DeleteSession(ctx, refreshToken)
}

type RefreshParams struct {
	RefreshToken string `json:"refresh_token"`
}

func (s *authService) Refresh(ctx context.Context, params RefreshParams) (string, error) {
	if err := params.validate(); err != nil {
		return "", err
	}

	secretKey := env.JWTRefreshSecret.Get()
	token, err := jwt.Parse(params.RefreshToken, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(secretKey), nil
	})
	if err != nil || !token.Valid {
		return "", http.ErrNoCookie
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return "", http.ErrNoCookie
	}

	sub, ok := claims["sub"].(string)
	if !ok {
		return "", http.ErrNoCookie
	}
	userId, err := uuid.Parse(sub)
	if err != nil {
		return "", http.ErrNoCookie
	}
	var user *user.User
	user, err = s.userRepository.GetUserByID(ctx, userId)
	if err != nil {
		return "", err
	}
	accessToken, err := generateAccessToken(user)
	if err != nil {
		return "", err
	}
	return accessToken, nil
}

func (r RefreshParams) validate() error {
	if r.RefreshToken == "" {
		return http.ErrNoCookie
	}
	return nil
}

type RegisterParams struct {
	Email, Username, Password string
}

func (s *authService) Register(ctx context.Context, params RegisterParams) (string, error) {
	userExists, err := s.userRepository.ExistsByEmail(ctx, params.Email)
	if err != nil {
		return "", err
	}
	if userExists {
		return "", errors.New("email already exists")
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(params.Password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	user, err := s.userRepository.CreateUser(ctx, params.Email, params.Username, string(passwordHash))
	if err != nil {
		return "", err
	}

	refreshToken, err := generateRefreshToken(user)
	if err != nil {
		return "", err
	}
	err = s.sessionRepository.CreateSession(ctx, user.ID.String(), refreshToken, time.Now().Add(7*24*time.Hour))
	if err != nil {
		return "", err
	}

	return refreshToken, nil
}
