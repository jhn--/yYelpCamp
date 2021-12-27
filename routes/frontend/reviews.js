const Campground = require('../../models/campground');
const Review = require('../../models/review');
const catchAsync = require('../utils/catchAsync');
const express = require('express');
const router = express.Router({ mergeParams: true });
const {isLoggedIn, validateReview} = require('../utils/middleware');

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
            const msg = 'Review posted!';
            req.flash('success', msg);
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
            const msg = 'Review successfully deleted.';
            req.flash('success', msg);
            res.redirect(`/campgrounds/${id}`);
            break;
    }
}

router.post('/', isLoggedIn, validateReview, _feNewReview)
router.delete('/:reviewId', isLoggedIn, _fedeleteReview)

module.exports = router;