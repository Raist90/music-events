package content

import (
	"md-api/config"
	"os"
)

var dir = config.Config.ContentDir

func Read(name string) ([]byte, error) {
	return os.ReadFile(dir + name)
}
