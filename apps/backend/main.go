package main

import (
	"md-api/api/server"
	"md-api/config"
)

func main() {
	config.Initialize()

	server.Listen()
}
