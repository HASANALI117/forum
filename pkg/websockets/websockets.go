package ws

import (
	"log"
	"net/http"

	handlers "forum/pkg/handlers"
	helpers "forum/pkg/helpers"
	database "forum/pkg/db"

	"github.com/gorilla/websocket"
)

type WSMessage struct {
	Type       string `json:"type"` // e.g. "private_message"
	Content    string `json:"content"`
	ReceiverID string `json:"receiver_id"`
	SenderID   string `json:"sender_id"`
	SenderName string `json:"sender_name"`
}

type Client struct {
	UserID string
	Conn   *websocket.Conn
	Send   chan WSMessage
}

type Hub struct {
	clients    map[string]*Client
	broadcast  chan WSMessage
	register   chan *Client
	unregister chan *Client
	db         *database.DBWrapper
}

func NewHub(db *database.DBWrapper) *Hub {
	return &Hub{
		clients:    make(map[string]*Client),
		broadcast:  make(chan WSMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		db:         db,
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client.UserID] = client
		case client := <-h.unregister:
			if c, ok := h.clients[client.UserID]; ok && c == client {
				delete(h.clients, client.UserID)
				close(client.Send)
			}
		case msg := <-h.broadcast:
			// Store message in DB
			err := helpers.StoreMessage(h.db.DB.DBConn, msg.SenderID, msg.ReceiverID, msg.Content)
			if err != nil {
				log.Println("error storing message:", err)
				continue
			}

			// Send to receiver if online
			if receiverClient, ok := h.clients[msg.ReceiverID]; ok {
				receiverClient.Send <- msg
			}
		}
	}
}

func (c *Client) readPump(h *Hub) {
	defer func() {
		h.unregister <- c
		c.Conn.Close()
	}()
	for {
		var msg WSMessage
		err := c.Conn.ReadJSON(&msg)
		if err != nil {
			log.Println("read error:", err)
			break
		}
		// Broadcast the message
		h.broadcast <- msg
	}
}

func (c *Client) writePump() {
	for msg := range c.Send {
		err := c.Conn.WriteJSON(msg)
		if err != nil {
			log.Println("write error:", err)
			c.Conn.Close()
			return
		}
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

func ServeWs(h *Hub, db *database.DBWrapper, w http.ResponseWriter, r *http.Request) {
	u, err := handlers.GetCurrentUser(db, r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("upgrade error:", err)
		return
	}
	client := &Client{
		UserID: u.ID,
		Conn:   conn,
		Send:   make(chan WSMessage, 256),
	}
	h.register <- client

	go client.writePump()
	client.readPump(h)
}
