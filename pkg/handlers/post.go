package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	database "forum/pkg/db"
	helpers "forum/pkg/helpers"
	models "forum/pkg/models"
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
			helpers.Error(w, "Invalid input", http.StatusBadRequest, err)
			return
		}

		u, _ := helpers.GetCurrentUser(db, r)

		postID, err := helpers.CreatePost(db.DB.DBConn, u.ID, p.Category, p.Title, p.Content)
		if err != nil {
			helpers.Error(w, "Could not create post", http.StatusInternalServerError, err)
			return
		}

		// Retrieve the created post details
		post, err := helpers.GetPostByID(db.DB.DBConn, postID)
		if err != nil {
			helpers.Error(w, "Could not retrieve post details", http.StatusInternalServerError, err)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(map[string]interface{}{
			"message": "Post created successfully",
			"post":    post,
		})
	}, db)
}

func GetPostsHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		posts, err := helpers.GetPosts(db.DB.DBConn)
		if err != nil {
			helpers.Error(w, "Could not get posts", http.StatusInternalServerError, err)
			return
		}

		json.NewEncoder(w).Encode(posts)
	}
}

func GetPostByIDHandler(db *database.DBWrapper) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Extract post ID from URL path
		pathParts := strings.Split(r.URL.Path, "/")
		if len(pathParts) < 4 || pathParts[3] == "" {
			helpers.Error(w, "Missing post ID", http.StatusBadRequest, fmt.Errorf("missing post ID"))
			return
		}
		postID := pathParts[3]

		post, err := helpers.GetPostByID(db.DB.DBConn, postID)
		if err != nil {
			helpers.Error(w, "Could not retrieve post details", http.StatusInternalServerError, err)
			return
		}

		w.WriteHeader(http.StatusOK)

		json.NewEncoder(w).Encode(map[string]interface{}{
			"post": post,
		})
	}
}

func GetPostsByUserID(db *sql.DB, userID string) ([]models.Post, error) {
	rows, err := db.Query(`SELECT p.id, p.user_id, p.category, p.title, p.content, p.created_at, u.username
        FROM posts p JOIN users u ON p.user_id = u.id WHERE p.user_id = ? ORDER BY p.created_at DESC`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		err := rows.Scan(&p.ID, &p.UserID, &p.Category, &p.Title, &p.Content, &p.CreatedAt, &p.UserName)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

func CreateCommentHandler(db *database.DBWrapper) http.HandlerFunc {
	return AuthRequired(func(w http.ResponseWriter, r *http.Request) {
		postID := r.URL.Query().Get("post_id")
		var c struct {
			Content string `json:"content"`
		}
		err := json.NewDecoder(r.Body).Decode(&c)
		if err != nil {
			helpers.Error(w, "Invalid input", http.StatusBadRequest, err)
			return
		}

		u, _ := helpers.GetCurrentUser(db, r)
		err = helpers.CreateComment(db.DB.DBConn, u.ID, postID, c.Content)
		if err != nil {
			helpers.Error(w, "Could not create comment", http.StatusInternalServerError, err)
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
			helpers.Error(w, "Could not get comments", http.StatusInternalServerError, err)
			return
		}
		json.NewEncoder(w).Encode(cmts)
	}
}
