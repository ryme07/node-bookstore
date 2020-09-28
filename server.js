const express = require("express");
const server = express();
const morgan = require("morgan");
const routerGlobal = require("./routers/global.router");
const routerBook = require("./routers/book.router");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
require("dotenv").config();
const apiKey = process.env.API_KEY;

// session message init
server.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

mongoose.connect(apiKey, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

server.use(express.static("public"));
server.use(morgan("dev"));
server.use(bodyParser.urlencoded({ extended: false }));
server.set("trust proxy", 1);

// session message
server.use((request, response, next) => {
  response.locals.message = request.session.message;
  delete request.session.message;
  next();
});
server.use("/", routerBook);
server.use("/", routerGlobal);

server.listen(3000);
