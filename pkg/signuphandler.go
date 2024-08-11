package handlers

import (
	"log"
	"net/http"
)

func SignUpHandler(w http.ResponseWriter, r *http.Request) {
	if err := templates.ExecuteTemplate(w, "signup.html", ""); err != nil {
		log.Fatal(err)
	}
}
