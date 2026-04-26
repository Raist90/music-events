package user

import (
	"net/http"

	httpx "md-api/internal/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetMe(dbpool *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		cookie, err := r.Cookie("refresh_token")
		if err != nil {
			http.Error(w, "no refresh token cookie", http.StatusUnauthorized)
			return
		}
		repo := NewRepository(dbpool)
		user, err := repo.GetUserByRefreshToken(r.Context(), cookie.Value)
		if err != nil {
			http.Error(w, "failed to get user profile", http.StatusNotFound)
			return
		}
		httpx.JsonWithData(w, map[string]any{
			"user": user,
		})
	}
}
