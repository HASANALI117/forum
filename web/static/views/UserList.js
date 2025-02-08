import AbstractView from "./AbstractView.js";
import { formatTimeAgo } from "../utils.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const users = [...this.params.users];
    
    // Sort users based on the specified priority:
    // 1. Users with chat history (sorted by most recent message)
    // 2. Online users without chat history (sorted alphabetically)
    // 3. Offline users without chat history (sorted alphabetically)
    users.sort((a, b) => {
      // If both have messages, sort by most recent first
      if (a.lastMessage && b.lastMessage) {
        return (
          new Date(b.lastMessage.created_at) -
          new Date(a.lastMessage.created_at)
        );
      }
      
      // If only one has a message, that one goes first
      if (a.lastMessage) return -1;
      if (b.lastMessage) return 1;
      
      // For users without messages:
      // If one is online and other is offline, online goes first
      if (a.status !== b.status) {
        return a.status === "online" ? -1 : 1;
      }
      
      // If both users have same status (both online or both offline),
      // sort alphabetically by username
      return a.username.localeCompare(b.username);
    });

    const usersHTML = users
      .map(
        (user, index) => /* HTML */ ` <a
          class="flex items-center justify-between p-4 hover:bg-gray-600 cursor-pointer transition-all"
          href="/chat/${user.id}"
          data-link
        >
          <div class="relative">
            <img
              class="w-10 h-10 rounded-full"
              src="${user.image}"
              alt="${user.username}"
            />
            ${user.status === "online"
              ? /* HTML */ `
                  <div
                    class="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-gray-600 bottom-0 right-0"
                  ></div>
                `
              : /* HTML */ `
                  <div
                    class="absolute w-4 h-4 bg-gray-500 rounded-full border-2 border-white bottom-0 right-0"
                  ></div>
                `}
          </div>
          <div class="flex flex-1 min-w-0">
            <div class="ml-4 flex-1 min-w-0">
              <p class="text-white text-xl font-semibold">${user.username}</p>
              ${user.lastMessage
                ? `<div class="flex mt-1 text-gray-400 min-w-0">
                      <p class="text-sm truncate min-w-0 flex-1">
                        ${
                          user.lastMessage.sender_name === user.username
                            ? user.lastMessage.content
                            : `You: ${user.lastMessage.content}`
                        }
                      </p>
                      <p class="text-xs ml-2 whitespace-nowrap">
                        · ${formatTimeAgo(user.lastMessage.created_at)}
                      </p>
                    </div>`
                : ""}
            </div>
          </div>
        </a>`
      )
      .join("");

    return /* HTML */ `
      <div class="flex flex-col w-full bg-gray-700">
        <h2 class="text-white text-xl font-bold my-6 text-left px-4">Chats</h2>
        <div class="flex flex-col overflow-y-auto h-full" id="chat-users">
          ${usersHTML}
        </div>
      </div>
    `;
  }
}
