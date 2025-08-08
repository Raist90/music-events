package env

import "os"

func MustGetenv(key string) string {
	val, ok := os.LookupEnv(key)

	if !ok {
		panic(key + " env variable is not set")
	}

	if val == "" {
		panic(key + " env variable is empty")
	}

	return val
}
