var express = require("express"),
    mongoose = require("mongoose"),
    app = express(),
    bodyParser = require("body-parser");
var mongooseUser = require('mongoose');
var http = require('http').Server(app);
var morgan = require('morgan');
var path = require('path');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client')));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(session({
    secret: 'ilovereviewingmovies'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/movie');
//mongooseUser.connect('mongodb://localhost/userData');
require('./config/passport')(passport);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected");
});

db = mongooseUser.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("Connected");
});

// This is our mongoose model for todos
var MovieSchema = mongoose.Schema({
    type: String,
    movie: String,
    genre: [String],
    cast: [String],
    likes: Number,
    dislikes: Number,
    rating: Boolean,
    reviews: {
        review: {
            type: String,
            trim: true
        }
    }
});

var UserSchema = mongooseUser.Schema({
    local: {
        email: String,
        password: String,
        favorites: [Number],
        likes: [Number],
        dislikes: [Number]
    }

});

var _movieReviews = mongoose.model("mymovies", MovieSchema);
var _userData = mongooseUser.model("users", UserSchema);
console.log(_movieReviews);
console.log(_userData);
var user_id = "rkm@rkm.com";

app.get("/movies.json", function(req, res) {
    _movieReviews.find({}, function(err, movies) {
        res.json(movies);
    });
});

app.get("/movies.json", function(req, res) {
    _movieReviews.find({}, function(err, movies) {
        res.json(movies);
    });
});

app.get("/actionmovies.json", function(req, res) {
    _movieReviews.find({
        genre: 'Action'
    }, function(err, movies) {
        res.json(movies);
    });
});

app.get("/romancemovies.json", function(req, res) {
    _movieReviews.find({
        genre: 'Romance'
    }, function(err, movies) {
        res.json(movies);
    });
});

app.get("/comicmovies.json", function(req, res) {
    _movieReviews.find({
        genre: 'Comic'
    }, function(err, movies) {
        res.json(movies);
    });
});

app.post("/updatelikes.json", function(req, res) {
    var id = parseInt(req.body.row_id);
    var user_id = req.body.user_id;
    _movieReviews.update({
        "id": id
    }, {
        $inc: {
            "likes": 1
        }
    }, function(err, movies) {
        console.log(user_id);
        //console.log(err);
    });

    _userData.update({
        'local.email': user_id
    }, {
        $push: {
            'local.likes': id
        }
    }, function(err, users) {
        console.log(users);
    });

    _movieReviews.find({}, function(err, movies) {
        res.json(movies);
    });

});

app.post("/updatefavs.json", function(req, res) {
    var id = parseInt(req.body.row_id);
    var user_id = req.body.user_id;
    _userData.update({
        'local.email': user_id
    }, {
        $push: {
            'local.favorites': id
        }
    }, function(err, users) {
        console.log("done");
        if (err) {
            console.log(err);
        }
    });

    _movieReviews.find({}, function(err, movies) {
        res.json(movies);
    });

});



app.post("/updatedislikes.json", function(req, res) {
    var id = parseInt(req.body.row_id);
    var user_id = req.body.user_id;
    _movieReviews.update({
        "id": id
    }, {
        $inc: {
            "dislikes": 1
        }
    }, function(err, movies) {
        console.log(movies);
    });
    _userData.update({
        'local.email': user_id
    }, {
        $push: {
            'local.dislikes': id
        }
    }, function(err, users) {
        console.log("done");
        if (err) {
            console.log(err);
        }
    });
    _movieReviews.find({}, function(err, movies) {
        res.json(movies);
    });

});

// routes ======================================================================
require('./app/routes.js')(app, passport);

http.listen(3000, function() {
    console.log("The Magic happens on port 3000!");
});