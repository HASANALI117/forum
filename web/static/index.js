import Navbar from './views/Navbar.js';
import Home from './views/Home.js';
import PostView from './views/PostView.js';
import PostCreate from './views/PostCreate.js';
import Signup from './views/Signup.js';
import Signin from './views/Signin.js';
import CategoriesList from './views/CategoriesList.js';
import ChatView from './views/ChatView.js';
import UserList from './views/UserList.js';
import { customFetch, getCurrentUser } from './utils.js';
import UserPosts from './views/UserPosts.js';

// Global WebSocket connection
window.ws = new WebSocket('ws://localhost:8080/ws');
window.currentUser = null;

window.ws.onopen = () => {
  console.log('WebSocket connection established');
};

window.ws.onclose = () => {
  console.log('WebSocket connection closed');
};

window.ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

// Handle WebSocket messages
window.ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Message received:', message);
  if (message.type === 'update_user_list') {
    renderUserList();
  }
};

const pathToRegex = (path) =>
  new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$');

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
  document.getElementById('navbar').innerHTML = await navbarView.getHtml();
  if (typeof navbarView.onMounted === 'function') {
    await navbarView.onMounted();
  }
};

const renderUserList = async () => {
  let users = await customFetch('/api/online_users');
  if (users.error) {
    users = [];
  }
  const filteredUsers = window.currentUser
    ? users.filter((user) => user.id !== window.currentUser.id)
    : users;

  const userlistView = new UserList({ users: filteredUsers });
  document.getElementById('userlist').innerHTML = await userlistView.getHtml();
};

window.renderUserList = renderUserList;

const renderPage = async () => {
  const match = await router();
  const pageView = new match.route.view(getParams(match));
  document.getElementById('root').innerHTML = await pageView.getHtml();

  if (typeof pageView.onMounted === 'function') {
    await pageView.onMounted();
  }
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  renderPage();
};

const router = async () => {
  const routes = [
    { path: '/', view: Home },
    { path: '/post/:id', view: PostView },
    { path: '/create-post', view: PostCreate },
    { path: '/signup', view: Signup },
    { path: '/signin', view: Signin },
    { path: '/category', view: CategoriesList },
    { path: '/chat/:id', view: ChatView },
    { path: '/my-posts', view: UserPosts },
  ];

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

window.addEventListener('popstate', renderPage);

document.addEventListener('DOMContentLoaded', async () => {
  await renderNavbar();
  await renderUserList();

  const [isLoggedIn, response] = await getCurrentUser();
  if (response) {
    window.currentUser = response.user;
    window.currentUserPosts = response.posts;
  }
  const currentPath = window.location.pathname;

  if (isLoggedIn) {
    await renderPage();
  } else if (currentPath !== '/signup') {
    navigateTo('/signin');
  } else {
    await renderPage();
  }

  document.body.addEventListener('click', function (e) {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
});
