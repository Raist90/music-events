package config

import (
	"os"

	"github.com/joho/godotenv"
)

type config struct {
	Api         Api
	ContentDir  string
	Environment Environment
	Port        string
}

var Config *config = Initialize()

func Initialize() *config {
	// TODO: Handle this in a different way
	err := godotenv.Load("../../.env")
	if err != nil {
		panic("Error loading .env file")
	}

	return &config{
		Api:         *newApi(),
		ContentDir:  "content/",
		Environment: environment(os.Getenv("ENVIRONMENT")),
		Port:        os.Getenv("PORT"),
	}
}

type Environment string

const (
	Development Environment = "development"
	Production  Environment = "production"
	Staging     Environment = "staging"
	Testing     Environment = "testing"
)

func environment(env string) Environment {
	switch env {
	case "development", "production", "staging", "testing":
		return Environment(env)
	case "":
		panic("Environment variable ENVIRONMENT is not set")
	default:
		panic("Invalid environment: " + env)
	}
}
