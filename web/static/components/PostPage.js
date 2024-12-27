import Comment from "./Comment.js";

const PostPage = (post) => {
  const commentsHTML = post.comments
    .map((comment) => Comment(comment, post))
    .join("");

  return /* HTML */ `
    <div class="flex items-center justify-center my-8">
      <div class="text-white w-1/2 rounded-xl p-6 bg-gray-900">
        <div class="flex items-center justify-between mb-4">
          <img
            class="w-10 h-10 rounded-full"
            src="${post.image}"
            alt="Random Image"
          />
          <div class="flex flex-col ml-4 text-sm text-gray-400">
            <div>
              <span class="font-semibold">u/${post.username}</span> •
              <span>${post.created_at}</span>
            </div>
            <span class="font-semibold">c/${post.category}</span>
          </div>
        </div>
        <hr class="my-4 border-gray-600" />
        <h1 class="text-lg font-semibold text-white mb-2">${post.title}</h1>
        <p class="text-md text-gray-300 line-clamp">${post.content}</p>
        <!-- Icons -->
        <div class="flex mt-6">
          <div
            class="flex items-center text-gray-400 hover:text-white cursor-pointer mr-6"
          >
            <i class="bx bxs-like text-xl"></i>
            <span class="ml-2">10</span>
          </div>
          <div
            class="flex items-center text-gray-400 hover:text-white cursor-pointer mr-6"
          >
            <i class="bx bxs-dislike text-xl"></i>
            <span class="ml-2">10</span>
          </div>
          <div
            class="flex items-center text-gray-400 hover:text-white cursor-pointer mr-6"
          >
            <i class="bx bxs-message-rounded-dots text-xl"></i>
            <span class="ml-2">10</span>
          </div>
        </div>
        <!-- Comment Form -->
        <div class="mt-6">
          <form id="comment-form">
            <label for="comment" class="block text-sm font-medium text-gray-400"
              >Add a comment:</label
            >
            <textarea
              id="comment"
              name="comment"
              rows="4"
              class="block w-full mt-2 p-2.5 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write your comment here..."
            ></textarea>
            <button
              type="submit"
              class="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
        </div>

        <!-- Comments -->
        ${commentsHTML}
      </div>
    </div>
  `;
};

export default PostPage;