import AbstractView from "./AbstractView.js";
import Post from "./Post.js";
import { customFetch } from "../utils.js";
import Toast from "../Toast.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async onMounted() {
    window.toast.show('Welcome to the Forum!', 'success', 3000);
  }

  async getHtml() {
    const posts = await customFetch("http://localhost:8080/api/posts", "GET");
    let postsHTML = "";
    if (posts) {
      postsHTML = await Promise.all(
        posts.map(async (post) => {
          const postView = new Post({ post });
          return await postView.getHtml();
        })
      ).then((htmlArray) => htmlArray.join(""));
    }

    return /* HTML */ `
      <div class="flex flex-row ml-12">
        <!-- Posts Section -->
        <div
          class="flex flex-col items-center justify-center flex-wrap my-8"
          id="posts"
        >
          ${posts
            ? postsHTML
            : `<div class="text-white">No posts available.</div>`}
        </div>
      </div>
    `;
  }
}
