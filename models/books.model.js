const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  author: String,
  pages: Number,
  describe: String,
  image: String,
});
module.exports = mongoose.model("Books", bookSchema);
