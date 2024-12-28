import Post from "./Post.js";
import Chat from "./Chat.js";

const Home = (posts, users) => {
  const postsHTML = posts.map((post) => Post(post)).join("");

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
      <div class="flex flex-col w-1/2 bg-gray-900 ml-16">${Chat(users)}</div>
    </div>
  `;
};

export default Home;
