const mongoose = require('mongoose')

const db_link = process.env.DATABASE;
//paste mongo db url here
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
