const users = [{
    id: "1",
    name: "Paul",
    email: "paul@example.com",
    age: 30,
  },
  {
    id: "2",
    name: "Andrew",
    email: "andrew@example.com",
  },
  {
    id: "3",
    name: "James",
    email: "james@example.com",
  },
];

const posts = [{
    id: "15",
    title: "Hello",
    body: "Welcome to my first post",
    published: true,
    author: "1",
  },
  {
    id: "25",
    title: "Learning",
    body: "I am learning graphql",
    published: false,
    author: "2",
  },
  {
    id: "35",
    title: "Success",
    body: "The tasks are successfully completed",
    published: true,
    author: "2",
  },
];

const comments = [{
    id: "10",
    text: "This worked well for me, Thanks!",
    author: "1",
    post: "15",
  },
  {
    id: "11",
    text: "Glad you enjoyed it...",
    author: "2",
    post: "15",
  },
  {
    id: "12",
    text: "This did not work",
    author: "3",
    post: "25",
  },
  {
    id: "13",
    text: "Nevermind, I got it to work",
    author: "2",
    post: "25",
  },
];

const db = {
    users,
    posts,
    comments
}

export { db as default}