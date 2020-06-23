const express = require('express');

const router = express.Router();

const Article = require('../../models/Article');

const Comment = require('../../models/Comment');

const User = require('../../models/User');

const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');


//get all articles by followed user 
router.get('/feed', auth, async (req, res) => {

    let limit = 20;
    let offset = 0;

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }
    try {
        const followingUser = await User.findById(req.user.id);

        if (followingUser === undefined || null) {
            return res.status(401);
        }

        const followings = followingUser.following.map(({ user }) => user)

        // console.log(followings);

        const articles = await Article.find({ author: { $in: followings }})
            .limit(Number(limit))
            .skip(Number(offset))
            .populate('author')
            .exec();

        res.json({ articles: articles });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }

    // res.send('Feed route!');
})


//get article by query
router.get('/', async (req, res) => {

    let limit = 20;
    let offset = 0;
    const tags = [req.query.tags];

    if (typeof req.query.limit !== 'undefined') {
        limit = req.query.limit;
    }

    if (typeof req.query.offset !== 'undefined') {
        offset = req.query.offset;
    }
    if (req.query.author) {

        const user = await User.findOne({ username: req.query.author });


        if (user === undefined || null) {
            return res.status(404).json({ message: 'Author not found!' });
        }

        try {
            const articles = await Article.find({ author: user.id })
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({ createdAt: 'desc' })
                .populate('User')
                .exec()

            res.json({ article: articles });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }

    } else {
        return res.status(400).json({ message: 'Query string  must not be null' });
    }

    if (req.query.favorite) {

        const user = await User.findOne({ username: req.query.favorite });


        if (user === undefined || null) {
            return res.status(404).json({ message: 'Author not found!' });
        }

        try {
            const articles = await Article.find({ author: user.id })
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({ createdAt: 'desc' })
                .populate('User')
                .exec()

            res.json({ article: articles });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Server error' });
        }

    } else {
        return res.status(400).json({ message: 'Query string must not be null!' });
    }
    // res.send('Articles Route');

    if(tags !== undefined || tags.length !==0) {
        const articles = await Article.find({ tagList: { $in: tags}})
                .limit(Number(limit))
                .skip(Number(offset))
                .sort({ createdAt: 'desc' })
                .populate('User')
                .exec()                    
    res.json({articles: articles});
    } else {
        return res.status(400).json({message: 'Tags musts not be null'}); 
    }
      
})

//get an article
router.get('/:slug', getArticleBySlug, async (req, res) => {
    const article = req.article;
    res.json(article);
})

//update an article
router.put('/:slug', auth, getArticleBySlug, async (req, res) => {
    const userId = req.user.id;
    const articleByAuthorId = req.article.author;
    const user = await User.findById(userId);

    if (userId.toString() === articleByAuthorId.toString()) {

        try {
            if (req.body.title !== undefined || null) {
                req.article.title = req.body.title;
            }

            if (req.body.description !== undefined || null) {
                req.article.description = req.body.description;
            }

            if (req.body.body !== undefined || null) {
                req.article.body = req.body.body;
            }

            await req.article.save();

            res.json(req.article.toJSONFor(user));
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Sever error!' });
        }

    } else {
        return res.status(403).json({ message: 'Authorization is required!' })
    }
    // res.send('Updated!!!');
})

//create an article
router.post('/', [
    check('title', 'Title must not be empty').notEmpty(),
    check('description', 'Description must not be empty').notEmpty(),
    check('body', 'Body must not be empty').notEmpty()
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ error: errors.array() });
    }

    try {

        const user = await User.findById(req.user.id);

        if (user === undefined || null) {
            res.status(401).json({ message: 'Unauthorized!' });
        }

        const { title, description, body } = req.body;

        const article = new Article({ title, description, body });

        article.author = user;

        await article.save();

        res.json({ article: article.toJSONFor(user) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
})

//delete an article 
router.delete('/:slug', auth, getArticleBySlug, async (req, res) => {

    const userId = req.user.id;
    const articleByAuthorId = req.article.author;

    if (userId.toString() === articleByAuthorId.toString()) {

        try {
            await req.article.remove();
            return res.json({ message: 'Deleted this article' });
        } catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }

    } else {
        res.status(403).json({ message: 'Authorization required!' });
    }
})

//favoriate an article 
router.post('/:slug/favorite', auth, getArticleBySlug, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        if (user.isFavorite(req.article.id)) {
            return res.status(400).json({ message: 'You already liked this article' });
        }

        user.favorite(req.article.id);

        await req.article.updateFavoriteCount();

        await user.save();

        console.log(user.favorites);
        
        res.json({ article: req.article.toJSONFor(user) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
})

//unfavoriate an article 
router.delete('/:slug/unfavorite', auth, getArticleBySlug, async (req, res) => {

    try {
        const userId = req.user.id;
        const user = await User.findById(userId);

        user.unfavorite(req.article.id);

        await req.article.updateFavoriteCount();

        
        await user.save();

        console.log(user.favorites);

        res.json({ article: req.article.toJSONFor(user) });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
})

//midleware for getting article by slug
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

module.exports = router; 
