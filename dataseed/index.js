// only used for testing mongoose functions and/or ingest data into mongodb.
// to run this js file, just execute the command `node dataseed.js`.
// or `node` then within node, execute the command `.load dataseed.js`.
// verify w compass or mongosh

// lorem ipsum
const { LoremIpsum } = require("lorem-ipsum");

// mapbox
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({
  accessToken:
    "pk.eyJ1IjoiLS0tamgiLCJhIjoiY2t4cXB0MHI5MWo3ZzJ2cDdibm90MHk0MSJ9.rfsiOHGkcnT0Pxj_N-Ecfw",
});

// mongoose
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const db_name = "dev_yelpcamp";
const _mongoose_opts = {
  //   autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};
mongoose
  .connect(`mongodb://localhost:27017/${db_name}`)
  .then(() => {
    console.log(`${db_name} connected`);
  })
  .catch((err) => {
    console.error(err);
  });
// mongoose

// add a test camp
// const testCampground = new Campground({
//     title: 'Test Camp Ground',
//     price: '100',
//     description: 'Test Camp Ground :D',
//     location: 'Anywhere'
// })

// const savedCamp = async function (camp) {
//     const savedCamp = await camp.save();
//     console.log(savedCamp);
// }

// const _campgrounds = [testCampground];

// for (let cg of _campgrounds) {
//     savedCamp(cg);
// }
// add a test camp

// delete all docs in Campground
const wipeAll = async function () {
  const dbWiped = await Campground.deleteMany({});
  console.log(dbWiped);
};

wipeAll();
// delete all docs in Campground

// populate Campground with data
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const populateCampground = async () => {
  for (let i = 0; i < 10; i++) {
    // create 10 docs
    const cityRand1000 = Math.floor(Math.random() * 1000); // pick 1 out of 1000 cities
    const randPicker = (arr) => {
      return arr[Math.floor(Math.random() * arr.length)];
    };
    const randDescription = new LoremIpsum({
      wordsPerSentence: {
        max: 16,
        min: 4,
      },
    });
    const location = `${cities[cityRand1000]["city"]}, ${cities[cityRand1000]["state"]}`;
    // const geoData = await geocodingClient.forwardGeocode({ query: location, limit: 1 }).send();
    // console.log(location, geoData.body.features[0].geometry);
    const randCamp = new Campground({
      title: `${randPicker(descriptors)} ${randPicker(places)} `,
      images: [
        {
          url: "https://res.cloudinary.com/jhnage/image/upload/v1640711858/yYelpCamp/gettyimages-482800571_high_fkzamh.jpg",
          filename: "gettyimages-482800571_high_fkzamh",
        },
        {
          url: "https://res.cloudinary.com/jhnage/image/upload/v1640711858/yYelpCamp/gettyimages-632167255_super_py6i1l.jpg",
          filename: "gettyimages-632167255_super_py6i1l",
        },
      ],
      price: Math.floor(Math.random() * 100),
      description: randDescription.generateSentences(5),
      location: location,
      author: "61c9ce3de5e5931323b60a83",
      geometry: {
        type: "Point",
        coordinates: [
          cities[cityRand1000]["longitude"],
          cities[cityRand1000]["latitude"],
        ],
      },
      reviews: [],
    });
    await randCamp.save();
  }
};

populateCampground().then(() => {
  mongoose.connection.close();
});
// populate Campground with data
