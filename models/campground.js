const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: {
        type: String
    },
    image: {
        type: String
    },
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
    if(doc) {
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