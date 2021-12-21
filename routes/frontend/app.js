const Campground = require('../../models/campground');
const Review = require('../../models/review');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');

const _feIndex = (req, res) => {
     res.render('index.ejs')
}

const _feListCampgrounds = catchAsync(async (req, res) => {
    const campGrounds = await Campground.find({ isDelete: false });
    res.render('campgrounds.ejs', { campGrounds });
})

const _feShowCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campGround = await Campground.findById(id).populate('reviews');
    res.render('campground.ejs', { campGround });
})

const _feNewCampground = catchAsync(async (req, res) => {
    switch (req.method) {
        case "POST":
            // if (!req.body.campground) {
            //     throw new ExpressError(400, "Invalid Campground data.");
            // }
            const newCampground = new Campground(req.body.campground);
            await newCampground.save();
            res.redirect(`/campground/${newCampground._id}`);
            break;
        default:
            res.render('newCampground.ejs');
    }
})

const _deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { isDelete: true });
    res.redirect('/campgrounds');
})

const _feEditCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    switch (req.method) {
        case "PUT":
            const editCampground = req.body.campground;
            await Campground.findByIdAndUpdate(id, editCampground, { new: true, runValidators: true });
            res.redirect(`/campground/${id}`)
            break;
        default:
            const campGround = await Campground.findById(id);
            res.render('editCampground.ejs', { campGround });
    }
})

const _feNewReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    switch (req.method) {
        case "POST":
            // console.log(req.body.review);
            const campGround = await Campground.findById(id); // find campground by id
            // console.log(campGround)
            const { rating, body } = req.body.review; // declare a review & populate w req.body.review
            const newReview = new Review({ rating, body }); // before push
            campGround.reviews.push(newReview);
            await campGround.save();
            await newReview.save();
            res.redirect(`/campground/${id}`)
            break;
    }
})

const _fedeleteReview = async (req, res) => {
    const { campId, reviewId } = req.params;
    switch (req.method) {
        case "DELETE":
            // not deleting, just updating the isDelete to true in Review,
            // therefore, i do not need to delete review from CampGround.
            // deviates from the class 470. Deleting Reviews.
            await Review.findByIdAndUpdate(reviewId, { isDelete: true });
            res.redirect(`/campground/${campId}`);
            break;
    }
}

const _fe404 = (req, res, next) => {
    // res.status(404).render('404.ejs')
    next(new ExpressError(404, `Page not found.`))
}

const _feRoutes = {
    _feIndex: _feIndex,
    _feListCampgrounds: _feListCampgrounds,
    _feShowCampground: _feShowCampground,
    _feNewCampground: _feNewCampground,
    _feEditCampground: _feEditCampground,
    _deleteCampground: _deleteCampground,
    _feNewReview: _feNewReview,
    _fedeleteReview: _fedeleteReview,
    // _feTESTAddCamp: _feTESTAddCamp,
    _fe404:_fe404
}

module.exports = _feRoutes;