const express = require('express');

const router = express.Router({ mergeParams: true });

const auth = require('../../middleware/auth');

const User = require('../../models/User');

const Article = require('../../models/Article');
const Comment = require('../../models/Comment');

//get all comments in an article
router.get('/', auth, getArticleBySlug, async (req, res) => {

    try {
        const comments = await Comment.find().populate('Article').find({article: req.article.id}); 
     
        if(comments === undefined || comments.length == 0 ) {
           return res.status(404).json({message: 'Comments not found!'}); 
        }
        res.json({comments: comments});
    } catch (error) {
        console.error(error); 
        res.status(500).json({message: 'Server error!'}); 
    }  
    // res.send('Get!!!'); 
})

//post a comment 
router.post('/', auth, getArticleBySlug, async (req, res) => {

    try {
        const userId = req.user.id;
        const articleSlug = req.article.slug;

        const user = await User.findById(userId);

        const comment = new Comment({body:req.body.body}); 
        comment.author = user;
        comment.article = req.article;

        await comment.save();
        req.article.comments.push(comment);

        await req.article.save();    
        res.json({ comment: comment.toJSONFor(user) });

    } catch (error) {
        console.error(error); 
        res.status(500).json({message: 'Server error'})
    }
    // res.send('Comment posted!!!'); 
    // console.log(userId);
    // console.log(articleSlug);
})

router.delete('/:id', auth, getArticleBySlug, getCommentById ,async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const commentByAuthor = req.comment.author; 
        
        if(commentByAuthor.toString() === userId.toString()) {

           const comment = await Comment.findById(req.comment.id); 

           await req.article.comments.remove(req.comment.id);
           
           await req.article.save(); 

           await comment.remove(); 

           res.json({message: 'Deleted this comment'});

        } else {
            return res.status(403).json({message: 'Authorization required!'})
        }

    } catch (error) {
        console.error(error); 
        res.status(500).json({message: 'Server error'})
    }
    // res.send('Deleted this comment!'); 
})

//middlaware for getting article by slug 
async function getArticleBySlug(req, res, next) {
    try {
        const slug = req.params.slug;

        const article = await Article.findOne({ slug: slug });

        if (article === null || undefined) {
            return res.status(404).json({ message: 'Article not found!' });
        }
        req.article = article;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

//middleware for getting comment by id
async function getCommentById(req, res, next) {
    try {
        const id = req.params.id; 

        const comment = await Comment.findById(id); 

        if(comment === null || undefined) {
            return res.status(404).json({message: 'Comment not found'}); 
        }
        req.comment = comment; 
        next(); 

    } catch (error) {
        console.error(error); 
        res.status(500).json({message: 'Server error!'}); 
    }
}

module.exports = router; 