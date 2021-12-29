const { BaseJoi, extension } = require("./joi_extensions");

const Joi = BaseJoi.extend(extension);

const campgroundSchema = Joi.object({
  campground: Joi.object({
    // title: Joi.string().required().escapeHTML(),
    title: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    // image: Joi.string().required(),
    price: Joi.number().required().min(1),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports = campgroundSchema;
