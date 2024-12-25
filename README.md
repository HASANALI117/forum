
# Forum and Chat Backend API Documentation

This README provides an overview of the available endpoints, their purposes, request/response formats, and notes on authentication. This API is built with Go, uses a SQLite database, and provides endpoints for user registration, login, posts, comments, and private messages.

## Base URL

All endpoints are served from:

```
http://localhost:8080
```

## Authentication

- Some endpoints require an authenticated session.
- Authentication is performed via a `session_token` cookie that is set when you log in.
- After logging in, include the `session_token` cookie on subsequent requests.

## Endpoints

### Registration

**POST** `/api/register`

**Description:** Registers a new user.

**Request Body (JSON):**
```json
{
  "nickname": "string",
  "email": "string",
  "password": "string",
  "age": 25,
  "gender": "M",
  "first_name": "string",
  "last_name": "string"
}
```

**Response:**
- `200 OK` on success.
- `400 Bad Request` if validation fails or user already exists.

---

### Login

**POST** `/api/login`

**Description:** Logs an existing user in using either their nickname or email, and password. Sets a `session_token` cookie on success.

**Request Body (JSON):**
```json
{
  "identifier": "nickname_or_email",
  "password": "string"
}
```

**Response:**
- `200 OK` on success (with `Set-Cookie: session_token=<token>`).
- `401 Unauthorized` if credentials are invalid.

---

### Logout

**GET** `/api/logout`

**Description:** Logs out the current user by clearing the session cookie.

**Authentication:** Required (session_token cookie).

**Response:**
- `200 OK` on success.

---

### Create Post

**POST** `/api/create_post`

**Description:** Creates a new post in the forum.

**Authentication:** Required.

**Request Body (JSON):**
```json
{
  "category": "string",
  "title": "string",
  "content": "string"
}
```

**Response:**
- `200 OK` on success.
- `401 Unauthorized` if not logged in.

---

### Get Posts

**GET** `/api/posts`

**Description:** Retrieves a list of all posts (public feed).

**Authentication:** Not strictly required (depends on your final logic).

**Response (JSON):**
```json
[
  {
    "id": "string",
    "user_id": "string",
    "category": "string",
    "title": "string",
    "content": "string",
    "created_at": "timestamp",
    "user_name": "string"
  }
]
```
- `200 OK` on success.

---

### Create Comment

**POST** `/api/create_comment?post_id=<POST_ID>`

**Description:** Adds a new comment to a specific post.

**Authentication:** Required.

**Request Body (JSON):**
```json
{
  "content": "string"
}
```

**Response:**
- `200 OK` on success.
- `400 Bad Request` if `post_id` is missing or invalid.
- `401 Unauthorized` if not logged in.

---

### Get Comments

**GET** `/api/comments?post_id=<POST_ID>`

**Description:** Retrieves all comments for a given post.

**Response (JSON):**
```json
[
  {
    "id": "string",
    "post_id": "string",
    "user_id": "string",
    "content": "string",
    "created_at": "timestamp",
    "user_name": "string"
  }
]
```
- `200 OK` on success.
- `400 Bad Request` if `post_id` is missing or invalid.

---

### Get Messages (Private Chat History)

**GET** `/api/get_messages?user_id=<OTHER_USER_ID>&limit=10&offset=0`

**Description:** Fetches the private messages between the currently logged-in user and another user. Supports pagination via `limit` and `offset` query parameters.

**Authentication:** Required.

**Response (JSON):**
```json
[
  {
    "id": "string",
    "sender_id": "string",
    "receiver_id": "string",
    "content": "string",
    "created_at": "timestamp",
    "sender_name": "string"
  }
]
```
- `200 OK` on success.
- `401 Unauthorized` if not logged in.

---

### Users List

**GET** `/api/users_list`

**Description:** Retrieves a list of all registered users. Useful for showing who might be available to chat.

**Authentication:** Required.

**Response (JSON):**
```json
[
  {
    "ID": "string",
    "Nickname": "string",
    "Email": "string",
    "Password": "hashed_string",
    "Age": 25,
    "Gender": "string",
    "FirstName": "string",
    "LastName": "string"
  }
]
```
- `200 OK` on success.
- `401 Unauthorized` if not logged in.

---

## WebSocket Endpoint

**URL:** `ws://localhost:8080/ws`

**Description:**  
Used for real-time private messaging. Once authenticated (the server checks the `session_token`), you can send and receive JSON messages of the form:

**Message Format (JSON):**
```json
{
  "type": "private_message",
  "content": "string",
  "receiver_id": "string",
  "sender_id": "string",
  "sender_name": "string"
}
```

**Behavior:**
- Sending a message through this WebSocket broadcasts it to the recipient if they are online.
- The message is also stored in the database.
- If the recipient is not online, the message is simply stored and will be available when they connect again and load the chat history.

**Notes:**
- Ensure you have a valid `session_token` before attempting to connect.
- The frontend (like the SPA) is expected to connect using the browser’s WebSocket API and attach the session cookie automatically.

---

## Error Responses

- `400 Bad Request`: Usually due to invalid input, missing parameters, or duplicate entries.
- `401 Unauthorized`: The user is not authenticated or the session has expired.
- `500 Internal Server Error`: Unexpected server errors.

In all cases, error responses will typically be accompanied by a textual message describing the issue.

---

## Testing

You can test the endpoints using a tool like Thunder Client or Postman. For WebSockets, use a browser console, a custom frontend, or a tool like `wscat` (with modifications to include authentication).

---

This README provides an overview of the key endpoints and their usage. For full details, refer to the source code and implement the frontend as needed.
