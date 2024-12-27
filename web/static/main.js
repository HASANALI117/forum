import Navbar from "./components/Navbar.js";
import Footer from "./components/Footer.js";
import Post from "./components/Post.js";

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

root.insertAdjacentHTML("beforebegin", Navbar());
root.insertAdjacentHTML("afterend", Footer());

posts.forEach((post) => {
  postsDiv.innerHTML += Post(
    post.username,
    post.image,
    post.title,
    post.category,
    post.content,
    post.created_at
  );
});

root.appendChild(postsDiv);
