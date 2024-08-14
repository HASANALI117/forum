package handlers

import (
	"forum/pkg/db"
	"forum/pkg/models"
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

		imgUrl := "https://picsum.photos/100"

		_, err = db.DataBase.Exec("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", username, email, string(hashedPassword))
		if err != nil {
			log.Fatal(err)
			return
		}

		user := models.User{
			Username: username,
			Email:    email,
			ImgURL:   imgUrl,
		}

		// Pass the user to the template
		if err := Templates.ExecuteTemplate(w, "index.html", user); err != nil {
			log.Fatal(err)
		}

		http.Redirect(w, r, "/", http.StatusSeeOther)

	} else {
		Templates.ExecuteTemplate(w, "signup.html", nil)
	}
}
