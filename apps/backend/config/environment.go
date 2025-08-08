package config

const (
	Development = "development"
	Production  = "production"
	Staging     = "staging"
	Testing     = "testing"
)

func mustEnvironment(env string) string {
	switch env {
	case Development, Production, Staging, Testing:
		return env
	case "":
		panic("Env variable ENVIRONMENT is not set")
	default:
		panic("Invalid env variable: " + env)
	}
}
