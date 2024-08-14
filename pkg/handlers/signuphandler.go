package handlers

import (
	"fmt"
	"forum/pkg/db"
	"forum/pkg/helpers"
	"log"
	"math/rand"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		email := r.FormValue("email")
		username := r.FormValue("username")
		password := r.FormValue("password")

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			log.Fatal(err)
		}

		// Generate a unique random image URL
		imgUrl := fmt.Sprintf("https://picsum.photos/seed/%d/100", rand.New(rand.NewSource(time.Now().UnixNano())).Intn(1000))

		result, err := db.DataBase.Exec("INSERT INTO users (username, email, password, img_url) VALUES (?, ?, ?, ?)", username, email, string(hashedPassword), imgUrl)
		if err != nil {
			log.Fatal(err)
			return
		}

		userID, err := result.LastInsertId()
		if err != nil {
			log.Fatal(err)
			return
		}

		fmt.Println(userID)

		sessionToken, expiresAt, err := helpers.CreateSession(int(userID))
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

	} else {
		Templates.ExecuteTemplate(w, "signup.html", nil)
	}
}
