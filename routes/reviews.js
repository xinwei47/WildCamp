const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground')
const Review = require('../models/review')
const { isLoggedIn, validateReview } = require('../middleware')

// add a review
router.post('/', isLoggedIn, validateReview, async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete a review
router.delete('/:reviewId', isLoggedIn, async (req, res, next) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id)
    campground.reviews.pull({ _id: reviewId });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully added a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
})

module.exports = router;