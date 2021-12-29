const Campground = require("../models/campground");
const catchAsync = require("../routes/utils/catchAsync");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });
const ExpressError = require("../routes/utils/expressError");

const _feIndex = catchAsync(async (req, res) => {
  const campGrounds = await Campground.find({ isDelete: false });
  res.render("index.ejs", { campGrounds });
});

// frontend
// const _feIndex = (req, res) => {
//   res.render("index.ejs");
// };

const _fe404 = (req, res, next) => {
  // res.status(404).render('404.ejs')
  next(new ExpressError(404, `Page not found.`));
};

module.exports = {
  _feIndex: _feIndex,
  _fe404: _fe404,
};
