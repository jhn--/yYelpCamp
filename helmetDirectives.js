const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com",
  "https://api.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://kit.fontawesome.com",
  "https://cdnjs.cloudflare.com",
  "https://cdn.jsdelivr.net",
  "https://unpkg.com/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com",
  "https://stackpath.bootstrapcdn.com",
  "https://api.mapbox.com",
  "https://api.tiles.mapbox.com",
  "https://fonts.googleapis.com",
  "https://use.fontawesome.com",
  "https://necolas.github.io",
  "https://cdn.jsdelivr.net",
  "https://unpkg.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com",
  "https://*.tiles.mapbox.com",
  "https://events.mapbox.com",
];
const fontSrcUrls = ["https://cdn.jsdelivr.net", "https://fonts.gstatic.com"];

const helmetDirectives = {
  directives: {
    defaultSrc: [],
    connectSrc: ["'self'", ...connectSrcUrls],
    scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
    styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
    workerSrc: ["'self'", "blob:"],
    childSrc: ["blob:"],
    objectSrc: [],
    imgSrc: [
      "'self'",
      "blob:",
      "data:",
      "https://res.cloudinary.com/jhnage/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
      "https://images.unsplash.com",
    ],
    fontSrc: ["'self'", "data:", ...fontSrcUrls],
  },
};

module.exports = helmetDirectives;
