import Navbar from "./views/Navbar.js";
import Home from "./views/Home.js";
import PostView from "./views/PostView.js";
import PostCreate from "./views/PostCreate.js";
import Signup from "./views/Signup.js";
import Signin from "./views/Signin.js";
import CategoriesList from "./views/CategoriesList.js";
import ChatView from "./views/ChatView.js";
import UserList from "./views/UserList.js";
import { USERS } from "./constants.js";

const pathToRegex = (path) =>
  new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = (match) => {
  const values = match.result.slice(1);
  const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
    (result) => result[1]
  );

  return Object.fromEntries(
    keys.map((key, i) => {
      return [key, values[i]];
    })
  );
};

const renderNavbar = async () => {
  const navbarView = new Navbar();
  document.getElementById("navbar").innerHTML = await navbarView.getHtml();
};

const renderUserList = async () => {
  const userlistView = new UserList({ users: USERS });
  document.getElementById("userlist").innerHTML = await userlistView.getHtml();
};

const renderPage = async () => {
  const match = await router();
  const pageView = new match.route.view(getParams(match));
  document.getElementById("root").innerHTML = await pageView.getHtml();

  if (typeof pageView.onMounted === "function") {
    await pageView.onMounted();
  }
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  renderPage();
};

const router = async () => {
  const routes = [
    { path: "/", view: Home },
    { path: "/post/:id", view: PostView },
    { path: "/create-post", view: PostCreate },
    { path: "/signup", view: Signup },
    { path: "/signin", view: Signin },
    { path: "/category", view: CategoriesList },
    { path: "/chat/:id", view: ChatView },
  ];

  // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    return {
      route: route,
      result: location.pathname.match(pathToRegex(route.path)),
    };
  });

  let match = potentialMatches.find(
    (potentialMatch) => potentialMatch.result !== null
  );

  if (!match) {
    match = {
      route: routes[0],
      result: [location.pathname],
    };
  }

  return match;
};

window.addEventListener("popstate", renderPage);

document.addEventListener("DOMContentLoaded", async () => {
  await renderNavbar();
  await renderUserList();
  await renderPage();

  document.body.addEventListener("click", function (e) {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
});
