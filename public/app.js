$.getJSON("/news", function(data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

$(document).on("click", "p", function() {
    $("#notes").empty();
    var thisID = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/news/" + thisID
    })
    .then(function(data) {
        // console.log(data);
        // //titile
        // $("#notes").append("<h2>" + data.title + "</h2>");
        // //input title
        // $("#notes").append("<input id= 'titleinput' name='title' >");
        // //text area for new note
        // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // //submit button for notes
        // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        // if (data.note) {
        //     // Place the title of the note in the title input
        //     $("#titleinput").val(data.note.title);
        //     // Place the body of the note in the body textarea
        //     $("#bodyinput").val(data.note.body);
        //   }

    })
})