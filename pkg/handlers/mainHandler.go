package handlers

import (
	"forum/pkg/helpers"
	"html/template"
	"net/http"
)

var templates = template.Must(template.ParseGlob("web/*.html"))

func MainHandler(w http.ResponseWriter, r *http.Request) {
	err := templates.ExecuteTemplate(w, "index.html", nil)
	if err != nil {
		helpers.Error(w, err.Error(), http.StatusInternalServerError, err)
	}
}
