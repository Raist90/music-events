package user

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID           uuid.UUID `json:"id"`
	Email        string    `json:"email"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
}

type Repository struct {
	db *pgxpool.Pool
}

func NewRepository(db *pgxpool.Pool) *Repository {
	return &Repository{db: db}
}

// TODO: remove User from every func name

func (r *Repository) CreateUser(ctx context.Context, email, username, passwordHash string) (*User, error) {
	var user User
	err := r.db.QueryRow(ctx,
		"INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING id, email, username, password_hash",
		email, username, passwordHash,
	).Scan(&user.ID, &user.Email, &user.Username, &user.PasswordHash)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) GetUserByID(ctx context.Context, id uuid.UUID) (*User, error) {
	var user User
	err := r.db.QueryRow(ctx, "SELECT id, email, username, password_hash FROM users WHERE id=$1", id).Scan(&user.ID, &user.Email, &user.Username, &user.PasswordHash)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) GetUserByEmail(ctx context.Context, email string) (*User, error) {
	var user User
	err := r.db.QueryRow(ctx, "SELECT id, email, username, password_hash FROM users WHERE email=$1", email).Scan(&user.ID, &user.Email, &user.Username, &user.PasswordHash)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) GetUserByUsername(ctx context.Context, username string) (*User, error) {
	var user User
	err := r.db.QueryRow(ctx, "SELECT id, email, username, password_hash FROM users WHERE username=$1", username).Scan(&user.ID, &user.Email, &user.Username, &user.PasswordHash)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *Repository) ExistsByEmail(ctx context.Context, email string) (bool, error) {
	var exists bool
	err := r.db.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM users WHERE email=$1)", email).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func (r *Repository) GetUserByRefreshToken(ctx context.Context, refreshToken string) (*User, error) {
	var user User
	err := r.db.QueryRow(ctx, `SELECT u.id, u.email, u.username, u.password_hash FROM users u JOIN sessions s ON u.id = s.user_id WHERE s.token = $1`, refreshToken).Scan(&user.ID, &user.Email, &user.Username, &user.PasswordHash)
	if err != nil {
		return nil, err
	}
	return &user, nil
}
