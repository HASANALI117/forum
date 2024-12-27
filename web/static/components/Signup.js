const Signup = () => {
  return /* HTML */ `
    <div class="flex flex-l items-center justify-center mt-8">
      <div
        class="bg-gray-900 w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div class="sm:mx-auto sm:w-full sm:max-w-md">
            <h2
              class="text-center text-2xl font-bold leading-9 tracking-tight text-white"
            >
              Create your account
            </h2>
          </div>
          <form class="space-y-4 md:space-y-6" action="/signup" method="POST">
            <div>
              <label
                for="email"
                class="block mb-2 text-sm font-medium text-white dark:text-white"
                >Email Address</label
              >
              <input
                type="email"
                name="email"
                id="email"
                class="block w-full rounded-md border-0 bg-gray-800 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder="name@email.com"
                required=""
              />
            </div>
            <div>
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
            <div>
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
              Create an account
            </button>
          </form>

          <div>
            <div class="relative mt-10">
              <div
                class="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div
                class="relative flex justify-center text-sm font-medium leading-6"
              >
                <span class="bg-gray-900 px-6 text-white"
                  >Or continue with</span
                >
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-4">
              <a
                href="#"
                class="flex w-full items-center justify-center gap-3 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-500 focus-visible:ring-transparent transition-all"
              >
                <svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                <span class="text-sm font-semibold leading-6">Google</span>
              </a>

              <a
                href="#"
                class="flex w-full items-center justify-center gap-3 rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-500 focus-visible:ring-transparent transition-all"
              >
                <svg
                  class="h-5 w-5 fill-[#24292F]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="text-sm font-semibold leading-6">GitHub</span>
              </a>
            </div>
          </div>

          <p class="mt-6 text-center text-sm text-gray-400">
            Already have an account?
            <a
              href="/"
              class="font-semibold leading-6 text-indigo-400 hover:text-indigo-300 transition-all"
              >Login here</a
            >
          </p>
        </div>
      </div>
    </div>
  `;
};

export default Signup;
