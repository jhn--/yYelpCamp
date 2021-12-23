const Campground = require('../../models/campground');
const Review = require('../../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const express = require('express');
const router = express.Router({mergeParams: true});

// joi
const reviewSchema = require('../../joiSchemas/joi_review');
// joi

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(element => element["message"]).join(',');
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

const _feNewReview = catchAsync(async (req, res) => {
  const { id } = req.params;
    switch (req.method) {
      case "POST":
          // console.log(req.body.review);
            const campGround = await Campground.findById(id); // find campground by id
            const { rating, body } = req.body.review; // declare a review & populate w req.body.review
            const newReview = new Review({ rating, body }); // before push
            campGround.reviews.push(newReview);
            await campGround.save();
            await newReview.save();
            res.redirect(`/campgrounds/${id}`)
            break;
    }
})

const _fedeleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  console.log(req.params);
    switch (req.method) {
        case "DELETE":
            // not deleting, just updating the isDelete to true in Review,
            // therefore, i do not need to delete review from CampGround.
            // deviates from the class 470. Deleting Reviews.
            await Review.findByIdAndUpdate(reviewId, { isDelete: true });
            res.redirect(`/campgrounds/${id}`);
            break;
    }
}

router.post('/', validateReview, _feNewReview)
router.delete('/:reviewId', _fedeleteReview)

module.exports = router;