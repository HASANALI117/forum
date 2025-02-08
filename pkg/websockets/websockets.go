package ws

import (
	"fmt"
	"log"
	"net/http"
	"time"

	database "forum/pkg/db"
	helpers "forum/pkg/helpers"

	"github.com/gorilla/websocket"
)

type WSMessage struct {
	Type        string    `json:"type"` // e.g. "private_message"
	Content     string    `json:"content"`
	ReceiverID  string    `json:"receiverId"`
	SenderID    string    `json:"senderId"`
	SenderName  string    `json:"senderName"`
	SenderImage string    `json:"senderImage"`
	CreatedAt   time.Time `json:"createdAt"`
}

type Client struct {
	UserID   string
	Conn     *websocket.Conn
	Send     chan WSMessage
	UserName string
	Image    string
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
			fmt.Println("Client connected:", client.UserID)
			fmt.Println("Total clients:", len(h.clients))
			fmt.Println("Clients:", h.clients)
			// Notify all clients to update the online users list with rate limiting
			go h.NotifyAllClientsToUpdateUserList()
		case client := <-h.unregister:
			if c, ok := h.clients[client.UserID]; ok && c == client {
				delete(h.clients, client.UserID)
				close(client.Send)
				fmt.Println("Client disconnected:", client.UserID)
				// Notify all clients to update the online users list with rate limiting
				go h.NotifyAllClientsToUpdateUserList()
			}
		case msg := <-h.broadcast:
			switch msg.Type {
			case "private_message":
				fmt.Println("message received")
				fmt.Println("Broadcasting message:", msg)
				fmt.Println("sender:", msg.SenderID)
				fmt.Println("receiver:", msg.ReceiverID)
				fmt.Println("image:", msg.SenderImage)
				// Store message in DB
				err := helpers.StoreMessage(h.db.DB.DBConn, msg.SenderID, msg.ReceiverID, msg.Content)
				if err != nil {
					log.Println("error storing message:", err)
					continue
				}
				// Send to receiver if online
				if receiverClient, ok := h.clients[msg.ReceiverID]; ok {
					receiverClient.Send <- msg
					fmt.Println("Message sent to receiver:", msg.ReceiverID)
				}
				// Send to sender
				if senderClient, ok := h.clients[msg.SenderID]; ok {
					senderClient.Send <- msg
					fmt.Println("Message sent to sender:", msg.SenderID)
				}
			case "update_user_list": // notify all clients to call /api/online_users to update the list
				fmt.Println("Broadcasting message:", msg)
				for _, c := range h.clients {
					c.Send <- msg
				}
			case "typing_start", "typing_end":
				// Send typing status only to receiver
				if receiverClient, ok := h.clients[msg.ReceiverID]; ok {
					receiverClient.Send <- msg
				}
			}
		}
	}
}

func (h *Hub) NotifyAllClientsToUpdateUserList() {
	time.Sleep(500 * time.Millisecond) // Rate limit updates
	select {
	case h.broadcast <- WSMessage{Type: "update_user_list"}:
	default:
		log.Println("Broadcast channel full, skipping user list update")
	}
}

func (h *Hub) GetOnlineUsers() []map[string]string {
	users := []map[string]string{}
	for _, c := range h.clients {
		users = append(users, map[string]string{
			"id":       c.UserID,
			"username": c.UserName,
			"image":    c.Image,
		})
	}
	return users
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
		msg.CreatedAt = time.Now()
		// Broadcast the message
		h.broadcast <- msg
	}
}

func (c *Client) writePump() {
	defer func() {
		c.Conn.Close()
	}()
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
	user, err := helpers.GetCurrentUser(db, r)
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
		UserID:   user.ID,
		Conn:     conn,
		Send:     make(chan WSMessage, 256),
		UserName: user.Username,
		Image:    user.Image,
	}
	h.register <- client

	go client.writePump()
	go client.readPump(h)
}
