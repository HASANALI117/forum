import AbstractView from './AbstractView.js';
import Chat from './Chat.js';
import { USERS, CHATS } from '../constants.js';
import { getCurrentUser, customFetch } from '../utils.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.chatId = null;
    this.user = null;
    this.chatComp = null;
    this.ws = null;
  }

  async getHtml() {
    const [isUserLoggedIn, user] = await getCurrentUser();
    this.user = user;
    this.chatId = this.params.id;
    // const chat = CHATS.find((chat) => chat.id === parseInt(chatId));
    const chat = CHATS[0];
    this.ws = new WebSocket('ws://localhost:8080/ws');

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'private_message') {
        // Update chat view with new message
        this.chatComp.onMounted(this.ws, {
          sendMessage: this.sendMessage.bind(this),
        });
      }
    };

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      // Send initial handshake or authentication if needed
      if (this.user) {
        this.sendMessage('Hello, world!');
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      // Implement reconnection logic if needed
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.chatComp = new Chat({ chats: [chat] });
    const chatHTML = await this.chatComp.getHtml();

    return /* HTML */ `
      <div class="flex flex-grow h-screen">
        <!-- Chat Section -->
        ${chatHTML}
      </div>
    `;
  }

  sendMessage(content) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'private_message',
          content: content,
          receiver_id: this.chatId,
          sender_id: this.user.ID,
          sender_name: this.user.Nickname,
        })
      );
      console.log('Message sent:', {
        content,
        ReceiverID: this.chatId,
        SenderID: this.user.ID,
        SenderName: this.user.Nickname,
      });
    } else {
      console.error('WebSocket is not open');
    }
  }

  async onMounted() {
    console.log('ChatView mounted');
    await this.chatComp.onMounted(this.ws, {
      sendMessage: this.sendMessage.bind(this),
    });
  }
}
