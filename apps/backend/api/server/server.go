package server

import (
	"log"
	"md-api/api/handler"
	"md-api/api/middleware"
	"md-api/auth"
	"md-api/env"
	"md-api/user"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

const MB = 1 << 20

var (
	chain     = middleware.Chain(middleware.Cors, middleware.RateLimit, middleware.Logger)
	authChain = middleware.Chain(middleware.JWTAuth, middleware.Cors, middleware.RateLimit, middleware.Logger)
)

func Listen(dbpool *pgxpool.Pool) {
	s := create(dbpool)
	log.Fatal(s.ListenAndServe())
}

func create(dbpool *pgxpool.Pool) *http.Server {
	mux := http.NewServeMux()
	middleware.StartRateLimiterCleanup()
	registerRoutes(mux, dbpool)
	return &http.Server{
		Addr:           env.Port.Get(),
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 2 * MB,
	}
}

func registerRoutes(mux *http.ServeMux, dbpool *pgxpool.Pool) {
	mux.HandleFunc("OPTIONS /", chain(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNoContent)
	}))
	mux.HandleFunc("GET /", chain(handler.Root))
	mux.HandleFunc("GET /events", chain(handler.GetEvents))
	mux.HandleFunc("POST /auth/login", chain(auth.Login(dbpool)))
	mux.HandleFunc("DELETE /auth/logout", chain(auth.Logout(dbpool)))
	mux.HandleFunc("POST /auth/register", chain(auth.Register(dbpool)))
	mux.HandleFunc("POST /auth/refresh", chain(auth.Refresh(dbpool)))
	mux.HandleFunc("GET /user/me", authChain(user.GetMe(dbpool)))
}
