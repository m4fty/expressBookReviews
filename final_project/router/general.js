const express = require("express");
const axios = require("axios");
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
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((response) => {
      return res.status(200).send(JSON.stringify(response, null, 4));
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Error fetching books", error: error.message });
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject(new Error("Book not found"));
    }
  })
    .then((book) => {
      return res.status(200).send(JSON.stringify(book, null, 4));
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  new Promise((resolve, reject) => {
    const booksAux = Object.values(books).filter(
      (book) => book.author.toLowerCase() === author
    );
    if (booksAux.length > 0) {
      resolve(booksAux);
    } else {
      reject(new Error("No books found by author"));
    }
  })
    .then((booksAux) => {
      return res.status(200).send(JSON.stringify(booksAux, null, 4));
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
});
// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  new Promise((resolve, reject) => {
    const booksAux = Object.values(books).filter(
      (book) => book.title.toLowerCase() === title
    );
    if (booksAux.length > 0) {
      resolve(booksAux);
    } else {
      reject(new Error("No books found"));
    }
  })
    .then((booksAux) => {
      return res.status(200).send(JSON.stringify(booksAux, null, 4));
    })
    .catch((error) => {
      return res.status(404).json({ message: error.message });
    });
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
