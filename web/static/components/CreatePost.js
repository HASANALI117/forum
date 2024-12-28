const categories = [
  { id: "category-1", name: "Full-stack" },
  { id: "category-2", name: "Front-end" },
  { id: "category-3", name: "Back-end" },
  { id: "category-3", name: "Back-end" },
  { id: "category-3", name: "Back-end" },
  { id: "category-3", name: "Back-end" },
];

const categoriesHTML = categories
  .map(
    (category) => /* HTML */ ` <div class="relative flex mr-4">
      <div class="flex h-6 items-center">
        <input
          id="${category.id}"
          name="${category.id}"
          type="radio"
          class="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
        />
        <label for="${category.id}" class="ml-2 text-sm font-medium text-white">
          ${category.name}
        </label>
      </div>
    </div>`
  )
  .join("");

const CreatePost = () => {
  return /* HTML */ `
    <div
      class="flex flex-col items-center justify-center py-8 bg-gray-900 w-full min-h-screen"
    >
      <form
        class="rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
        action="/create-post"
        method="POST"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <div class="border-b pb-12">
            <div class="sm:mx-auto sm:w-full sm:max-w-md">
              <h2
                class="text-center text-2xl font-bold leading-9 tracking-tight text-white"
              >
                Create a Post
              </h2>
            </div>

            <div class="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div class="sm:col-span-3 w-full">
                <label
                  for="title"
                  class="block text-sm font-medium leading-6 text-white"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  class="block w-full rounded-md mt-2 border-0 bg-gray-800 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  required
                />
              </div>

              <div class="col-span-full w-full">
                <label
                  for="content"
                  class="block text-sm font-medium leading-6 text-white"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows="3"
                  class="block w-full rounded-md mt-2 border-0 bg-gray-800 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  required
                ></textarea>
              </div>
            </div>

            <div class="mt-10 space-y-10">
              <h2 class="text-sm font-semibold leading-6 text-white">
                Categories
              </h2>

              <div class="mt-6 flex items-center flex-wrap">
                ${categoriesHTML}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 w-full transition-all"
        >
          Save
        </button>
      </form>
    </div>
  `;
};

export default CreatePost;
