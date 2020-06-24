const mongoose = require('mongoose'); 

const CommentSchema = new mongoose.Schema({
    body: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    article: {type: mongoose.Schema.Types.ObjectId, ref:'Article'}
}, {timestamps: true});

CommentSchema.methods.toJSONFor = function(user){
    return {
        id: this.id,
        body: this.body,
        author: user.getProfile(),
        createdAt: this.createdAt,
        updatedAt: this.updatedAt 
    };
};



module.exports = Comment = mongoose.model('Comment', CommentSchema);

