const express = require('express');
const router = express.Router();
const User = require('../models/user')
const passport = require('passport')

// get register form
router.get('/register', (req, res, next) => {
    res.render('users/register')
})

// post new user registry
router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await new User({ username, email });
        const registeredUser = await User.register(user, password);
        // login the new user after registeration using passport built-in method: req.login 
        // req.login() cannot be awaited, and must include a callback
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `Welcome to WildCamp, ${req.user.username}!`)
            res.redirect('/campgrounds')
        })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
})

// get login form
router.get('/login', (req, res, next) => {
    res.render('users/login')
})

// login the user
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.flash('success', `Welcome back, ${req.user.username}!`)
    const redirectDestination = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectDestination);
})

// logout the user
router.get('/logout', (req, res, next) => {
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
})


module.exports = router;