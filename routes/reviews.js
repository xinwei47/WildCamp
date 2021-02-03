const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware')

const reviews = require('../controllers/reviews')

// add a review
router.post('/', isLoggedIn, validateReview, reviews.addReview)

// delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview)

module.exports = router;