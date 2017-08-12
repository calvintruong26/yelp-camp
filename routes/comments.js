var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment     = require("../models/comment");
var middleware = require("../middleware");


//COMMENTS - NEW
router.get("/new", middleware.isLoggedIn,function(req, res) {
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            req.flash("error", "Oops! Something went wrong... Please try again.");
            console.log(err);
        }
        else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//COMMENTS - CREATE
router.post("/", middleware.isLoggedIn,function(req, res){
   Campground.findById(req.params.id, function(err, campground){
      if (err) {
          req.flash("error", "Oops! Something went wrong... Please try again.");
          console.log(err);
      } 
      else {
          Comment.create(req.body.comment, function(err, comment){
              if (err) {
                  req.flash("error", "Oops! Something went wrong... Please try again.");
                  console.log(err);
              }
              else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully created comment.");
                    res.redirect("/campgrounds/" + campground._id);
              }
          });
      }
   });
});

//COMMENT - EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwnership,function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment) {
       if (err) {
           req.flash("error", "Oops! Something went wrong... Please try again.");
           console.log(err);
       }
       else {
           res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
   });
});

//COMMENT - UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership,function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if (err) {
          req.flash("error", "Oops! Something went wrong... Please try again.");
          res.redirect("back");
      } 
      else {
          req.flash("success", "Successfully updated comment.");
          res.redirect("/campgrounds/" + req.params.id);
      }
    });
});

//COMMENT - DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership,function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if (err){
           req.flash("error", "Oops! Something went wrong... Please try again.");
           res.redirect("back");
       }
       else {
           req.flash("success", "Successfully deleted comment.");
           res.redirect("/campgrounds/" + req.params.id);
       }
   }); 
});




module.exports = router;