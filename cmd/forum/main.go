package main

import (
	"forum/pkg/db"
	handlers "forum/pkg/handlers"
	"log"
	"net/http"
)

func main() {
	db.InitDB()
	defer db.DataBase.Close()

	http.Handle("/web/static/", http.StripPrefix("/web/static/", http.FileServer(http.Dir("web/static"))))

	http.HandleFunc("/", handlers.MainHandler)
	http.HandleFunc("/signup", handlers.SignUpHandler)
	http.HandleFunc("/signin", handlers.SignInHandler)
	http.HandleFunc("/signout", handlers.SignOutHandler)
	http.HandleFunc("/create-post", handlers.PostHandler)
	http.HandleFunc("/post-form", handlers.RenderPostFormHandler)
	http.HandleFunc("/filter", handlers.FilterHandler)

	log.Println("Server running on http://localhost:8082")
	if err := http.ListenAndServe(":8082", nil); err != nil {
		log.Fatal(err)
	}
}
