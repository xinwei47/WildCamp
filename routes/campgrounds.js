const express = require('express');
const router = express.Router();
const { isLoggedIn, validateCampground, isCampgroundAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, validateCampground, campgrounds.addNewCampground)

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(campgrounds.showCampground)
    .put(isLoggedIn, isCampgroundAuthor, validateCampground, campgrounds.updateCampground)
    .delete(isLoggedIn, isCampgroundAuthor, campgrounds.deleteCampground)

router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, campgrounds.renderEditForm)


module.exports = router;