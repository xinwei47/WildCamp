const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    rating: Number,
    body: String
});

module.exports = mongoose.model('Review', ReviewSchema);