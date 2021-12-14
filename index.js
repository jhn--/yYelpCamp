// express
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// express

// mongoose
const mongoose = require('mongoose');
const Campground = require('./models/campground')
const db_name = 'dev_yelpcamp'
const _mongoose_opts = {
//   autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(`mongodb://localhost:27017/${db_name}`)
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

const _port = 8888;
app.listen(_port, () => {
    console.log(`yYelpCamp, listening on ${_port}`);
})
// express

// const { _feIndex, _feTESTAddCamp, _fe404 } = require('./routes/frontend/app');
const { _feIndex, _feListCampgrounds, _feShowCampground, _feNewCampground, _feEditCampground, _deleteCampground, _fe404 } = require('./routes/frontend/app');

// frontend
app.get('/', _feIndex);
app.get('/campgrounds', _feListCampgrounds)
app.get('/campground/new', _feNewCampground)
app.post('/campground/new', _feNewCampground)
app.get('/campground/:id', _feShowCampground)
app.delete('/campground/:id', _deleteCampground)
app.get('/campground/:id/edit', _feEditCampground)
app.put('/campground/:id/edit', _feEditCampground)
// app.get('/addcampground', _feTESTAddCamp);

// 404s
app.get('*', _fe404);