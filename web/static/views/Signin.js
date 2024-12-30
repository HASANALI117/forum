import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    return /* HTML */ `
      <div id="signin-form" class="hidden">
        <div
          class="absolute left-0 z-10 mt-2 w-64 flex min-h-full flex-col justify-center px-6 pb-4 lg:px-8 bg-gray-900"
        >
          <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form class="space-y-6" action="/signin" method="GET">
              <div>
                <label
                  for="username"
                  class="block text-sm font-medium leading-6 text-white"
                  >Username</label
                >
                <div class="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autocomplete="username"
                    required
                    class="block w-full rounded-md border-0 bg-gray-800 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <label
                    for="password"
                    class="block text-sm font-medium leading-6 text-white"
                    >Password</label
                  >
                  <div class="text-sm">
                    <a
                      href="#"
                      class="font-semibold text-indigo-400 hover:text-indigo-300"
                      >Forgot password?</a
                    >
                  </div>
                </div>
                <div class="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    class="block w-full rounded-md border-0 bg-gray-800 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>

            <p class="mt-6 text-center text-sm text-gray-400">
              No account?
              <a
                id="signup-link"
                href="#signup"
                class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
                >Sign up</a
              >
            </p>
          </div>
        </div>
      </div>
    `;
  }
}
