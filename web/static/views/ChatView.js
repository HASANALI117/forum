import AbstractView from './AbstractView.js';
import Message from './Message.js';
import { USERS, CHATS } from '../constants.js';
import { getCurrentUser, customFetch, handleFormSubmit } from '../utils.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.chatterId = null;
    this.user = null;
    this.currentPage = 1;
    this.totalPages = 1;
    this.isLoading = false;
  }

  async getHtml() {
    const [isUserLoggedIn, user] = await getCurrentUser();
    this.user = user;
    this.chatterId = this.params.id;

    const { messages, currentPage, totalMessages, totalPages } =
      await customFetch(
        `/api/get_messages?user_id=${this.chatterId}&limit=10&page=${this.currentPage}`
      );

    this.totalPages = totalPages;
    this.currentPage = currentPage;

    window.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message received:', message);
      if (
        message.type === 'private_message' &&
        (message.senderId === this.chatterId ||
          message.senderId === this.user.id)
      ) {
        // console.log('Message received from chatter:', message);
        const messageView = new Message({ message });
        messageView.getHtml().then((html) => {
          const chatMessages = document.getElementById('chat-messages');

          // Remove empty state message if it exists
          const emptyState = chatMessages.querySelector(
            '.flex.flex-col.items-center.justify-center'
          );
          if (emptyState) {
            chatMessages.removeChild(emptyState);
          }

          chatMessages.insertAdjacentHTML('beforeend', html);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      } else if (message.type === 'update_user_list') {
        window.renderUserList();
      }
    };

    let chatsHTML;
    if (messages.length > 0) {
      chatsHTML = await Promise.all(
        messages.map(async (message) => {
          const messageView = new Message({ message });
          return await messageView.getHtml();
        })
      ).then((htmlArray) => htmlArray.join(''));
    } else {
      // Get chatter's name from USERS constant
      const chatter = USERS.find((user) => user.id === this.chatterId);
      const chatterName = chatter ? chatter.username : 'this user';

      chatsHTML = /* HTML */ `
        <div
          class="flex flex-col items-center justify-center h-full text-gray-400"
        >
          <i class="bx bx-message-rounded-dots text-6xl mb-4"></i>
          <p class="text-lg">Start chatting with ${chatterName}</p>
          <p class="text-sm">
            Send your first message to begin the conversation
          </p>
        </div>
      `;
    }

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
    if (window.ws && window.ws.readyState === WebSocket.OPEN) {
      window.ws.send(
        JSON.stringify({
          type: 'private_message',
          content: content,
          receiverId: this.chatterId,
          senderId: this.user.id,
          senderName: this.user.username,
        })
      );
      console.log('Message sent:', {
        content,
        ReceiverID: this.chatterId,
        SenderID: this.user.id,
        SenderName: this.user.username,
      });
    } else {
      console.error('WebSocket is not open');
    }
  }

  async onMounted() {
    console.log('ChatView mounted');
    console.log(window.abc);

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

    // Infinite scroll setup
    chatMessages.addEventListener('scroll', async () => {
      if (
        chatMessages.scrollTop === 0 &&
        !this.isLoading &&
        this.currentPage < this.totalPages - 1
      ) {
        this.isLoading = true;

        // Show loading indicator
        const loading = document.createElement('div');
        loading.className = 'text-center text-gray-400 py-2';
        loading.textContent = 'Loading older messages...';
        chatMessages.prepend(loading);

        // Get scroll height before loading new messages
        const oldScrollHeight = chatMessages.scrollHeight;

        // Fetch older messages
        const { messages: olderMessages } = await customFetch(
          `/api/get_messages?user_id=${this.chatterId}&limit=10&page=${
            this.currentPage + 1
          }`
        );

        // Remove loading indicator
        chatMessages.removeChild(loading);

        if (olderMessages.length > 0) {
          this.currentPage++;

          // Prepend new messages
          const olderMessagesHTML = await Promise.all(
            olderMessages.map(async (message) => {
              const messageView = new Message({ message });
              return await messageView.getHtml();
            })
          ).then((htmlArray) => htmlArray.join(''));

          chatMessages.insertAdjacentHTML('afterbegin', olderMessagesHTML);

          // Maintain scroll position
          const newScrollHeight = chatMessages.scrollHeight;
          chatMessages.scrollTop = newScrollHeight - oldScrollHeight;
        }

        this.isLoading = false;
      }
    });

    // Auto-scroll to bottom on new messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}
