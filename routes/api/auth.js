const express = require('express');
const router = express.Router();

const User = require('../../models/User');

const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

router.post('/', [
    check('email', 'Please enter a valid email!!').isEmail(),
    check('password', 'Password is required!!').exists()
], async (req, res) => {
    // res.send('Auth Route');
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        const token = await user.generateAuthToken();
        const responseUser = await User.findOne({ email }).select('-password');
        res.json({ user: responseUser });

    } catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: 'Server error' });
    }
})

module.exports = router; 