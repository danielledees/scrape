var mongoose = require("mongoose");

//this save a reference to the schema 
var Schema = mongoose.Schema;

//creates a new userschema object usng the above schema
var NewsSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "note"
    }
});

//mongoose's model method
var News = mongoose.model("News", NewsSchema);

module.exports = News;