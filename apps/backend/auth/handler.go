package auth

import (
	"encoding/json"
	httpx "md-api/internal/http"
	"md-api/session"
	"md-api/user"
	"net/http"

	"github.com/go-playground/validator/v10"
	"github.com/jackc/pgx/v5/pgxpool"
)

type loginRequest struct {
	Email    string `json:"email,omitempty" validate:"required_without=Username,email"`
	Password string `json:"password" validate:"required,min=8,containsany=!@#?*"`
	Username string `json:"username,omitempty" validate:"required_without=Email,omitempty,min=3"`
}

func Login(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost && r.Method != http.MethodOptions {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req loginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}

		if err := req.validate(); err != nil {
			httpx.WriteValidationError(w, err)
			return
		}

		authSvc := NewService(session.NewRepository(dbpool), user.NewRepository(dbpool))
		refreshToken, err := authSvc.Login(r.Context(), req.toLoginParams())
		if err != nil {
			http.Error(w, "invalid credentials", http.StatusUnauthorized)
			return
		}
		httpx.SetAuthCookie(w, refreshToken)
		httpx.Json(w)
	}
}

func (r *loginRequest) toLoginParams() LoginParams {
	return LoginParams{
		Email:    r.Email,
		Username: r.Username,
		Password: r.Password,
	}
}

func (r *loginRequest) validate() error {
	validate := validator.New(validator.WithRequiredStructEnabled())
	return validate.Struct(r)
}

func Logout(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodDelete {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		refreshCookie, err := r.Cookie("refresh_token")
		if err != nil {
			http.Error(w, "no refresh token cookie", http.StatusBadRequest)
			return
		}

		authSvc := NewService(session.NewRepository(dbpool), nil)
		err = authSvc.Logout(r.Context(), refreshCookie.Value)
		if err != nil {
			http.Error(w, "failed to logout", http.StatusInternalServerError)
			return
		}
		httpx.SetAuthCookie(w, "") // Clear the cookie
		httpx.Json(w)
	}
}

func Refresh(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		cookie, err := r.Cookie("refresh_token")
		if err != nil {
			http.Error(w, "no refresh token cookie", http.StatusUnauthorized)
			return
		}

		authSvc := NewService(session.NewRepository(dbpool), user.NewRepository(dbpool))
		req := RefreshParams{RefreshToken: cookie.Value}
		accessToken, err := authSvc.Refresh(r.Context(), req)
		if err != nil {
			http.Error(w, "invalid refresh token", http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"status":       "success",
			"access_token": accessToken,
		})
	}
}

type registerRequest struct {
	Email    string `json:"email" validate:"required,email"`
	Username string `json:"username" validate:"required,min=3"`
	Password string `json:"password" validate:"required,min=8,containsany=!@#?*"`
}

func Register(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var req registerRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "invalid request body", http.StatusBadRequest)
			return
		}

		if err := req.validate(); err != nil {
			httpx.WriteValidationError(w, err)
			return
		}

		authSvc := NewService(session.NewRepository(dbpool), user.NewRepository(dbpool))
		refreshToken, err := authSvc.Register(r.Context(), req.toRegisterParams())
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		httpx.SetAuthCookie(w, refreshToken)
		httpx.Json(w) // TODO: remember to remove access token from openapi.yaml
	}
}

func (r *registerRequest) validate() error {
	validate := validator.New(validator.WithRequiredStructEnabled())
	return validate.Struct(r)
}

func (r *registerRequest) toRegisterParams() RegisterParams {
	return RegisterParams{
		Email:    r.Email,
		Username: r.Username,
		Password: r.Password,
	}
}
