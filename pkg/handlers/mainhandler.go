package handlers

import (
	"html/template"
	"log"
	"net/http"
)

var templates = template.Must(template.ParseGlob("web/templates/*.html"))

func MainHandler(w http.ResponseWriter, r *http.Request) {
	if err := templates.ExecuteTemplate(w, "index.html", ""); err != nil {
		log.Fatal(err)
	}
}
