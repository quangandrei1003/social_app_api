const mongoose = require('mongoose'); 

const uniqueValidator = require('mongoose-unique-validator'); 

const slug = require('slug'); 

const User = require('./User'); 

const Comment = require('./Comment'); 

const ArticleSchema = new mongoose.Schema({
    slug:{ 
    type: String, 
    lowercase: true, 
    unique: true},
    title: String,
    description: String,
    body: String,
    tagList:[{type: String}],
    favoritesCount: {type: Number, default: 0},
    author: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:'Comment'}]
}, {timestamps: true});


ArticleSchema.methods.slugify = function(){
    this.slug = slug(this.title) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
};

ArticleSchema.pre('validate', function(next){
    if(!this.slug){
        this.slugify();
    }
    return next();
});

ArticleSchema.plugin(uniqueValidator, {message: "Article is already taken."});

ArticleSchema.methods.toJSONFor = function(user) {
    return {
        slug: this.slug,
        title: this.title,
        description: this.description,
        body: this.body,
        tagList: this.tagList,
        favoritesCount: this.favoritesCount,
        favorited: user ? user.isFavorite(this._id) : false,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        author: user.getProfile()
    };
};

// ArticleSchema.methods.updateFavoriteCount = function() {
//     const article = this;
//     return User.countDocuments({favorites: {$in: [article._id]}}).then(function(count){
//         article.favoritesCount = count;
//         return article.save();
//     });
// }

ArticleSchema.pre('remove', async function(next) {
    const article = this; 
    await Comment.deleteMany({article: article._id}); 
    next(); 
}); 



module.exports = Article = mongoose.model('Article', ArticleSchema); 