
package helpers

import (
	"database/sql"
	"time"
	"github.com/google/uuid"
	models "forum/pkg/models"
)

func CreateComment(db *sql.DB, userID, postID, content string) error {
	id := uuid.New().String()
	_, err := db.Exec(`INSERT INTO comments(id, post_id, user_id, content, created_at)
	VALUES(?, ?, ?, ?, ?)`, id, postID, userID, content, time.Now())
	return err
}

func GetCommentsForPost(db *sql.DB, postID string) ([]models.Comment, error) {
	rows, err := db.Query(`SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.username
		FROM comments c JOIN users u ON c.user_id = u.id 
		WHERE c.post_id = ?
		ORDER BY c.created_at ASC`, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []models.Comment
	for rows.Next() {
		var cmt models.Comment
		err := rows.Scan(&cmt.ID, &cmt.PostID, &cmt.UserID, &cmt.Content, &cmt.CreatedAt, &cmt.UserName)
		if err != nil {
			return nil, err
		}
		comments = append(comments, cmt)
	}
	return comments, nil
}