var output,
    user_id,
    user_favs,
    rating,
    fav_output;
var main = function(movieObjects) {
    "use strict";
    console.log("SANITY CHECK" + $('#'));
    var movies = movieObjects.map(function(movie) {
        rating = (movie.likes / (movie.likes + movie.dislikes)) * 5;
        rating = Math.round(rating * 10) / 10;
        output = "<div class=\"col l4\">" +
            "<div class=\"card\">" +
            "<div class=\"card-image waves-effect waves-block waves-light\">" +
            "<img class=\"activator\" width=\"307px\" height=\"172px\" src=\"/images/" + movie.movie + ".jpg\">" +
            "</div>" +
            "<div class=\"card-contentic\">" +
            "<span class=\"card-title activator grey-text text-darken-4\">" + movie.movie + "<i class=\"material-icons right\">more_vert</i></span>" +
            "<p>" + movie.category + "</p>" +
            "<h5>Rating: " + rating + "/5</h5>" +
            "</div>" +
            "<div class=\"card-reveal\">" +
            "<span class=\"card-title grey-text text-darken-4\">" + movie.movie + "<i class=\"material-icons right\">close</i></span>" + "<p><strong>Starring: </strong>" + movie.starring + "</p><p><strong>Genre: </strong>" + movie.genre +
            "</p><div class=\"row\">" +
            "<div class=\"col l6\">" +
            "<p><i onclick=\"updateLikes(" + movie.id + ")\" class=\"material-icons\">thumb_up</i>&nbsp;<span>" + movie.likes + "</span>\&nbsp;<i onclick=\"updateDislikes(" + movie.id + ")\" class=\"material-icons\">thumb_down</i>&nbsp;" + movie.dislikes + "</p>" +
            "</div>" +
            "<div class=\"col l6\">" +
            "<i onclick=\"updateFavs(" + movie.id + ")\" class=\"material-icons\">grade</i>" +
            "</div>" +
            "</div>" +
            "<p><strong>Review:</strong></p>" + movie.Review +

        "</div>" +
            "</div>" +
            "</div>";
        $('#content').append(output);
        return movie.description;
    });
};

var loadFavs = function(favObjects) {
    var fav = favObjects.map(function(fav) {
        fav_output = "<p>" + fav.movie + "</p>";
        $('#fav_output').append(fav_output);
        return fav.description;
    });
};

$(document).ready(function() {

    loadUserData();
    $.getJSON("favMovies.json", function(favObjects) {
        loadFavs(favObjects);
    });
    $.getJSON("movies.json", function(movieObjects) {
        main(movieObjects);
    });
    $('.modal-trigger').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
    });
});
$('#action_button').click(function() {
    $.getJSON("actionmovies.json", function(movieObjects) {
        $('#action_button').addClass('active');
        $('#romance_button').removeClass('active');
        $('#comic_button').removeClass('active');
        $('#content').empty();
        main(movieObjects);
    });
});

$('#romance_button').click(function() {
    $.getJSON("romancemovies.json", function(movieObjects) {
        $('#action_button').removeClass('active');
        $('#romance_button').addClass('active');
        $('#comic_button').removeClass('active');
        $('#content').empty();
        main(movieObjects);
    });
});

$('#comic_button').click(function() {
    $.getJSON("comicmovies.json", function(movieObjects) {
        $('#action_button').removeClass('active');
        $('#romance_button').removeClass('active');
        $('#comic_button').addClass('active');
        $('#content').empty();
        main(movieObjects);
    });
});

function updateLikes(row_id) {
    var data = {
        row_id: row_id,
        user_id: user_id
    };

    $.post("updatelikes.json", data, function(movieObjects) {
        $('#content').empty();
        main(movieObjects);
    });
}


function updateDislikes(row_id) {
    var data = {
        row_id: row_id,
        user_id: user_id
    };
    $.post("updatedislikes.json", data, function(movieObjects) {
        $('#content').empty();
        main(movieObjects, user_id);
    });
}

function updateFavs(row_id) {
    var data = {
        row_id: row_id,
        user_id: user_id
    };
    $.post("updatefavs.json", data, function(movieObjects) {
        $('#content').empty();
        main(movieObjects, user_id);
    });
}


function loadUserData() {

    user_id = $('#user_id').text();
    console.log(user_id);
}