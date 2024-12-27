package handlers

import (
	"html/template"
	"net/http"
)

var templates = template.Must(template.ParseGlob("web/*.html"))

func MainHandler(w http.ResponseWriter, r *http.Request) {
	err := templates.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
