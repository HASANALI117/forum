import AbstractView from "./AbstractView.js";
import { CATEGORIES } from "../constants.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const category = this.params.category;

    return /* HTML */ `
      <a class="m-4" href="/category/${category.id}" data-link>
        <div
          class="ml-12 w-96 h-full bg-gray-900 rounded-2xl p-12 shadow-lg hover:shadow-2xl transition-all"
        >
          <div class="flex items-center mb-4">
            <img
              class="w-10 h-10 rounded-full"
              src=${category.image}
              alt="Random Image"
            />
            <div class="flex flex-col ml-4 text-sm text-gray-400">
              <span class="font-semibold">c/${category.name}</span>
            </div>
          </div>
          <hr class="my-4 border-gray-600" />
          <h1 class="text-lg font-semibold text-white mb-2">
            ${category.name}
          </h1>
          <p class="text-md text-gray-300 line-clamp">
            ${category.description}
          </p>
        </div>
      </a>
    `;
  }
}
