import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const users = this.params.users;

    const usersHTML = users
      .map(
        (user, index) => /* HTML */ ` <a
          class="flex items-center p-4 hover:bg-gray-600 cursor-pointer transition-all"
          href="/chat/${user.id}"
        >
          <div class="relative">
            <img
              class="w-10 h-10 rounded-full"
              src="${'https://picsum.photos/200'}"
              alt="${user.username}"
            />
            ${user.status === 'online' ? /* HTML */ `
              <div class="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white bottom-0 right-0"></div>
            ` : ''}
          </div>
          <div class="ml-4">
            <p class="text-white text-xl font-semibold">${user.username}</p>
          </div>
        </a>`
      )
      .join('');

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
