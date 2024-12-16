
package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	helpers "forum/pkg/helpers"
	models "forum/pkg/models"
	database "forum/pkg/db"
)

// Middleware to ensure user is authenticated
func AuthRequired(next http.HandlerFunc, db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err := GetCurrentUser(db, r)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	}
}

// Registration Handler
func RegisterHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid Method", http.StatusMethodNotAllowed)
			return
		}
		var u models.User
		err := json.NewDecoder(r.Body).Decode(&u)
		if (err != nil) {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		err = helpers.RegisterUser(db.DB.DBConn, u)
		if err != nil {
			http.Error(w, "Could not register user", http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusOK)
	}
}

// Login Handler
func LoginHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Invalid Method", http.StatusMethodNotAllowed)
			return
		}

		var creds struct {
			Identifier string `json:"identifier"`
			Password   string `json:"password"`
		}
		err := json.NewDecoder(r.Body).Decode(&creds)
		if err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		u, err := helpers.AuthenticateUser(db.DB.DBConn, creds.Identifier, creds.Password)
		if err != nil {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		sessionToken, err := helpers.CreateSession(db.DB.DBConn, u.ID)
		if err != nil {
			http.Error(w, "Error creating session", http.StatusInternalServerError)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "session_token",
			Value:    sessionToken,
			Path:     "/",
			HttpOnly: true,
			Expires:  time.Now().Add(24 * time.Hour),
		})
		w.WriteHeader(http.StatusOK)
	}
}

// Logout Handler
func LogoutHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_token")
		if err == nil {
			helpers.DeleteSession(db.DB.DBConn, cookie.Value)
			http.SetCookie(w, &http.Cookie{
				Name:     "session_token",
				Value:    "",
				Path:     "/",
				HttpOnly: true,
				Expires:  time.Unix(0, 0),
			})
		}
		w.WriteHeader(http.StatusOK)
	}
}