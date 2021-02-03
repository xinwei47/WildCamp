const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.addReview = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Successfully added a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id)
    campground.reviews.pull({ _id: reviewId });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!')
    res.redirect(`/campgrounds/${campground._id}`)
}