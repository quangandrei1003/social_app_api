const mongoose = require('mongoose'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const config = require('config'); 

const UserSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true
    }, 
    email: {
        type: String, 
        required: true,
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    avatar: {
        type: String, 
    }, 
    bio: {
        type: String,
        required: true 
    },
    tokens: [{
        token: {
            type: String, 
            require: true
        }
    }], 
    following: [{
        user: {
        type:  mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true  
    }}], 
    favorites: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref:'Article'
    }],
})

UserSchema.pre('save', async function(next) {
    const user = this; 

    if(user.isModified('password')) {
        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(user.password, salt); 
        next(); 
    }
})

UserSchema.methods.getProfile = function() {
    const user = this; 
    let profile = {
        username: user.username, 
        bio: user.bio, 
        avatar: user.avatar, 
        following: false
    }
    return profile; 
}

UserSchema.methods.generateAuthToken = async function () {
    const user = this
    const payload = {
        user: {
            id: user.id
        }
    }
    //sign jwt token
    const token = jwt.sign(payload, 
        config.get('secretToken'),
        {expiresIn: '5 days'})

    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token; 
}

UserSchema.methods.follow = async function(id) {
    const user = this; 
    
    user.following.push({user: id})

    return user.save();  
}

UserSchema.methods.unfollow = function(id) {
    const user = this; 
    user.following = user.following.filter(
        ({user}) => user.toString() !== id)
    return user.save(); 
}

UserSchema.methods.isFollowing = function(id) {
    const user = this; 
    return user.following.some(function(followId){
        return id.toString() === followId.toString();
    });
};

UserSchema.methods.favorite = function(id) {
    const user = this; 
    user.favorites.push(id); 
}

UserSchema.methods.unfavorite = function(id) {
    const user = this; 
    user.favorites.remove(id); 
}

UserSchema.methods.isFavorite = function(id) {
    const user = this; 
    return user.favorites.some(function(favoriteId) {
        return id.toString() === favoriteId.toString()
    })

}

module.exports = User = mongoose.model('User', UserSchema); 