import AbstractView from "./AbstractView.js";
import Category from "./Category.js";
import { CATEGORIES } from "../constants.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const categoriesHTML = await Promise.all(
      CATEGORIES.map(async (category) => {
        const categoryView = new Category({ category });
        return await categoryView.getHtml();
      })
    ).then((htmlArray) => htmlArray.join(""));

    return /* HTML */ `
      <div class="flex flex-row w-full mx-auto">
        <!-- Categories Section -->
        <div
          class="flex items-center justify-center flex-wrap my-8"
          id="categories"
        >
          ${categoriesHTML}
        </div>
      </div>
    `;
  }
}
