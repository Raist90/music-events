package handler

import (
	"encoding/json"
	"fmt"
	"md-api/api/content"
	"md-api/api/markdown"
	"net/http"
	"os/exec"
)

func Root(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
	fmt.Fprintln(w, "Listening on port 8080")

	file, err := content.Read("test.md")
	if err != nil {
		http.Error(w, fmt.Sprintf("Error opening file: %v", err), http.StatusInternalServerError)
		return
	}
	fmt.Println(string(file))
}

func uuid() string {
	out, err := exec.Command("uuidgen").Output()
	if err != nil {
		panic(fmt.Sprintf("Error generating UUID: %v", err))
	}
	return string(out)
}

func Post(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	name := r.PathValue("name")
	content, err := content.Read(name)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error reading file: %v", err), http.StatusNotFound)
		return
	}

	html, err := markdown.ToHTML(content)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error converting markdown to HTML: %v", err), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(map[string]any{
		"data": map[string]string{
			"html": html,
			"id":   uuid(),
		},
		"status": "success",
	}); err != nil {
		http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
		return
	}
}
