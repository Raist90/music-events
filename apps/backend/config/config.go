package config

import (
	"md-api/env"

	"github.com/joho/godotenv"
)

type config struct {
	Api         Api
	Environment string
	Port        string
}

var Config *config = MustLoad()

func MustLoad() *config {
	// TODO: Handle this in a different way
	err := godotenv.Load(".env")
	if err != nil {
		panic("Error loading .env file")
	}

	return &config{
		Api:         *newApi(),
		Environment: mustEnvironment(env.MustGetenv("ENVIRONMENT")),
		Port:        env.MustGetenv("PORT"),
	}
}
