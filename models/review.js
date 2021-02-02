const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    rating: Number,
    body: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Review', ReviewSchema);