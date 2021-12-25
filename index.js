// express
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./routes/utils/expressError');
const session = require('express-session');
const flash = require('connect-flash');
// express

// passport
const passport = require('passport');
const passportLocalStrategy = require('passport-local');
// passport

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

// express
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_m'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
// app.set('views', [process.cwd() + '/views/frontend', process.cwd() + '/views/backend'])
app.set('views', path.join(__dirname, '/views/frontend'), path.join(__dirname, '/views/backend'))
const sessionConfig = {
  secret: 'thisshouldnotbeherelmao',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 604800000, // 1 week = 604800000 milliseconds
    maxAge: 604800000,
    httpOnly: true
  }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); // make sure session is used before passport.session()
const User = require('./models/user');
passport.use(new passportLocalStrategy(User.authenticate())); // User model doesn't have authenticate fn, it is added via passport (along with other functions, check docs!)
passport.serializeUser(User.serializeUser()); // Generate a fn used by passport to serialize users into the session - store into session.
passport.deserializeUser(User.deserializeUser()); // Generate a fn used by passport to deserialize users from(?) the session - get user out of that session.

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

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

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
