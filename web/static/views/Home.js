import AbstractView from './AbstractView.js';
import Post from './Post.js';
import { customFetch } from '../utils.js';

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    // const user = await customFetch(
    //   'http://localhost:8080/api/current_user',
    //   'GET'
    // );
    const posts = await customFetch('http://localhost:8080/api/posts', 'GET');

    const postsHTML = await Promise.all(
      posts.map(async (post) => {
        const postView = new Post({ post });
        return await postView.getHtml();
      })
    ).then((htmlArray) => htmlArray.join(''));

    return /* HTML */ `
      <div class="flex flex-row w-full mx-auto">
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
