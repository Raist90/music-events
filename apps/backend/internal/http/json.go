package http

import (
	"encoding/json"
	"net/http"
)

func Json(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{
		"status": "success",
	})
}

// JsonWithData sends a JSON response with a "status": "success" field and any additional data provided in the input map.
func JsonWithData(w http.ResponseWriter, data map[string]any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	resp := map[string]any{
		"status": "success",
	}
	for k, v := range data {
		resp[k] = v
	}
	json.NewEncoder(w).Encode(resp)
}
