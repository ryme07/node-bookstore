const mongoose = require("mongoose");
const fs = require("fs");
const bookModel = require("../models/books.model");

// Get all books
exports.books_display = (request, response) => {
  bookModel
    .find()
    .exec()
    .then((books) => {
      response.render("books/bookList.html.twig", {
        books: books,
        message: response.locals.message,
      });
    })
    .catch();
};

// POST a new book
exports.book_create = (request, response) => {
  const book = new bookModel({
    _id: new mongoose.Types.ObjectId(),
    name: request.body.title,
    author: request.body.author,
    pages: request.body.pages,
    describe: request.body.describe,
    image: request.file.path.substring(14),
  });
  book
    .save()
    .then((result) => {
      console.log(result);
      response.redirect("/books");
    })
    .catch((error) => {
      console.log(error);
    });
};

// GET book's details
exports.book_details = (request, response) => {
  bookModel
    .findById(request.params.id)
    .exec()
    .then((book) => {
      response.render("books/book.html.twig", { book: book, isEdit: false });
    })
    .catch((error) => {
      console.log(error);
    });
};

// GET book to edit
exports.book_editDisplay = (request, response) => {
  bookModel
    .findById(request.params.id)
    .exec()
    .then((book) => {
      response.render("books/book.html.twig", { book: book, isEdit: true });
    })
    .catch((error) => {
      console.log(error);
    });
};

// EDIT a book
exports.book_edit = (request, response) => {
  console.log(request.body);
  const bookUpdate = {
    name: request.body.title,
    author: request.body.author,
    pages: request.body.pages,
    describe: request.body.describe,
  };

  bookModel
    .updateOne({ _id: request.body.id }, bookUpdate)
    .exec()
    .then((result) => {
      if (result.nModified < 1) throw new Error("Edit request failed");
      console.log(result);
      request.session.message = {
        type: "success",
        content: "Book edit",
      };
      response.redirect("/books");
    })
    .catch((error) => {
      console.log(error);
      request.session.message = {
        type: "danger",
        content: "Book's edit failed",
      };
      response.redirect("/books");
    });
};

// EDIT an image book
exports.book_editImage = (request, response) => {
  const book = bookModel
    .findById(request.body.id)
    .select("image")
    .exec()
    .then((book) => {
      fs.unlink("./public/images/" + book.image, (error) => {
        console.log(error);
      });

      const bookUpdate = {
        image: request.file.path.substring(14),
      };

      bookModel
        .updateOne({ _id: request.body.id }, bookUpdate)
        .exec()
        .then((result) => {
          response.redirect("/books/edit/" + request.body.id);
        })
        .catch((error) => {
          console.log(error);
        });
    });
};

// DELETE a book
exports.book_delete = (request, response) => {
  const book = bookModel
    .findById(request.params.id)
    .select("image")
    .exec()
    .then((book) => {
      fs.unlink("./public/images/" + book.image, (error) => {
        console.log(error);
      });
      bookModel
        .deleteOne({ _id: request.params.id })
        .exec()
        .then((result) => {
          request.session.message = {
            type: "success",
            content: "Delete done",
          };
          response.redirect("/books");
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
