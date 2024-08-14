package handlers

import (
	"fmt"
	"forum/pkg/db"
	"forum/pkg/helpers"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func SignInHandler(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")
	var hashedPassword, email, imgUrl, createdAtStr string
	var userID int

	err := db.DataBase.QueryRow("SELECT id, email, password, img_url, created_at FROM users WHERE username = ?", username).Scan(&userID, &email, &hashedPassword, &imgUrl, &createdAtStr)
	if err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	if err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)); err != nil {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	fmt.Println("login succesful")

	sessionToken, expiresAt, err := helpers.CreateSession(userID)
	if err != nil {
		http.Error(w, "Failed to create session", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    sessionToken,
		Expires:  expiresAt,
		HttpOnly: true,
	})

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
