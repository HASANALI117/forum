import AbstractView from "./AbstractView.js";
import { customFetch, getCurrentUser } from "../utils.js";

export default class extends AbstractView {
  constructor(params) {
    super(params);
  }

  async getHtml() {
    const user = this.params.user;

    return /* HTML */ `
      <div id="user-dropdown">
        <div
          class="border-2 border-white rounded absolute left-0 z-10 mt-2 w-64 flex min-h-full flex-col justify-center px-6 pb-4 lg:px-8 bg-gray-900"
        >
          <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <div class="font-semibold my-6 text-sm text-gray-400 text-left">
              Name: <span class="font-normal">${user.FirstName}</span>
            </div>
            <div class="font-semibold my-6 text-sm text-gray-400 text-left">
              Age: <span class="font-normal">${user.Age}</span>
            </div>
            <div class="font-semibold my-6 text-sm text-gray-400 text-left">
              Gender: <span class="font-normal">${user.Gender}</span>
            </div>
            <div class="font-semibold my-6 text-sm text-gray-400 text-left">
              Username: <span class="font-normal">${user.Nickname}</span>
            </div>
            <div class="font-semibold my-6 text-sm text-gray-400 text-left">
              Email: <span class="font-normal">${user.Email}</span>
            </div>

            <div class="my-4">
              <form id="logout-form">
                <button
                  type="submit"
                  class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async onMounted() {
    const logoutForm = document.getElementById("logout-form");

    logoutForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      try {
        await customFetch(
          "http://localhost:8080/api/logout",
          "GET",
          null,
          () => {
            window.location.href = "/signin";
          },
          (error) => {
            console.error("Logout failed", error);
          }
        );
      } catch (error) {
        console.error("Error logging out:", error);
      }
    });
  }
}
