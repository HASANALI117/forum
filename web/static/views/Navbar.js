import AbstractView from "./AbstractView.js";
import SigninCard from "./SigninCard.js";
import { USERS, NavLinks } from "../constants.js";
import UserDropDown from "./UserDropDown.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const isLoggedIn = window.isLoggedIn;
    const user = window.currentUser;

    const navItems = NavLinks.map(
      (link) => /* HTML */ ` <a
        href="${link.href}"
        class="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
        data-link
      >
        ${link.icon
          ? `<i class="bx ${link.icon} mr-1 text-xl"></i>`
          : ""}${link.name}
      </a>`
    ).join("");

    return /* HTML */ `
      <header class="bg-gray-800">
        <div
          class="mx-auto max-w-7xl px-2 sm:px-4 lg:divide-y lg:divide-gray-700 lg:px-8"
        >
          <div class="relative flex h-16 justify-between">
            <div class="relative z-10 flex px-2 lg:px-0">
              <div class="flex flex-shrink-0 items-center">
                <a href="/" data-link>
                  <img
                    class="h-12 w-12 rounded-full"
                    src="/static/assets/logo.PNG"
                    alt="Your Company"
                  />
                </a>
                <h1 class="text-white text-xl pl-1 font-bold">FORUM</h1>
              </div>
            </div>

            <div
              class="relative z-0 flex flex-1 items-center justify-center px-2 sm:absolute sm:inset-0"
            >
              <div class="w-full sm:max-w-xs">
                <label for="search" class="sr-only">Search</label>
                <div class="relative">
                  <div
                    class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
                  >
                    <svg
                      class="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="search"
                    name="search"
                    class="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 focus:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                    placeholder="Search"
                    type="search"
                  />
                </div>
              </div>
            </div>

            <div
              class="hidden lg:relative lg:z-10 lg:ml-4 lg:flex lg:items-center"
            >
              <!-- Profile dropdown -->
              <div class="relative ml-4 flex-shrink-0">
                <div class="flex items-center justify-between">
                  <button
                    id="user-menu-button"
                    type="button"
                    class="relative flex rounded-full bg-gray-800 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span class="sr-only">Open user menu</span>

                    <img
                      class="w-10 h-10 rounded-full"
                      src=${isLoggedIn ? user.image : USERS[0].image}
                      alt="User Image"
                    />
                  </button>

                  <p class="ml-4 text-xl font-medium text-white">
                    ${isLoggedIn ? user.username : "Guest"}
                  </p>
                </div>

                <div id="signin-container" class="hidden"></div>
              </div>
            </div>
          </div>

          <nav class="hidden lg:flex lg:space-x-8 lg:py-2" aria-label="Global">
            ${navItems}
          </nav>
        </div>
      </header>
    `;
  }

  async onMounted() {
    const isLoggedIn = window.isLoggedIn;
    const user = window.currentUser;

    const userMenuButton = document.getElementById("user-menu-button");
    const signinContainer = document.getElementById("signin-container");

    if (isLoggedIn) {
      const userDropDownCard = new UserDropDown({ user });
      signinContainer.innerHTML = await userDropDownCard.getHtml();

      if (typeof userDropDownCard.onMounted === "function") {
        await userDropDownCard.onMounted();
      }
    } else {
      const signinCard = new SigninCard();
      signinContainer.innerHTML = await signinCard.getHtml();

      if (typeof signinCard.onMounted === "function") {
        await signinCard.onMounted();
      }
    }

    userMenuButton.addEventListener("click", async () => {
      signinContainer.classList.toggle("hidden");
    });
  }
}
