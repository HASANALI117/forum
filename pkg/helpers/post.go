package helpers

import (
	"database/sql"
	models "forum/pkg/models"
	"time"

	"github.com/google/uuid"
)

func CreatePost(db *sql.DB, userID, category, title, content string) (string, error) {
	id := uuid.New().String()
	_, err := db.Exec(`INSERT INTO posts(id, user_id, category, title, content, created_at)
	VALUES(?, ?, ?, ?, ?, ?)`, id, userID, category, title, content, time.Now())

	if err != nil {
		return "", err
	}
	return id, nil
}

func GetPosts(db *sql.DB) ([]models.Post, error) {
	rows, err := db.Query(`SELECT p.id, p.user_id, p.category, p.title, p.content, p.created_at, u.username, u.image
		FROM posts p JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []models.Post
	for rows.Next() {
		var p models.Post
		err := rows.Scan(&p.ID, &p.UserID, &p.Category, &p.Title, &p.Content, &p.CreatedAt, &p.UserName, &p.UserImage)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}

	return posts, nil
}

func GetPostByID(db *sql.DB, postID string) (*models.Post, error) {
	row := db.QueryRow(`SELECT p.id, p.user_id, p.category, p.title, p.content, p.created_at, u.username, u.image
        FROM posts p JOIN users u ON p.user_id = u.id WHERE p.id = ?`, postID)
	post := &models.Post{}
	err := row.Scan(&post.ID, &post.UserID, &post.Category, &post.Title, &post.Content, &post.CreatedAt, &post.UserName, &post.UserImage)
	if err != nil {
		return nil, err
	}
	return post, nil
}
