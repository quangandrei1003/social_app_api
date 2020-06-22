const mongoose = require('mongoose'); 

const User = require('./User'); 

const ProfileSchema = new mongoose.Schema({
    user: {
        type:  mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    },
    username: {
        type: String, 
        required: true
    }, 
    bio: {
        type: String, 
        required: true
    }, 
    avatar: {
        type: String, 
        required: true
    }, 
    following: {
        type: Boolean, 
        default: false, 
        required: true
    }, 
})

module.exports = Profile = mongoose.model('profile', ProfileSchema); 