# Real-Time Chat Implementation

This document describes the real-time chat implementation using Socket.IO in the frontend.

## Architecture

The chat system consists of several layers:

### 1. Socket Context (`src/context/SocketContext.tsx`)
- Manages the Socket.IO connection lifecycle
- Automatically connects/disconnects based on authentication state
- Handles connection events (connect, disconnect, errors)
- Provides socket instance to all child components via React Context

### 2. Chat Service (`src/services/chatService.ts`)
- Provides HTTP API calls for chat operations
- TypeScript interfaces for Message, Conversation, etc.
- Functions for:
  - Getting conversations list
  - Getting conversation messages
  - Creating conversations
  - Marking messages as read
  - Deleting messages

### 3. Chat Hooks (`src/hooks/useChat.ts`)

#### `useChat(conversationId)`
Real-time messaging hook for a specific conversation:
- Loads message history from API
- Joins/leaves conversation rooms via Socket.IO
- Listens for incoming messages in real-time
- Handles message delivery/read status updates
- Manages typing indicators
- Provides pagination for older messages
- Functions:
  - `sendMessage(content)` - Send a message via socket
  - `markAsRead()` - Mark messages as read
  - `startTyping()` / `stopTyping()` - Typing indicators
  - `loadMoreMessages()` - Load older messages

#### `useConversations()`
Hook for managing conversations list:
- Loads all user conversations from API
- Updates conversation list when new messages arrive
- Provides `refreshConversations()` function

### 4. Chat Page (`src/app/[locale]/chats/page.tsx`)
The main chat UI with:
- Conversations list sidebar
- Real-time message display
- Message input with typing indicators
- Auto-scroll to latest messages
- Pagination support
- Mobile responsive design
- Support for desktop and mobile views

## Socket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join_conversation` | `{ conversationId }` | Join a conversation room |
| `leave_conversation` | `{ conversationId }` | Leave a conversation room |
| `send_message` | `{ conversationId, message: { content, messageType } }` | Send a message |
| `typing_start` | `{ conversationId }` | User started typing |
| `typing_stop` | `{ conversationId }` | User stopped typing |
| `message_read` | `{ conversationId }` | Mark messages as read |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `user_online` | `{ userId }` | User came online |
| `user_offline` | `{ userId }` | User went offline |
| `message_received` | `{ message, conversationId }` | New message received |
| `message_delivered` | `{ messageId, conversationId }` | Message delivered confirmation |
| `message_read` | `{ conversationId, readBy }` | Messages marked as read |
| `user_typing` | `{ userId, conversationId, isTyping }` | User typing status changed |

## Features

### ✅ Real-time Messaging
- Instant message delivery via WebSocket
- No need to refresh page
- Messages appear immediately for both sender and receiver

### ✅ Typing Indicators
- Shows when the other user is typing
- Auto-stops after 3 seconds of inactivity
- Stops when user sends message or clears input

### ✅ Message Status
- **Sent**: Message sent to server
- **Delivered**: Message delivered to recipient
- **Read**: Message read by recipient

### ✅ Online Presence
- Shows when users come online/offline
- Green dot indicator on avatars

### ✅ Pagination
- Load older messages by scrolling up
- Efficient loading with 50 messages per page
- Auto-scrolls to bottom for new messages

### ✅ Auto-reconnection
- Automatically reconnects on connection loss
- Retries up to 5 times with 1-second delay
- Uses both WebSocket and polling transports

### ✅ Mobile Support
- Responsive design for all screen sizes
- Slide-in panel for mobile chat view
- Touch-friendly interface

## Configuration

### Backend URL
The socket URL is configured in `src/context/SocketContext.tsx`:
```typescript
const newSocket = io("http://localhost:3000", {
  // ... config
});
```

The HTTP API base URL is configured in `src/lib/axiosClient.ts`:
```typescript
const api = axios.create({
  baseURL: "http://localhost:3000",
  // ... config
});
```

**Note**: Both are currently set to `http://localhost:3000`. Update these URLs to match your backend server address.

### Environment Variables
No additional environment variables needed. The socket connection uses the same authentication token as the HTTP API.

## Authentication

The socket connection automatically uses the JWT token from cookies:
- Token is retrieved from `access_token` cookie
- Sent in the `auth.token` field during connection
- Backend validates the token via `WsJwtGuard`

## Usage Example

```tsx
import { useChat, useConversations } from "@/hooks/useChat";

function ChatComponent() {
  const { conversations } = useConversations();
  const [activeConversationId, setActiveConversationId] = useState(null);

  const {
    messages,
    loading,
    isTyping,
    sendMessage,
    markAsRead,
  } = useChat(activeConversationId);

  const handleSend = (text: string) => {
    sendMessage(text);
  };

  // ... rest of component
}
```

## Troubleshooting

### Socket not connecting
1. Check if backend is running on correct port
2. Verify JWT token is present in cookies
3. Check browser console for connection errors
4. Ensure CORS is properly configured on backend

### Messages not appearing
1. Verify you've joined the conversation room
2. Check socket connection status
3. Look for errors in browser console
4. Ensure conversation ID is valid

### Typing indicators not working
1. Check if `startTyping()` is called on input change
2. Verify socket is connected
3. Ensure you're in the correct conversation room

## Best Practices

1. **Always check socket connection** before emitting events
2. **Clean up event listeners** in useEffect cleanup
3. **Handle errors gracefully** with try-catch blocks
4. **Debounce typing indicators** to avoid too many events
5. **Validate conversation access** before joining rooms

## Performance Considerations

- Messages are paginated (50 per page) to avoid loading too much data
- Socket events are cleaned up when components unmount
- Typing indicators auto-stop after timeout
- Connection state is managed globally to avoid multiple connections

## Security

- JWT authentication required for socket connection
- Users can only access conversations they're participants in
- Messages are validated on the backend
- Blocked users cannot send messages
