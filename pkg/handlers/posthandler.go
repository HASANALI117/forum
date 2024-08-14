package handlers

import (
	"log"
	"net/http"
)

func PostHandler(w http.ResponseWriter, r *http.Request) {
	if err := Templates.ExecuteTemplate(w, "postform.html", ""); err != nil {
		log.Fatal(err)
	}
}
