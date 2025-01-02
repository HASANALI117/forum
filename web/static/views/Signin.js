import AbstractView from "./AbstractView.js";
import { handleFormSubmit, customFetch } from "../utils.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    return /* HTML */ `
      <div class="flex flex-l items-center justify-center my-8">
        <div class="bg-gray-900 w-3/5 rounded-lg shadow p-12">
          <h2 class="text-center text-2xl font-bold text-white">Sign In</h2>

          <form class="mt-10" id="signin-form">
            <div class="mb-10">
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-white dark:text-white"
                >Username</label
              >
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username"
                class="block w-full rounded-md border-0 bg-gray-800 p-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                required=""
              />
            </div>

            <div class="mb-10">
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-white dark:text-white"
                >Password</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                class="block w-full rounded-md border-0 bg-gray-800 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                required=""
              />
            </div>

            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all"
            >
              Sign in
            </button>
          </form>

          <p class="mt-6 text-center text-sm text-gray-400">
            No Account?
            <a
              href="/signup"
              class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300 transition-all"
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
        }
      );

      if (response) {
        window.location.href = "/";
      }
    });
  }
}
