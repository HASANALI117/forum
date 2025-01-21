import AbstractView from './AbstractView.js';
import { formatTimeAgo } from '../utils.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const message = this.params.message;

    return /* HTML */ `
      <div class="flex items-start hover:bg-gray-700 p-6 transition-all">
        <img
          class="w-10 h-10 rounded-full mr-4"
          src="${message.image}"
          alt="${message.senderName}"
        />
        <div class="flex flex-col">
          <div class="flex items-center">
            <p class="text-white font-semibold">${message.senderName}</p>
            <span class="ml-2 text-gray-400 text-sm timestamp" data-timestamp="${message.createdAt}">
              ${formatTimeAgo(message.createdAt)}
            </span>
          </div>
          <p class="text-gray-300">${message.content}</p>
        </div>
      </div>
    `;
  }
}
