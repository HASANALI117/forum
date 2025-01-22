package models

import (
	"time"
)

// User model
type User struct {
	ID        string `json:"id"`
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Age       int    `json:"age"`
	Gender    string `json:"gender"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Image     string `json:"image"`
}

// Post model
type Post struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	Category  string    `json:"category"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
	UserName  string    `json:"userName"`
	UserImage string    `json:"userImage"`
}

// Comment model
type Comment struct {
	ID        string    `json:"id"`
	PostID    string    `json:"postId"`
	UserID    string    `json:"userId"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createdAt"`
	UserName  string    `json:"userName"`
	UserImage string    `json:"userImage"`
}

// Message model
type Message struct {
	ID          string    `json:"id"`
	SenderID    string    `json:"senderId"`
	ReceiverID  string    `json:"receiverId"`
	Content     string    `json:"content"`
	CreatedAt   time.Time `json:"createdAt"`
	SenderName  string    `json:"senderName"`
	SenderImage string    `json:"senderImage"`
}
