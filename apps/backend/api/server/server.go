package server

import (
	"log"
	"md-api/api/handler"
	"md-api/api/middleware"
	"md-api/config"
	"net/http"
	"time"
)

const MB = 1 << 20

var port = config.Config.Port

func Listen() {
	s := create()
	log.Fatal(s.ListenAndServe())
}

func create() *http.Server {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /", middleware.Logger(handler.Root))
	mux.HandleFunc("GET /events", middleware.Chain(middleware.Logger, middleware.Cors)(handler.GetEvents))

	return &http.Server{
		Addr:           port,
		Handler:        mux,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 2 * MB,
	}
}
