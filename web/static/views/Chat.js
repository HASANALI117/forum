import AbstractView from "./AbstractView.js";
import Message from "./Message.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const chats = this.params.chats;

    const chatsHTML = await Promise.all(
      chats.map(async (chat) => {
        const messagesHTML = await Promise.all(
          chat.messages.map(async (message) => {
            const messageView = new Message({ message });
            return await messageView.getHtml();
          })
        ).then((htmlArray) => htmlArray.join(""));

        return /* HTML */ `
          <div class="chat" data-chat-id="${chat.id}">${messagesHTML}</div>
        `;
      })
    ).then((htmlArray) => htmlArray.join(""));

    return /* HTML */ `
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
          <i
            class="bx bxs-send text-3xl text-white ml-1 hover:bg-gray-500 rounded-full cursor-pointer p-2"
          ></i>
        </form>
      </div>
    `;
  }
}
