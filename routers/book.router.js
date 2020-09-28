const express = require("express");
const router = express.Router();
const twig = require("twig");
const bookController = require("../controllers/book.controller");

const multer = require("multer");

// destination storage
const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    callback(null, "./public/images/");
  },
  filename: (request, file, cb) => {
    let date = new Date().toLocaleDateString();
    cb(
      null,
      date + "-" + Math.round(Math.random() * 10000) + "-" + file.originalname
    );
  },
});

const fileFilter = (request, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Image not accepted"), false);
  }
};

// init multer options
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Books page
router.get("/books", bookController.books_display);
// Create a new book
router.post("/books", upload.single("image"), bookController.book_create);
// Book's details
router.get("/books/:id", bookController.book_details);
// Get a book to edit
router.get("/books/edit/:id", bookController.book_editDisplay);
//Edit a book
router.post("/books/editServer", bookController.book_edit);
// edit an image
router.post(
  "/books/updateImage",
  upload.single("image"),
  bookController.book_editImage
);
// Delete a book
router.post("/books/delete/:id", bookController.book_delete);

module.exports = router;
