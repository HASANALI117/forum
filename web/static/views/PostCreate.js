import AbstractView from "./AbstractView.js";
import { CATEGORIES } from "../constants.js";
import { customFetch, handleFormSubmit } from "../utils.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const categoriesHTML = CATEGORIES.map(
      (category) => /* HTML */ ` <div class="relative flex mr-10">
        <div class="flex h-6 items-center">
          <input
            id="${category.id}"
            name="category"
            value="${category.name}"
            type="radio"
            class="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
          />
          <label
            for="${category.name}"
            class="ml-2 text-sm font-medium text-white"
          >
            ${category.name}
          </label>
        </div>
      </div>`
    ).join("");

    return /* HTML */ `
      <div class="flex justify-center items-center mt-10">
        <form
          class="bg-gray-900 w-3/5 rounded-lg shadow p-12"
          id="post-create-form"
        >
          <h2
            class="text-center text-2xl font-bold leading-9 tracking-tight text-white"
          >
            Create a Post
          </h2>

          <div class="w-full mt-10">
            <label
              for="title"
              class="block text-sm font-medium leading-6 text-white"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              class="block w-full rounded-md mt-2 border-0 bg-gray-800 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              required
            />
          </div>

          <div class="w-full mt-10">
            <label
              for="content"
              class="block text-sm font-medium leading-6 text-white"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows="3"
              class="block w-full h-60 resize-none rounded-md mt-2 border-0 bg-gray-800 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              required
            ></textarea>
          </div>

          <div class="mt-10">
            <h2 class="text-sm font-semibold text-white">Categories</h2>

            <div class="mt-6 flex items-center flex-wrap">
              ${categoriesHTML}
            </div>
          </div>

          <button
            type="submit"
            class="mt-10 rounded-md bg-indigo-500 px-3 py-2 text-md font-semibold text-white shadow-sm hover:bg-indigo-400 w-full transition-all"
          >
            Save
          </button>
        </form>
      </div>
    `;
  }

  async onMounted() {
    handleFormSubmit("post-create-form", async (data) => {
      const response = await customFetch(
        "http://localhost:8080/api/create_post",
        "POST",
        {
          category: data.category,
          title: data.title,
          content: data.content,
        }
      );

      if (response) {
        window.location.href = "/";
      }
    });
  }
}
