package main

import (
	"fmt"
	"log"
	"time"

	"github.com/joho/godotenv"
	"md-api/env"
	"md-api/testutil"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	// Get JWT secret from environment
	secret := []byte(env.JWTSecret.Get())

	// Generate token using shared testutil function
	tokenString, err := testutil.GenerateTestToken(secret, 24*time.Hour)
	if err != nil {
		log.Fatalf("Failed to sign token: %v", err)
	}

	// Print token
	fmt.Println("Generated JWT Token:")
	fmt.Println(tokenString)
	fmt.Println("\nTest with curl:")
	fmt.Printf("curl -H \"Authorization: Bearer %s\" http://localhost:8080/\n", tokenString)
	fmt.Printf("curl -H \"Authorization: Bearer %s\" http://localhost:8080/events\n", tokenString)
}
