import AbstractView from "./AbstractView.js";
import Chat from "./Chat.js";
import { USERS, CHATS } from "../constants.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const chatId = this.params.id;
    const chat = CHATS.find((chat) => chat.id === parseInt(chatId));

    const chatView = new Chat({ users: USERS, chats: [chat] });
    const chatHTML = await chatView.getHtml();

    return /* HTML */ `
      <div class="flex flex-grow h-screen">
        <!-- Chat Section -->
        ${chatHTML}
      </div>
    `;
  }
}
