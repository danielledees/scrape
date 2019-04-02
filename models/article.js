var mongoose = require("mongoose");

//this save a reference to the schema 
var Schema = mongoose.Schema;

//creates a new userschema object usng the above schema
var ArticleSchema = new Schema ({

    // image: {
    //     type: String,
    //     required: true
    // },

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
    saved: {
        type: Boolean,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;