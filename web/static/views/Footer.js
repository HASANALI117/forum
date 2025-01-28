import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    return /* HTML */ `
      <footer class="text-center bg-gray-800 text-white py-4">
        <p>&copy; Hasan | Ahmed 2024</p>
      </footer>
    `;
  }
}
