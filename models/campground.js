const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/c_thumb,h_150,w_150');
});

const CampgroundSchema = new Schema({
    title: {
        type: String
    },
    images: [ImageSchema],
    price: {
        type: Number
    },
    description: {
        type: String
    },
    location: {
        type: String
    },
    geometry: { //geojson
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
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