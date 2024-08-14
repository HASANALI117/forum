package handlers

import (
	"forum/pkg/models"
	"html/template"
	"log"
	"net/http"
)

var Templates = template.Must(template.ParseGlob("web/templates/*.html"))

func MainHandler(w http.ResponseWriter, r *http.Request) {
	var user *models.User

	cookie, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			// If the cookie is not set, redirect to the login page
			user := &models.User{IsLoggedIn: false}
			if err := Templates.ExecuteTemplate(w, "index.html", user); err != nil {
				log.Fatal(err)
			}
			return
		}
		log.Fatal(err)
		// For any other type of error, return a bad request status
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	user, err = SessionHandler(cookie.Value)
	if err != nil {
		log.Println("Error retrieving user from session:", err)
		log.Fatal(err)
	}

	if err := Templates.ExecuteTemplate(w, "index.html", user); err != nil {
		log.Fatal(err)
	}
}
