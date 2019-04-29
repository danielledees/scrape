$( document ).ready(function() {

//news articles in json

// $.getJSON("/news", function(data) {
//     for (var i = 0; i < data.length; i++) {
//         $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title  + "<br />" + data[i].headline + "<br />" + "https://www.residentadvisor.net/"+data[i].link +"</p>" + "<button id='save'> Save" + "<br />");
//     }
// });



//scrape button
$(".scrape").on("click", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .done(function(data) {
    console.log(data)
    window.location= "/"
  })
});


//save an article button
// $("#saveArt").click(function(event) {
//   event.preventDefault();
//   console.log("click worked")
//   var button = $(this);
//   var id = button.attr("id");
//   // var thisId = $(this).attr("data-id");
//   $.ajax({
//     method: "PUT",
//     url: "/save/" + id
//   })
//   .then(function(data) {
//     console.log(data)
//     window.location = "/"
//   })
  
// });

$(".save").click(function (event) {
  event.preventDefault();
  console.log("click worked")
  var artId = $(this).attr("id");
  $.ajax({
    type:"PUT",
    url: "/save/" + artId
}).done(function(data){
  console.log(data)
    // window.location="/";
});
});



// delete article button
$("#delete").on("click", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/news/delete/" + thisId
  })
  .done(function() {
    window.location = "/saved"
  })
});


// add note button
$(document).on("click", ".addNote", function() {
  $("#noteModal").show();

})



// save note button
$("#saveNote").on("click", function() {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/news/" + thisId,
    data: {
      text: $("#noteText" + thisId).val()
    }
  })
  .then(function(data) {
    $("#noteText" + thisId).val("");
    $(".modalNote").modal("hide");
    window.location = "/saved"
  })
});


// When you click the savenote button
$(document).on("click", "#saveNote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/news/" + thisId,
    data: {
      
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
   
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});





// delete note button
$("#deleteNote").on("click", function() {
  var noteId = $(this).attr("data-note-id");
  var articleId = $(this).attr("data-article-id");
  $.ajax({
    method: "DELETE",
    url: "/notes/delete/" + noteId +"/" + articleId
  })
  .then(function(data) {
    $(".modalNote").modal("hide");
    window.location = "/saved"
  })
});

});



// // click p tag function
// $(document).on("click", "p", function() {
//     $("#notes").empty();
//     var thisID = $(this).attr("data-id");

//     $.ajax({
//         method: "GET",
//         url: "/news/" + thisID
//     })
//     .then(function(data) {
//         console.log(data);
//         // The title of the article
//         $("#notes").append("<h2>" + this.title + "</h2>");
//         // An input to enter a new title
//         // $("#notes").append("<input id='titleinput' name='title' >");
//         // A textarea to add a new note body
//         $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//         // A button to submit a new note, with the id of the article saved to it
//         $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
//         $("#notes").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");
  
//         // If there's a note in the article
//         if (data.note) {
//           // Place the title of the note in the title input
//           $("#titleinput").val(data.note.title);
//           // Place the body of the note in the body textarea
//           $("#bodyinput").val(data.note.body);
//         }
//       });

// });


// // save note
// $(document).on("click", "#savenote", function() {
//     var thisId = $(this).attr("data-id");

//     $.ajax({
//         method: "POST",
//     url: "/news/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });

// $(document).on("click", "#deletenote", function() {
//     var thisId = $(this).attr("data-id");

//     $.ajax({
//         method: "DELETE",
//     url: "/news/" + thisId,
//     data: {
//       // Value taken from title input
//       title: $("#titleinput").val(),
//       // Value taken from note textarea
//       body: $("#bodyinput").val()
//     }
//   })
//     // With that done
//     .then(function(data) {
//       // Log the response
//       console.log(data);
//       // Empty the notes section
//       $("#notes").empty();
//     });

//   // Also, remove the values entered in the input and textarea for note entry
//   $("#titleinput").val("");
//   $("#bodyinput").val("");
// });

// $(document).on("click", "#deleteall", function() {
//     $.ajax({
//         method: "DELETE",
//         url: "/news/" 

//     })
//     .then(function(data) {
//         $("#articles").empty();
//     });
// });

// });




// //view saved articles button
// $("#saved").on("click", function() {
//   $.ajax({
//     method: "GET",
//     url: "/saved"
//   })
//   .then(function(data) {
//     console.log(data)
//     window.location="/"
//   })
// });

