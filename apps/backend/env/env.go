package env

import "os"

func GetEnv(key string) string {
	val, ok := os.LookupEnv(key)

	if !ok {
		panic(key + " environment variable is not set")
	}

	if val == "" {
		panic(key + " environment variable is empty")
	}

	return val
}
