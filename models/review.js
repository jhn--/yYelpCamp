const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    isDelete: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('Review', ReviewSchema);