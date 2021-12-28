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
            newCampground.images = req.files.map(f => ({ url: f.path, filename: f.filename })); // take out the path and file name from req.file and consolidate them into an object literal and assign it to newCampground.images.
            newCampground.author = req.user._id; // req.user._id - check 516.
            await newCampground.save();
            console.log(newCampground);
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
            // console.log(req.body);
            const editCampground = req.body.campground;
            if (campGround.isDelete) {
                const msg = 'Cannot find that campground.';
                req.flash('error', msg)
                res.redirect('/campgrounds');
            } else {
                const newImgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
                const updatedCampground = await Campground.findByIdAndUpdate(id, editCampground, { new: true, runValidators: true });
                updatedCampground.images.push(...newImgs); // use js spread syntax, newImgs is an array, we don't want to push an array into the campground.images array.
                await updatedCampground.save();
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