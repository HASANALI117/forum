package handlers

import (
	"log"
	"net/http"
)

func FilterHandler(w http.ResponseWriter, r *http.Request) {
	if err := Templates.ExecuteTemplate(w, "filter.html", ""); err != nil {
		log.Fatal(err)
	}
}
