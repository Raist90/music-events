package main

import (
	"context"
	"fmt"
	"log"
	"md-api/api/server"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func mustLoadEnvs() error {
	if _, err := os.Stat(".env.development.local"); err == nil {
		return godotenv.Load(".env.development.local")
	}
	return nil
}

func main() {
	err := mustLoadEnvs()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbpool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to create connection pool: %v\n", err)
		os.Exit(1)
	}
	defer dbpool.Close()

	server.Listen(dbpool)
}
