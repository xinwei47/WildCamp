const express = require('express');
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Review = require('./models/review')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const { campgroundJoiSchema, reviewJoiSchema } = require('./joischema');

const ExpressError = require('./utilities/ExpressError');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

// connect to mongoDB
mongoose.connect('mongodb://localhost:27017/wild-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// middleware to validate campground input using Joi schema
const validateCampground = (req, res, next) => {
    const { error } = campgroundJoiSchema.validate(req.body.campground, { abortEarly: false });
    if (error) {
        const message = error.details.map(ele => ele.message).join(', ')
        throw new ExpressError(400, message)
    } else {
        next();
    }
}

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


// Routes

app.get('/', (req, res, next) => {
    res.render('home')
})

// view all campgrounds
app.get('/campgrounds', async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

// get new campground form
app.get('/campgrounds/new', (req, res, next) => {
    res.render('campgrounds/new')
})

// individual campground page
app.get('/campgrounds/:id', async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
})

// post new campground
app.post('/campgrounds', validateCampground, async (req, res, next) => {
    // console.log(req.body);
    // console.log(req.body.campground);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

// get campground update form
app.get('/campgrounds/:id/edit', async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
})

// update campground
app.put('/campgrounds/:id', validateCampground, async (req, res, next) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete campground (including dependent reviews)
app.delete('/campgrounds/:id', async (req, res, next) => {
    await Campground.findByIdAndDelete(req.params.id)
    res.redirect('/campgrounds')
})

// add reviews
app.post('/campgrounds/:id/reviews', validateReview, async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    const review = await new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// delete a review
app.delete('/campgrounds/:id/reviews/:reviewId', async (req, res, next) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findById(id)
    campground.reviews.pull({ _id: reviewId });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${campground._id}`)
})




app.use('*', (req, res) => {
    throw new ExpressError(404, 'Page Not Found');
})

// error handler: the end of the middleware stack
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.statusMessage) err.statusMessage = 'Oh no! Something went wrong!';
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log('listening on port 3000')
})