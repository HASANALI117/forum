import AbstractView from "./AbstractView.js";
import { handleFormSubmit, customFetch } from "../utils.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    return /* HTML */ `
      <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-gray-900 w-screen"
      >
        <div
          class="w-3/5 h-3/5 max-w-lg rounded-xl shadow-xl p-12 flex flex-col items-center justify-center border-indigo-400 border"
        >
          <div class="flex items-center space-x-3">
            <img
              class="h-12 w-12 rounded-full"
              src="/static/assets/logo.PNG"
              alt="forum"
            />
            <h1 class="text-white text-3xl font-bold">FORUM</h1>
          </div>
          <h2 class="text-center text-2xl font-bold text-white mt-12">
            Sign In
          </h2>

          <form class="mt-8 w-full" id="signin-form">
            <div class="mb-6">
              <label
                for="username"
                class="block text-sm font-medium text-white mb-2"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username"
                class="block w-full rounded-md border-0 bg-gray-200 p-3 text-black shadow-sm focus:bg-gray-100 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div class="mb-6">
              <label
                for="password"
                class="block text-sm font-medium text-white mb-2"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="block w-full rounded-md border-0 bg-gray-200 p-3 text-black shadow-sm focus:bg-gray-100 focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              class="w-full rounded-md bg-indigo-500 px-3 py-3 text-lg font-semibold text-white shadow transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-300">
            No Account?
            <a
              href="/signup"
              data-link
              class="font-semibold text-indigo-300 hover:text-indigo-200 transition-all"
              >Sign up</a
            >
          </p>
        </div>
      </div>
    `;
  }

  async onMounted() {
    handleFormSubmit("signin-form", async (data) => {
      const response = await customFetch(
        "http://localhost:8080/api/login",
        "POST",
        {
          identifier: data.username,
          password: data.password,
        },
        () => {
          window.location.href = "/";
        }
      );
    });
  }
}
