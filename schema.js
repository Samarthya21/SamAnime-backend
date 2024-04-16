const mongoose = require('mongoose')

const db_link = process.env.DATABASE;
mongoose.connect("mongodb+srv://samarthya777:AMirZR2Y0tawLKED@cluster0.1pcf65w.mongodb.net/AnimeDB?retryWrites=true&w=majority")
    .then(function (db) {
        console.log("Database connnected");
    })
    .catch(function (err) {
        console.log(err);
})
const schema = mongoose.Schema({
    userId:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        
        minLength:8,
    },
    selectedtitlesarray:{
    type: Array,
    
    },
    selectedimagesarray:{
        type: Array,
        
        },
})

const user_model = mongoose.model("user_model", schema);
module.exports=user_model;