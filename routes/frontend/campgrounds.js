const Campground = require('../../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const express = require('express');
const router = express.Router();

// joi
const campgroundSchema = require('../../joiSchemas/joi_campground');
// joi

const validateCampground = (req, res, next) => {
  // console.log(campgroundSchema.validate(req.body)['error']['details'].map(element => element["message"]));
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(element => element["message"]).join(',');
    throw new ExpressError(400, msg)
  } else {
    next()
  }
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
            res.redirect(`/campgrounds/${newCampground._id}`);
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
            res.redirect(`/campgrounds/${id}`)
            break;
        default:
            const campGround = await Campground.findById(id);
            res.render('editCampground.ejs', { campGround });
    }
})

router.get('/', _feListCampgrounds)
router.get('/new', _feNewCampground)
router.post('/new', validateCampground, _feNewCampground)
router.get('/:id', _feShowCampground)
router.delete('/:id', _deleteCampground)
router.get('/:id/edit', _feEditCampground)
router.put('/:id/edit', validateCampground, _feEditCampground)

module.exports = router;