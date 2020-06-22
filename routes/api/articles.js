const express = require('express');

const router = express.Router();

const Article = require('../../models/Article');

const Comment = require('../../models/Comment'); 

const User = require('../../models/User');

const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

router.get('/', (req, res) => {
    res.send('Articles Route');
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
            return res.json({message: 'Deleted this article'}); 
        } catch (error) {
            return res.status(500).json({ message: 'Server error' });
        }

    } else {
        res.status(403).json({ message: 'Authorization required!' });
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
