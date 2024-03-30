const mongoose = require('mongoose');


let usersSchema = new mongoose.Schema({
    email : {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isSuperAdmin : {
        type: Boolean,
        required: true
    },
    token: { 
        type: String 
    }
})

module.exports = mongoose.model('User', usersSchema, "SLICK_Users")
