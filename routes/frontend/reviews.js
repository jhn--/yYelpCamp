const express = require('express');
const router = express.Router({ mergeParams: true });
const
  {
    isLoggedIn,
    isReviewAuthor,
    validateReview
  } = require('../utils/middleware');
const 
  {
      _feNewReview,
      _fedeleteReview
  } = require('../../controllers/reviews')

router.post('/', isLoggedIn, validateReview, _feNewReview)
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, _fedeleteReview)

module.exports = router;