const { campgroundJoiSchema, reviewJoiSchema } = require('./joischema');
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'Please login first.');
        return res.redirect('/login');
    }
    next();
}

// validate whether user is the campground author
module.exports.isCampgroundAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Sorry. You do not have permission to do that.')
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

// validate whether user is the review author
module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Sorry. You do not have permission to do that.');
        return res.redirect(`/campgrounds/${campground._id}`);
    }
    next();
}

// validate campground input using Joi schema
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body.campground, { abortEarly: false });
    if (error) {
        const message = error.details.map(ele => ele.message).join(', ')
        throw new ExpressError(400, message)
    } else {
        next();
    }
}

// validate review input using Joi schema
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body.review, { abortEarly: false });
    if (error) {
        const message = error.details.map(ele => ele.message).join(', ')
        throw new ExpressError(400, message)
    } else {
        next();
    }
}