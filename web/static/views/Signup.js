import AbstractView from "./AbstractView.js";
import { handleFormSubmit, customFetch, getCurrentUser } from "../utils.js";

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
          class="w-3/5 max-w-lg rounded-xl shadow-xl p-12 flex flex-col items-center justify-center border border-indigo-400"
        >
          <div class="flex items-center space-x-3">
            <img
              class="h-12 w-12 rounded-full"
              src="/static/assets/logo.PNG"
              alt="forum"
            />
            <h1 class="text-white text-3xl font-bold">FORUM</h1>
          </div>
          <h2 class="text-center text-2xl font-bold text-white mt-8">
            Create your account
          </h2>

          <form class="mt-8 w-full" id="signup-form">
            <div class="flex space-x-4">
              <div class="w-1/2 mb-6">
                <label
                  for="firstName"
                  class="block text-sm font-medium text-white mb-2"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="John"
                  class="block w-full rounded-md bg-gray-200 focus:bg-gray-100 p-2 text-black shadow-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div class="w-1/2 mb-6">
                <label
                  for="lastName"
                  class="block text-sm font-medium text-white mb-2"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Cena"
                  class="block w-full rounded-md bg-gray-200 focus:bg-gray-100 p-2 text-black shadow-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div class="flex space-x-4">
              <div class="w-1/2 mb-6">
                <label
                  for="age"
                  class="block text-sm font-medium text-white mb-2"
                >
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  placeholder="25"
                  class="block w-full rounded-md bg-gray-200 focus:bg-gray-100 p-2 text-black shadow-sm focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div class="w-1/2 mb-6">
                <label
                  for="gender"
                  class="block text-sm font-medium text-white mb-2"
                >
                  Gender
                </label>
                <select
                  name="gender"
                  id="gender"
                  class="block w-full rounded-md bg-gray-200 focus:bg-gray-100 p-2 text-black shadow-sm focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="" disabled selected>Select your gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
            </div>

            <div class="mb-6">
              <label
                for="email"
                class="block text-sm font-medium text-white mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="name@email.com"
                class="block w-full rounded-md bg-gray-200 focus:bg-gray-100 p-2 text-black shadow-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

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
                class="block w-full rounded-md bg-gray-200 focus:bg-gray-100 p-2.5 texblackte shadow-sm focus:ring-2 focus:ring-indigo-500"
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
                class="block w-full rounded-md bg-gray-200 focus:bg-gray-100 p-2 text-black shadow-sm focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-3 text-lg font-semibold text-white shadow transition-colors hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Create an account
            </button>
          </form>

          <p class="mt-8 text-center text-sm text-gray-300">
            Already have an account?
            <a
              href="/signin"
              data-link
              class="font-semibold text-indigo-300 hover:text-indigo-200 transition-all"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    `;
  }

  async onMounted() {
    handleFormSubmit("signup-form", (data) => {
      customFetch(
        "http://localhost:8080/api/register",
        "POST",
        {
          username: data.username,
          email: data.email,
          password: data.password,
          age: parseInt(data.age, 10),
          gender: data.gender,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        async (res) => {
          if (res.user) {
            setTimeout(async () => {
              const [isLoggedIn, response] = await getCurrentUser();
              window.isLoggedIn = isLoggedIn;
              window.currentUser = response ? response.user : null;
              if (isLoggedIn) {
                window.location.href = "/";
              } else {
                console.error("User not authenticated after signup.");
              }
            }, 1000);
          } else {
            console.error("Signup failed:", res);
          }
        },
        (error) => {
          console.error("Error creating user:", error);
        }
      );
    });
  }
}
