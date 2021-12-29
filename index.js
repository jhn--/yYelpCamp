if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// console.log(process.env.NODE_ENV); // undefined, therefore not production
// console.log(process.env.CLOUDINARY_CLOUD_NAME,
// process.env.CLOUDINARY_KEY,
// process.env.CLOUDINARY_SECRET)

// express
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
// express

// helmet
const helmet = require("helmet");
// helmet

// passport
const passport = require("passport");
const passportLocalStrategy = require("passport-local");
// passport

// morgan
const morgan = require("morgan");
app.use(morgan("dev"));
// morgan

// mongoose
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");

const _mongoose_opts = {
  //   autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// const db_name = "dev_yelpcamp";
// const dbUrl = `mongodb://localhost:27017/${db_name}`;
const dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl, _mongoose_opts)
  .then(() => {
    console.log(`DB connected`);
  })
  .catch((err) => {
    console.error(err);
  });
// mongoose

// express
app.use(express.static(path.join(__dirname, "static")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_m"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
// app.set('views', [process.cwd() + '/views/frontend', process.cwd() + '/views/backend'])
app.set(
  "views",
  path.join(__dirname, "/views/frontend"),
  path.join(__dirname, "/views/backend")
);

// store sessions in mongodb
const MongoStore = require("connect-mongo"); // from const session = require("express-session");
const secret = process.env.SECRET;
const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 3600, // 24 hrs
});

store.on("error", function (e) {
  console.log("session store error", e);
});
const sessionConfig = {
  store: store,
  name: "yYC",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 604800000, // 1 week = 604800000 milliseconds
    maxAge: 604800000,
    httpOnly: true,
    // secure: true
  },
};
app.use(session(sessionConfig));
// store sessions in mongodb

app.use(flash());

app.use(mongoSanitize());
app.use(helmet());

const helmetDirectives = require("./helmetDirectives");
app.use(helmet.contentSecurityPolicy(helmetDirectives));

app.use(passport.initialize());
app.use(passport.session()); // make sure session is used before passport.session()
const User = require("./models/user");
passport.use(new passportLocalStrategy(User.authenticate())); // User model doesn't have authenticate fn, it is added via passport (along with other functions, check docs!)
passport.serializeUser(User.serializeUser()); // Generate a fn used by passport to serialize users into the session - store into session.
passport.deserializeUser(User.deserializeUser()); // Generate a fn used by passport to deserialize users from(?) the session - get user out of that session.

// const port = 8888;
const port = process.env.PORT; // process.env.PORT is being defined over @ heroku. knew abt it from the course.
app.listen(port, () => {
  console.log(`yYelpCamp, listening on ${port}`);
});
// express

app.use((req, res, next) => {
  if (!["/login", "/register"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  } // record the original URL unsigned user trying to go to into session.
  // console.log(req.session);
  // console.log(req.originalUrl);
  res.locals.currentUser = req.user; //514. currentUser Helper
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.get('/', _feIndex);

// express routes
const userRoutes = require("./routes/frontend/users");
app.use("/", userRoutes);
const campgroundsRoutes = require("./routes/frontend/campgrounds");
app.use("/campgrounds", campgroundsRoutes);
const reviewsRoutes = require("./routes/frontend/reviews");
app.use("/campgrounds/:id/reviews", reviewsRoutes);
const frontpageRoutes = require("./routes/frontend/frontpage");
app.use("/", frontpageRoutes);
// express routes

// 404s
// app.all("*", _fe404);

app.use((err, req, res, next) => {
  // const { statusCode = 500, msg = "Something went wrong." } = err;
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "Something went wrong.";
  }
  res.status(statusCode).render("error.ejs", { err });
});
