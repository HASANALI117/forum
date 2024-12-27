import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Post from "./components/Post.js";
import Signin from "./components/Signin.js";
import Signup from "./components/Signup.js";

// Sample user data
const USER = {
  username: "hasan",
  image: "https://picsum.photos/200",
};

// Sample posts data
const POSTS = [
  {
    username: "hasan",
    image: "https://picsum.photos/200?random=1",
    title: "Post Title 1",
    category: "Category 1",
    content:
      "Post description, Post description, Post description, Post description",
    created_at: "21/12/2024",
  },
  {
    username: "ali",
    image: "https://picsum.photos/200?random=2",
    title: "Post Title 2",
    category: "Category 2",
    content:
      "Post description, Post description, Post description, Post description, Post description,Post description",
    created_at: "21/12/2024",
  },
  {
    username: "ahmed",
    image: "https://picsum.photos/200?random=3",
    title: "Post Title 3",
    category: "Category 3",
    content:
      "Post description, Post description, Post description, Post description",
    created_at: "21/12/2024",
  },
];

// DOM elements
const root = document.getElementById("root");
const posts = document.createElement("div");
posts.id = "posts";
posts.className = "flex";

// Render Navbar and Footer
const renderLayout = () => {
  root.insertAdjacentHTML("beforebegin", Navbar(USER));
  root.insertAdjacentHTML("afterend", Footer());
};

// Render posts
const renderPosts = () => {
  posts.innerHTML = "";
  POSTS.forEach((post) => {
    posts.innerHTML += Post(post);
  });
  root.appendChild(posts);
};

// Render signup form
const renderSignup = () => {
  root.innerHTML = Signup();
};

// Render page based on hash
const renderPage = () => {
  const hash = window.location.hash;

  switch (hash) {
    case "#signup":
      renderSignup();
      break;

    case "":
    default:
      renderPosts();
      break;
  }
};

// Initialize event listeners
const initEventListeners = () => {
  window.addEventListener("hashchange", renderPage);
  window.addEventListener("load", renderPage);

  const userMenuButton = document.getElementById("user-menu-button");
  const signinContainer = document.getElementById("signin-container");

  // Toggle user menu
  userMenuButton.addEventListener("click", () => {
    if (!signinContainer.innerHTML) {
      signinContainer.innerHTML = Signin();
    }
    const signinForm = document.getElementById("signin-form");
    signinForm.classList.toggle("hidden");

    // Add event listener to the signup link
    const signupLink = document.getElementById("signup-link");
    signupLink.addEventListener("click", (event) => {
      signinForm.classList.toggle("hidden");
    });
  });
};

// Initialize the app
const initApp = () => {
  renderLayout();
  renderPage();
  initEventListeners();
};

// Start the app
initApp();
