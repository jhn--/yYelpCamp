const Campground = require('../../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');

const _feIndex = catchAsync((req, res) => {
     res.render('index.ejs')
})

// const _feTESTAddCamp = async (req, res) => {
//     // test frontend function for adding a campground
//     // following class `408. Campground Model Basics`
//     const testCampground = new Campground({
//         title: 'Test Camp Ground',
//         price: '100',
//         description: 'Test Camp Ground :D',
//         location: 'Anywhere'
//     })
//     const savedCamp = await testCampground.save();
//     res.send(savedCamp);
// }

const _feListCampgrounds = catchAsync(async (req, res) => {
    const campGrounds = await Campground.find({ isDelete: false });
    res.render('campgrounds.ejs', { campGrounds });
})

const _feShowCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    const campGround = await Campground.findById(id);
    res.render('campground.ejs', { campGround });
})

const _feNewCampground = catchAsync(async (req, res) => {
    switch (req.method) {
        case "POST":
            if (!req.body.campground) {
                throw new ExpressError(400, "Invalid Campground data.");
            }
            console.log(req.body.campground)
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

const _fe404 = (req, res, next) => {
    // res.status(404).render('404.ejs')
    next(new ExpressError(404, 'Page not found.'))
}

const _feRoutes = {
    _feIndex: _feIndex,
    _feListCampgrounds: _feListCampgrounds,
    _feShowCampground: _feShowCampground,
    _feNewCampground: _feNewCampground,
    _feEditCampground: _feEditCampground,
    _deleteCampground: _deleteCampground,
    // _feTESTAddCamp: _feTESTAddCamp,
    _fe404:_fe404
}

module.exports = _feRoutes;