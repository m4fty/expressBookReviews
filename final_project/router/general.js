const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "Username already exists!" });
  }
  users.push({ username, password });
  return res
    .status(200)
    .json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(300).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(300).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  const booksAux = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author
  );
  if (booksAux.length > 0) {
    return res.status(300).send(JSON.stringify(booksAux, null, 4));
  } else {
    return res.status(404).json({ message: "No books found by author" });
  }
});
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksAux = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title
  );

  if (booksAux.length > 0) {
    return res.status(300).send(JSON.stringify(booksAux, null, 4));
  } else {
    return res.status(404).json({ message: "No books found" });
  }
});

module.exports = public_users;

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(300).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "No book found" });
  }
});

module.exports.general = public_users;
