const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String
    },
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndUpdate', async (doc) => {
    // query middleware
    // https://mongoosejs.com/docs/middleware.html
    if(doc.isDelete) {
        await review.updateMany(
            {
                _id: {
                    $in: doc.reviews
                }
            }, {isDelete: true}, {new: true}
        )
    }
})


module.exports = mongoose.model('Campground', CampgroundSchema);