package handlers

import (
	"fmt"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func SignInHandler(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("username: %s, password: %s, hashed-password: %s\n", username, password, hashedPassword)

	if err = bcrypt.CompareHashAndPassword(hashedPassword, []byte(password)); err != nil {
		log.Fatal(err)
	}

	if err := templates.ExecuteTemplate(w, "index.html", ""); err != nil {
		log.Fatal(err)
	}
}
