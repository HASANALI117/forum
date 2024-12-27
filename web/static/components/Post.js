const Post = (username, image, title, category, content, created_at) => {
  return /* HTML */ `
    <a class="m-4" href="/">
      <div class="bg-gray-900 w-72 rounded-2xl p-6 shadow-lg hover:shadow-2xl">
        <div class="flex items-center justify-between mb-4">
          <img
            class="w-10 h-10 rounded-full"
            src="${image}"
            alt="Random Image"
          />
          <div class="flex flex-col ml-4 text-sm text-gray-400">
            <div>
              <span class="font-semibold">u/${username}</span> •
              <span>${created_at}</span>
            </div>
            <span class="font-semibold">c/${category}</span>
          </div>
        </div>
        <hr class="my-4 border-gray-600" />

        <h1 class="text-lg font-semibold text-white mb-2">${title}</h1>
        <p class="text-md text-gray-300 line-clamp">${content}</p>

        <!-- Icons -->
        <div class="flex justify-between mt-6">
          <div
            class="flex items-center text-gray-400 hover:text-white cursor-pointer"
          >
            <i class="bx bxs-like text-xl"></i>
            <span class="ml-2">10</span>
          </div>
          <div
            class="flex items-center text-gray-400 hover:text-white cursor-pointer"
          >
            <i class="bx bxs-dislike text-xl"></i>
            <span class="ml-2">10</span>
          </div>
          <div
            class="flex items-center text-gray-400 hover:text-white cursor-pointer"
          >
            <i class="bx bxs-message-rounded-dots text-xl"></i>
            <span class="ml-2">10</span>
          </div>
        </div>
      </div>
    </a>
  `;
};

export default Post;
