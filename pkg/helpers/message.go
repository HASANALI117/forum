
package helpers

import (
	"database/sql"
	"time"
	"github.com/google/uuid"
	models "forum/pkg/models"
)

func StoreMessage(db *sql.DB, senderID, receiverID, content string) error {
	id := uuid.New().String()
	_, err := db.Exec(`INSERT INTO messages(id, sender_id, receiver_id, content, created_at)
	VALUES(?, ?, ?, ?, ?)`, id, senderID, receiverID, content, time.Now())
	return err
}

// GetMessages between two users with pagination (last N)
func GetMessages(db *sql.DB, userA, userB string, limit, offset int) ([]models.Message, error) {
	rows, err := db.Query(`
		SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, us.nickname
		FROM messages m
		JOIN users us ON m.sender_id = us.id
		WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
		ORDER BY m.created_at DESC LIMIT ? OFFSET ?
	`, userA, userB, userB, userA, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var msgs []models.Message
	for rows.Next() {
		var msg models.Message
		err := rows.Scan(&msg.ID, &msg.SenderID, &msg.ReceiverID, &msg.Content, &msg.CreatedAt, &msg.SenderName)
		if err != nil {
			return nil, err
		}
		msgs = append(msgs, msg)
	}
	// messages are in DESC order, reverse them
	for i, j := 0, len(msgs)-1; i < j; i, j = i+1, j-1 {
		msgs[i], msgs[j] = msgs[j], msgs[i]
	}
	return msgs, nil
}