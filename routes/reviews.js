const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground')
const Review = require('../models/review')
const ExpressError = require('../utilities/ExpressError');
const { reviewJoiSchema } = require('../joischema')



// middleware to validate review input
const validateReview = (req, res, next) => {
    const { error } = reviewJoiSchema.validate(req.body.review, { abortEarly: false });
    if (error) {
        const message = error.details.map(ele => ele.message).join(', ')
        throw new ExpressError(400, message)
    } else {
        next();
    }
}

// add reviews
router.post('/', validateReview, async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete a review
router.delete('/:reviewId', async (req, res, next) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id)
    campground.reviews.pull({ _id: reviewId });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully added a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports = router;