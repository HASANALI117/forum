import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const users = this.params.users;

    const usersHTML = users
      .map(
        (user) => /* HTML */ ` <div
          class="flex items-center p-4 hover:bg-gray-600 cursor-pointer transition-all"
        >
          <img
            class="w-10 h-10 rounded-full"
            src="${user.image}"
            alt="${user.username}"
          />
          <div class="ml-4">
            <p class="text-white text-xl font-semibold">${user.username}</p>
          </div>
        </div>`
      )
      .join("");

    return /* HTML */ `
      <div class="flex flex-col overflow-y-auto h-full" id="chat-users">
        ${usersHTML}
      </div>
    `;
  }
}
