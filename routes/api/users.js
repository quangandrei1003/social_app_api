const express = require('express'); 
const User = require('../../models/User'); 
const auth = require('../../middleware/auth'); 

const router = express.Router(); 
const { check, validationResult } = require('express-validator');

const brcypt = require('bcryptjs'); 
const gravatar = require('gravatar'); 
const jwt = require('jsonwebtoken'); 
const config = require('config'); 
const { update } = require('../../models/User');

//get current user
router.get('/', auth , async (req, res) => {
    
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user); 
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message: 'Server error'}); 
    }

})

//create new user
router.post('/', [
    check('username' , 'Username is required').notEmpty(),
    check('email', 'Email is not correct').isEmail(), 
    check('password', 'Password must be 6 characters length').isLength({min: 6}),
    check('bio', 'Bio is required').notEmpty()
] , async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({error: errors.array()}); 
    }

    const {username, email, password, bio} = req.body; 

    try {
        let user = await User.findOne({email}); 
        //check duplicate for user
        if(user) {
            return res.status(400).json({error: 'User has already existed!'})
        }
        //get user avatar
        const avatar = gravatar.url(email, {
            s: '200', r: 'pg', d: '404'
        }); 
        //create new user 
        user = new User({username, email, password, avatar, bio}); 
        //save user into database
        await user.save();

        const { username: _username, email: _email , avatar: _avatar, bio: _bio } = user; 

        const token = await user.generateAuthToken(); 

        const responseObj = {
            username: _username, 
            email: _email, 
            avatar: _avatar, 
            bio: _bio
        }

        res.json({token : token, user: responseObj}); 

    } catch (error) {
        console.error(error); 
        res.status(500).json({error: error.message})
    }
})

//update user 
router.put('/', auth , async (req, res) => {
    const updates = Object.keys(req.body); 
    const allowedUpdates = ['username', 'gmail', 'password', 'avatar']; 
    const isValidOperation = updates.every(update => allowedUpdates.includes(update)); 
    
    if(!isValidOperation) {
        res.status(400).json({message: 'Invalid operation'}); 
    }
    try {
        const updatedUser = await User.findById(req.user.id);
        // console.log(updatedUser);
        
        updates.forEach(update => {
            updatedUser[update] = req.body[update]; 
        })
        await updatedUser.save(); 
            
        const responseUser = await User.findById(req.user.id).select('-password'); 

        res.json(responseUser); 
        
    } catch (error) {
        res.status(500).json({message: 'Server error'});    
    }
})

module.exports = router; 