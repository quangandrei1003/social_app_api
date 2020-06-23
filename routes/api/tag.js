const express = require('express'); 
const mongoose = require('mongoose');

const Article = require('../../models/Article'); 

const router = express.Router(); 

router.get('/', async (req, res) => {
    try {
        const tags = await Article.find().distinct('tagList');

    if(tags === null || tags.length ===0) {
        return res.status(404).json({message: 'Tags not found'}); 
    }
     
    res.json({tags : tags});

    } catch (error) {
        console.error(error); 
        res.status(500).json({message: 'Sever error'}); 
    }
})

module.exports = router;