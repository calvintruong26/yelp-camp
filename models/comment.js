var mongoose = require("mongoose");

//Create new schema
var commentSchema = new mongoose.Schema({
   text: String,
   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String   
   }
});

//Create new collection
var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;