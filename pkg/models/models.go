package models

import (
	"time"
)

// User model
type User struct {
	ID        string
	Nickname  string
	Email     string
	Password  string
	Age       int
	Gender    string
	FirstName string
	LastName  string
}

// Post model
type Post struct {
	ID        string
	UserID    string
	Category  string
	Title     string
	Content   string
	CreatedAt time.Time
	UserName  string // can be joined for display
}

// Comment model
type Comment struct {
	ID        string
	PostID    string
	UserID    string
	Content   string
	CreatedAt time.Time
	UserName  string
}

// Message model
type Message struct {
	ID         string
	SenderID   string
	ReceiverID string
	Content    string
	CreatedAt  time.Time
	SenderName string
}
