// only used for testing mongoose functions and/or ingest data into mongodb.
// to run this js file, just execute the command `node dataseed.js`.
// or `node` then within node, execute the command `.load dataseed.js`.
// verify w compass or mongosh


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

const testCampground = new Campground({
    title: 'Test Camp Ground',
    price: '100',
    description: 'Test Camp Ground :D',
    location: 'Anywhere'
})

const savedCamp = async function (camp) {
    const savedCamp = await camp.save();
    console.log(savedCamp);
}

const _campgrounds = [testCampground];

for (let cg of _campgrounds) {
    savedCamp(cg);
}