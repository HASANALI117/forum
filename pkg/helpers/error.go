package helpers

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// ErrorResponse represents the structure of the error response
type ErrorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// RespondWithError sends a JSON response with the given error code and message
func Error(w http.ResponseWriter, message string, code int, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	fmt.Println(err)
	json.NewEncoder(w).Encode(ErrorResponse{Code: code, Message: message})
}
