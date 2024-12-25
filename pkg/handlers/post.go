
package handlers

import (
	"encoding/json"
	"net/http"

	helpers "forum/pkg/helpers"
	database "forum/pkg/db"
)

// Posts and Comments
func CreatePostHandler(db *database.DBWrapper) http.HandlerFunc {
	return AuthRequired(func(w http.ResponseWriter, r *http.Request) {
		var p struct {
			Category string `json:"category"`
			Title    string `json:"title"`
			Content  string `json:"content"`
		}
		err := json.NewDecoder(r.Body).Decode(&p)
		if err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		u, _ := GetCurrentUser(db, r)

		err = helpers.CreatePost(db.DB.DBConn, u.ID, p.Category, p.Title, p.Content)
		if err != nil {
			http.Error(w, "Could not create post", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}, db)
}

func GetPostsHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		posts, err := helpers.GetPosts(db.DB.DBConn)
		if err != nil {
			http.Error(w, "Could not get posts", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(posts)
	}
}

func CreateCommentHandler(db *database.DBWrapper) http.HandlerFunc {
	return AuthRequired(func(w http.ResponseWriter, r *http.Request) {
		postID := r.URL.Query().Get("post_id")
		var c struct {
			Content string `json:"content"`
		}
		err := json.NewDecoder(r.Body).Decode(&c)
		if err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		u, _ := GetCurrentUser(db, r)
		err = helpers.CreateComment(db.DB.DBConn, u.ID, postID, c.Content)
		if err != nil {
			http.Error(w, "Could not create comment", http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	}, db)
}

func GetCommentsHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		postID := r.URL.Query().Get("post_id")
		cmts, err := helpers.GetCommentsForPost(db.DB.DBConn, postID)
		if err != nil {
			http.Error(w, "Could not get comments", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(cmts)
	}
}