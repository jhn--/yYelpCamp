const Joi = require("joi");

const userSchema = Joi.object({
user: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().required(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    }).required()
})

module.exports = userSchema;