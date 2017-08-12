var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function (req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Oops! You must be logged in to do that. Please log in and try again.");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function (req, res, next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground){
           if (err) {
               req.flash("error", "Error: Campground could not be found...");
               res.redirect("back");
           } 
           else {
               if (foundCampground.author.id.equals(req.user._id)){
                  next(); 
               }
               else {
                   req.flash("error", "Sorry, you don't have permission to do this.");
                   res.redirect("back");
               }
           }
        }); 
    }
    else {
        req.flash("error", "Oops! You must be logged in to do that. Please log in and try again.");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if (err) {
               req.flash("error", "Error: Comment could not be found...");
               res.redirect("back");
           } 
           else {
               if (foundComment.author.id.equals(req.user._id)){
                  next(); 
               }
               else {
                   req.flash("error", "Sorry, you don't have permission to do that...");
                   res.redirect("back");
               }
           }
        }); 
    }
    else {
        req.flash("error", "Oops! You must be logged in to do that. Please log in and try again.");
        res.redirect("back");
    }
}

module.exports = middlewareObj;