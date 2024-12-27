import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Post from "./components/Post.js";
import Signin from "./components/Signin.js";
import Signup from "./components/Signup.js";

const user = {
  username: "hasan",
  image: "https://picsum.photos/200",
};

const posts = [
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

const root = document.getElementById("root");
const postsDiv = document.createElement("div");

postsDiv.id = "posts";
postsDiv.className = "flex";

root.insertAdjacentHTML("beforebegin", Navbar(user));
root.insertAdjacentHTML("afterend", Footer());

const renderPosts = () => {
  postsDiv.innerHTML = "";
  posts.forEach((post) => {
    postsDiv.innerHTML += Post(post);
  });
  root.appendChild(postsDiv);
};

const renderSignup = () => {
  root.innerHTML = Signup();
};

const renderPage = () => {
  const hash = window.location.hash;
  if (hash === "#signup") {
    renderSignup();
  } else {
    renderPosts();
  }
};

window.addEventListener("hashchange", renderPage);
window.addEventListener("load", renderPage);

// Initial render
renderPage();

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
