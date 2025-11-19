package main

import (
	"log"
	"md-api/api/server"

	"github.com/joho/godotenv"
)

func mustLoadEnvs() error {
	return godotenv.Load(".env")
}

func main() {
	err := mustLoadEnvs()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	server.Listen()
}
