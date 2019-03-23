var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NotesSchema = Schema ({
    title: String,
    body: String
});

var Notes = mongoose.model("note", NotesSchema);

module.exports = Notes;