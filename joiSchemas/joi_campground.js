const Joi = require("joi");

const campgroundSchema = Joi.object({
campground: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required().min(1),
    description: Joi.string().required()
    }).required()
})

module.exports = campgroundSchema;