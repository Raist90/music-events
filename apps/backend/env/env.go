package env

import (
	"os"
)

type envVar string

func (key envVar) Get() string {
	val, ok := os.LookupEnv(string(key))
	if !ok {
		panic(string(key) + " env variable is not set")
	}

	if val == "" {
		panic(string(key) + " env variable is empty")
	}

	return os.Getenv(string(key))
}

const (
	Environment envVar = "ENVIRONMENT"
	Port        envVar = "PORT"

	JWTSecret envVar = "JWT_SECRET"

	TicketMasterApiUrl    envVar = "TICKETMASTER_API_URL"
	TicketMasterApiKey    envVar = "TICKETMASTER_API_KEY"
	TicketMasterApiSecret envVar = "TICKETMASTER_API_SECRET"
)
