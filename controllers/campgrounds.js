const Campground = require('../models/campground')

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res, next) => {
    res.render('campgrounds/new')
}

module.exports.showCampground = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('author').populate({ path: 'reviews', populate: { path: 'author' } });
    if (!campground) {
        req.flash('error', 'Campground is not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

module.exports.addNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id
    await campground.save();
    req.flash('success', 'Successfully added the campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.renderEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground is not found.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    await campground.save();
    req.flash('success', 'Successfully updated the campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const campground = await Campground.findByIdAndDelete(req.params.id)
    req.flash('success', `Successfully deleted ${campground.title} !`)
    res.redirect('/campgrounds')
}