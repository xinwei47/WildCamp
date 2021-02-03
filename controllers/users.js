const User = require('../models/user');

module.exports.renderRegisterForm = (req, res, next) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res, next) => {
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
}

module.exports.renderLoginForm = (req, res, next) => {
    res.render('users/login')
}

module.exports.loginUser = (req, res, next) => {
    req.flash('success', `Welcome back, ${req.user.username}!`)
    const redirectDestination = req.session.returnTo || '/campgrounds'
    delete req.session.returnTo;
    res.redirect(redirectDestination);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout()
    req.flash('success', 'Goodbye!')
    res.redirect('/campgrounds')
}