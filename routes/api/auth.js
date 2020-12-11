const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator/check');

/* @route   GET api/auth
*  @desc    Test route
*  @access  Public*/
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

/* @route   POST api/auth
*  @desc    Authenticate user and get token
*  @access  Public*/
router.post('/', [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        /*Check if user exists*/
        const {email, password} = req.body;

        try {
            /*Get user gravatar based on email*/
            let user = await User.findOne({email});
            if (!user) {
                return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
            }
            /*Compares encrypted password to user password*/
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
            }
            /*Creates jsonwebtoken payload*/
            const payload = {
                user: {
                    id: user.id
                }
            }
            /*Signs payload*/
            jwt.sign(payload,
                /*Gets secret token*/
                config.get('jwtSecret'),
                {expiresIn: 3600000}, (err, token) => {
                    if (err) throw err;
                    res.json({token});
                });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
    });/*end of async*/

module.exports = router;