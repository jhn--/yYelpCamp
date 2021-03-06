const { BaseJoi, extension } = require("./joi_extensions");

const Joi = BaseJoi.extend(extension);

// const Joi = require("joi");

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).multiple(1),
    body: Joi.string().required().escapeHTML(),
  }).required(),
});

module.exports = reviewSchema;
