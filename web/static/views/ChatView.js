import AbstractView from './AbstractView.js';
import Message from './Message.js';
import { USERS, CHATS } from '../constants.js';
import { getCurrentUser, customFetch, handleFormSubmit } from '../utils.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.chatId = null;
    this.user = null;
    this.ws = null;
  }

  async getHtml() {
    const [isUserLoggedIn, user] = await getCurrentUser();
    this.user = user;
    this.chatId = this.params.id;
    const chat = CHATS[0];

    this.ws = new WebSocket('ws://localhost:8080/ws');

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'private_message') {
        console.log('Message received:', message);
        const messageView = new Message({ message });
        messageView.getHtml().then((html) => {
          const chatMessages = document.getElementById('chat-messages');
          chatMessages.insertAdjacentHTML('beforeend', html);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      }
    };

    this.ws.onopen = () => {
      console.log('WebSocket connection established');
      if (this.user) {
        this.sendMessage('Hello, world!');
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    const chatsHTML = await Promise.all(
      chat.messages.map(async (message) => {
        const messageView = new Message({ message });
        return await messageView.getHtml();
      })
    ).then((htmlArray) => htmlArray.join(''));

    return /* HTML */ `
      <div class="flex flex-grow h-screen">
        <div class="flex flex-col w-full bg-gray-900">
          <div
            class="flex flex-col overflow-y-auto h-96 flex-grow"
            id="chat-messages"
          >
            ${chatsHTML}
          </div>
          <form
            id="chat-form"
            class="m-4 flex justify-center items-center relative sticky bottom-0 py-4"
          >
            <i class="bx bxs-camera text-3xl text-white mr-4"></i>
            <input
              type="text"
              id="chat-input"
              class="w-full p-2 h-12 rounded-full bg-gray-700 text-white border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Type a message..."
            />
            <i
              class="bx bx-smile absolute right-16 text-gray-400 text-3xl hover:text-white"
            ></i>
            <button
              type="submit"
              class="bx bxs-send text-3xl text-white ml-1 hover:bg-gray-500 rounded-full cursor-pointer p-2"
            ></button>
          </form>
        </div>
      </div>
    `;
  }

  sendMessage(content) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'private_message',
          content: content,
          receiverId: this.chatId,
          senderId: this.user.id,
          senderName: this.user.username,
        })
      );
      console.log('Message sent:', {
        content,
        ReceiverID: this.chatId,
        SenderID: this.user.id,
        SenderName: this.user.username,
      });
    } else {
      console.error('WebSocket is not open');
    }
  }

  async onMounted() {
    console.log('ChatView mounted');

    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    // Handle form submission
    handleFormSubmit('chat-form', (data) => {
      const message = chatInput.value.trim();
      if (message) {
        this.sendMessage(message);
        chatInput.value = '';
      }
    });

    // Auto-scroll to bottom on new messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}
