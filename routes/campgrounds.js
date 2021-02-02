const express = require('express');
const router = express.Router();
const Campground = require('../models/campground')
const { isLoggedIn, validateCampground } = require('../middleware')

// view all campgrounds
router.get('/', async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

// get new campground form
router.get('/new', isLoggedIn, (req, res, next) => {
    res.render('campgrounds/new')
})

// individual campground page
router.get('/:id', async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground is not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
})

// post new campground
router.post('/', isLoggedIn, validateCampground, async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully added the campground!')
    res.redirect(`/campgrounds/${campground._id}`);
})

// get campground update form
router.get('/:id/edit', isLoggedIn, async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground is not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
})

// update campground
router.put('/:id', isLoggedIn, validateCampground, async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    await campground.save();
    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete campground (including dependent reviews)
router.delete('/:id', isLoggedIn, async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', 'Successfully deleted the campground!')
    res.redirect('/campgrounds')
})

module.exports = router;