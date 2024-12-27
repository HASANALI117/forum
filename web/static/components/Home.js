import Post from "./Post.js";

const Home = (post) => {
  const postsHTML = post.map((post) => Post(post));

  return /* HTML */ `
    <div class="flex items-center justify-center flex-wrap my-8" id="posts">
      <!-- Posts -->
      ${postsHTML}
    </div>
  `;
};

export default Home;
