import Message from "./Message.js";

const Chat = (users, messages) => {
  const usersHTML = users
    .map(
      (user) => /* HTML */ ` <div
        class="flex items-center p-4 hover:bg-gray-600 cursor-pointer transition-all"
      >
        <img
          class="w-10 h-10 rounded-full"
          src="${user.image}"
          alt="${user.username}"
        />
        <div class="ml-4">
          <p class="text-white text-xl font-semibold">${user.username}</p>
        </div>
      </div>`
    )
    .join("");

  const messagesHTML = messages.map((message) => Message(message)).join("");

  return /* HTML */ `
    <!-- Chat Section -->
    <div class="flex flex-row h-full">
      <!-- Users Sidebar -->
      <div class="flex flex-col w-1/4 bg-gray-700">
        <h2 class="text-white text-xl font-bold my-6 text-left px-4">Chats</h2>

        <div class="flex flex-col overflow-y-auto h-full" id="chat-users">
          <!-- User list will go here -->
          ${usersHTML}
        </div>
      </div>

      <!-- Chat Area -->
      <div class="flex flex-col w-full bg-gray-900">
        <div
          class="flex flex-col overflow-y-auto h-96 flex-grow"
          id="chat-messages"
        >
          <!-- Chat messages will go here -->
          ${messagesHTML}
        </div>

        <form
          id="chat-form"
          class="m-4 flex justify-center items-center relative"
        >
          <i class="bx bxs-camera text-3xl text-white mr-4"></i>

          <input
            type="text"
            id="chat-input"
            class="w-full p-2 h-12 rounded-full bg-gray-700 text-white border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Type a message..."
          />
          <i
            class="bx bx-smile absolute right-16 text-gray-400 text-3xl hover:text-white"
          ></i>

          <i
            class="bx bxs-send text-3xl text-white ml-1 hover:bg-gray-500 rounded-full cursor-pointer p-2"
          ></i>
        </form>
      </div>
    </div>
  `;
};

export default Chat;
