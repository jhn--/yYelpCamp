const Campground = require('../models/campground');
const catchAsync = require('../routes/utils/catchAsync');

const _feListCampgrounds = catchAsync(async (req, res) => {
    const campGrounds = await Campground.find({ isDelete: false });
    res.render('campgrounds.ejs', { campGrounds });
})

const _feShowCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    // const campGround = await Campground.findById(id).populate('reviews').populate('author');
    const campGround = await Campground.findById(id).populate( // important
        {
            path: 'reviews',
            populate:
            {
                path: 'author'
            }
        }
    ).populate('author');
    // console.log(campGround);
    if (campGround.isDelete) {
        const msg = 'Cannot find that campground.';
        req.flash('error', msg)
        return res.redirect('/campgrounds');
    }
    res.render('campground.ejs', { campGround });
})

const _feNewCampground = catchAsync(async (req, res) => {
    switch (req.method) {
        case "POST":
            // if (!req.body.campground) {
            //     throw new ExpressError(400, "Invalid Campground data.");
            // }
            const newCampground = new Campground(req.body.campground);
            newCampground.author = req.user._id; // req.user._id - check 516.
            await newCampground.save();
            const msg = 'Successfully made a new campground!'
            req.flash('success', msg);
            res.redirect(`/campgrounds/${newCampground._id}`);
            break;
        default:
            console.log(req.session.passport.user);
            res.render('newCampground.ejs');
    }
})

const _feDeleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { isDelete: true }, { new: true });
    const msg = 'Camp successfully deleted.'
    req.flash('success', msg);
    res.redirect('/campgrounds');
})

const _feEditCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campGround = await Campground.findById(id);
    switch (req.method) {
        case "PUT":
            const editCampground = req.body.campground;
            if (campGround.isDelete) {
                const msg = 'Cannot find that campground.';
                req.flash('error', msg)
                res.redirect('/campgrounds');
            } else {
                await Campground.findByIdAndUpdate(id, editCampground, { new: true, runValidators: true });
                const msg = 'Camp edited successfully!';
                req.flash('success', msg);
                res.redirect(`/campgrounds/${id}`)
            }
            break;
        default:
            if (campGround.isDelete) {
                const msg = 'Cannot find that campground.';
                req.flash('error', msg)
                return res.redirect('/campgrounds');
            }
            res.render('editCampground.ejs', { campGround });
    }
})

module.exports = {
    _feListCampgrounds: _feListCampgrounds,
    _feShowCampground: _feShowCampground,
    _feNewCampground: _feNewCampground,
    _feDeleteCampground: _feDeleteCampground,
    _feEditCampground: _feEditCampground
}