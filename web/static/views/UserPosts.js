import AbstractView from './AbstractView.js';
import Post from './Post.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const isUserLoggedIn = !!window.currentUser;
    // const response = window.currentUser;

    const posts = window.currentUserPosts;

    const postsHTML = await Promise.all(
      posts.map(async (post) => {
        const postView = new Post({ post });
        return await postView.getHtml();
      })
    ).then((htmlArray) => htmlArray.join(''));

    return /* HTML */ `
      <div class="flex flex-row">
        <!-- Posts Section -->
        <div
          class="flex flex-col items-center justify-center flex-wrap my-8"
          id="posts"
        >
          ${postsHTML}
        </div>
      </div>
    `;
  }
}
