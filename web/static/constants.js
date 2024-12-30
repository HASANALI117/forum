// Navigation links
export const NavLinks = [
  {
    name: "Home",
    href: "/",
    icon: "bxs-home",
  },
  {
    name: "My Posts",
    href: "/my-posts",
    icon: "bxs-notepad",
  },
  {
    name: "Categories",
    href: "/categories",
    icon: "bxs-category",
  },
  {
    name: "Create Post",
    href: "/create-post",
    icon: "bx-plus",
  },
  {
    name: "Sign In",
    href: "/signin",
    icon: "bx-user",
  },
];

// Sample user data
export const USERS = [
  {
    username: "hasan",
    image: "https://picsum.photos/200",
    date: "11/12/2024",
    email: "hasan@gmail.com",
  },
  {
    username: "hasan",
    image: "https://picsum.photos/200",
    date: "11/12/2024",
    email: "hasan@gmail.com",
  },
  {
    username: "hasan",
    image: "https://picsum.photos/200",
    date: "11/12/2024",
    email: "hasan@gmail.com",
  },
];

// Sample posts data
export const POSTS = [
  {
    username: "hasan",
    image: "https://picsum.photos/200?random=1",
    id: 1,
    title: "Post Title 1",
    category: "Category 1",
    content:
      "Post description, Post description, Post description, Post description",
    likes: 1,
    dislikes: 5,
    created_at: "21/12/2024",
    comments: [
      {
        id: 1,
        content: "Content",
        likes: 83,
        dislikes: 27,
        created_at: "27/12/2024",
      },
      {
        id: 1,
        content: "Content",
        likes: 0,
        dislikes: 2,
        created_at: "27/12/2024",
      },
      {
        id: 1,
        content: "Content",
        likes: 32,
        dislikes: 12,
        created_at: "27/12/2024",
      },
    ],
  },
  {
    username: "ali",
    image: "https://picsum.photos/200?random=2",
    id: 2,
    title: "Post Title 2",
    category: "Category 2",
    content:
      "Post description, Post description, Post description, Post description, Post description,Post description",
    likes: 1,
    dislikes: 5,
    created_at: "21/12/2024",
    comments: [
      {
        id: 1,
        content: "Content",
        likes: 3,
        dislikes: 2,
        created_at: "27/12/2024",
      },
    ],
  },
  {
    username: "ahmed",
    image: "https://picsum.photos/200?random=3",
    id: 3,
    title: "Post Title 3",
    category: "Category 3",
    content:
      "Post description, Post description, Post description, Post description",
    likes: 1,
    dislikes: 5,
    created_at: "21/12/2024",
    comments: [
      {
        id: 1,
        content: "Content",
        likes: 3,
        dislikes: 2,
        created_at: "27/12/2024",
      },
    ],
  },
];

// Sample chat messages
export const MESSAGES = [
  {
    username: "User 1",
    image: USERS[0].image,
    content: "Hello, how are you?",
    timestamp: "10:00 AM",
  },
  {
    username: "User 2",
    image: USERS[1].image,
    content:
      "loremdvssdvnsdv  sdv sdviono no niosdv nodv nov nionoisdv  sdvnsdv noniowef sdv niosev no niosdv niosdv iose niowef oniio eniowe niowef nioo wenioniowe nioe nio wenio wefnionio weniowef ",
    timestamp: "10:05 AM",
  },
  {
    username: "User 1",
    image: USERS[0].image,
    content: "I'm doing well, thank you!",
    timestamp: "10:10 AM",
  },
];

export const CATEGORIES = [
  { id: "1", name: "Full-stack" },
  { id: "2", name: "Front-end" },
  { id: "3", name: "Back-end" },
];
