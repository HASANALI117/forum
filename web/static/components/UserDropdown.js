const UserDropdown = (user) => {
  return /* HTML */ `
    <div id="logout" class="hidden">
      <div
        class="absolute left-0 z-10 mt-2 w-64 flex min-h-full flex-col justify-center px-6 pb-4 lg:px-8 bg-gray-900"
      >
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <div class="font-semibold my-6 text-sm text-gray-400 text-left">
            Username:<span class="font-normal ml-2">${user.username}</span>
          </div>
          <div class="font-semibold my-6 text-sm text-gray-400 text-left">
            Email:<span class="font-normal ml-2">${user.email}</span>
          </div>

          <div class="my-4">
            <form action="/signout" method="post">
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
};

export default UserDropdown;
