const Campground = require("../../models/campground");
const Review = require("../../models/review");
const ExpressError = require("../utils/expressError");

// joi
const campgroundSchema = require("../../joiSchemas/joi_campground");
const reviewSchema = require("../../joiSchemas/joi_review");
const userSchema = require("../../joiSchemas/joi_user");
// joi

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "You must be signed in.");
    res.redirect("/login");
  }
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campGround = await Campground.findById(id);
  if (campGround.author.equals(req.user._id)) {
    next();
  } else {
    req.flash("error", "You do not have permission to edit this camp.");
    res.redirect(`/campgrounds/${id}`);
  }
};

const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // id = campground Id.
  const review = await Review.findById(reviewId);
  if (review.author.equals(req.user._id)) {
    next();
  } else {
    req.flash("error", "You do not have permission to delete this review.");
    res.redirect(`/campgrounds/${id}`);
  }
};

const validateCampground = (req, res, next) => {
  // console.log(campgroundSchema.validate(req.body)['error']['details'].map(element => element["message"]));
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element["message"]).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element["message"]).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element["message"]).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

module.exports = {
  isLoggedIn,
  isAuthor,
  isReviewAuthor,
  validateCampground,
  validateReview,
  validateUser,
};
