package markdown

import (
	"bytes"

	"github.com/yuin/goldmark"
)

func ToHTML(source []byte) (string, error) {
	var buf bytes.Buffer
	if err := goldmark.Convert(source, &buf); err != nil {
		return "", err
	}

	return buf.String(), nil
}
