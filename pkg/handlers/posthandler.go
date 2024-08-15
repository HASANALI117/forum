package handlers

import (
	"forum/pkg/db"
	"log"
	"net/http"
	"time"
)

func PostHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		log.Fatal(err)
		return
	}

	user, err := SessionHandler(cookie.Value)
	if err != nil {
		log.Fatal(err)
		log.Println("Error retrieving user from session:", err)
	}

	title := r.FormValue("title")
	content := r.FormValue("content")

	_, err = db.DataBase.Exec("INSERT INTO posts (user_id, title, content, created_at) VALUES (?, ?, ?, ?)", user.UserID, title, content, time.Now())
	if err != nil {
		log.Fatal(err)
	}

	http.Redirect(w, r, "/", http.StatusSeeOther)

	// if err := Templates.ExecuteTemplate(w, "index.html", nil); err != nil {
	// 	log.Fatal(err)
	// }
}

func RenderPostFormHandler(w http.ResponseWriter, r *http.Request) {
	if err := Templates.ExecuteTemplate(w, "postform.html", ""); err != nil {
		log.Fatal(err)
	}
}
