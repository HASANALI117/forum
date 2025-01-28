# Real-Time Forum

A full-stack web application implementing a real-time forum with live chat capabilities. Built with Go (backend) and Vanilla JavaScript (frontend) using WebSockets for real-time communication.

## Features

### User Authentication
- User registration with required fields:
  - Nickname
  - Age
  - Gender
  - First Name
  - Last Name
  - Email
  - Password
- Login using email/nickname with password
- Session management
- Secure password hashing using bcrypt

### Posts & Comments
- Create and view posts with categories
- Comment on posts
- Feed display showing all posts
- Expandable comments view per post
- Category-based post filtering

### Real-Time Chat
- Live private messaging between users
- Online/Offline user status
- Message history with lazy loading (10 messages at a time)
- Real-time message notifications
- Chat list organized by most recent messages
- Message format includes timestamp and sender details

## Project Structure

### Frontend (`web/`)
```
web/
├── index.html           # Single page application entry point
└── static/
    ├── assets/         # Images and icons
    ├── styles/         # CSS stylesheets
    ├── views/          # JavaScript view components
    ├── index.js        # Main JavaScript entry point
    └── utils.js        # Utility functions
```

### Backend (`pkg/`)
```
pkg/
├── db/                 # Database interactions
├── handlers/           # HTTP and WebSocket request handlers
├── helpers/            # Helper functions
├── models/            # Data models
└── websockets/        # WebSocket implementation
```

### Entry Point (`cmd/`)
```
cmd/forum/             # Main application
```

## Technical Implementation

### Frontend
- Single Page Application (SPA) architecture
- Custom router for client-side navigation
- WebSocket client for real-time communication
- Modular view components
- No external frontend frameworks/libraries
- Responsive design using Tailwind CSS
- Custom toast notifications

### Backend
- Go web server
- SQLite database for data persistence
- Gorilla WebSocket for real-time communication
- Session-based authentication
- RESTful API endpoints
- Concurrent handling of WebSocket connections

## Dependencies

### Backend
- Standard Go packages
- Gorilla WebSocket
- SQLite3
- Bcrypt for password hashing
- UUID for unique identifiers

### Frontend
- Tailwind CSS for styling
- Font Awesome icons
- Box Icons
- Google Fonts

## Getting Started

1. Clone the repository
2. Ensure Go is installed on your system
3. Install dependencies:
```bash
go mod download
```
4. Run the server:
```bash
go run cmd/forum/main.go
```
5. Open `http://localhost:8080` in your browser

## Key Features in Detail

### Real-Time Communication
- WebSocket connections maintain persistent communication channels
- Live updates for:
  - New messages
  - User online status
  - Post updates
  - Comments

### User Experience
- Clean, intuitive interface
- Real-time feedback on actions
- Smooth navigation between views
- Error handling with toast notifications

### Data Management
- Efficient database queries
- Prepared statements for security
- Transaction support for data integrity
- Proper indexing for performance
