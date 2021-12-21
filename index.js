// express
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./routes/utils/expressError');
// express

// morgan 
let morgan = require('morgan');
app.use(morgan('dev'));
// morgan 

// joi
const campgroundSchema = require('./joiSchemas/joi_campground');
const reviewSchema = require('./joiSchemas/joi_review');
// joi


// mongoose
const mongoose = require('mongoose');
const db_name = 'dev_yelpcamp'
const _mongoose_opts = {
//   autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(`mongodb://localhost:27017/${db_name}`, _mongoose_opts)
    .then(() => {
    console.log(`${db_name} connected`)
    })
    .catch((err) => {
    console.error(err)
    })
// mongoose

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_m'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
// app.set('views', [process.cwd() + '/views/frontend', process.cwd() + '/views/backend'])
app.set('views', path.join(__dirname, '/views/frontend'), path.join(__dirname, '/views/backend'))

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

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(element => element["message"]).join(',');
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

const _port = 8888;
app.listen(_port, () => {
    console.log(`yYelpCamp, listening on ${_port}`);
})
// express

// const { _feIndex, _feTESTAddCamp, _fe404 } = require('./routes/frontend/app');
const { _feIndex, _feListCampgrounds, _feShowCampground, _feNewCampground, _feEditCampground, _deleteCampground, _feNewReview, _fedeleteReview, _fe404 } = require('./routes/frontend/app');

// frontend
app.get('/', _feIndex);
app.get('/campgrounds', _feListCampgrounds)
app.get('/campground/new', _feNewCampground)
app.post('/campground/new', validateCampground, _feNewCampground)
app.post('/campground/:id/review', validateReview, _feNewReview)
app.delete('/campground/:campId/review/:reviewId', _fedeleteReview)
app.get('/campground/:id', _feShowCampground)
app.delete('/campground/:id', _deleteCampground)
app.get('/campground/:id/edit', _feEditCampground)
app.put('/campground/:id/edit', validateCampground, _feEditCampground)

// 404s
app.all('*', _fe404);

app.use((err, req, res, next) => {
  // const { statusCode = 500, msg = "Something went wrong." } = err;
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong."
  }
  res.status(statusCode).render('error.ejs', {err});
})
