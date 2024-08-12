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

	// Log the database connection status
	if db.DataBase == nil {
		log.Fatal("Database connection is nil after initialization")
	} else {
		log.Println("Database connection is initialized successfully")
	}

	http.Handle("/web/static/", http.StripPrefix("/web/static/", http.FileServer(http.Dir("web/static"))))
	http.HandleFunc("/", handlers.MainHandler)
	http.HandleFunc("/signup", handlers.SignUpHandler)
	http.HandleFunc("/signin", handlers.SignInHandler)
	log.Println("Server running on http://localhost:8082")
	if err := http.ListenAndServe(":8082", nil); err != nil {
		log.Fatal(err)
	}
}
