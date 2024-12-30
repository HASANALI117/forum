import AbstractView from "./AbstractView.js";
import Post from "./Post.js";
import Chat from "./Chat.js";
import { POSTS, USERS, MESSAGES } from "../constants.js"; // Assuming you have these constants

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const postsHTML = await Promise.all(
      POSTS.map(async (post) => {
        const postView = new Post({ post });
        return await postView.getHtml();
      })
    ).then((htmlArray) => htmlArray.join(""));

    const chatView = new Chat({ users: USERS, messages: MESSAGES });
    const chatHTML = await chatView.getHtml();

    return /* HTML */ `
      <div class="flex flex-row w-full mx-auto">
        <!-- Posts Section -->
        <div
          class="flex flex-col w-2/3 items-center justify-center flex-wrap my-8"
          id="posts"
        >
          ${postsHTML}
        </div>
        <!-- Chat Section -->
        <div class="flex flex-col w-1/2 bg-gray-900 ml-16">${chatHTML}</div>
      </div>
    `;
  }
}
