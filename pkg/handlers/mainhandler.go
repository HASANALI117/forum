package handlers

import (
	"html/template"
	"log"
	"net/http"
)

var Templates = template.Must(template.ParseGlob("web/templates/*.html"))

func MainHandler(w http.ResponseWriter, r *http.Request) {
	if err := Templates.ExecuteTemplate(w, "index.html", ""); err != nil {
		log.Fatal(err)
	}
}
