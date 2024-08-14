package handlers

import (
	"forum/pkg/db"
	"log"
	"net/http"
	"time"
)

func SignOutHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			http.Redirect(w, r, "/", http.StatusSeeOther)
			return
		}

		log.Fatal(err)
	}
	sessionToken := cookie.Value

	// Delete the session from the database
	_, err = db.DataBase.Exec("DELETE FROM sessions WHERE session_token = ?", sessionToken)
	if err != nil {
		log.Fatal(err)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Expires:  time.Unix(0, 0),
		HttpOnly: true,
	})
	// Redirect to the homepage
	http.Redirect(w, r, "/", http.StatusSeeOther)
}
