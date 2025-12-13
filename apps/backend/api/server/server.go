package server

import (
	"log"
	"md-api/api/handler"
	"md-api/api/middleware"
	"md-api/env"
	"net/http"
	"time"
)

const MB = 1 << 20

func Listen() {
	s := create()
	log.Fatal(s.ListenAndServe())
}

func create() *http.Server {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /", middleware.Chain(
		middleware.JWTAuth,
		middleware.Logger,
		middleware.Cors,
	)(handler.Root))

	mux.HandleFunc("GET /events", middleware.Chain(
		middleware.JWTAuth,
		middleware.Logger,
		middleware.Cors,
	)(handler.GetEvents))

	return &http.Server{
		Addr:           env.Port.Get(),
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 2 * MB,
	}
}
