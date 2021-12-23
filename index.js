// express
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./routes/utils/expressError');
// express

// morgan 
const morgan = require('morgan');
app.use(morgan('dev'));
// morgan 

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

const _port = 8888;
app.listen(_port, () => {
    console.log(`yYelpCamp, listening on ${_port}`);
})
// express

// frontend
const _feIndex = (req, res) => {
     res.render('index.ejs')
}

const _fe404 = (req, res, next) => {
    // res.status(404).render('404.ejs')
    next(new ExpressError(404, `Page not found.`))
}

app.get('/', _feIndex);

// express routes
const campgroundsRoutes = require('./routes/frontend/campgrounds');
app.use('/campgrounds', campgroundsRoutes);
const reviewsRoutes = require('./routes/frontend/reviews');
app.use('/campgrounds/:id/reviews', reviewsRoutes);
// express routes

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
