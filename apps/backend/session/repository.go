package session

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreateSession(ctx context.Context, userId string, token string, expiresAt time.Time) error {
	_, err := r.db.Exec(ctx, "INSERT INTO sessions (user_id, token, expires_at) VALUES ($1, $2, $3)", userId, token, expiresAt)
	if err != nil {
		return err
	}
	return nil
}

// GetSession retrieves the most recent valid session token for a user. It returns an empty string if no valid session is found or if there's an error.
func (r *Repository) GetSession(ctx context.Context, userId string) string {
	var token string
	err := r.db.QueryRow(ctx, "SELECT token FROM sessions WHERE user_id = $1 AND expires_at > NOW() ORDER BY expires_at DESC LIMIT 1", userId).Scan(&token)
	if err != nil {
		return ""
	}
	return token
}

func (r *Repository) DeleteSession(ctx context.Context, token string) error {
	_, err := r.db.Exec(ctx, "DELETE FROM sessions WHERE token = $1", token)
	if err != nil {
		return err
	}
	return nil
}

func (r *Repository) IsValidSession(ctx context.Context, token string) bool {
	var exists bool
	err := r.db.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM sessions WHERE token = $1 AND expires_at > NOW())", token).Scan(&exists)
	if err != nil {
		return false
	}
	return exists
}
