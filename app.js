var express         = require("express");
var app             = express();
var bodyParser      = require("body-parser");
var mongoose        = require("mongoose");
var flash           = require("connect-flash");
var passport        = require("passport");
var LocalStrategy   = require("passport-local");
var metherOverride  = require("method-override");
var Comment         = require("./models/comment")
var Campground      = require("./models/campground");
var User            = require("./models/user");
var seedDB          = require("./seeds");

var indexRoute = require("./routes/index"),
    commentRoute = require("./routes/comments"),
    campgroundRoute = require("./routes/campgrounds");

//Create database if not already there, otherwise connect to existing database
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v13Deployed";
mongoose.connect(url);


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(metherOverride("_method"));
app.use(flash());
//seedDB();


// PASSPORT CONFIG

app.use(require("express-session")({
    secret: "This is my secret!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoute);
app.use("/campgrounds", campgroundRoute);
app.use("/campgrounds/:id/comments", commentRoute);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server has started!!");
});