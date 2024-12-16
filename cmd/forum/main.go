package main

import (
	"log"
	"net/http"

	handlers "forum/pkg/handlers"
	db "forum/pkg/db"
	ws "forum/pkg/websockets"
)

func main() {
	dbConn, err := db.InitDB()
	if err != nil {
		log.Fatal("Could not initialize DB:", err)
	}
	dbWrapper := &db.DBWrapper{DB: &db.DBResource{DBConn: dbConn}}

	hub := ws.NewHub(dbWrapper)
	go hub.Run()

	// Routes for API
	http.HandleFunc("/api/register", handlers.RegisterHandler(dbWrapper))
	http.HandleFunc("/api/login", handlers.LoginHandler(dbWrapper))
	http.HandleFunc("/api/logout", handlers.LogoutHandler(dbWrapper))

	http.HandleFunc("/api/posts", handlers.GetPostsHandler(dbWrapper))
	http.HandleFunc("/api/create_post", handlers.CreatePostHandler(dbWrapper))
	http.HandleFunc("/api/comments", handlers.GetCommentsHandler(dbWrapper))
	http.HandleFunc("/api/create_comment", handlers.CreateCommentHandler(dbWrapper))

	http.HandleFunc("/api/get_messages", handlers.GetMessagesHandler(dbWrapper))
	http.HandleFunc("/api/users_list", handlers.GetUsersListHandler(dbWrapper))

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		ws.ServeWs(hub, dbWrapper, w, r)
	})

	// Serve static files (SPA)
	http.Handle("/", http.FileServer(http.Dir("static")))

	log.Println("Server running on :8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
