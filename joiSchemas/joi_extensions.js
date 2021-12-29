const BaseJoi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML.",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHTML(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== true) {
          return helpers.error("string.escapeHTML", { value });
        } else {
          return clean;
        }
      },
    },
  },
});

module.exports = {
  BaseJoi: BaseJoi,
  extension: extension,
};
