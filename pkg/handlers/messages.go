package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	helpers "forum/pkg/helpers"
	database "forum/pkg/db"
)

// Private messages - loaded via AJAX and sent via WebSockets
func GetMessagesHandler(db *database.DBWrapper) http.HandlerFunc {
	return AuthRequired(func(w http.ResponseWriter, r *http.Request) {
		otherUserID := r.URL.Query().Get("user_id")
		limitStr := r.URL.Query().Get("limit")
		offsetStr := r.URL.Query().Get("offset")

		limit, _ := strconv.Atoi(limitStr)
		if limit == 0 {
			limit = 10
		}
		offset, _ := strconv.Atoi(offsetStr)

		u, _ := GetCurrentUser(db, r)
		msgs, err := helpers.GetMessages(db.DB.DBConn, u.ID, otherUserID, limit, offset)
		if err != nil {
			http.Error(w, "Could not get messages", http.StatusInternalServerError)
			return
		}
		json.NewEncoder(w).Encode(msgs)
	}, db)
}
