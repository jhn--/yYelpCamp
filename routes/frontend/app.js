const Campground = require('../../models/campground')

const _feIndex = (req, res) => {
     res.render('index.ejs')
}

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

const _feListCampgrounds = async (req, res) => {
    const campGrounds = await Campground.find({ isDelete: false });
    res.render('campgrounds.ejs', { campGrounds });
}

const _feShowCampground = async (req, res) => {
    const { id } = req.params;
    const campGround = await Campground.findOne({ id: id });
    res.render('campground.ejs', { campGround });
}

const _fe404 = (req, res) => {
    res.status(404).render('404.ejs')
}

const _feRoutes = {
    _feIndex: _feIndex,
    _feListCampgrounds: _feListCampgrounds,
    _feShowCampground: _feShowCampground,
    // _feTESTAddCamp: _feTESTAddCamp,
    _fe404:_fe404
}

module.exports = _feRoutes;