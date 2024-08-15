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
			user = &models.User{IsLoggedIn: false}
		} else {
			log.Fatal(err)
			// For any other type of error, return a bad request status
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}
	} else {
		user, err = SessionHandler(cookie.Value)
		if err != nil {
			log.Println("Error retrieving user from session:", err)
		}
	}

	pageData := FetchPosts(user)

	if err := Templates.ExecuteTemplate(w, "index.html", pageData); err != nil {
		log.Fatal(err)
	}
}
