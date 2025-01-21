package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	database "forum/pkg/db"
	helpers "forum/pkg/helpers"
	"forum/pkg/models"
)

// Private messages - loaded via AJAX and sent via WebSockets
func GetMessagesHandler(db *database.DBWrapper) http.HandlerFunc {
	return AuthRequired(func(w http.ResponseWriter, r *http.Request) {
		otherUserID := r.URL.Query().Get("user_id")
		limitStr := r.URL.Query().Get("limit")
		pageStr := r.URL.Query().Get("page")
		fmt.Println("queries:", otherUserID, limitStr, pageStr)
		limit, _ := strconv.Atoi(limitStr)
		if limit == 0 {
			limit = 10
		}
		page, _ := strconv.Atoi(pageStr)
		offset := (page - 1) * limit

		currentUser, _ := GetCurrentUser(db, r)
		msgs, err := helpers.GetMessages(db.DB.DBConn, currentUser.ID, otherUserID, limit, offset)
		if err != nil {
			helpers.Error(w, "Could not get messages", http.StatusInternalServerError, err)
			return
		}

		if msgs == nil {
			msgs = []models.Message{}
		}

		totalMessages, err := helpers.GetTotalMessagesCount(db.DB.DBConn, currentUser.ID, otherUserID)
		if err != nil {
			helpers.Error(w, "Could not get total messages count", http.StatusInternalServerError, err)
			return
		}

		response := map[string]interface{}{
			"messages":      msgs,
			"currentPage":   page,
			"totalPages":    (totalMessages + limit - 1) / limit,
			"totalMessages": totalMessages,
		}

		json.NewEncoder(w).Encode(response)
	}, db)
}

func GetAllMessagesHandler(db *database.DBWrapper) http.HandlerFunc {
	return AuthRequired(func(w http.ResponseWriter, r *http.Request) {
		msgs, err := helpers.GetAllMessages(db.DB.DBConn)
		if err != nil {
			helpers.Error(w, "Could not get all messages", http.StatusInternalServerError, err)
			return
		}
		json.NewEncoder(w).Encode(msgs)
	}, db)
}
