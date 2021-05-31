const { addBooks, getBooks, updateBooks, deleteBooks } = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBooks,
  },
  {
    method: "GET",
    path: "/books/{bookIdParam?}",
    handler: getBooks,
  },
  {
    method: "PUT",
    path: "/books/{bookIdParam}",
    handler: updateBooks,
  },
  {
    method: "DELETE",
    path: "/books/{bookIdParam}",
    handler: deleteBooks,
  },
];

module.exports = routes;
