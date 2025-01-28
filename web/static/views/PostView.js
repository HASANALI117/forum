import AbstractView from "./AbstractView.js";
import Comment from "./Comment.js";
import { customFetch, formatTimeAgo, handleFormSubmit } from "../utils.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const postId = this.params.id;

    const response = await customFetch(
      `http://localhost:8080/api/post/${postId}`,
      "GET"
    );

    const post = response.post;

    if (!post) {
      return /* HTML */ `<div class="text-white">Post not found</div>`;
    }

    const formattedTime = formatTimeAgo(post.createdAt);

    const commentsResponse = await customFetch(
      `http://localhost:8080/api/comments?post_id=${postId}`,
      "GET"
    );

    const comments = commentsResponse || [];

    const commentsHTML = await Promise.all(
      comments.map(async (comment) => {
        const formattedTime = formatTimeAgo(comment.createdAt);

        const commentView = new Comment({ comment, formattedTime });
        return await commentView.getHtml();
      })
    ).then((htmlArray) => htmlArray.join(""));

    return /* HTML */ `
      <div class="flex items-center justify-center my-8">
        <div class="text-white w-4/5 rounded-xl p-12 bg-gray-900">
          <div class="flex items-center mb-4">
            <img
              class="w-10 h-10 rounded-full"
              src="${post.userImage}"
              alt="Random Image"
            />
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
          <p class="text-md text-gray-300">${post.content}</p>
          <!-- Icons -->
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
              <span class="ml-2">${comments.length}</span>
            </div>
          </div>

          <!-- Comments -->
          ${commentsHTML}

          <!-- Comment Form -->
          <div class="mt-16">
            <form id="comment-form">
              <label
                for="comment"
                class="block text-sm font-medium text-gray-400"
                >Add a comment:</label
              >
              <textarea
                id="comment"
                name="comment"
                rows="4"
                class="block resize-none overflow-y-auto h-32 w-full mt-2 p-2.5 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Write your comment here..."
              ></textarea>
              <button
                type="submit"
                class="w-full mt-8 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  async onMounted() {
    const postId = this.params.id;

    handleFormSubmit("comment-form", async (data) => {
      const response = await customFetch(
        `http://localhost:8080/api/create_comment?post_id=${postId}`,
        "POST",
        {
          content: data.comment,
        },
        () => {
          window.location.href = `/post/${postId}`;
        }
      );
    });
  }
}
