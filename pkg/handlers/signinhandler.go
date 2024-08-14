package handlers

import (
	"fmt"
	"forum/pkg/db"
	"forum/pkg/models"
	"log"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func SignInHandler(w http.ResponseWriter, r *http.Request) {
	username := r.FormValue("username")
	password := r.FormValue("password")
	var hashedPassword, email, imgUrl string

	err := db.DataBase.QueryRow("SELECT password, email, img_url FROM users WHERE username = ?", username).Scan(&hashedPassword)
	if err != nil {
		log.Fatal(err)
	}

	if err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password)); err != nil {
		log.Fatal(err)
	}

	fmt.Println("login succesful")

	user := models.User{
		Username: username,
		Email:    email,
		ImgURL:   imgUrl,
	}
	fmt.Println(user)

	if err := Templates.ExecuteTemplate(w, "index.html", user); err != nil {
		log.Fatal(err)
	}
}
