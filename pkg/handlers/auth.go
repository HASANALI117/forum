package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	database "forum/pkg/db"
	helpers "forum/pkg/helpers"
	models "forum/pkg/models"
)

// Middleware to ensure user is authenticated
func AuthRequired(next http.HandlerFunc, db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, err := helpers.GetCurrentUser(db, r)
		if err != nil {
			helpers.Error(w, "Unauthorized", http.StatusUnauthorized, err)
			return
		}
		next.ServeHTTP(w, r)
	}
}

// Registration Handler
func RegisterHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			helpers.Error(w, "invalid method", http.StatusMethodNotAllowed, fmt.Errorf("invalid method: %s", r.Method))
			return
		}
		var user models.User
		err := json.NewDecoder(r.Body).Decode(&user)
		if err != nil {
			helpers.Error(w, "Invalid input", http.StatusBadRequest, err)
			return
		}

		err = helpers.RegisterUser(db.DB.DBConn, user)
		if err != nil {
			helpers.Error(w, "Could not register user", http.StatusBadRequest, err)
			fmt.Println(err)
			return
		}

		// Automatically log in the user after registration
		sessionToken, err := helpers.CreateSession(db.DB.DBConn, user.ID)
		if err != nil {
			helpers.Error(w, "Error creating session", http.StatusInternalServerError, err)
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

		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "User registered and logged in successfully",
			"user":    user,
		})
	}
}

// Login Handler
func LoginHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			helpers.Error(w, "Invalid Method", http.StatusMethodNotAllowed, fmt.Errorf("invalid method: %s", r.Method))
			return
		}

		var creds struct {
			Identifier string `json:"identifier"`
			Password   string `json:"password"`
		}
		err := json.NewDecoder(r.Body).Decode(&creds)
		if err != nil {
			helpers.Error(w, "Invalid input", http.StatusBadRequest, err)
			return
		}

		u, err := helpers.AuthenticateUser(db.DB.DBConn, creds.Identifier, creds.Password)
		if err != nil {
			helpers.Error(w, "Invalid credentials", http.StatusUnauthorized, err)
			return
		}

		sessionToken, err := helpers.CreateSession(db.DB.DBConn, u.ID)
		if err != nil {
			helpers.Error(w, "Error creating session", http.StatusInternalServerError, err)
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

		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "User logged in successfully",
			"user":    u,
		})
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

func CurrentUserHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		user, err := helpers.GetCurrentUser(db, r)
		if err != nil {
			helpers.Error(w, "Unauthorized", http.StatusUnauthorized, err)
			return
		}
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"user": user,
		})
	}
}
