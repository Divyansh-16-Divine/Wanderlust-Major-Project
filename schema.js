const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().trim().required().messages({
      "string.empty": "Title is required.",
    }),
    description: Joi.string().trim().required().messages({
      "string.empty": "Description is required.",
    }),
    price: Joi.alternatives()
      .try(
        Joi.number().min(0).messages({
          "number.base": "Price must be a number.",
          "number.min": "Price cannot be negative.",
        }),
        Joi.string().allow("").empty("")
      )
      .optional(),
    country: Joi.string().trim().required().messages({
      "string.empty": "Country is required.",
    }),
    location: Joi.string().trim().required().messages({
      "string.empty": "Location is required.",
    }),
  })
    .required()
    .unknown(true), // ✅ This is the key addition
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
  }).required(),
});
