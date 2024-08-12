package handlers

import (
	"fmt"
	"forum/pkg/db"
	"log"
	"net/http"

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

		if db.DataBase == nil {
			log.Fatal("Database connection is nil")
		}

		_, err = db.DataBase.Exec("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", username, email, string(hashedPassword))
		if err != nil {
			http.Error(w, "User already exists", http.StatusConflict)
			return
		}

		http.Redirect(w, r, "/", http.StatusSeeOther)

		fmt.Printf("email: %s, username: %s, password: %s, hashed-password: %s\n", email, username, password, hashedPassword)
	} else {
		templates.ExecuteTemplate(w, "signup.html", nil)
	}
}
