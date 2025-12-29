package main

import (
	"log"
	"md-api/api/server"
	"os"

	"github.com/joho/godotenv"
)

func mustLoadEnvs() error {
	if _, err := os.Stat(".env"); err == nil {
		return godotenv.Load(".env")
	}
	return nil
}

func main() {
	err := mustLoadEnvs()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	server.Listen()
}
