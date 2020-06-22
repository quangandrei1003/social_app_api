const express = require('express'); 

const router = express.Router({mergeParams: true}); 

const auth = require('../../middleware/auth'); 


//post a comment 
router.post('/', auth, getArticleBySlug, async (req, res) => {
    const userId = req.user.id; 

    const articleSlug = req.article.slug; 
    console.log(userId);
    console.log(articleSlug);

    res.send('Comment posted!!!'); 
    
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
module.exports = router; 