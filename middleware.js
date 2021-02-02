const { campgroundJoiSchema, reviewJoiSchema } = require('./joischema')
const ExpressError = require('./utilities/ExpressError')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        console.log(req.session);
        req.flash('error', 'Please login first.');
        return res.redirect('/login');
    }
    next();
}

// middleware to validate campground input using Joi schema
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body.campground, { abortEarly: false });
    if (error) {
        const message = error.details.map(ele => ele.message).join(', ')
        throw new ExpressError(400, message)
    } else {
        next();
    }
}

// middleware to validate review input
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body.review, { abortEarly: false });
    if (error) {
        const message = error.details.map(ele => ele.message).join(', ')
        throw new ExpressError(400, message)
    } else {
        next();
    }
}