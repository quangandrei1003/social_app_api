const jwt = require('jsonwebtoken'); 

const config = require('config'); 

const auth = (req, res, next) => {
    const token = req.header('x-auth-token'); 

    if(!token) {
        res.status(401).json({message : 'Unauthorized!'}); 
    }

    //compare and verify jwt
    try {
        jwt.verify(token, config.get('secretToken'), (err, decoded) => {
            if(err) {
                console.error(err);
            } else {
                req.user = decoded.user;
                next(); 
            }
        })
    } catch (error) {
        console.err('Error with authentication middleware'); 
        res.status(500).json({message: 'Server error'}); 
    }
}

module.exports = auth
