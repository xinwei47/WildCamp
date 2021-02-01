const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review')

const CampgroundSchema = new Schema({
    title: String,
    location: String,
    price: Number,
    description: String,
    image: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

// mongoose middleware to delete dependent reviews when deleting a campground
// the hooked function is executed post 'findOneAndDelete' (which deleted the campground)
// doc automatically capture the deleted campground
CampgroundSchema.post('findOneAndDelete', function (doc) {
    if (doc) {
        Review.deleteMany({ _id: { $in: doc.reviews } })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);