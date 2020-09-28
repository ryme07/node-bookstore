const express = require("express");
const router = express.Router();
const twig = require("twig");

// Home page
router.get("/", (request, response) => {
  response.render("home.html.twig");
});

// 404 error
router.use((request, response, next) => {
  const error = new Error("Page not found");
  error.status = 404;
  next(error);
});

router.use((error, request, response) => {
  response.status(error.status || 500);
  response.end(error.message);
});

module.exports = router;
