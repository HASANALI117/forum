import AbstractView from "./AbstractView.js";
import { formatTimeAgo } from "../utils.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const post = this.params.post;

    if (!post) {
      return `<div class="text-white">Post not found</div>`;
    }

    const formattedTime = formatTimeAgo(post.createdAt);

    return /* HTML */ `
      <a class="m-4 w-100" href="/post/${post.id}">
        <div
          class="bg-gray-900 rounded-2xl p-12 shadow-lg hover:shadow-2xl transition-all line-clamp"
        >
          <div class="flex items-center mb-4">
            <img class="w-10 h-10 rounded-full" src="" alt="Random Image" />
            <div class="flex flex-col ml-4 text-sm text-gray-400">
              <div>
                <span class="font-semibold">u/${post.userName}</span> •
                <span>${formattedTime}</span>
              </div>
              <span class="font-semibold">c/${post.category}</span>
            </div>
          </div>
          <hr class="my-4 border-gray-600" />
          <h1 class="text-lg font-semibold text-white mb-2">${post.title}</h1>
          <p class="text-md text-gray-300 line-clamp">${post.content}</p>
          <div class="flex mt-6">
            <div
              class="flex items-center text-gray-400 hover:text-white cursor-pointer mr-6"
            >
              <i class="bx bxs-like text-xl"></i>
              <span class="ml-2">12</span>
            </div>
            <div
              class="flex items-center text-gray-400 hover:text-white cursor-pointer mr-6"
            >
              <i class="bx bxs-dislike text-xl"></i>
              <span class="ml-2">12</span>
            </div>
            <div
              class="flex items-center text-gray-400 hover:text-white cursor-pointer mr-6"
            >
              <i class="bx bxs-message-rounded-dots text-xl"></i>
              <span class="ml-2">12</span>
            </div>
          </div>
        </div>
      </a>
    `;
  }
}
