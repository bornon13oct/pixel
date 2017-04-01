var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    passport       = require("passport"),
    flash          = require("connect-flash"),
    methodOverride = require("method-override"),
    LocalStrategy  = require("passport-local"),
    User           = require("./models/user"),
    seedDB         = require("./seeds");

seedDB(); 
// mongodb://localhost/yelp_camp
mongoose.connect("mongodb://skay13oct:skay13oct@ds135689.mlab.com:35689/yelpcamp");

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(require("express-session")({
    secret: "I love node.js",
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
    res.locals.error     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});
app.use(methodOverride("_method"));

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});     
        }
    });
});

app.post("/campgrounds", isLoggedIn, function (req, res) {
    var name          = req.body.name,
        image         = req.body.image,
        description   = req.body.description,
        author        = {id: req.user._id, username: req.user.username},
        newCampground = {name: name, image: image, description: description, author: author};
        Campground.create(newCampground, function(err, campground){
            if(err){
                req.flash("error", "Something went wrong");
                console.log(err);
            }
        });
        res.redirect("/campgrounds");    
});

app.get("/campgrounds/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new"); 
});

app.get("/campgrounds/:id", function (req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        }
        else {
            res.render("campgrounds/show", {campground:foundCampground});
        }
    });
});

app.get("/campgrounds/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        }
        else{
            req.flash("success", "Successfully edited campground");
            res.render("campgrounds/edit", {campground:foundCampground});
        }
    });
});

app.put("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

app.delete("/campgrounds/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds"+req.params.id);
        }
        else{
            req.flash("success", "Sucessfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        }
        else{
            res.render("comments/new", {campground:campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                    res.redirect("/campgrounds");
                }
                else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/"+campground._id);
                }
            });
        }
    });
});

app.get("/campgrounds/:id/comments/:comment_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(error, foundComment){
        if(error){
            console.log(error);
        }
        else{
            res.render("comments/edit", {campground_id:req.params.id, comment:foundComment});
        }
    });
});

app.put("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

app.delete("/campgrounds/:id/comments/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Something went wrong");
            console.log(err);
            res.redirect("/campgrounds"+req.params.id);
        }
        else{
            req.flash("success", "Comment successfully deleted");
            res.redirect("/campgrounds");
        }
    });
});


app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelpcamp "+ user.username);
            res.redirect("/campgrounds");
        });
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

app.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
});

app.get("/team", function(req, res) {
    res.render("team");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to that");
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    req.flash("error", "You do not have permissions to do that");
                    res.redirect("back");
                }
            }                
        });
    }
    else{
        req.flash("error", "You need to be logged in to that");
        res.redirect("back");
    }
}

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Something went wrong");
                res.redirect("back");
            }
            else{
                if(foundComment.author.id.equals(req.user._id)){
                   next();
                   }
                else{
                    req.flash("error", "You do not have permissions to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You need to be logged in to that");
        res.redirect("back");
    }
}
    
app.listen(process.env.PORT, process.env.IP, function () {
    console.log("server has started");
});