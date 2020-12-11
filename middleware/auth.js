const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    /*Get token from header*/
    const token = req.header('x-auth-token');
    /*Checks if no token*/
    if (!token) {
        return res.status(401).json({msg: 'No token, authorization denied'});
    }
    /*Verifies token*/
    try {
        /*Decodes token*/
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        /*Sets req.user with decoded.user info*/
        req.user = decoded.user;
        /*Continues program*/
        next();
    } catch (err) {
        res.status(401).json({msg: 'Token not valid'});
    }
}