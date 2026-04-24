package http

import (
	"encoding/json"
	"net/http"

	"github.com/go-playground/validator/v10"
)

// WriteValidationError converts validation errors into a structured JSON response
// and sends it back to the client with a 400 Bad Request status code.
func WriteValidationError(w http.ResponseWriter, err error) {
	validationErrors := err.(validator.ValidationErrors)
	errorMessages := make(map[string]string)
	for _, fieldErr := range validationErrors {
		errorMessages[fieldErr.Field()] = fieldErr.Error()
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(map[string]any{
		"status": "error",
		"errors": errorMessages,
	})
}
