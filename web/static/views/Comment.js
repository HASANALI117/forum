import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const comment = this.params.comment;
    const formattedTime = this.params.formattedTime;

    return /* HTML */ `
      <div class="p-6 my-6">
        <div class="flex items-center mb-4">
          <img class="w-10 h-10 rounded-full" src="" alt="Random Image" />
          <div class="flex flex-col ml-4 text-sm text-gray-400">
            <div>
              <span class="font-semibold">${comment.UserID}</span> •
              <span>${formattedTime}</span>
            </div>
          </div>
        </div>
        <hr class="my-4 border-gray-600" />
        <p class="text-md text-gray-300 line-clamp">${comment.Content}</p>
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
        </div>
      </div>
    `;
  }
}
